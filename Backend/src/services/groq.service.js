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
    `You are the official customer support assistant for "${tenant.name}".`,
    '',
    '## STRICT RULES (NEVER VIOLATE):',
    '1. You may ONLY answer using the "Knowledge Base Context" provided below.',
    '2. If the answer is NOT explicitly present in the Knowledge Base Context, you MUST respond with: "I\'m sorry, I don\'t have information about that in our knowledge base. Please contact our support team for further assistance."',
    '3. Do NOT use your own training data, general knowledge, or assumptions.',
    '4. Do NOT guess, speculate, or infer answers that are not directly stated in the context.',
    '5. Do NOT answer questions about topics unrelated to the business (e.g., weather, math, coding, general trivia).',
    '6. Keep responses concise — 1-2 sentences maximum.',
    '7. Do NOT repeat the full knowledge base content. Extract only the relevant part.',
    '8. Use semantic understanding to match the customer\'s intent to the closest KB entry, but never fabricate information.',
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
              content: [
                `You are the official support assistant for "${tenant.name}".`,
                'You are a STRICT knowledge-base-only assistant.',
                'You must ONLY answer questions using the knowledge base context provided in the user message.',
                'If the knowledge base context does not contain the answer, you MUST refuse and direct them to the support team.',
                'NEVER use your general training knowledge. NEVER guess. NEVER answer off-topic questions.',
                'Keep all responses to 1-2 short sentences.',
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
