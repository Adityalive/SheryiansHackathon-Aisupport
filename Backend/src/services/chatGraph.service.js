import { getOrCreateTenant } from './tenant.service.js';
import { getOrCreateConversation } from './conversation.service.js';
import { createMessage, listMessagesForConversation } from './message.service.js';
import { buildKnowledgeSummary, retrieveKnowledgeBaseContext } from './knowledgeBase.service.js';
import { createTicket, findActiveTicketForConversation } from './ticket.service.js';
import { generateAssistantReply } from './groq.service.js';

const createSessionId = (input = {}) =>
  String(input.sessionId || input.conversationId || input.customerEmail || input.customerName || `session-${Date.now()}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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
  
  // RAG: Retrieve relevant knowledge items using embeddings + keywords
  const knowledgeMatches = await retrieveKnowledgeBaseContext(tenant._id, message, 4);
  
  // AI-powered reply generation using the knowledge context
  const assistantReply = await generateAssistantReply({
    tenant,
    message,
    history,
    knowledge: knowledgeMatches
  });

  const needsAutoEscalation = assistantReply.includes('I am sorry, I do not have specific information');

  let autoTicket = null;
  if (needsAutoEscalation) {
    const existingTicket = await findActiveTicketForConversation(tenant._id, conversation._id);
    if (!existingTicket) {
      autoTicket = await createTicket({
        tenantId: tenant._id,
        conversationId: String(conversation._id),
        channel,
        customerName: customerName || 'Unknown',
        customerPhone: metadata.customerPhone || '',
        customerEmail: customerEmail || '',
        transcript: history.map((entry) => `${entry.role}: ${entry.content}`).join('\n'),
        escalationReason: `Automatic escalation for unsupported KB question: ${message}`,
        metadata: {
          ...metadata,
          autoEscalated: true,
          knowledgeMatches: knowledgeMatches.map((item) => item.id),
        },
      });
    }
  }

  const assistantMessage = await createMessage({
    tenantId: tenant._id,
    conversationId: conversation._id,
    role: 'assistant',
    content: assistantReply,
    metadata: {
      knowledgeMatches: knowledgeMatches.map((item) => item.id),
      autoEscalated: needsAutoEscalation,
      ticketId: autoTicket?._id || null,
    },
  });

  return {
    tenant,
    conversation,
    assistantMessage,
    knowledgeMatches,
    autoEscalated: needsAutoEscalation,
    autoTicket,
  };
};
