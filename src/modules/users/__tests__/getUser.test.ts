import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken } from '../../../common'
import { defaultUser, publicId, salt } from '../../../test/helpers'

const request = supertest(app)

describe('Get User Tests', () => {
  test('Getting user details fails if not authenticated', async () => {
    const result = await request.get('/api/users').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('Getting user details fails if user does not exist', async () => {
    const invalidToken = generateToken({ id: '456' }, { salt: 'salt2' })
    const result = await request
      .get('/api/users')
      .send({})
      .set('Authorization', `Bearer ${invalidToken}`)

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({
      errors: [{ message: 'user not found' }],
      isSuccess: false,
    })
  })

  test('Getting user details fails if user exists but invalid salt is used', async () => {
    const token = generateToken({ id: publicId }, { salt: 'invalid' })
    const result = await request
      .get('/api/users')
      .send({})
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Invalid Token' }],
      isSuccess: false,
    })
  })

  test('Getting user details fails if user exists but token has expired', async () => {
    const fiveMinutesAgo = -5 * 60000
    const token = generateToken(
      { id: publicId },
      { salt, expires: fiveMinutesAgo },
    )
    const result = await request
      .get('/api/users')
      .send({})
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Token Expired' }],
      isSuccess: false,
    })
  })

  test('Getting user details succeeds if user is properly authenticated', async () => {
    const token = generateToken({ id: publicId }, { salt })
    const result = await request
      .get('/api/users')
      .send({})
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(200)
    expect(result.body.data).not.toHaveProperty('password')
    expect(result.body.data).not.toHaveProperty('salt')
    expect(result.body).toEqual({
      data: expect.objectContaining({
        firstName: defaultUser.firstName,
        lastName: defaultUser.lastName,
        email: defaultUser.email,
        phoneNumber: defaultUser.phoneNumber,
      }),
      isSuccess: true,
    })
  })
})
