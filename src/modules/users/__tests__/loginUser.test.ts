import supertest from 'supertest'
import { app } from '../../../app'
import { hashPassword } from '../../../common'
import { createAppUser, getAppUserByEmail } from '../data'

const request = supertest(app)

const defaultUser = {
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'user@email.com',
  phoneNumber: '+2349012345678',
  password: 'TestPass1&',
}

beforeEach(async () => {
  const password = await hashPassword(defaultUser.password)
  await createAppUser({
    ...defaultUser,
    password,
    publicId: '123',
    salt: 'salt',
  })
})

describe('Login User Tests', () => {
  test('User login fails validation when required input is not provided', async () => {
    const result = await request.post('/api/users/login').send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'email' },
        { message: 'Required', field: 'password' },
      ],
      isSuccess: false,
    })
  })

  test('User login fails validation when invalid email is provided', async () => {
    const result = await request
      .post('/api/users/login')
      .send({ email: 'invalidMail', password: defaultUser.password })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Invalid email', field: 'email' }],
      isSuccess: false,
    })
  })

  test('User login fails when user with email does not exist', async () => {
    const email = 'none@email.com'
    const existingUser = await getAppUserByEmail(email)
    const result = await request
      .post('/api/users/login')
      .send({ email, password: defaultUser.password })

    expect(result.statusCode).toBe(400)
    expect(existingUser).toBeNull()
    expect(result.body).toEqual({
      errors: [{ message: 'invalid credentials' }],
      isSuccess: false,
    })
  })

  test('User login fails when user exists but invalid password is used', async () => {
    const existingUser = await getAppUserByEmail(defaultUser.email)
    const result = await request
      .post('/api/users/login')
      .send({ email: defaultUser.email, password: 'wrongPassword' })

    expect(result.statusCode).toBe(400)
    expect(existingUser).not.toBeNull()
    expect(existingUser?.email).toBe(defaultUser.email)
    expect(result.body).toEqual({
      errors: [{ message: 'invalid credentials' }],
      isSuccess: false,
    })
  })

  test('User login succeeds when valid credentials are provided', async () => {
    const existingUser = await getAppUserByEmail(defaultUser.email)
    const result = await request
      .post('/api/users/login')
      .send({ email: defaultUser.email, password: defaultUser.password })

    expect(result.statusCode).toBe(200)
    expect(existingUser).not.toBeNull()
    expect(existingUser?.email).toBe(defaultUser.email)
    expect(result.body.data.user).not.toHaveProperty('password')
    expect(result.body.data.user).not.toHaveProperty('salt')
    expect(result.body.data).toEqual({
      user: expect.objectContaining({
        firstName: defaultUser.firstName,
        lastName: defaultUser.lastName,
        email: defaultUser.email,
        phoneNumber: defaultUser.phoneNumber,
      }),
      token: expect.stringMatching(/^ey/),
    })
  })
})
