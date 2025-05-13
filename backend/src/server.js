import express from 'express'
import cors from 'cors'
import multer from 'multer'
import OpenAI from 'openai'
import 'dotenv/config'

const app = express()
const upload = multer()           // in-memory storage
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(cors())
app.use(express.json())

// 1) stub generate
app.post('/api/generate', (req, res) => {
  // TODO: call openai.images.generate()
  res.json({ url: 'TODO' })
})

// 2) stub edit
app.post('/api/edit', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mask',  maxCount: 1 }
]), (req, res) => {
  // TODO: call openai.images.edit()
  res.json({ url: 'TODO' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API listening on ${PORT}`))
