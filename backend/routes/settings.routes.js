import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const settingsRouter = express.Router();

settingsRouter.get('/', (_req, res) => {
  try {
    const settings = db.getData().settings;
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.put('/', requireAuth, (req, res) => {
  try {
    const newSettings = req.body;
    db.getData().settings = {
      ...db.getData().settings,
      ...newSettings
    };
    db.save();

    res.json({
      success: true,
      message: 'Paramètres mis à jour.',
      settings: db.getData().settings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { settingsRouter };
