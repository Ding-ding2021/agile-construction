import express from 'express'
import { corsMiddleware } from './middleware/cors'
import { errorHandler, notFoundHandler } from './middleware/error'
import routes from './routes/index'

const app = express()

app.use(corsMiddleware)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'entity' })
})

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
