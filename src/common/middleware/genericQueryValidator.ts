import { z } from 'zod'
import { isPositiveInteger, middlewareWrapper } from '../utils'

const genericQuerySchema = z
  .object({
    page: z.custom((page) => {
      if (typeof page !== 'string') return false
      return isPositiveInteger(page)
    }),
    limit: z.custom((limit) => {
      if (typeof limit !== 'string') return false
      return isPositiveInteger(limit)
    }),
    sort: z.enum(['asc', 'desc']),
    search: z.string().trim().min(1).max(50),
  })
  .strict()
  .partial()

export const genericQueryValidator = middlewareWrapper(
  async ({ query }): Promise<void> => {
    await genericQuerySchema.parseAsync(query)
  },
)
