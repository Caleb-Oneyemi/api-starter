import { Router } from 'express'
import { userCreationValidator } from '../middleware'
import { createUser, getUser, verifyToken } from '../controllers'
import { isAuthenticated } from '../../../common'

const router = Router()

router.post('/', userCreationValidator, createUser)

router.get('/verify/:token', verifyToken)

router.get('/', isAuthenticated, getUser)

export { router as userRoutes }
