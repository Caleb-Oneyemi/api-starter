import supertest from 'supertest'
import { app } from '../../../app'
import { AppUserDoc, verifyPassword } from '../../../common'
import { defaultUser, token } from '../../../test/helpers'
import { getAppUserByEmail } from '../data'

const request = supertest(app)

describe('Change Password Tests', () => {
  test('changing password fails if user is not authenticated', async () => {
    const result = await request.patch('/api/users/change-password').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('changing password fails if required input is not supplied', async () => {
    const result = await request
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'oldPassword' },
        { message: 'Required', field: 'newPassword' },
        { message: 'Required', field: 'confirmedNewPassword' },
      ],
      isSuccess: false,
    })
  })

  test('changing password fails if either new or confirmed password do not meet criteria', async () => {
    const message =
      'password must contain at least one lowercase letter, one uppercase letter, one number and one symbol'

    const result = await request
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: defaultUser.password,
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

  test('changing password fails if old password is incorrect', async () => {
    const result = await request
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'wrongOldPassword',
        newPassword: 'NewTestPass1&',
        confirmedNewPassword: 'NewTestPass1&',
      })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'wrong old password' }],
      isSuccess: false,
    })
  })

  test('changing password fails if old password and new password are the same', async () => {
    const result = await request
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: defaultUser.password,
        newPassword: defaultUser.password,
        confirmedNewPassword: defaultUser.password,
      })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'old and new password must be different' }],
      isSuccess: false,
    })
  })

  test('changing password fails if new password and confirmed password are not the same', async () => {
    const result = await request
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: defaultUser.password,
        newPassword: 'NewTestPass1&',
        confirmedNewPassword: 'NewTestPass3#',
      })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'confirmed password must match new password' }],
      isSuccess: false,
    })
  })

  test('changing password succeeds when all criteria are met', async () => {
    const newPass = 'NewTestPass1&'
    const result = await request
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: defaultUser.password,
        newPassword: newPass,
        confirmedNewPassword: newPass,
      })

    const user = (await getAppUserByEmail(defaultUser.email)) as AppUserDoc

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: null,
      isSuccess: true,
    })

    expect(user).not.toBeNull()
    expect(verifyPassword(newPass, user.password)).resolves.toBe(true)
  })
})
