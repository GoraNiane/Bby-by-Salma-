import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const collectionsRouter = express.Router();

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

collectionsRouter.get('/', (req, res) => {
  try {
    let collections = [...db.getData().collections];
    const { status, featured } = req.query;

    if (status) collections = collections.filter(c => c.status === status);
    if (featured === 'true') collections = collections.filter(c => c.isFeatured);

    const enriched = collections.map(col => {
      const productCount = db.getData().products.filter(p => p.collectionId === col.id).length;
      return {
        ...col,
        productCount
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

collectionsRouter.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const collection = db.getData().collections.find(c => c.id === idOrSlug || c.slug === idOrSlug);

    if (!collection) {
      return res.status(404).json({ error: 'Gamme introuvable.' });
    }

    const products = db.getData().products.filter(p => p.collectionId === collection.id);

    res.json({
      ...collection,
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

collectionsRouter.post('/', requireAuth, (req, res) => {
  try {
    const {
      name,
      categoryId = 'cat_teint',
      shade = '',
      description = '',
      shortDescription = '',
      coverImage,
      images = [],
      status = 'active',
      isFeatured = true
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Le nom de la gamme est obligatoire.' });
    }

    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (db.getData().collections.some(c => c.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const imageList = Array.isArray(images) && images.length > 0
      ? images
      : (coverImage ? [coverImage] : ['/assets/hero_banner.jpg']);

    const newCollection = {
      id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug: finalSlug,
      categoryId,
      shade: shade.trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      coverImage: coverImage || imageList[0] || '/assets/hero_banner.jpg',
      images: imageList,
      status: status || 'active',
      isFeatured: Boolean(isFeatured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.getData().collections.unshift(newCollection);
    db.save();

    res.status(201).json({
      success: true,
      message: 'Gamme créée avec succès.',
      collection: newCollection
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

collectionsRouter.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().collections.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Gamme introuvable.' });
    }

    const current = db.getData().collections[index];
    const updateData = req.body;

    let updatedSlug = current.slug;
    if (updateData.name && updateData.name !== current.name) {
      const baseSlug = slugify(updateData.name);
      updatedSlug = baseSlug;
      let counter = 1;
      while (db.getData().collections.some(c => c.slug === updatedSlug && c.id !== id)) {
        updatedSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updated = {
      ...current,
      name: updateData.name !== undefined ? updateData.name.trim() : current.name,
      slug: updatedSlug,
      categoryId: updateData.categoryId !== undefined ? updateData.categoryId : current.categoryId,
      shade: updateData.shade !== undefined ? updateData.shade.trim() : current.shade,
      description: updateData.description !== undefined ? updateData.description.trim() : current.description,
      shortDescription: updateData.shortDescription !== undefined ? updateData.shortDescription.trim() : current.shortDescription,
      coverImage: updateData.coverImage !== undefined ? updateData.coverImage : current.coverImage,
      images: Array.isArray(updateData.images) ? updateData.images : current.images,
      status: updateData.status !== undefined ? updateData.status : current.status,
      isFeatured: updateData.isFeatured !== undefined ? Boolean(updateData.isFeatured) : current.isFeatured,
      updatedAt: new Date().toISOString()
    };

    db.getData().collections[index] = updated;
    db.save();

    res.json({
      success: true,
      message: 'Gamme mise à jour avec succès.',
      collection: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

collectionsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().collections = db.getData().collections.filter(c => c.id !== id);

    db.getData().products.forEach(p => {
      if (p.collectionId === id) delete p.collectionId;
    });

    db.save();
    res.json({ success: true, message: 'Gamme supprimée.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { collectionsRouter };
