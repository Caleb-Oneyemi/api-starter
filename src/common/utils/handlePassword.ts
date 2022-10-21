import crypto from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(8).toString('hex')
  const hash = (await scrypt(password, salt, 64)) as Buffer
  return salt + ':' + hash.toString('hex')
}

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const [salt, key] = hash.split(':')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  if (key === derivedKey.toString('hex')) return true
  return false
}
