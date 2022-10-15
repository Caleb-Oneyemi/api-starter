import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserDoc } from '../../modules/users'

type Payload = Pick<UserDoc, 'id' | 'firstName' | 'lastName' | 'email'>

export const generateToken = ({
  id,
  firstName,
  lastName,
  email,
}: Payload): string => {
  const signature: string = config.get('jwtSecret')
  const token = jwt.sign({ id, firstName, lastName, email }, signature, {
    expiresIn: '7d',
  })
  return token
}

export const validateToken = (token: string) => {
  const signature: string = config.get('jwtSecret')
  const payload = jwt.verify(token, signature) as Payload & JwtPayload
  return payload
}
