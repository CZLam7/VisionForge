// backend/src/server.js

// Load env vars first
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const OpenAI  = require('openai').default;              // note .default for v4 SDK
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app    = express();
const upload = multer();   // in-memory storage

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize S3 client
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Middleware
app.use(cors());
app.use(express.json());

// ── 1) Image generate stub ───────────────────────────────────────────────
app.post('/api/generate', (req, res) => {
  // TODO: call openai.images.generate()
  res.json({ url: 'TODO' });
});

// ── 2) Image edit stub ─────────────────────────────────────────────────
app.post(
  '/api/edit',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mask',  maxCount: 1 }
  ]),
  (req, res) => {
    // TODO: call openai.images.edit()
    res.json({ url: 'TODO' });
  }
);

// ── 3) Upload single file to S3 ────────────────────────────────────────
app.post(
  '/api/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).send('No file uploaded');

      // Unique key
      const key = `${Date.now()}_${file.originalname}`;

      // Upload to S3
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      // Public URL
      const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      res.json({ url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ── Start server ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
