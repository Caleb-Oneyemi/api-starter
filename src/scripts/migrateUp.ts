import { config, database, up } from 'migrate-mongo'
import migrationConfig from '../../migrate-mongo-config'
import { logger } from '../common'

config.set(migrationConfig)

const migrate = async () => {
  let client
  let migrated

  try {
    const connection = await database.connect()
    client = connection.client

    migrated = await up(connection.db, client)
  } catch (err: any) {
    logger.error(`Failed to migrate up: ${err.message}`)
  }

  if (Array.isArray(migrated)) {
    migrated.forEach((fileName) => logger.info(`Migrated up: ${fileName}`))
  }

  if (client) {
    try {
      await client.close()
    } catch (err: any) {
      logger.error(
        `Failed to close DB connection after migration: ${err.message}`,
      )
    }
  }
}

migrate()
