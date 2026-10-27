import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const reviewsRouter = express.Router();

reviewsRouter.get('/', (req, res) => {
  try {
    const { productId, status } = req.query;
    let reviews = [...db.getData().reviews];

    if (productId) reviews = reviews.filter(r => r.productId === productId);
    if (status) reviews = reviews.filter(r => r.status === status);

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

reviewsRouter.post('/', (req, res) => {
  try {
    const { productId, customerName, rating, title, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    }

    const product = db.getData().products.find(p => p.id === productId);

    const newReview = {
      id: `rev_${Date.now()}`,
      productId,
      productName: product ? product.name : undefined,
      customerName: customerName.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? title.trim() : 'Avis client',
      comment: comment.trim(),
      verified: true,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    db.getData().reviews.unshift(newReview);
    db.save();

    res.status(201).json({
      success: true,
      message: 'Avis enregistré avec succès !',
      review: newReview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

reviewsRouter.put('/:id/status', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = db.getData().reviews.find(r => r.id === id);

    if (!review) return res.status(404).json({ error: 'Avis introuvable.' });

    review.status = status;
    db.save();

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

reviewsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().reviews = db.getData().reviews.filter(r => r.id !== id);
    db.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { reviewsRouter };
