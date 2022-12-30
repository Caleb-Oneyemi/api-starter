import supertest from 'supertest'
import { app } from '../../../app'
import { publicId, salt, token } from '../../../test/helpers'
import { getUserByPublicId } from '../data'

const request = supertest(app)

describe('Logout Tests', () => {
  test('logout fails if user is not authenticated', async () => {
    const result = await request.get('/api/users/logout').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('logout succeeds and invalidates all jwt tokens by changing salt', async () => {
    const result = await request
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    const user = await getUserByPublicId(publicId)
    const badResult = await request
      .get('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: { message: 'user tokens invalidated' },
      isSuccess: true,
    })
    expect(user?.salt).not.toBe(salt)
    expect(badResult.statusCode).toBe(401)
    expect(badResult.body).toEqual({
      errors: [{ message: 'Invalid Token' }],
      isSuccess: false,
    })
  })
})
