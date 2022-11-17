import { Todo } from '../models'
import { TodoAttributes, TodoQueryInput, UserTodoQueryInput } from '../types'

export const createTodo = (input: TodoAttributes) => {
  return Todo.build(input)
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getAllTodos = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  search,
}: TodoQueryInput) => {
  const filter = {}
  if (search) {
    Object.assign(filter, { $or: [{ task: search }, { description: search }] })
  }

  return Todo.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * 10)
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getUserTodos = ({
  owner,
  page = 1,
  limit = 10,
  sort = 'desc',
  search,
}: UserTodoQueryInput) => {
  const filter = { owner }
  if (search) {
    Object.assign(filter, { $or: [{ task: search }, { description: search }] })
  }

  return Todo.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * 10)
}

export const getTodoById = (id: string) => {
  return Todo.findById(id)
}

export const getTodoByCustomId = (customId: string) => {
  return Todo.findOne({ customId })
}

export const updateTodo = (
  customId: string,
  input: Partial<TodoAttributes>,
) => {
  return Todo.findOneAndUpdate({ customId }, { $set: input }, { new: true })
}

export const deleteTodo = (customId: string) => {
  return Todo.findOneAndDelete({ customId })
}

export const getTotalTodoCount = () => {
  return Todo.countDocuments()
}

export const getTotalUserTodoCount = (owner: string) => {
  return Todo.countDocuments({ owner })
}
