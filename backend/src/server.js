// backend/src/server.js

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const OpenAI  = require('openai').default;
const { toFile } = require('openai');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app    = express();
const upload = multer({ dest: '/tmp' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const s3     = new S3Client({ region: process.env.AWS_REGION });

app.use(cors());
app.use(express.json());

// ── 1) Upload single file to S3 ────────────────────────────────────────
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const key = `${Date.now()}_${file.originalname}`;
    // stream from disk to S3
    const fileStream = fs.createReadStream(file.path);
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key:    key,
      Body:   fileStream,
      ContentType: file.mimetype,
    }));
    fs.unlinkSync(file.path);

    const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return res.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ── 2) Edit an existing image ──────────────────────────────────────────
app.post('/api/edit', upload.single('image'), async (req, res) => {
  const promptText = req.body.prompt;
  const file       = req.file;

  if (!promptText || !file) {
    return res.status(400).json({ error: 'Missing prompt or image file' });
  }

  try {
    // Wrap the uploaded file into the SDK helper
    const filePath = path.resolve(file.path);
    const fileForAPI = await toFile(
      fs.createReadStream(filePath),
      file.originalname,
      { type: file.mimetype }
    );

    // Call the images.edit endpoint
    const response = await openai.images.edit({
      model:           'gpt-image-1',
      prompt:          promptText,
      n:               1,
      size:            '1024x1024',
      // response_format: 'url',
      image:           fileForAPI,
    });

    fs.unlinkSync(filePath);
    const b64       = response.data[0].b64_json;
    const outName   = `edited-${Date.now()}.png`;
    const outPath   = path.join(__dirname, '..', outName); 
    // __dirname is /app/src, so this writes to /app/edited-*.png

    fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
    console.log(`Wrote edited image to ${outPath}`);
    res.json({ savedAs: outName });
    return res.json({ b64_json: response.data[0].b64_json });
  } catch (err) {
    console.error('Edit error:', err);
    if (file && file.path) fs.unlinkSync(file.path);
    return res.status(500).json({ error: err.message });
  }
});

// ── Start server ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
