import httpStatus from 'http-status'
import { Router, Request, NextFunction } from 'express'
import { CustomResponse } from '../../../common'
import { userCreationValidator } from '../middleware'
import { createUser } from '../controllers'

const router = Router()

router.post(
  '/',
  userCreationValidator,
  async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const data = await createUser(req.body)

      res.status(httpStatus.CREATED).send({
        message: 'USER CREATED SUCCESSFULLY',
        isSuccess: true,
        data,
      })
    } catch (err) {
      next(err)
    }
  },
)

export { router as userRoutes }
