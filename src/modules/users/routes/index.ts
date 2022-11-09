import { Router } from 'express'
import { userCreationValidator } from '../middleware'
import { createUser, verifyToken } from '../controllers'

const router = Router()

router.post('/', userCreationValidator, createUser)

router.get('/verify/:token', verifyToken)

export { router as userRoutes }
