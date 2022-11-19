import httpStatus from 'http-status'
import * as TodoService from '../services'
import { CreateTodoInput, TodoQueryInput, UpdateTodoInput } from '../types'

import {
  ResponseData,
  ControllerInput,
  controllerWrapper,
} from '../../../common'

export const createTodo = controllerWrapper(
  httpStatus.CREATED,
  async ({
    input,
    user,
  }: ControllerInput<CreateTodoInput>): Promise<ResponseData> => {
    const owner = user?.id as string
    return TodoService.createTodo({ ...input, owner })
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

export const getUserTodos = controllerWrapper(
  httpStatus.OK,
  async ({
    user,
    query,
  }: ControllerInput<{}, {}, TodoQueryInput>): Promise<ResponseData> => {
    const owner = user?.id as string
    return TodoService.getUserTodos({ ...query, owner })
  },
)

export const getTodoByPublicId = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return TodoService.getTodoByPublicId(params.publicId)
  },
)

type UpdateTodoData = ControllerInput<UpdateTodoInput, { publicId: string }>

export const updateTodo = controllerWrapper(
  httpStatus.OK,
  async ({ input, params }: UpdateTodoData): Promise<ResponseData> => {
    return TodoService.updateTodo(params.publicId, input)
  },
)

export const deleteTodo = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return TodoService.deleteTodo(params.publicId)
  },
)
