import { generateToken } from '../../common'

export const defaultUser = {
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'user@email.com',
  phoneNumber: '+2349012345678',
  password: 'TestPass1&',
}

export const publicId = '123'

export const salt = 'salt'

export const token = generateToken({ id: publicId }, { salt })
