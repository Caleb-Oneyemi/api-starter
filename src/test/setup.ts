import mongoose from 'mongoose'
import { hashPassword } from '../common'
import { createAppUser } from '../modules/users/data'
import { defaultUser, publicId, salt } from './helpers'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  const password = await hashPassword(defaultUser.password)
  await createAppUser({
    ...defaultUser,
    password,
    publicId,
    salt,
  })
})

afterEach(async () => {
  jest.clearAllMocks()

  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

jest.mock('../providers', () => {
  return {
    sendRegistrationMail: jest.fn(() => Promise.resolve()),
    sendEmailVerificationMail: jest.fn(() => Promise.resolve()),
    sendPasswordResetMail: jest.fn(() => Promise.resolve()),
  }
})
