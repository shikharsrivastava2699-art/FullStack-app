import { Router } from 'express'
import { fetchMakes } from '../controllers/makeController'

const router = Router()

router.get('/makes', fetchMakes)

export default router
