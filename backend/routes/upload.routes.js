import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRouter = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `bbs_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format d’image non supporté.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

uploadRouter.post('/multiple', requireAuth, upload.array('images', 5), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier sélectionné.' });
    }

    const uploadedUrls = files.map(file => `/uploads/${file.filename}`);
    return res.json({
      success: true,
      message: `${files.length} photo(s) importée(s) avec succès.`,
      urls: uploadedUrls
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erreur lors de l’upload.' });
  }
});

uploadRouter.post('/single', requireAuth, upload.single('image'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier sélectionné.' });
    }

    return res.json({
      success: true,
      url: `/uploads/${file.filename}`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erreur lors de l’upload.' });
  }
});

uploadRouter.post('/base64', requireAuth, (req, res) => {
  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Données base64 manquantes.' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let extension = '.webp';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('jpeg') || mime.includes('jpg')) extension = '.jpg';
      else if (mime.includes('png')) extension = '.png';
      else if (mime.includes('webp')) extension = '.webp';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const uniqueName = `bbs_${Date.now()}_${Math.round(Math.random() * 1000)}${extension}`;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    return res.json({
      success: true,
      url: `/uploads/${uniqueName}`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erreur.' });
  }
});

export { uploadRouter };
