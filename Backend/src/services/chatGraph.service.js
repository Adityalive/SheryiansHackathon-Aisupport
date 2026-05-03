import { getOrCreateTenant } from './tenant.service.js';
import { getOrCreateConversation } from './conversation.service.js';
import { createMessage, listMessagesForConversation } from './message.service.js';
import { buildKnowledgeSummary, retrieveKnowledgeBaseContext } from './knowledgeBase.service.js';
import { createTicket, findActiveTicketForConversation } from './ticket.service.js';

const createSessionId = (input = {}) =>
  String(input.sessionId || input.conversationId || input.customerEmail || input.customerName || `session-${Date.now()}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const shortenReply = (text = '', maxWords = 24) => {
  const cleaned = String(text || '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return cleaned;

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const firstSentence = sentences[0] || cleaned;
  const words = firstSentence.split(/\s+/);
  if (words.length <= maxWords) return firstSentence;
  return `${words.slice(0, maxWords).join(' ')}...`;
};

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
  const knowledgeMatches = await retrieveKnowledgeBaseContext(tenant._id, message, 3);
  const knowledgeSummary = buildKnowledgeSummary(knowledgeMatches);
  const bestMatch = knowledgeMatches[0];
  const shouldAnswerDirectly =
    bestMatch &&
    bestMatch.type === 'faq' &&
    Boolean(bestMatch.answer) &&
    bestMatch.score >= 1.25;

  const assistantReply = shouldAnswerDirectly
    ? shortenReply(bestMatch.answer)
    : 'I do not have that in the knowledge base.';

  const needsAutoEscalation = !shouldAnswerDirectly;

  let autoTicket = null;
  let finalAssistantReply = assistantReply;

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

    finalAssistantReply = 'I do not have that in the knowledge base.';
  }

  const assistantMessage = await createMessage({
    tenantId: tenant._id,
    conversationId: conversation._id,
    role: 'assistant',
    content: shortenReply(finalAssistantReply),
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
