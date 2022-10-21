import { Router } from 'express'
import { userCreationValidator } from '../middleware'
import { createUser } from '../controllers'

const router = Router()

router.post('/', userCreationValidator, createUser)

export { router as userRoutes }
