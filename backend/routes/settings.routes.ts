import express from 'express';
import { db, StoreSettings } from '../db.js';
import { requireAuth } from '../auth.js';

const settingsRouter = express.Router();

// GET settings (Public for currency & delivery fees)
settingsRouter.get('/', (_req, res) => {
  try {
    const settings = db.getData().settings;
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update settings (Admin)
settingsRouter.put('/', requireAuth, (req, res) => {
  try {
    const newSettings: Partial<StoreSettings> = req.body;
    db.getData().settings = {
      ...db.getData().settings,
      ...newSettings
    };
    db.save();

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès.',
      settings: db.getData().settings
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { settingsRouter };
