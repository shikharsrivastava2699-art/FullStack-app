import { Request, Response } from 'express'
import { getAllMakes } from '../services/makeService'

export const fetchMakes = async (req: Request, res: Response) => {
  const makes = await getAllMakes()

  res.json({
    success: true,
    data: {
      makes
    }
  })
}
