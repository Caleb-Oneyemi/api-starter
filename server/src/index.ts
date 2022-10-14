import config from 'config'

import { app } from './app'
import { logger } from './common'

const port = config.get('port')

app.listen(port, () => {
  logger.debug(`listening on port ${port}...`)
})
