import express from 'express';
import { db, Collection } from '../db.js';
import { requireAuth } from '../auth.js';

const collectionsRouter = express.Router();

function slugify(text: string): string {
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

// GET all collections
collectionsRouter.get('/', (req, res) => {
  try {
    let collections = [...db.getData().collections];
    const { status, featured } = req.query;

    if (status) {
      collections = collections.filter(c => c.status === status);
    }
    if (featured === 'true') {
      collections = collections.filter(c => c.isFeatured);
    }

    // Attach product count to each collection
    const enriched = collections.map(col => {
      const productCount = db.getData().products.filter(p => p.collectionId === col.id).length;
      return {
        ...col,
        productCount
      };
    });

    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la récupération des gammes.' });
  }
});

// GET collection by ID or Slug with its associated products
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
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur.' });
  }
});

// POST Create Collection (Admin)
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

    const newCollection: Collection = {
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
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la création de la gamme.' });
  }
});

// PUT Update Collection (Admin)
collectionsRouter.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().collections.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Gamme introuvable.' });
    }

    const currentCollection = db.getData().collections[index];
    const updateData = req.body;

    let updatedSlug = currentCollection.slug;
    if (updateData.name && updateData.name !== currentCollection.name) {
      const baseSlug = slugify(updateData.name);
      updatedSlug = baseSlug;
      let counter = 1;
      while (db.getData().collections.some(c => c.slug === updatedSlug && c.id !== id)) {
        updatedSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updatedCollection: Collection = {
      ...currentCollection,
      name: updateData.name !== undefined ? updateData.name.trim() : currentCollection.name,
      slug: updatedSlug,
      categoryId: updateData.categoryId !== undefined ? updateData.categoryId : currentCollection.categoryId,
      shade: updateData.shade !== undefined ? updateData.shade.trim() : currentCollection.shade,
      description: updateData.description !== undefined ? updateData.description.trim() : currentCollection.description,
      shortDescription: updateData.shortDescription !== undefined ? updateData.shortDescription.trim() : currentCollection.shortDescription,
      coverImage: updateData.coverImage !== undefined ? updateData.coverImage : currentCollection.coverImage,
      images: Array.isArray(updateData.images) ? updateData.images : currentCollection.images,
      status: updateData.status !== undefined ? updateData.status : currentCollection.status,
      isFeatured: updateData.isFeatured !== undefined ? Boolean(updateData.isFeatured) : currentCollection.isFeatured,
      updatedAt: new Date().toISOString()
    };

    db.getData().collections[index] = updatedCollection;
    db.save();

    res.json({
      success: true,
      message: 'Gamme mise à jour avec succès.',
      collection: updatedCollection
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur.' });
  }
});

// DELETE Collection (Admin)
collectionsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = db.getData().collections.length;
    db.getData().collections = db.getData().collections.filter(c => c.id !== id);

    if (db.getData().collections.length === initialLen) {
      return res.status(404).json({ error: 'Gamme introuvable.' });
    }

    // Unset collectionId for products in this collection
    db.getData().products.forEach(p => {
      if (p.collectionId === id) {
        delete p.collectionId;
      }
    });

    db.save();
    res.json({ success: true, message: 'Gamme supprimée avec succès.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur.' });
  }
});

export { collectionsRouter };
