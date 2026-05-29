import { Request, Response } from 'express'
import env from '../config/env'

export const getHealth = (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'ok',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  })
}
