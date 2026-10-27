import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAuth, AuthRequest } from '../auth.js';

const authRouter = express.Router();

// Admin Login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const envEmail = (process.env.ADMIN_EMAIL || 'admin@bbsbysalma.com').trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const envName = process.env.ADMIN_NAME || 'Salma - Administratrice BBS';

    // 1. Direct match with environment variables (Vercel env vars support)
    if (normalizedEmail === envEmail && password === envPassword) {
      let user = db.getData().adminUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        user = {
          id: 'admin_1',
          name: envName,
          email: envEmail,
          passwordHash: bcrypt.hashSync(envPassword, 10),
          role: 'superadmin',
          avatar: '/assets/teint_marron.jpg'
        };
        db.getData().adminUsers.unshift(user);
        db.save();
      } else {
        user.passwordHash = bcrypt.hashSync(envPassword, 10);
        user.name = envName;
        db.save();
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
    }

    // 2. Fallback to existing hashed password in database
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
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erreur lors de la connexion.' });
  }
});

// Verify Current Token / Profile
authRouter.get('/me', requireAuth, (req: AuthRequest, res) => {
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

// Update Admin Profile & Password
authRouter.put('/profile', requireAuth, (req: AuthRequest, res) => {
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
        return res.status(400).json({ error: 'Veuillez saisir votre mot de passe actuel pour le modifier.' });
      }
      const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
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
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erreur lors de la mise à jour.' });
  }
});

export { authRouter };
