import supertest from 'supertest'
import { app } from '../../../app'
import { AppUserDoc, generateToken, verifyPassword } from '../../../common'
import { publicId, salt } from '../../../test/helpers'
import { getAppUserByPublicId, updateAppUser } from '../data'

const request = supertest(app)

const expires = 60 * 60 * 24

describe('Reset Password Tests', () => {
  test('reset password fails when required input is not provided', async () => {
    const result = await request.post('/api/users/reset-password').send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'token' },
        { message: 'Required', field: 'newPassword' },
        { message: 'Required', field: 'confirmedNewPassword' },
      ],
      isSuccess: false,
    })
  })

  test('reset password fails if either new or confirmed password do not meet criteria', async () => {
    const message =
      'password must contain at least one lowercase letter, one uppercase letter, one number and one symbol'
    const result = await request.post('/api/users/reset-password').send({
      token: 'test',
      newPassword: 'onlyAlphabets',
      confirmedNewPassword: 'onlyAlphabets',
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message,
          field: 'newPassword',
        },
        {
          message,
          field: 'confirmedNewPassword',
        },
      ],
      isSuccess: false,
    })
  })

  test('reset password fails if new password and confirmed password are not the same', async () => {
    const result = await request.post('/api/users/reset-password').send({
      token: 'test',
      newPassword: 'NewTestPass1&',
      confirmedNewPassword: 'NewTestPass3#',
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'confirmed password must match new password' }],
      isSuccess: false,
    })
  })

  test('reset password fails if token is not a valid jwt token', async () => {
    const result = await request.post('/api/users/reset-password').send({
      token: 'test',
      newPassword: 'NewTestPass1&',
      confirmedNewPassword: 'NewTestPass1&',
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'invalid token' }],
      isSuccess: false,
    })
  })

  test('reset password fails if valid token has already been used', async () => {
    const token = generateToken({ id: publicId }, { salt, expires })
    await updateAppUser({ publicId }, { previousResetPasswordToken: token })

    const result = await request.post('/api/users/reset-password').send({
      token,
      newPassword: 'NewTestPass1&',
      confirmedNewPassword: 'NewTestPass1&',
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'reset token expired' }],
      isSuccess: false,
    })
  })

  test('reset password fails if user exists but salt has changed since reset link was issued', async () => {
    const token = generateToken({ id: publicId }, { salt: 'oldSalt', expires })

    const result = await request.post('/api/users/reset-password').send({
      token,
      newPassword: 'NewTestPass1&',
      confirmedNewPassword: 'NewTestPass1&',
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Invalid Token' }],
      isSuccess: false,
    })
  })

  test('reset password fails if user exists and salt is valid but token has expired', async () => {
    const fiveMinutesAgo = -5 * 60000
    const expiredToken = generateToken(
      { id: publicId },
      { salt, expires: fiveMinutesAgo },
    )
    const result = await request.post('/api/users/reset-password').send({
      token: expiredToken,
      newPassword: 'NewTestPass1&',
      confirmedNewPassword: 'NewTestPass1&',
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Token Expired' }],
      isSuccess: false,
    })
  })

  test('reset password succeeds if all criteria are met, after which salt is updated', async () => {
    const token = generateToken({ id: publicId }, { salt, expires })
    const newPass = 'NewTestPass1&'

    const result = await request.post('/api/users/reset-password').send({
      token,
      newPassword: newPass,
      confirmedNewPassword: newPass,
    })

    const user = (await getAppUserByPublicId(publicId)) as AppUserDoc

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: null,
      isSuccess: true,
    })
    expect(user.salt).not.toBe(salt)
    expect(user.previousResetPasswordToken).toBe(token)
    expect(verifyPassword(newPass, user.password)).resolves.toBe(true)
  })
})
