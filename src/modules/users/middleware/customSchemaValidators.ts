import validator from 'validator'
import { supportedDialingCodes } from '../../../common'

export const validatePhone = (data: string) => {
  if (
    validator.isMobilePhone(data, supportedDialingCodes, { strictMode: true })
  ) {
    return true
  }
  return false
}

export const validatePassword = (data: string) => {
  if (validator.isStrongPassword(data)) return true
  return false
}

export const isAlphabet = (input: string) => {
  const res = input.match(/^[a-z]+$/i)
  if (res == null) return false
  return true
}

export const passwordValidationMsg =
  'password must contain at least one lowercase letter, one uppercase letter, one number and one symbol'

export const phoneValidationMsg = 'phone number must have valid format'

export const alphabetMsg = 'property may only contain alphabets'
