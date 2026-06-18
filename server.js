import 'dotenv/config'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import handler from './api/describe.js'

const app = express()
app.use(express.json({ limit: '10mb' }))

app.post('/api/describe', (req, res) => handler(req, res))

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
})
app.use(vite.middlewares)

const PORT = 5173
app.listen(PORT, () => {
  console.log(`\n  Louis Vision running at http://localhost:${PORT}\n`)
})
