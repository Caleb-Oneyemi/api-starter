import { Router } from 'express'
import { isAuthenticated } from './isAuthenticated'
import { userRoutes } from './users'
import { postRoutes } from './posts'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/posts', isAuthenticated, postRoutes)

export { router as ApiRouter }
