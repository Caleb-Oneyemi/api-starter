import { createTodoSchema, getTodosSchema, updateTodoSchema } from './schemas'
import { middlewareWrapper } from '../../../common'

export const createTodoValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await createTodoSchema.parseAsync(input)
  },
)

export const getTodosValidator = middlewareWrapper(
  async ({ query }): Promise<void> => {
    await getTodosSchema.parseAsync(query)
  },
)

export const updateTodoValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await updateTodoSchema.parseAsync(input)
  },
)
