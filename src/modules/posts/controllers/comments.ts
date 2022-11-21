import httpStatus from 'http-status'
import * as CommentService from '../services'

import {
  ResponseData,
  ControllerInput,
  controllerWrapper,
  QueryInput,
} from '../../../common'

export const createComment = controllerWrapper(
  httpStatus.CREATED,
  async ({
    input,
    params,
    user,
  }: ControllerInput<
    { body: string },
    { postId: string }
  >): Promise<ResponseData> => {
    const owner = user?.id as string
    return CommentService.createComment({
      body: input.body,
      postId: params.postId,
      owner,
    })
  },
)

type GetCommentsType = ControllerInput<{}, { postId: string }, QueryInput>

export const getCommentsByPostId = controllerWrapper(
  httpStatus.OK,
  async ({ params, query }: GetCommentsType): Promise<ResponseData> => {
    return CommentService.getCommentsByPostId(params.postId, query)
  },
)

export const getLoggedInUserComments = controllerWrapper(
  httpStatus.OK,
  async ({
    user,
    query,
  }: ControllerInput<{}, {}, QueryInput>): Promise<ResponseData> => {
    const owner = user?.id as string
    return CommentService.getLoggedInUserComments({ ...query, owner })
  },
)

export const updateComment = controllerWrapper(
  httpStatus.OK,
  async ({
    input,
    params,
  }: ControllerInput<{ body: string }>): Promise<ResponseData> => {
    return CommentService.updateComment(params.publicId, input.body)
  },
)

export const deleteComment = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return CommentService.deleteComment(params.publicId)
  },
)
