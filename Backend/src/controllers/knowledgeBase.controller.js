import {
  createKnowledgeBaseItem,
  listKnowledgeBaseItems,
  getKnowledgeBaseItem,
  deleteKnowledgeBaseItem,
} from '../services/knowledgeBase.service.js';
<<<<<<< HEAD
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
=======
// pdf-parse is imported lazily inside handleUploadDocument to avoid its
// broken startup test that crashes the server at module-load time.
>>>>>>> update

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
      const { default: pdf } = await import('pdf-parse');
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf-8');
    }

    // Smart CSV Handling
    if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      const rows = text.split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
      if (rows.length > 1) {
        const headers = rows[0].toLowerCase().split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const qIndex = headers.findIndex((h) => h === 'prompt' || h === 'question' || h === 'q');
        const aIndex = headers.findIndex((h) => h === 'response' || h === 'answer' || h === 'a');

        if (qIndex !== -1 && aIndex !== -1) {
          const results = [];
          for (let i = 1; i < rows.length; i++) {
            // Regex to split by comma but ignore commas inside quotes
            const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const question = (cols[qIndex] || '').replace(/^"|"$/g, '').trim();
            const answer = (cols[aIndex] || '').replace(/^"|"$/g, '').trim();

            if (question && answer) {
              const item = await createKnowledgeBaseItem(req.user.tenantId, {
                type: 'faq',
                title: question.substring(0, 60),
                question,
                answer,
                content: answer,
                tags: ['csv_import'],
              });
              results.push(item);
            }
          }
          return res.status(201).json({
            message: `Successfully imported ${results.length} items from CSV`,
            count: results.length,
          });
        }
      }
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
