import { Router } from 'express'
import { userRoutes } from './users'
import { postRoutes } from './posts'
import { isAuthenticated } from '../common'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/posts', isAuthenticated, postRoutes)

export { router as ApiRouter }
