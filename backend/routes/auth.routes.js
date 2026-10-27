import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAuth } from '../auth.js';

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.getData().adminUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erreur lors de la connexion.' });
  }
});

authRouter.get('/me', requireAuth, (req, res) => {
  const user = db.getData().adminUsers.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
});

authRouter.put('/profile', requireAuth, (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, avatar } = req.body;
    const userIndex = db.getData().adminUsers.findIndex(u => u.id === req.user?.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const user = db.getData().adminUsers[userIndex];

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (avatar) user.avatar = avatar;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Veuillez saisir votre mot de passe actuel.' });
      }
      const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
      }
      user.passwordHash = bcrypt.hashSync(newPassword, 10);
    }

    db.getData().adminUsers[userIndex] = user;
    db.save();

    return res.json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erreur.' });
  }
});

export { authRouter };
