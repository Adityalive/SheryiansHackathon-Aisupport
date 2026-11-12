const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildPrompt = ({ tenant, message, history, knowledge }) => {
  const compactKnowledge = (knowledge || []).slice(0, 3);
  const compactHistory = (history || []).slice(-4);

  const knowledgeBlock = compactKnowledge.length
    ? compactKnowledge
        .map((item, index) => `${index + 1}. ${item.title}\nQ: ${item.question || 'n/a'}\nA: ${item.answer || item.content || 'n/a'}`)
        .join('\n\n')
    : 'No relevant knowledge base items were found.';

  const historyBlock = compactHistory
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join('\n');

  return [
    `You are the customer support assistant for "${tenant.name}".`,
    '',
    '## RULES:',
    '1. Answer the customer\'s question using the Knowledge Base Context below.',
    '2. You CAN paraphrase, summarize, and rephrase information from the context — you do NOT need to quote it word-for-word.',
    '3. If the customer\'s question is related to any topic covered in the context, answer it naturally using that information.',
    '4. Only refuse if the question is COMPLETELY unrelated to anything in the context (e.g., weather, coding, trivia).',
    '5. When refusing, say: "I don\'t have information about that. Please contact our support team for help."',
    '6. Keep responses concise and friendly — 1-3 sentences.',
    '7. Do NOT make up facts that aren\'t supported by the context.',
    '',
    `## Knowledge Base Context:\n${knowledgeBlock}`,
    '',
    `## Conversation History:\n${historyBlock || 'No previous messages.'}`,
    '',
    `## Customer Question: ${message}`,
  ].join('\n');
};

export const generateAssistantReply = async ({ tenant, message, history = [], knowledge = [] }) => {
  const apiKey = process.env.GROQ_API_KEY;
  let model = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
  // Prompt-guard is a security classifier that outputs numbers, not chat text
  if (model.includes('prompt-guard') || model === 'llama-3.1-8b-instant') {
    model = 'qwen/qwen3.8-27b';
  }

  if (apiKey) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: [
                `You are the friendly support assistant for "${tenant.name}".`,
                'Answer questions using the knowledge base context provided.',
                'You can paraphrase and summarize — you don\'t need exact word matches.',
                'If the context covers the topic even partially, give a helpful answer.',
                'Only refuse if the question is completely unrelated to the context.',
                'Keep responses short and natural — 1-3 sentences.',
              ].join(' '),
            },
            {
              role: 'user',
              content: buildPrompt({ tenant, message, history, knowledge }),
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content?.trim();
        if (content) {
          return content;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API Error Details:', JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      console.error(`Groq request failed critically: ${error.message}`);
    }
  } else {
    console.warn('GROQ_API_KEY is not set — falling back to KB-only response.');
  }

  // Fallback: return KB content if the match is reasonably relevant
  const RELEVANCE_THRESHOLD = 2;
  if (knowledge.length > 0 && knowledge[0].score >= RELEVANCE_THRESHOLD) {
    const best = knowledge[0];
    if (best.type === 'faq' && best.answer) {
      return String(best.answer).trim().slice(0, 300);
    }
    const content = best.content || best.answer || '';
    if (content.trim()) {
      const firstSentence = content.trim().split(/(?<=[.!?])\s+/)[0] || content.trim();
      return firstSentence.slice(0, 300);
    }
  }

  return "I don't have information about that right now. Please contact our support team for further assistance.";
};
