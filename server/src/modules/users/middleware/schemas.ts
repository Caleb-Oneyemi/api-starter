import { z } from 'zod'
import { validatePassword, validatePhone } from './customSchemaValidators'

export const userCreationSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.custom(validatePassword),
    phoneNumber: z.custom(validatePhone),
  })
  .strict()

export const userUpdateSchema = z
  .object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.custom(validatePhone).optional(),
  })
  .strict()

export const passwordUpdateSchema = z
  .object({
    oldPassword: z.custom(validatePassword),
    newPassword: z.custom(validatePassword),
    confirmedNewPassword: z.custom(validatePassword),
  })
  .strict()
