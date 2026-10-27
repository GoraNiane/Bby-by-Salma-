import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const productsRouter = express.Router();

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

productsRouter.get('/', (req, res) => {
  try {
    let products = [...db.getData().products];
    const { category, collection, status, search, featured, bestSeller, isNew } = req.query;

    if (category) products = products.filter(p => p.categoryId === category);
    if (collection) products = products.filter(p => p.collectionId === collection);
    if (status) products = products.filter(p => p.status === status);
    if (featured === 'true') products = products.filter(p => p.isFeatured);
    if (bestSeller === 'true') products = products.filter(p => p.isBestSeller);
    if (isNew === 'true') products = products.filter(p => p.isNew);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.shade && p.shade.toLowerCase().includes(q))
      );
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

productsRouter.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = db.getData().products.find(p => p.id === idOrSlug || p.slug === idOrSlug);

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

productsRouter.post('/', requireAuth, (req, res) => {
  try {
    const {
      name,
      sku,
      brand = 'BBS By Salma',
      categoryId,
      collectionId,
      description = '',
      shortDescription = '',
      price,
      oldPrice,
      promoPrice,
      stock = 0,
      alertThreshold = 5,
      shade = '',
      skinType = '',
      ingredients = '',
      images = [],
      isFeatured = false,
      isNew = false,
      isBestSeller = false,
      status = 'published'
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nom et prix obligatoires.' });
    }

    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (db.getData().products.some(p => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const generatedSku = sku?.trim() || `BBS-${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedImages = Array.isArray(images)
      ? images.map((img, idx) => ({
          id: img.id || `img_${Date.now()}_${idx}`,
          url: typeof img === 'string' ? img : img.url,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
          position: img.position !== undefined ? img.position : idx + 1
        }))
      : [];

    const newProduct = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug: finalSlug,
      sku: generatedSku,
      brand: brand.trim(),
      categoryId: categoryId || 'cat_teint',
      collectionId: collectionId || undefined,
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      promoPrice: promoPrice ? Number(promoPrice) : undefined,
      stock: Number(stock) || 0,
      alertThreshold: Number(alertThreshold) || 5,
      shade: shade?.trim(),
      skinType: skinType?.trim(),
      ingredients: ingredients?.trim(),
      images: formattedImages,
      isFeatured: Boolean(isFeatured),
      isNew: Boolean(isNew),
      isBestSeller: Boolean(isBestSeller),
      status: status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.getData().products.unshift(newProduct);
    db.save();

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès.',
      product: newProduct
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

productsRouter.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }

    const current = db.getData().products[index];
    const updateData = req.body;

    let updatedSlug = current.slug;
    if (updateData.name && updateData.name !== current.name) {
      const baseSlug = slugify(updateData.name);
      updatedSlug = baseSlug;
      let counter = 1;
      while (db.getData().products.some(p => p.slug === updatedSlug && p.id !== id)) {
        updatedSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    let formattedImages = current.images;
    if (Array.isArray(updateData.images)) {
      formattedImages = updateData.images.map((img, idx) => ({
        id: img.id || `img_${Date.now()}_${idx}`,
        url: typeof img === 'string' ? img : img.url,
        isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
        position: img.position !== undefined ? img.position : idx + 1
      }));
    }

    const updated = {
      ...current,
      name: updateData.name !== undefined ? updateData.name.trim() : current.name,
      slug: updatedSlug,
      sku: updateData.sku !== undefined ? updateData.sku.trim() : current.sku,
      brand: updateData.brand !== undefined ? updateData.brand.trim() : current.brand,
      categoryId: updateData.categoryId !== undefined ? updateData.categoryId : current.categoryId,
      collectionId: updateData.collectionId !== undefined ? (updateData.collectionId || undefined) : current.collectionId,
      description: updateData.description !== undefined ? updateData.description.trim() : current.description,
      shortDescription: updateData.shortDescription !== undefined ? updateData.shortDescription.trim() : current.shortDescription,
      price: updateData.price !== undefined ? Number(updateData.price) : current.price,
      oldPrice: updateData.oldPrice !== undefined ? (updateData.oldPrice ? Number(updateData.oldPrice) : undefined) : current.oldPrice,
      promoPrice: updateData.promoPrice !== undefined ? (updateData.promoPrice ? Number(updateData.promoPrice) : undefined) : current.promoPrice,
      stock: updateData.stock !== undefined ? Number(updateData.stock) : current.stock,
      alertThreshold: updateData.alertThreshold !== undefined ? Number(updateData.alertThreshold) : current.alertThreshold,
      shade: updateData.shade !== undefined ? updateData.shade.trim() : current.shade,
      skinType: updateData.skinType !== undefined ? updateData.skinType.trim() : current.skinType,
      ingredients: updateData.ingredients !== undefined ? updateData.ingredients.trim() : current.ingredients,
      images: formattedImages,
      isFeatured: updateData.isFeatured !== undefined ? Boolean(updateData.isFeatured) : current.isFeatured,
      isNew: updateData.isNew !== undefined ? Boolean(updateData.isNew) : current.isNew,
      isBestSeller: updateData.isBestSeller !== undefined ? Boolean(updateData.isBestSeller) : current.isBestSeller,
      status: updateData.status !== undefined ? updateData.status : current.status,
      updatedAt: new Date().toISOString()
    };

    db.getData().products[index] = updated;
    db.save();

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès.',
      product: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

productsRouter.patch('/:id/stock', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = db.getData().products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable.' });
    }

    product.stock = Math.max(0, Number(stock));
    product.updatedAt = new Date().toISOString();
    db.save();

    res.json({ success: true, stock: product.stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

productsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().products = db.getData().products.filter(p => p.id !== id);
    db.save();
    res.json({ success: true, message: 'Produit supprimé.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { productsRouter };
