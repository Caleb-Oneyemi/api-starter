import { createLogger, format, transports } from 'winston'

const { combine, colorize, timestamp, printf } = format

export const logger = createLogger({
  level: 'debug',
  format: combine(
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
  ),
  transports: [new transports.Console()],
})
