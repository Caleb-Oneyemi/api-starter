import { z } from 'zod'
import {
  validatePassword,
  validatePhone,
  passwordValidationMsg,
  phoneValidationMsg,
} from './customSchemaValidators'

export const userCreationSchema = z
  .object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
    email: z.string().trim().email(),
    phoneNumber: z
      .string()
      .trim()
      .refine(validatePhone, { message: phoneValidationMsg }),
    password: z
      .string()
      .trim()
      .min(8)
      .max(50)
      .refine(validatePassword, { message: passwordValidationMsg }),
  })
  .strict()

export const userUpdateSchema = z
  .object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    phoneNumber: z
      .string()
      .trim()
      .refine(validatePhone, { message: phoneValidationMsg })
      .optional(),
  })
  .strict()

export const passwordUpdateSchema = z
  .object({
    oldPassword: z.string().trim().min(8).max(50),
    newPassword: z
      .string()
      .trim()
      .min(8)
      .max(50)
      .refine(validatePassword, { message: passwordValidationMsg }),
    confirmedNewPassword: z
      .string()
      .trim()
      .min(8)
      .max(50)
      .refine(validatePassword, { message: passwordValidationMsg }),
  })
  .strict()

export const loginUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict()

export const forgotPasswordSchema = z
  .object({
    email: z.string().email(),
  })
  .strict()

export const resetPasswordSchema = z
  .object({
    token: z.string().trim(),
    newPassword: z
      .string()
      .trim()
      .min(8)
      .max(50)
      .refine(validatePassword, { message: passwordValidationMsg }),
    confirmedNewPassword: z
      .string()
      .trim()
      .min(8)
      .max(50)
      .refine(validatePassword, { message: passwordValidationMsg }),
  })
  .strict()
