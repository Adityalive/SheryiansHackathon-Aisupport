const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
    `You are a helpful support bot for ${tenant.name}.`,
    'Your priority is FACTUAL ACCURACY, but you should also use the most likely relevant knowledge base answer when the wording is a close match.',
    'Keep every reply short and crisp: 1 to 2 sentences max.',
    'Do not explain your reasoning unless the user asks.',
    '',
    'Use semantic matching, not only exact wording.',
    'If the user says something like "refund policy" and the Knowledge Base contains a refund policy FAQ, answer from that FAQ even if the phrasing is slightly different.',
    'Only refuse when there is no reasonable match at all or when the question clearly asks for a different topic.',
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
          temperature: 0, // Keep replies stable and reduce unnecessary variation
          messages: [
            {
              role: 'system',
              content: `You are the official support agent for ${tenant.name}. Use the most likely matching FAQ answer when the knowledge base is a close semantic match. Be accurate, but do not be overly strict about wording.`,
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
        console.error('Groq API Error:', errorData);
      }
    } catch (error) {
      console.warn(`Groq request failed: ${error.message}`);
    }
  }

  // Fallback to knowledge base if API fails or key is missing
  if (knowledge.length > 0) {
    const best = knowledge[0];
    const answer = best.answer || best.content || 'I found a related help article, but it does not contain a direct answer yet.';
    return answer;
  }

  return 'I do not have enough information yet. Please contact support.';
};
