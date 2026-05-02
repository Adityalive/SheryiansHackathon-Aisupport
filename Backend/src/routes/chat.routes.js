import { Router } from 'express';
import {
  createTenantKnowledgeBaseItem,
  deleteTenantKnowledgeBaseItem,
  getConversation,
  getKnowledgeItem,
  getTenantConversations,
  listTenantKnowledgeBase,
  seedTenantKnowledgeBase,
  sendMessage,
  deleteTenantConversation,
} from '../controllers/chat.controller.js';

const router = Router();

router.post('/message', sendMessage);
router.get('/conversations/:conversationId', getConversation);
router.get('/tenants/:tenantId/conversations', getTenantConversations);
router.delete('/tenants/:tenantId/conversations/:conversationId', deleteTenantConversation);
router.get('/tenants/:tenantId/knowledge-base', listTenantKnowledgeBase);
router.post('/tenants/:tenantId/knowledge-base', createTenantKnowledgeBaseItem);
router.delete('/tenants/:tenantId/knowledge-base/:itemId', deleteTenantKnowledgeBaseItem);
router.post('/tenants/:tenantId/knowledge-base/seed', seedTenantKnowledgeBase);
router.get('/tenants/:tenantId/knowledge-base/:itemId', getKnowledgeItem);

export default router;
