import { Todo } from '../models'
import { TodoAttributes, TodoQueryInput } from '../types'

export const createTodo = (input: TodoAttributes) => {
  return Todo.build(input)
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getAllTodos = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  filter,
}: TodoQueryInput & { filter: Record<string, unknown> }) => {
  return Todo.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getUserTodos = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  filter,
}: TodoQueryInput & { filter: Record<string, unknown> }) => {
  return Todo.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
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

export const getTotalTodoCount = (filter: Record<string, unknown>) => {
  return Todo.countDocuments(filter)
}

export const getTotalUserTodoCount = (filter: Record<string, unknown>) => {
  return Todo.countDocuments(filter)
}
