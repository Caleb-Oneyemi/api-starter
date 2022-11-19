import * as TodoDAL from '../data'
import {
  BadRequestError,
  generatePublicId,
  NotFoundError,
} from '../../../common'

import {
  TodoQueryInput,
  UserTodoQueryInput,
  UpdateTodoInput,
  CreateTodoInput,
} from '../types'

export const createTodo = async (input: CreateTodoInput) => {
  const publicId = await generatePublicId()
  const dueDate = new Date(input.dueDate)
  if (new Date() > dueDate) {
    throw new BadRequestError('due date must be a future date')
  }

  return TodoDAL.createTodo({
    ...input,
    publicId,
    dueDate,
  })
}

export const getAllTodos = async ({
  page = 1,
  limit = 10,
  sort,
  search,
}: TodoQueryInput) => {
  const filter = {}
  if (search) {
    Object.assign(filter, {
      $or: [
        { task: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    })
  }

  const count = await TodoDAL.getTotalTodoCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1
  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const todos = await TodoDAL.getAllTodos({
    page: +page,
    limit: +limit,
    sort,
    filter,
  })

  return {
    todos,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const getUserTodos = async ({
  owner,
  page = 1,
  limit = 10,
  sort,
  search,
}: UserTodoQueryInput) => {
  const filter = { owner }
  if (search) {
    Object.assign(filter, {
      $or: [
        { task: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    })
  }

  const count = await TodoDAL.getTotalUserTodoCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1
  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const todos = await TodoDAL.getUserTodos({
    page: +page,
    limit: +limit,
    sort,
    filter,
  })

  return {
    todos,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const getTodoByPublicId = async (publicId: string) => {
  const todo = await TodoDAL.getTodoByPublicId(publicId, true)
  if (!todo) throw new NotFoundError('todo record does not exist')
  return todo
}

export const updateTodo = async (publicId: string, input: UpdateTodoInput) => {
  const data = input
  let dueDate: Date

  if (input.dueDate) {
    dueDate = new Date(input.dueDate)
    if (new Date() > dueDate) {
      throw new BadRequestError('due date must be a future date')
    }

    Object.assign(data, { dueDate })
  }

  const todo = await TodoDAL.updateTodo(publicId, data)
  if (!todo) throw new NotFoundError('todo record does not exist')
  return todo
}

export const deleteTodo = async (publicId: string) => {
  const todo = await TodoDAL.deleteTodo(publicId)
  if (!todo) throw new NotFoundError('todo record does not exist')
}
