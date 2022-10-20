import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserDoc } from '../../modules/users/types'

type Payload = Pick<UserDoc, 'customId' | 'firstName' | 'lastName' | 'email'>

export const generateToken = (
  { customId, firstName, lastName, email }: Payload,
  salt: string,
): string => {
  const signature: string = config.get('jwtSecret') + salt
  const token = jwt.sign({ customId, firstName, lastName, email }, signature, {
    expiresIn: '7d',
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
