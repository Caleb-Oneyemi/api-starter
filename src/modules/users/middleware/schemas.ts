import { z } from 'zod'
import {
  validatePassword,
  validatePhone,
  passwordValidationMsg,
  phoneValidationMsg,
  isAlphabet,
  alphabetMsg,
} from './customSchemaValidators'

export const userCreationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .refine(isAlphabet, { message: alphabetMsg }),
    lastName: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .refine(isAlphabet, { message: alphabetMsg }),
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

export const userUpdateSchema = userCreationSchema
  .omit({ password: true })
  .partial()
  .refine(
    ({ firstName, lastName, email, phoneNumber }) => {
      if (!firstName && !lastName && !email && !phoneNumber) return false
      return true
    },
    {
      message: 'update must contain at least one property',
    },
  )

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
