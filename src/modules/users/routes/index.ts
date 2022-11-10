import { Router } from 'express'
import { userCreationValidator, userUpdateValidator } from '../middleware'
import { createUser, getUser, verifyAccount, updateUser } from '../controllers'
import { isAuthenticated } from '../../../common'

const router = Router()

router.post('/', userCreationValidator, createUser)

router.get('/verify/:token', verifyAccount)

router.get('/', isAuthenticated, getUser)

router.patch('/', isAuthenticated, userUpdateValidator, updateUser)

export { router as userRoutes }
