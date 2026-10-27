import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const contentRouter = express.Router();

contentRouter.get('/', (_req, res) => {
  try {
    const content = db.getData().siteContent;
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.put('/', requireAuth, (req, res) => {
  try {
    const updatedContent = req.body;
    const current = db.getData().siteContent;

    db.getData().siteContent = {
      hero: { ...current.hero, ...(updatedContent.hero || {}) },
      promoBanner: { ...current.promoBanner, ...(updatedContent.promoBanner || {}) },
      about: { ...current.about, ...(updatedContent.about || {}) },
      contact: { ...current.contact, ...(updatedContent.contact || {}) },
      guarantees: updatedContent.guarantees || current.guarantees
    };

    db.save();

    res.json({
      success: true,
      message: 'Contenu du site mis à jour.',
      content: db.getData().siteContent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { contentRouter };
