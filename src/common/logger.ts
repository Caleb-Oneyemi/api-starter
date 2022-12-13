import winston from 'winston'
import config from 'config'
import newrelicFormatter from '@newrelic/winston-enricher'

const newrelicWinstonFormatter = newrelicFormatter(winston)
const env: string = config.get('env')

const { createLogger, format, transports } = winston
const { combine, colorize, timestamp, printf } = format

const getFormatters = (env: string) => {
  if (env !== 'development' && env !== 'test') {
    return [newrelicWinstonFormatter()]
  }

  return [
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(({ timestamp, level, message, stack }) => {
      if (stack) {
        return `[api_service: ${timestamp} ${level}: ${stack}`
      }

      return `[api_service: ${timestamp as string}] ${level}: ${message}`
    }),
  ]
}

export const logger = createLogger({
  level: 'debug',
  format: combine(...getFormatters(env)),
  transports: [new transports.Console()],
})
