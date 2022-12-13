import supertest from 'supertest'
import { app } from '../../../app'
import { createAppUser } from '../data'
import { sendRegistrationMail } from '../../../providers'

const request = supertest(app)

const defaultUser = {
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'user@email.com',
  phoneNumber: '+2349012345678',
  password: 'TestPass1&',
}

describe('Create User Tests', () => {
  test('User creation fails validation when required input is not provided', async () => {
    const result = await request.post('/api/users').send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'firstName' },
        { message: 'Required', field: 'lastName' },
        { message: 'Required', field: 'email' },
        { message: 'Required', field: 'phoneNumber' },
        { message: 'Required', field: 'password' },
      ],
      isSuccess: false,
    })
  })

  test('User creation fails validation when firstName is below 2 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, firstName: 'a' })

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

  test('User creation fails validation when firstName is above 50 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, firstName: 'a'.repeat(51) })

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

  test('User creation fails validation when firstName contains numbers or special characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, firstName: 'b@' })

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

  test('User creation fails validation when lastName is below 2 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, lastName: 'a' })

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

  test('User creation fails validation when lastName is above 50 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, lastName: 'a'.repeat(51) })

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

  test('User creation fails validation when lastName contains numbers or special characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, lastName: 'a1' })

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

  test('User creation fails validation when email is invalid', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, email: 'user' })

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

  test('User creation fails validation when phone number is invalid', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, phoneNumber: '+1012345678' })

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

  test('User creation fails validation when password is invalid', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, password: 'password' })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message:
            'password must contain at least one lowercase letter, one uppercase letter, one number and one symbol',
          field: 'password',
        },
      ],
      isSuccess: false,
    })
  })

  test('User creation fails validation when valid password is above 50 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...defaultUser, password: 'Pass1%' + 'a'.repeat(45) })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at most 50 character(s)',
          field: 'password',
        },
      ],
      isSuccess: false,
    })
  })

  test('User creation fails when user with email already exists', async () => {
    await createAppUser({ ...defaultUser, publicId: '123', salt: 'salt' })
    const result = await request.post('/api/users').send(defaultUser)

    expect(result.statusCode).toBe(409)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'email already in use',
        },
      ],
      isSuccess: false,
    })
  })

  test('User creation succeeds when all requirements are met', async () => {
    const result = await request.post('/api/users').send(defaultUser)

    expect(result.statusCode).toBe(201)
    expect(result.body).not.toHaveProperty('password')
    expect(result.body).not.toHaveProperty('salt')
    expect(result.body).toMatchObject({
      data: {
        firstName: defaultUser.firstName,
        lastName: defaultUser.lastName,
        email: defaultUser.email,
        phoneNumber: defaultUser.phoneNumber,
      },
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
