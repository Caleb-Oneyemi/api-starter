import config from 'config'
import { logger, hashPassword, generatePublicId, generateSalt } from '../common'
import { createAdminUser, getAdminUserByUsername } from '../modules/users/data'

const username: string = config.get('adminUsername')
const pass: string = config.get('adminPassword')

export const createDefaultAdminUser = async () => {
  const adminUser = await getAdminUserByUsername(username)

  if (adminUser) {
    logger.debug('admin user already created')
    return
  }

  try {
    const [password, publicId] = await Promise.all([
      hashPassword(pass),
      generatePublicId(),
    ])
    const salt = generateSalt(24)
    await createAdminUser({ username, password, publicId, salt })
    logger.debug('admin user created successfully')
  } catch (err) {
    logger.warn(`failed to create default admin user because ${err}`)
  }
}

createDefaultAdminUser()
