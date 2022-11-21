import { Router } from 'express'
import { userRoutes } from './users'
import { postRoutes, commentRoutes } from './posts'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/posts', postRoutes)

router.use('/api/comments', commentRoutes)

export { router as ApiRouter }
