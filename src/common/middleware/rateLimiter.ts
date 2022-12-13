import config from 'config'
import { Request, Response, NextFunction } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { RateLimitError } from '../errors'
import { normalizeIPAddress } from '../utils'
import { client } from '../../redisClient'

const env = config.get('env')

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'MIDDLEWARE',
  points: 10,
  duration: 1,
  blockDuration: 60 * 60,
})

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env === 'test') {
    return next()
  }

  try {
    const ip = normalizeIPAddress(req.ip) || req.ip
    await limiter.consume(ip)
    next()
  } catch (err: any) {
    if (err instanceof Error) {
      return next(err)
    }

    const retryAfter = String(Math.round(err.msBeforeNext / 1000) || 1)
    res.setHeader('Retry-After', retryAfter)
    next(new RateLimitError('request limit exceeded'))
  }
}
