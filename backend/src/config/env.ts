import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT ?? 5000)
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const API_VERSION = process.env.API_VERSION ?? 'v1'

export default {
  PORT,
  NODE_ENV,
  API_VERSION
}
