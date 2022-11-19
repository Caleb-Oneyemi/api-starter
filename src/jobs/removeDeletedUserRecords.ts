import mongoose from 'mongoose'
import { CronJob } from 'cron'
import { deleteUserTodos } from '../modules/todos/data'
import { getUsersToBeDeleted, hardDeleteUser } from '../modules/users/data'
import { logger } from '../common'

const removeDeletedUserRecords = async () => {
  logger.debug('----Starting Delete User Job----')
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const users = getUsersToBeDeleted()
    for await (const user of users) {
      await deleteUserTodos(user.id, session)
      await hardDeleteUser(user.publicId, session)
    }

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    logger.warn('Failed to process Delete User Job')
    logger.warn(error)
  } finally {
    session.endSession()
  }

  logger.debug('----Ending Delete User Job----')
}

/** Runs Everyday at 12AM. Needs configured mongo replica set */
export const removeDeletedUserRecordsJob = new CronJob(
  '0 0 0 * * *',
  removeDeletedUserRecords,
)
