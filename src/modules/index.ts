import { Router } from 'express'
import { userRoutes } from './users'
import { authRoutes } from './auth'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/auth', authRoutes)

export { router as ApiRouter }
