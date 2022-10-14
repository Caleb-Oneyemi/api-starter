import config from 'config'
import mongoose from 'mongoose'
import { logger } from '../common'

const mongoUrl: string = config.get('mongoUrl')

mongoose
  .connect(mongoUrl)
  .then(() => logger.debug('Connected to Database'))
  .catch((err: Error) => {
    logger.error(
      `Error connecting to Database with connection string "${mongoUrl}" ---- ${err}`,
    )
    process.exit(1)
  })
