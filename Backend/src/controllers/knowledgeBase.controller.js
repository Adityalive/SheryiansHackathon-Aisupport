import {
  createKnowledgeBaseItem,
  listKnowledgeBaseItems,
  getKnowledgeBaseItem,
  deleteKnowledgeBaseItem,
} from '../services/knowledgeBase.service.js';
import pdf from 'pdf-parse';

export const handleCreateKnowledgeItem = async (req, res) => {
  try {
    const item = await createKnowledgeBaseItem(req.user.tenantId, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleListKnowledgeItems = async (req, res) => {
  try {
    const items = await listKnowledgeBaseItems(req.user.tenantId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleDeleteKnowledgeItem = async (req, res) => {
  try {
    await deleteKnowledgeBaseItem(req.user.tenantId, req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleUploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf-8');
    }

    const payload = {
      type: 'document',
      title: req.file.originalname,
      content: text,
      metadata: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    };

    const item = await createKnowledgeBaseItem(req.user.tenantId, payload);
    res.status(201).json(item);
  } catch (error) {
    console.error('Document Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
};
