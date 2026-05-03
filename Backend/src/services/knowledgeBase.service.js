import KnowledgeBaseItem from '../models/KnowledgeBaseModel.js';
import mongoose from 'mongoose';
import { createRecord, findOneRecord, findRecords } from './repository.service.js';
import { getEmbedding, getEmbeddings } from './gemini.service.js';

const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  if (mA === 0 || mB === 0) return 0;
  return dotProduct / (mA * mB);
};

const chunkText = (text, maxLength = 800, overlap = 100) => {
  if (!text) return [];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLength;
    if (end < text.length) {
      // Try to find a sentence end or space to avoid cutting in the middle
      const lastSpace = text.lastIndexOf(' ', end);
      if (lastSpace > start + maxLength / 2) {
        end = lastSpace;
      }
    }
    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
    if (start < 0) start = 0;
    if (end >= text.length) break;
  }
  return chunks.filter(c => c.length > 10);
};

const splitSentences = (text) =>
  String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

const extractRelevantSnippet = (text, message, maxSentences = 2, maxChars = 320) => {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return String(text || '').trim().slice(0, maxChars);

  const queryTokens = cleanTokens(message);
  if (queryTokens.length === 0) {
    return sentences.slice(0, maxSentences).join(' ').slice(0, maxChars);
  }

  const scored = sentences.map((sentence, index) => {
    const sentenceTokens = new Set(cleanTokens(sentence));
    let score = 0;
    for (const token of queryTokens) {
      for (const candidate of sentenceTokens) {
        if (tokenMatches(token, candidate)) {
          score += token.length >= 5 ? 1.5 : 1;
          break;
        }
      }
    }
    return { sentence, score, index };
  });

  const best = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.sentence)
    .join(' ');

  const snippet = best || sentences.slice(0, maxSentences).join(' ');
  return snippet.slice(0, maxChars).trim();
};

