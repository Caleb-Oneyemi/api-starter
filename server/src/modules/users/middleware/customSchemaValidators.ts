import validator from 'validator'
import { ZodError, ZodIssueCode } from 'zod'
import { supportedDialingCodes } from '../../../common'

export const validatePhone = (data: unknown) => {
  if (typeof data !== 'string') return false
  if (
    validator.isMobilePhone(data, supportedDialingCodes, { strictMode: true })
  )
    return true
  return false
}

const base = {
  code: ZodIssueCode.custom,
  path: ['password'],
}

export const validatePassword = (data: unknown) => {
  if (data === undefined) {
    throw new ZodError([
      {
        ...base,
        message: 'Required',
      },
    ])
  }

  if (typeof data !== 'string') {
    throw new ZodError([
      {
        ...base,
        message: `Expected string, received ${typeof data}`,
      },
    ])
  }

  if (data.length < 8 || data.length > 50) {
    throw new ZodError([
      {
        ...base,
        message: 'password length must be between 8 and 50',
      },
    ])
  }

  if (validator.isStrongPassword(data)) return true

  throw new ZodError([
    {
      ...base,
      message:
        'password must have at least one small letter, one capital letter, one symbol and one number',
    },
  ])
}
