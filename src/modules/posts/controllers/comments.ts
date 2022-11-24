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
    { id: string }
  >): Promise<ResponseData> => {
    const owner = user?.id as string
    return CommentService.createComment({
      body: input.body,
      postId: params.id,
      owner,
    })
  },
)

type GetCommentsType = ControllerInput<{}, { id: string }, QueryInput>

export const getCommentsByPostId = controllerWrapper(
  httpStatus.OK,
  async ({ params, query }: GetCommentsType): Promise<ResponseData> => {
    return CommentService.getCommentsByPostId(params.id, query)
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
  }: ControllerInput<
    { body: string },
    { publicId: string }
  >): Promise<ResponseData> => {
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

export const likeComment = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
    user,
  }: ControllerInput<{}, { commentId: string }>): Promise<ResponseData> => {
    const owner = user?.id as string
    return CommentService.likeComment({ owner, commentId: params.commentId })
  },
)

export const unlikeComment = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({
    params,
    user,
  }: ControllerInput<{}, { commentId: string }>): Promise<ResponseData> => {
    const owner = user?.id as string
    return CommentService.unlikeComment({ owner, commentId: params.commentId })
  },
)
