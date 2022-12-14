import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken } from '../../../common'
import { defaultUser, publicId, salt, token } from '../../../test/helpers'
import { getAppUserByEmail } from '../data'

const request = supertest(app)

describe('Verify User Account Tests', () => {
  test('User verification fails if token is not a valid jwt token', async () => {
    const invalidToken = 'invalid'
    const result = await request
      .get(`/api/users/verify/${invalidToken}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'invalid token' }],
      isSuccess: false,
    })
  })

  test('User verification fails if user with public id does not exist', async () => {
    const invalidToken = generateToken({ id: '456' }, { salt: 'salt2' })
    const result = await request
      .get(`/api/users/verify/${invalidToken}`)
      .send({})

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({
      errors: [{ message: 'user not found' }],
      isSuccess: false,
    })
  })

  test('User verification fails if user exists but invalid salt is used', async () => {
    const invalidToken = generateToken({ id: publicId }, { salt: 'salt2' })
    const result = await request
      .get(`/api/users/verify/${invalidToken}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Invalid Token' }],
      isSuccess: false,
    })
  })

  test('User verification fails if user exists but token has expired', async () => {
    const fiveMinutesAgo = -5 * 60000
    const expiredToken = generateToken(
      { id: publicId },
      { salt, expires: fiveMinutesAgo },
    )
    const result = await request
      .get(`/api/users/verify/${expiredToken}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Token Expired' }],
      isSuccess: false,
    })
  })

  test('User verification succeeds with valid token for existing user', async () => {
    const userBeforeVerification = await getAppUserByEmail(defaultUser.email)
    const result = await request.get(`/api/users/verify/${token}`).send({})
    const userAfterVerification = await getAppUserByEmail(defaultUser.email)

    expect(result.statusCode).toBe(200)
    expect(userBeforeVerification?.confirmed).toBe(false)
    expect(userAfterVerification?.confirmed).toBe(true)
  })
})
