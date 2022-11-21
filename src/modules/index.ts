import { Router } from 'express'
import { userRoutes } from './users'
import { postRoutes } from './posts'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/posts', postRoutes)

export { router as ApiRouter }
