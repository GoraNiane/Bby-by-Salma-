import express from 'express';
import { db, Review } from '../db.js';
import { requireAuth } from '../auth.js';

const reviewsRouter = express.Router();

// GET all reviews (Public: approved, Admin: all)
reviewsRouter.get('/', (req, res) => {
  try {
    const { productId, status } = req.query;
    let reviews = [...db.getData().reviews];

    if (productId) {
      reviews = reviews.filter(r => r.productId === productId);
    }
    if (status) {
      reviews = reviews.filter(r => r.status === status);
    }

    // Sort newest first
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create Review (Public)
reviewsRouter.post('/', (req, res) => {
  try {
    const { productId, customerName, rating, title, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    const product = db.getData().products.find(p => p.id === productId);

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      productId,
      productName: product ? product.name : undefined,
      customerName: customerName.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? title.trim() : 'Avis client',
      comment: comment.trim(),
      verified: true,
      status: 'approved', // Auto-approved or pending according to store preferences
      createdAt: new Date().toISOString()
    };

    db.getData().reviews.unshift(newReview);
    db.save();

    res.status(201).json({
      success: true,
      message: 'Merci pour votre avis précieux !',
      review: newReview
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Moderate Review (Admin)
reviewsRouter.put('/:id/status', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = db.getData().reviews.find(r => r.id === id);

    if (!review) {
      return res.status(404).json({ error: 'Avis introuvable.' });
    }

    review.status = status;
    db.save();

    res.json({ success: true, message: 'Statut de l’avis mis à jour.', review });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Review (Admin)
reviewsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().reviews = db.getData().reviews.filter(r => r.id !== id);
    db.save();
    res.json({ success: true, message: 'Avis supprimé.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { reviewsRouter };
