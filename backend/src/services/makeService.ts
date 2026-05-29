import { Make } from '../types/make'
import { sampleMakes } from '../data/sampleMakes'

export const getAllMakes = async (): Promise<Make[]> => {
  // TODO: replace sample data with a database query once DB integration is added.
  return sampleMakes
}
