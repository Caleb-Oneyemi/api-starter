import * as TodoDAL from '../data'
import {
  TodoAttributes,
  TodoQueryInput,
  UserTodoQueryInput,
  UpdateTodoInput,
} from '../types'

export const createTodo = async (input: TodoAttributes) => {
  return TodoDAL.createTodo(input)
}

export const getAllTodos = async ({
  page = 1,
  limit = 10,
  search,
}: TodoQueryInput) => {
  const todos = await TodoDAL.getAllTodos(page, limit, search)
  const count = await TodoDAL.getTotalTodoCount()

  return {
    todos,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  }
}

export const getUserTodos = async ({
  owner,
  page = 1,
  limit = 10,
  search,
}: UserTodoQueryInput) => {
  const todos = await TodoDAL.getUserTodos(owner, page, limit, search)
  const count = await TodoDAL.getTotalUserTodoCount(owner)

  return {
    todos,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  }
}

export const getTodoById = async (id: string) => {
  return TodoDAL.getTodoById(id)
}

export const getTodoByCustomId = async (customId: string) => {
  return TodoDAL.getTodoByCustomId(customId)
}

export const updateTodo = async (customId: string, input: UpdateTodoInput) => {
  return TodoDAL.updateTodo(customId, input)
}

export const deleteTodo = async (customId: string) => {
  return TodoDAL.deleteTodo(customId)
}
