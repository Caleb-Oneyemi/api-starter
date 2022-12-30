import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken } from '../../../common'
import { sendRegistrationMail } from '../../../providers'
import { defaultUser, token } from '../../../test/helpers'

const request = supertest(app)

describe('Resend Account Verification Tests', () => {
  test('resending account verification fails if user is not authenticated', async () => {
    const result = await request
      .post('/api/users/resend/account-verification')
      .send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('resending account verification fails if user does not exist', async () => {
    const invalidToken = generateToken({ id: '456' }, { salt: 'salt2' })
    const result = await request
      .post('/api/users/resend/account-verification')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({})

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({
      errors: [{ message: 'user not found' }],
      isSuccess: false,
    })
  })

  test('resending account verification succeeds for authenticated user', async () => {
    const result = await request
      .post('/api/users/resend/account-verification')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: null,
      isSuccess: true,
    })

    expect(sendRegistrationMail).toBeCalledTimes(1)
    expect(sendRegistrationMail).toBeCalledWith(
      expect.objectContaining({
        email: defaultUser.email,
        firstName: defaultUser.firstName,
      }),
      expect.stringMatching(/^ey/),
    )
  })
})
