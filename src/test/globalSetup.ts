import { MongoMemoryServer } from 'mongodb-memory-server'

const EnvVars = Object.freeze({
  JWT_SECRET: 'secret',
})

declare global {
  // eslint-disable-next-line no-var
  var mongoServer: MongoMemoryServer
}

export default async (): Promise<void> => {
  const mongoServer = await MongoMemoryServer.create()
  process.env.MONGO_URL = mongoServer.getUri()

  for (const key in EnvVars) {
    process.env[key] = EnvVars[key as keyof typeof EnvVars]
  }

  global.mongoServer = mongoServer
}
