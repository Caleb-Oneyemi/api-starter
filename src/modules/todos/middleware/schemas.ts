import { z } from 'zod'
import { isPositiveInteger } from '../../../common'

export const createTodoSchema = z
  .object({
    task: z.string().trim().min(1).max(50),
    dueDate: z.custom((date) => {
      if (typeof date !== 'string') return false
      return !isNaN(Date.parse(date))
    }),
    description: z.string().trim().min(1).max(1000).optional(),
  })
  .strict()

export const getTodosSchema = z
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

export const updateTodoSchema = createTodoSchema
  .extend({
    isCompleted: z.boolean(),
  })
  .partial()
  .refine(
    (input) => {
      if (Object.keys(input).length === 0) return false
      return true
    },
    {
      message: 'update must contain at least one property',
    },
  )
