import httpStatus from 'http-status'
import * as TodoService from '../services'
import { TodoAttributes, TodoQueryInput, UpdateTodoInput } from '../types'

import {
  ResponseData,
  ControllerInput,
  controllerWrapper,
} from '../../../common'

export const createTodo = controllerWrapper(
  httpStatus.CREATED,
  async ({ input }: ControllerInput<TodoAttributes>): Promise<ResponseData> => {
    return TodoService.createTodo(input)
  },
)

export const getAllTodos = controllerWrapper(
  httpStatus.OK,
  async ({
    query,
  }: ControllerInput<{}, {}, TodoQueryInput>): Promise<ResponseData> => {
    return TodoService.getAllTodos(query)
  },
)

type GetUserTodosInput = ControllerInput<
  {},
  { ownerId: string },
  TodoQueryInput
>

export const getUserTodos = controllerWrapper(
  httpStatus.OK,
  async ({ params, query }: GetUserTodosInput): Promise<ResponseData> => {
    return TodoService.getUserTodos({ ...query, owner: params.ownerId })
  },
)

export const getTodoById = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
  }: ControllerInput<{}, { id: string }>): Promise<ResponseData> => {
    return TodoService.getTodoById(params.id)
  },
)

export const getTodoByCustomId = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
  }: ControllerInput<{}, { customId: string }>): Promise<ResponseData> => {
    return TodoService.getTodoByCustomId(params.customId)
  },
)

type UpdateTodoData = ControllerInput<UpdateTodoInput, { customId: string }>

export const updateTodo = controllerWrapper(
  httpStatus.CREATED,
  async ({ input, params }: UpdateTodoData): Promise<ResponseData> => {
    return TodoService.updateTodo(params.customId, input)
  },
)

export const deleteTodo = controllerWrapper(
  httpStatus.CREATED,
  async ({
    params,
  }: ControllerInput<{}, { customId: string }>): Promise<ResponseData> => {
    return TodoService.deleteTodo(params.customId)
  },
)
