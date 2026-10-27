import express from 'express';
import { db, SiteContent } from '../db.js';
import { requireAuth } from '../auth.js';

const contentRouter = express.Router();

// GET Site Content (Public)
contentRouter.get('/', (_req, res) => {
  try {
    const content = db.getData().siteContent;
    res.json(content);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update Site Content (Admin)
contentRouter.put('/', requireAuth, (req, res) => {
  try {
    const updatedContent: Partial<SiteContent> = req.body;
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
      message: 'Contenu du site mis à jour avec succès.',
      content: db.getData().siteContent
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { contentRouter };
