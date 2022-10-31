import crypto from 'crypto'
import config from 'config'
import { nanoid } from 'nanoid'
import { logger, hashPassword } from '../common'
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
    const customId = nanoid(8)
    const password = await hashPassword(pass)
    const salt = crypto.randomBytes(24).toString('hex')
    await createServiceUser({ username, password, customId, salt })
    logger.debug('service user created successfully')
  } catch (err) {
    logger.warn(`failed to create service user because ${err}`)
  }
}

createDefaultServiceUser()
