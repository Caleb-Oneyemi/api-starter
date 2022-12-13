import mongoose from 'mongoose'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!)
})

afterAll(async () => {
  await mongoose.disconnect()
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
