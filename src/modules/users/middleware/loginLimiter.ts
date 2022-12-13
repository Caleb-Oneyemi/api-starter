import config from 'config'
import { Request, Response, NextFunction } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { client } from '../../../redisClient'
import { RateLimitError } from '../../../common'

const env = config.get('env')

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'LOGIN',
  points: 30,
  duration: 60 * 60,
  blockDuration: 60 * 60,
})

export const loginLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (env === 'test') {
      return next()
    }

    await limiter.consume(req.body.email)
    next()
  } catch (err: any) {
    if (err instanceof Error) {
      return next(err)
    }

    const retryAfter = String(Math.round(err.msBeforeNext / 1000) || 1)
    res.setHeader('Retry-After', retryAfter)
    next(new RateLimitError('login request limit exceeded'))
  }
}
