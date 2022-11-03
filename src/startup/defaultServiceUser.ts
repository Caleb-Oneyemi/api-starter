import config from 'config'
import { logger, hashPassword, generateCustomId, generateSalt } from '../common'
import {
  createServiceUser,
  getServiceUserByUsername,
} from '../modules/users/data'

const username: string = config.get('serviceUsername')
const pass: string = config.get('servicePassword')

export const createDefaultServiceUser = async () => {
  const serviceUser = await getServiceUserByUsername(username)

  if (serviceUser) {
    logger.debug('service user already created')
    return
  }

  try {
    const [password, customId] = await Promise.all([
      hashPassword(pass),
      generateCustomId(),
    ])
    const salt = generateSalt(24)
    await createServiceUser({ username, password, customId, salt })
    logger.debug('service user created successfully')
  } catch (err) {
    logger.warn(`failed to create service user because ${err}`)
  }
}

createDefaultServiceUser()
