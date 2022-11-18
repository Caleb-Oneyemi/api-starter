import { createTodoSchema, getTodosSchema, updateTodoSchema } from './schemas'
import { getTodoByCustomId } from '../data'
import { TodoDoc } from '../types'
import { middlewareWrapper, checkPermissions } from '../../../common'

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
  async ({ input, params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions<TodoDoc>({
      userId,
      recordId: params.customId,
      getRecord: getTodoByCustomId,
    })

    await updateTodoSchema.parseAsync(input)
  },
)

export const deleteTodoValidator = middlewareWrapper(
  async ({ params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions({
      userId,
      recordId: params.customId,
      getRecord: getTodoByCustomId,
    })
  },
)
