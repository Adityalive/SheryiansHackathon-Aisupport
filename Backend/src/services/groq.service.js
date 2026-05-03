const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildPrompt = ({ tenant, message, history, knowledge }) => {
  const compactKnowledge = (knowledge || []).slice(0, 2);
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
    `You are a helpful support bot for ${tenant.name}.`,
    'Use only the provided knowledge base context.',
    'Keep the reply short: 1 short sentence if possible.',
    'Do not explain your reasoning.',
    'Do not repeat the full document.',
    '',
    'Use semantic matching, not only exact wording.',
    'If the answer is not in the context, refuse briefly.',
    '',
    'If the information is genuinely missing, say: "I am sorry, I do not have specific information about that. Please contact our support team directly."',
    '',
    `Knowledge Base Context:\n${knowledgeBlock}`,
    '',
    `Conversation History:\n${historyBlock || 'No previous messages.'}`,
    '',
    `Customer Question: ${message}`,
  ].join('\n');
};

export const generateAssistantReply = async ({ tenant, message, history = [], knowledge = [] }) => {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

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
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: `You are the official support agent for ${tenant.name}. Answer only from the provided knowledge base context. Keep it concise.`,
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
        const errorData = await response.json();
        console.error('Groq API Error Details:', JSON.stringify(errorData, null, 2));
      }
    } catch (error) {
      console.error(`Groq request failed critically: ${error.message}`);
    }
  }

  // Smarter fallback: summarize the best match instead of dumping it raw
  if (knowledge.length > 0) {
    const best = knowledge[0];
    const answer = best.answer || best.content || 'I found a related help article, but it does not contain a direct answer yet.';
    return String(answer).trim().split(/(?<=[.!?])\s+/)[0].slice(0, 220);
  }

  return 'I am sorry, I do not have specific information in my knowledge base to answer that. Please contact our support team.';
};
