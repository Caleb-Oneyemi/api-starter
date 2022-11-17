import { Router } from 'express'
import { userRoutes } from './users'
import { todoRoutes } from './todos'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/todos', todoRoutes)

export { router as ApiRouter }
