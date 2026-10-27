import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const categoriesRouter = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

categoriesRouter.get('/', (_req, res) => {
  try {
    const categories = db.getData().categories.map(cat => {
      const productCount = db.getData().products.filter(p => p.categoryId === cat.id).length;
      return { ...cat, productCount };
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

categoriesRouter.post('/', requireAuth, (req, res) => {
  try {
    const { name, description = '', image = '/assets/hero_banner.jpg' } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom obligatoire.' });

    const slug = slugify(name);
    const newCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug,
      description: description.trim(),
      image,
      createdAt: new Date().toISOString()
    };

    db.getData().categories.push(newCategory);
    db.save();

    res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

categoriesRouter.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().categories.findIndex(c => c.id === id);

    if (index === -1) return res.status(404).json({ error: 'Catégorie introuvable.' });

    const current = db.getData().categories[index];
    const { name, description, image } = req.body;

    const updated = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      slug: name !== undefined ? slugify(name) : current.slug,
      description: description !== undefined ? description.trim() : current.description,
      image: image !== undefined ? image : current.image
    };

    db.getData().categories[index] = updated;
    db.save();

    res.json({ success: true, category: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

categoriesRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().categories = db.getData().categories.filter(c => c.id !== id);
    db.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { categoriesRouter };
