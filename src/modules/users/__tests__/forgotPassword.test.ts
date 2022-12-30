import supertest from 'supertest'
import { app } from '../../../app'
import { sendPasswordResetMail } from '../../../providers'
import { defaultUser } from '../../../test/helpers'

const request = supertest(app)

const data = {
  message:
    'A mail will be sent to this email if an account is registered under it',
}

describe('Forgot Password Tests', () => {
  test('Forgot password fails when email is not provided', async () => {
    const result = await request.post('/api/users/forgot-password').send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Required', field: 'email' }],
      isSuccess: false,
    })
  })

  test('Forgot password fails silently if user with email does not exist', async () => {
    const result = await request
      .post('/api/users/forgot-password')
      .send({ email: 'notfounduser@mail.co' })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data,
      isSuccess: true,
    })
    expect(sendPasswordResetMail).not.toHaveBeenCalled()
  })

  test('Forgot password succeeds if user with email exists', async () => {
    const result = await request
      .post('/api/users/forgot-password')
      .send({ email: defaultUser.email })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data,
      isSuccess: true,
    })
    expect(sendPasswordResetMail).toHaveBeenCalledTimes(1)
    expect(sendPasswordResetMail).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: defaultUser.firstName,
        email: defaultUser.email,
      }),
      expect.stringMatching(/^ey/),
    )
  })
})
