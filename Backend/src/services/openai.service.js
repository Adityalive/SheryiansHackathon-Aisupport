const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const buildPrompt = ({ tenant, message, history, knowledge }) => {
  const knowledgeBlock = knowledge.length
    ? knowledge
        .map((item, index) => `${index + 1}. ${item.title}\nQ: ${item.question || 'n/a'}\nA: ${item.answer || item.content || 'n/a'}`)
        .join('\n\n')
    : 'No relevant knowledge base items were found.';

  const historyBlock = history
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join('\n');

  return [
    `You are a tenant-scoped support assistant for ${tenant.name}.`,
    'Answer using the most likely knowledge base match when the wording is close, even if it is not an exact phrase match.',
    'Be practical rather than overly strict. Do not reject a FAQ just because the user phrased it a little differently.',
    'Keep every reply short and crisp: 1 to 2 sentences max.',
    'If the answer is not covered at all, say you need a support agent in one short sentence.',
    '',
    `Knowledge base context:\n${knowledgeBlock}`,
    '',
    `Conversation history:\n${historyBlock || 'No previous messages.'}`,
    '',
    `Customer message: ${message}`,
  ].join('\n');
};

export const generateAssistantReply = async ({ tenant, message, history = [], knowledge = [] }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (apiKey) {
    try {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful customer support assistant. Prefer the most likely FAQ answer for near-matches, and keep answers short, accurate, and tenant-specific.',
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
      }
    } catch (error) {
      console.warn(`OpenAI request failed: ${error.message}`);
    }
  }

  if (knowledge.length > 0) {
    const best = knowledge[0];
    const answer = best.answer || best.content || 'I found a related help article, but it does not contain a direct answer yet.';
    return answer;
  }

  return 'I do not have enough information yet. Please contact support.';
};
