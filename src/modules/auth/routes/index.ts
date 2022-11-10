import { Router } from 'express'
import { loginUserValidator } from '../middleware'
import { loginUser } from '../controllers'

const router = Router()

router.post('/login', loginUserValidator, loginUser)

export { router as authRoutes }
