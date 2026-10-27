import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRouter = express.Router();

const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('[Upload] Note: uploadDir could not be created:', e);
}

// Check whether Cloudinary credentials are provided
function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Initialize Cloudinary if configured
function initCloudinary(): boolean {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    return true;
  }
  return false;
}

// Helper to upload a local file to Cloudinary or return local path
async function processUploadedFile(file: Express.Multer.File): Promise<string> {
  if (initCloudinary()) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: process.env.CLOUDINARY_FOLDER || 'bbs-by-salma',
        resource_type: 'image'
      });
      // Cleanup local temp file
      try {
        fs.unlinkSync(file.path);
      } catch {}
      console.log(`[Cloudinary] Image uploadée avec succès : ${result.secure_url}`);
      return result.secure_url;
    } catch (err) {
      console.error('[Cloudinary] Erreur upload, fallback local :', err);
      return `/uploads/${file.filename}`;
    }
  }

  // Fallback to local upload
  return `/uploads/${file.filename}`;
}

// Multer disk storage config for receiving uploads
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

const fileFilter = (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/avif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format d’image non supporté. Utilisez JPG, PNG, WEBP ou GIF.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

// Upload multiple images (up to 5)
uploadRouter.post('/multiple', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier sélectionné.' });
    }

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await processUploadedFile(file);
      uploadedUrls.push(url);
    }

    return res.json({
      success: true,
      message: `${files.length} photo(s) importée(s) avec succès.`,
      urls: uploadedUrls,
      provider: isCloudinaryConfigured() ? 'cloudinary' : 'local'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erreur lors de l’upload des images.' });
  }
});

// Upload single image
uploadRouter.post('/single', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier sélectionné.' });
    }

    const url = await processUploadedFile(file);

    return res.json({
      success: true,
      url,
      provider: isCloudinaryConfigured() ? 'cloudinary' : 'local'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erreur lors de l’upload.' });
  }
});

// Direct Base64 upload (for phone canvas-compressed photos)
uploadRouter.post('/base64', requireAuth, async (req, res) => {
  try {
    const { base64Data, filename } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Données base64 manquantes.' });
    }

    if (initCloudinary()) {
      try {
        const result = await cloudinary.uploader.upload(base64Data, {
          folder: process.env.CLOUDINARY_FOLDER || 'bbs-by-salma',
          resource_type: 'image'
        });
        console.log(`[Cloudinary Base64] Image uploadée avec succès : ${result.secure_url}`);
        return res.json({
          success: true,
          url: result.secure_url,
          provider: 'cloudinary'
        });
      } catch (err) {
        console.error('[Cloudinary Base64] Erreur upload, fallback local :', err);
      }
    }

    // Fallback to local file saving
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
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
      url: `/uploads/${uniqueName}`,
      provider: 'local'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erreur lors de l’enregistrement de l’image.' });
  }
});

export { uploadRouter };
