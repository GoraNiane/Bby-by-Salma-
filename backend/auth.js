import jwt from 'jsonwebtoken';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bbs_by_salma_ultra_secure_jwt_secret_key_2026';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé. Authentification requise.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Session expirée ou jeton invalide. Veuillez vous reconnecter.' });
  }

  const user = db.getData().adminUsers.find(u => u.id === decoded.id);
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur administrateur introuvable.' });
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  next();
}
