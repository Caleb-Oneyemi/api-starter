import * as CommentDAL from '../data'
import { CreateCommentInput } from '../types'

import {
  BadRequestError,
  generatePublicId,
  NotFoundError,
  QueryInput,
} from '../../../common'

export const createComment = async (input: CreateCommentInput) => {
  const publicId = await generatePublicId()
  return CommentDAL.createComment({
    ...input,
    publicId,
  })
}

export const getCommentsByPostId = async (
  postId: string,
  { page = 1, limit = 10, sort }: QueryInput,
) => {
  const filter = { postId }
  const count = await CommentDAL.getTotalCommentCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }
  const comments = await CommentDAL.getAllComments({
    page: +page,
    limit: +limit,
    sort,
    filter,
  })

  return {
    comments,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const getLoggedInUserComments = async ({
  owner,
  page = 1,
  limit = 10,
  sort,
}: QueryInput & { owner: string }) => {
  const filter = { owner }
  const count = await CommentDAL.getTotalUserCommentCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }
  const comments = await CommentDAL.getCommentsByUser({
    page: +page,
    limit: +limit,
    sort,
    filter,
  })

  return {
    comments,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const updateComment = async (publicId: string, body: string) => {
  const comment = await CommentDAL.updateComment(publicId, { body })
  if (!comment) {
    throw new NotFoundError('Comment record does not exist')
  }

  return comment
}

export const deleteComment = async (publicId: string) => {
  const comment = await CommentDAL.deleteComment(publicId)
  if (!comment) {
    throw new NotFoundError('Comment record does not exist')
  }
}
