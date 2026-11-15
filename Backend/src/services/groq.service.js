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
    `You are the official customer support AI assistant for "${tenant.name}".`,
    '',
    '## INSTRUCTIONS:',
    `1. If the user asks general questions about this website, business, or service (e.g. "what does this website do?", "who are you?", "what services do you offer?"): explain warmly that you are the official customer support AI for ${tenant.name}, helping users with inquiries, account support, ticketing, and information from the company knowledge base.`,
    '2. For specific questions (policies, refunds, technical details, procedures): answer using the Knowledge Base Context provided below.',
    '3. You CAN paraphrase, synthesize, and summarize information naturally — you do NOT need to quote word-for-word.',
    '4. Only refuse if the question is completely unrelated to the business or customer support (e.g. general trivia, coding homework, unrelated politics).',
    '5. When genuinely missing information, politely reply: "I don\'t have specific information about that in our knowledge base. Please feel free to open a ticket or reach out to our team!"',
    '6. Keep your answers concise, helpful, and natural (1-3 sentences).',
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
                `You are the friendly AI customer support representative for "${tenant.name}".`,
                'You help visitors learn what this website offers and answer questions using the provided knowledge base context.',
                'If asked what this website does, introduce the platform warmly and explain you are here to assist with questions, tickets, and policies.',
                'Answer questions accurately and concisely in 1-3 sentences.',
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
