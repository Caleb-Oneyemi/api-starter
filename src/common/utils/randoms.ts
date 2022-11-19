import crypto from 'crypto'
import { nanoid } from 'nanoid/async'

export const generateSalt = (size: number) => {
  return crypto.randomBytes(size).toString('hex')
}

export const generateCode = (size: number) => {
  const min = '1'.padEnd(size, '0')
  const max = '9'.padEnd(size, '9')
  return crypto.randomInt(parseInt(min), parseInt(max))
}

export const generatePublicId = async (size?: number) => {
  if (size == undefined) return nanoid()
  return nanoid(size)
}
