import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'
interface Payload {
  id: string
}

interface TokenOptions {
  salt: string
  expires?: number
}

/** Default expiry is 7 days */
export const generateToken = (
  { id }: Payload,
  { salt, expires }: TokenOptions,
): string => {
  const signature: string = config.get('jwtSecret') + salt
  const expiresIn = expires ? expires : '7d'
  const token = jwt.sign({ id }, signature, {
    expiresIn,
  })
  return token
}

export const validateToken = (token: string, salt: string) => {
  const signature: string = config.get('jwtSecret') + salt
  const payload = jwt.verify(token, signature) as Payload & JwtPayload
  return payload
}

/** NOTE: This function only decodes the token, no validation is done!!! */
export const decodeToken = (token: string) => {
  const payload = jwt.decode(token) as Payload & JwtPayload
  return payload
}
