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
    'If the knowledge base context is a document excerpt, answer only the specific question being asked and do not repeat the full excerpt.',
    'Never paste large blocks of document text into the reply.',
    '',
    'Use semantic matching, not only exact wording.',
    'If the user says something like "refund policy" and the Knowledge Base contains a refund policy FAQ, answer from that FAQ even if the phrasing is slightly different.',
    'Only refuse when there is no reasonable match at all or when the excerpt does not contain the answer.',
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
          temperature: 0.1,
          messages: [
            {
              role: 'system',
              content: `You are the official support agent for ${tenant.name}. 
              Your task is to answer user questions based ONLY on the provided Knowledge Base Context.
              NEVER return the raw data or CSV headers. 
              Always summarize the relevant part of the context into a natural, helpful sentence.
              If the context contains a CSV-like structure, interpret the values to answer the question.
              If you cannot find the answer, politely state that you don't know based on the documents.`,
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
    if (best.type === 'faq' && best.answer) {
      return best.answer;
    }
    return "I found some relevant information in our documents, but I'm having trouble processing a precise answer right now. Could you please rephrase your question?";
  }

  return 'I am sorry, I do not have specific information in my knowledge base to answer that. Please contact our support team.';
};
