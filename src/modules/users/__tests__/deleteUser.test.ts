import supertest from 'supertest'
import { app } from '../../../app'
import { defaultUser, token } from '../../../test/helpers'
import { getAppUserByEmail } from '../data'

const request = supertest(app)

describe('Delete User Tests', () => {
  test('User delete fails if not authenticated', async () => {
    const result = await request.delete('/api/users').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'Not Authenticated' }],
      isSuccess: false,
    })
  })

  test('User delete succeeds when user is authenticated', async () => {
    const aMonthFromNow = new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    )

    const result = await request
      .delete('/api/users')
      .send({})
      .set('Authorization', `Bearer ${token}`)

    const userAfterDelete = await getAppUserByEmail(defaultUser.email)
    const deletedDate = userAfterDelete?.deletedAt as Date

    expect(result.statusCode).toBe(204)
    expect(userAfterDelete?.deletedAt).not.toBeNull()
    expect(new Date(deletedDate).getDate()).toBe(
      new Date(aMonthFromNow).getDate(),
    )
    expect(new Date(deletedDate).getMonth()).toBe(
      new Date(aMonthFromNow).getMonth(),
    )
    expect(new Date(deletedDate).getFullYear()).toBe(
      new Date(aMonthFromNow).getFullYear(),
    )
  })
})
