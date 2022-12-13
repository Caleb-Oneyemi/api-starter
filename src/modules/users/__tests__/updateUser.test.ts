import supertest from 'supertest'
import { app } from '../../../app'
import { hashPassword, generateToken } from '../../../common'
import { createAppUser, getAppUserByEmail } from '../data'

const request = supertest(app)

const defaultUser = {
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'user@email.com',
  phoneNumber: '+2349012345678',
  password: 'TestPass1&',
}

const publicId = '123'
const salt = 'salt'
const token = generateToken({ id: publicId }, { salt })

beforeEach(async () => {
  const password = await hashPassword(defaultUser.password)
  await createAppUser({
    ...defaultUser,
    password,
    publicId,
    salt,
  })
})

describe('Update User Tests', () => {
  test('User update fails if not authenticated', async () => {
    const result = await request.patch('/api/users').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('User update fails validation when required input is not provided', async () => {
    const result = await request
      .patch('/api/users')
      .send({})
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'update must contain at least one property', field: '' },
      ],
      isSuccess: false,
    })
  })

  test('User update fails when invalid field is provided', async () => {
    const result = await request
      .patch('/api/users')
      .send({ password: 'test' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body.errors[0]).toEqual({
      message: "Unrecognized key(s) in object: 'password'",
      field: '',
    })
  })

  test('User update fails validation when firstName is below 2 characters', async () => {
    const result = await request
      .patch('/api/users')
      .send({ firstName: 'a' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at least 2 character(s)',
          field: 'firstName',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when firstName is above 50 characters', async () => {
    const result = await request
      .patch('/api/users')
      .send({ firstName: 'a'.repeat(51) })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at most 50 character(s)',
          field: 'firstName',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when firstName contains numbers or special characters', async () => {
    const result = await request
      .patch('/api/users')
      .send({ firstName: 'b@' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'property may only contain alphabets',
          field: 'firstName',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when lastName is below 2 characters', async () => {
    const result = await request
      .patch('/api/users')
      .send({ lastName: 'a' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at least 2 character(s)',
          field: 'lastName',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when lastName is above 50 characters', async () => {
    const result = await request
      .patch('/api/users')
      .send({ lastName: 'a'.repeat(51) })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at most 50 character(s)',
          field: 'lastName',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when lastName contains numbers or special characters', async () => {
    const result = await request
      .patch('/api/users')
      .send({ lastName: 'a1' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'property may only contain alphabets',
          field: 'lastName',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when email has invalid format', async () => {
    const result = await request
      .patch('/api/users')
      .send({ email: 'user' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'Invalid email',
          field: 'email',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails validation when phone number has invalid format', async () => {
    const result = await request
      .patch('/api/users')
      .send({ phoneNumber: '+1012345678' })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'phone number must have valid format',
          field: 'phoneNumber',
        },
      ],
      isSuccess: false,
    })
  })

  test('User update fails when email is already in use', async () => {
    const user2 = {
      firstName: 'user2fn',
      lastName: 'user2ln',
      password: defaultUser.password,
      email: 'exists@email.com',
      publicId: '456',
      salt: 'salt22',
    }
    await createAppUser(user2)

    const result = await request
      .patch('/api/users')
      .send({ email: user2.email })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(409)
    expect(result.body.errors).toEqual([
      {
        message: 'email already in use',
      },
    ])
  })

  test('User update fails when phone number is already in use', async () => {
    const user2 = {
      firstName: 'user2fn',
      lastName: 'user2ln',
      password: defaultUser.password,
      phoneNumber: '+2349876543210',
      email: 'exists@email.com',
      publicId: '456',
      salt: 'salt22',
    }
    await createAppUser(user2)

    const result = await request
      .patch('/api/users')
      .send({ phoneNumber: user2.phoneNumber })
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toBe(409)
    expect(result.body.errors).toEqual([
      {
        message: 'phone number already in use',
      },
    ])
  })

  test('User update succeeds for valid first name', async () => {
    const firstName = 'newname'
    const result = await request
      .patch('/api/users')
      .send({ firstName })
      .set('Authorization', `Bearer ${token}`)
    const userAfterUpdate = await getAppUserByEmail(defaultUser.email)

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({ firstName }),
      isSuccess: true,
    })
    expect(userAfterUpdate?.firstName).not.toBe(defaultUser.firstName)
    expect(result.body.data.firstName).toBe(userAfterUpdate?.firstName)
  })

  test('User update succeeds for valid last name', async () => {
    const lastName = 'newname'
    const result = await request
      .patch('/api/users')
      .send({ lastName })
      .set('Authorization', `Bearer ${token}`)
    const userAfterUpdate = await getAppUserByEmail(defaultUser.email)

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({ lastName }),
      isSuccess: true,
    })
    expect(userAfterUpdate?.lastName).not.toBe(defaultUser.lastName)
    expect(result.body.data.lastName).toBe(userAfterUpdate?.lastName)
  })

  test('User update succeeds for valid email', async () => {
    const newEmail = 'new@mail.co'
    const result = await request
      .patch('/api/users')
      .send({ email: newEmail })
      .set('Authorization', `Bearer ${token}`)
    const userAfterUpdate = await getAppUserByEmail(newEmail)

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({ email: newEmail }),
      isSuccess: true,
    })
    expect(userAfterUpdate?.email).not.toBe(defaultUser.email)
    expect(result.body.data.email).toBe(userAfterUpdate?.email)
  })

  test('User update succeeds for valid phone number', async () => {
    const phoneNumber = '+2349876543210'
    const result = await request
      .patch('/api/users')
      .send({ phoneNumber })
      .set('Authorization', `Bearer ${token}`)
    const userAfterUpdate = await getAppUserByEmail(defaultUser.email)

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({ phoneNumber }),
      isSuccess: true,
    })
    expect(userAfterUpdate?.phoneNumber).not.toBe(defaultUser.phoneNumber)
    expect(result.body.data.phoneNumber).toBe(userAfterUpdate?.phoneNumber)
  })
})
