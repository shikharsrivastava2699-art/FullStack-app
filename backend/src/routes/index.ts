import { Router } from 'express'
import healthRoutes from './healthRoutes'
import makeRoutes from './makeRoutes'

const router = Router()

router.use(healthRoutes)
router.use(makeRoutes)

export default router
