import { Router } from 'express';
import multer from 'multer';
import {
  handleCreateKnowledgeItem,
  handleListKnowledgeItems,
  handleDeleteKnowledgeItem,
  handleUploadDocument,
} from '../controllers/knowledgeBase.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.get('/', handleListKnowledgeItems);
router.post('/', handleCreateKnowledgeItem);
router.delete('/:id', handleDeleteKnowledgeItem);
router.post('/upload', upload.single('file'), handleUploadDocument);

export default router;
