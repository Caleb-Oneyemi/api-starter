import * as TodoDAL from '../data'
import { TodoAttributes } from '../models'

interface TodoQueryInput {
  page?: number
  limit?: number
  search?: string
  owner: string
}

export const createTodo = async (input: TodoAttributes) => {
  return TodoDAL.createTodo(input)
}

export const getAllTodos = async ({
  page,
  limit,
  search,
}: Omit<TodoQueryInput, 'owner'>) => {
  const todos = await TodoDAL.getAllTodos(page, limit, search)
  const count = await TodoDAL.getTotalTodoCount()

  return {
    todos,
    currentPage: page || 1,
    totalPages: Math.ceil(count / 10),
  }
}

export const getUserTodos = async ({
  owner,
  page,
  limit,
  search,
}: TodoQueryInput) => {
  const todos = await TodoDAL.getUserTodos(owner, page, limit, search)
  const count = await TodoDAL.getTotalUserTodoCount(owner)

  return {
    todos,
    currentPage: page || 1,
    totalPages: Math.ceil(count / 10),
  }
}

export const getTodoById = async (id: string) => {
  return TodoDAL.getTodoById(id)
}

export const getTodoByCustomId = async (customId: string) => {
  return TodoDAL.getTodoByCustomId(customId)
}

export const updateTodo = async (
  customId: string,
  input: Partial<Omit<TodoAttributes, 'owner' | 'customId'>>,
) => {
  return TodoDAL.updateTodo(customId, input)
}

export const deleteTodo = async (customId: string) => {
  return TodoDAL.deleteTodo(customId)
}
