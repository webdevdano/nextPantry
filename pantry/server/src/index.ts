import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import itemsRouter from './routes/items'

const app = express()
const PORT = Number(process.env.PORT) || 5001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pantry'

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, status: 'healthy' }))
app.use('/api/items', itemsRouter)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

start()
