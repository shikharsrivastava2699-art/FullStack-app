import express from 'express'
import cors from 'cors'
import routes from './routes'
import env from './config/env'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Backend running with TypeScript 🚀')
})

app.use(`/api/${env.API_VERSION}`, routes)
app.get('/health', (_req, res) => {
  res.redirect(307, `/api/${env.API_VERSION}/health`)
})

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})