const tokenize = (input) =>
  String(input || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

const STOPWORDS = new Set([
  'the', 'and', 'for', 'you', 'your', 'with', 'this', 'that', 'from', 'are', 'was', 'can', 'how', 'what', 'when', 'where', 'why', 'who', 'please',
]);

const cleanTokens = (input) => tokenize(input).filter((word) => !STOPWORDS.has(word));

const tokenMatches = (queryToken, candidateToken) => {
  if (!queryToken || !candidateToken) return false;
  if (queryToken === candidateToken) return true;
  const minPrefix = Math.min(4, queryToken.length, candidateToken.length);
  if (minPrefix >= 4) {
    return (
      queryToken.startsWith(candidateToken.slice(0, minPrefix)) ||
      candidateToken.startsWith(queryToken.slice(0, minPrefix))
    );
  }
  return queryToken.startsWith(candidateToken) || candidateToken.startsWith(queryToken);
};

const scoreKnowledgeItem = (item, message) => {
  const messageTokens = [...new Set(cleanTokens(message))];
  const fields = [item.title, item.question, item.answer, item.content, ...(item.tags || [])];
  const tokens = [...new Set(cleanTokens(fields.join(' ')))];
  let score = 0;

  for (const queryToken of messageTokens) {
    const matched = tokens.some((candidateToken) => tokenMatches(queryToken, candidateToken));
    if (matched) {
      score += queryToken.length >= 5 ? 1.5 : 1;
    }
  }

  const loweredMessage = String(message || '').toLowerCase();
  if (item.question && loweredMessage.includes(item.question.toLowerCase().slice(0, 24))) {
    score += 4;
  }

  if (item.title && loweredMessage.includes(item.title.toLowerCase().slice(0, 24))) {
    score += 2;
  }

  return score;
};

export const createKnowledgeBaseItem = async (tenantId, payload) => {
  const title = payload.title;
  const question = payload.question || '';
  const answer = payload.answer || '';
  const content = payload.content || payload.answer || '';
  
  // Generate chunks if not provided
  let chunksData = payload.chunks || [];
  if (chunksData.length === 0) {
    const textToChunk = `${title}\n${question}\n${content}`;
    const textChunks = chunkText(textToChunk, 420, 60);
    
    // Generate embeddings for chunks
    if (textChunks.length > 0) {
      try {
        const embeddings = await getEmbeddings(textChunks);
        chunksData = textChunks.map((text, i) => ({
          chunkText: text,
          chunkOrder: i,
          embedding: embeddings[i]
        }));
      } catch (error) {
        console.warn('Embedding generation failed during creation:', error.message);
        chunksData = textChunks.map((text, i) => ({
          chunkText: text,
          chunkOrder: i
        }));
      }
    }
  }

  return createRecord(KnowledgeBaseItem, 'KnowledgeBaseItem', {
    tenantId,
    type: payload.type || 'faq',
    title,
    question,
    answer,
    content,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    chunks: chunksData,
    status: payload.status || 'active',
    metadata: payload.metadata || {},
  });
};

export const listKnowledgeBaseItems = async (tenantId) =>
  findRecords(KnowledgeBaseItem, 'KnowledgeBaseItem', { tenantId }, { sort: { createdAt: -1 } });

export const getKnowledgeBaseItem = async (tenantId, itemId) =>
  mongoose.isValidObjectId(itemId) ? findOneRecord(KnowledgeBaseItem, 'KnowledgeBaseItem', { tenantId, _id: itemId }) : null;

export const deleteKnowledgeBaseItem = async (tenantId, itemId) => {
  if (!mongoose.isValidObjectId(itemId)) return null;
  return KnowledgeBaseItem.findOneAndDelete({ tenantId, _id: itemId });
};

export const seedKnowledgeBase = async (tenantId, items = []) => {
  const created = [];
  for (const item of items) {
    created.push(await createKnowledgeBaseItem(tenantId, item));
  }
  return created;
};

export const retrieveKnowledgeBaseContext = async (tenantId, message, limit = 4) => {
  const items = await listKnowledgeBaseItems(tenantId);
  let messageEmbedding = null;
  
  try {
    messageEmbedding = await getEmbedding(message);
  } catch (error) {
    console.warn('Embedding retrieval failed during search:', error.message);
  }

  const matches = [];

  for (const item of items) {
    let bestChunkScore = 0;
    let bestChunkText = '';

    if (messageEmbedding && item.chunks && item.chunks.length > 0) {
      for (const chunk of item.chunks) {
        if (chunk.embedding) {
          const sim = cosineSimilarity(messageEmbedding, chunk.embedding);
          if (sim > bestChunkScore) {
            bestChunkScore = sim;
            bestChunkText = chunk.chunkText;
          }
        }
      }
    }

    // Keyword score as a weight/tie-breaker
    const keywordScore = scoreKnowledgeItem(item, message);
    
    // Normalize and combine scores
    // bestChunkScore is typically 0.6 - 0.9 for good matches
    // keywordScore can be anywhere from 0 to 10+
    const combinedScore = (bestChunkScore * 10) + keywordScore;

    if (combinedScore > 1.5) {
      const rawContent = bestChunkText || item.content || item.answer || '';
      const focusedContent =
        item.type === 'document'
          ? extractRelevantSnippet(rawContent, message)
          : rawContent;

      matches.push({
        id: item._id,
        type: item.type,
        title: item.title,
        question: item.question,
        answer: item.answer,
        content: focusedContent,
        tags: item.tags || [],
        score: combinedScore,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, limit);
};

export const buildKnowledgeSummary = (matches = []) =>
  matches
    .map((match, index) => {
      const lines = [`[${index + 1}] ${match.title}`];
      if (match.question) lines.push(`Q: ${match.question}`);
      if (match.answer && match.type === 'faq') lines.push(`A: ${match.answer}`);
      if (match.content) lines.push(`Relevant excerpt: ${match.content}`);
      return lines.join('\n');
    })
    .join('\n\n');
