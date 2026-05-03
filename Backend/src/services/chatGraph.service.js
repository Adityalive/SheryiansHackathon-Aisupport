import { getOrCreateTenant } from './tenant.service.js';
import { getOrCreateConversation } from './conversation.service.js';
import { createMessage, listMessagesForConversation } from './message.service.js';
import { retrieveKnowledgeBaseContext } from './knowledgeBase.service.js';
import { createTicket, findActiveTicketForConversation } from './ticket.service.js';
import { generateAssistantReply } from './groq.service.js';

const createSessionId = (input = {}) =>
  String(input.sessionId || input.conversationId || input.customerEmail || input.customerName || `session-${Date.now()}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const shortenReply = (text = '', maxChars = 220) => {
  const cleaned = String(text || '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return cleaned;

  const firstSentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
  return firstSentence.length > maxChars
    ? `${firstSentence.slice(0, maxChars).trim()}...`
    : firstSentence;
};

const compactHistory = (history = [], maxMessages = 4, maxChars = 180) =>
  history.slice(-maxMessages).map((entry) => ({
    role: entry.role,
    content: shortenReply(entry.content, maxChars),
  }));

export const runChatGraph = async ({
  tenantInput,
  message,
  sessionId,
  customerName,
  customerEmail,
  channel = 'chat',
  metadata = {},
}) => {
  const tenant = await getOrCreateTenant(tenantInput);
  const normalizedSessionId = createSessionId({ sessionId, conversationId: metadata.conversationId, customerEmail, customerName });

  const conversation = await getOrCreateConversation({
    tenantId: tenant._id,
    sessionId: normalizedSessionId,
    customerName,
    customerEmail,
    channel,
    metadata,
  });

  await createMessage({
    tenantId: tenant._id,
    conversationId: conversation._id,
    role: 'user',
    content: message,
    metadata,
  });

  const history = await listMessagesForConversation(tenant._id, conversation._id);
  const recentHistory = compactHistory(history);
  
  // RAG: Retrieve relevant knowledge items using embeddings + keywords
  const knowledgeMatches = await retrieveKnowledgeBaseContext(tenant._id, message, 2);
  
  // AI-powered reply generation using the knowledge context
  const assistantReply = await generateAssistantReply({
    tenant,
    message,
    history: recentHistory,
    knowledge: knowledgeMatches
  });
  const finalReply = shortenReply(assistantReply);

  const assistantMessage = await createMessage({
    tenantId: tenant._id,
    conversationId: conversation._id,
    role: 'assistant',
    content: finalReply,
    metadata: {
      knowledgeMatches: knowledgeMatches.map((item) => item.id),
    },
  });

  return {
    tenant,
    conversation,
    assistantMessage,
    knowledgeMatches,
    autoEscalated: false,
    autoTicket: null,
  };
};
