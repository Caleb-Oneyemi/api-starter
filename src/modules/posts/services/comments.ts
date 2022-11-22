import * as DAL from '../data'
import { CommentLikeAttributes, CreateCommentInput } from '../types'

import {
  BadRequestError,
  generatePublicId,
  NotFoundError,
  QueryInput,
} from '../../../common'

export const createComment = async (input: CreateCommentInput) => {
  const publicId = await generatePublicId()
  return DAL.createComment({
    ...input,
    publicId,
  })
}

export const getCommentsByPostId = async (
  postId: string,
  { page = 1, limit = 10, sort }: QueryInput,
) => {
  const filter = { postId }
  const count = await DAL.getTotalCommentCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }
  const comments = await DAL.getAllComments({
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
  const count = await DAL.getTotalUserCommentCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }
  const comments = await DAL.getCommentsByUser({
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
  const comment = await DAL.updateComment(publicId, { body })
  if (!comment) {
    throw new NotFoundError('Comment record does not exist')
  }

  return comment
}

export const deleteComment = async (publicId: string) => {
  const comment = await DAL.deleteComment(publicId)
  if (!comment) {
    throw new NotFoundError('Comment record does not exist')
  }
}

export const likeComment = async (input: CommentLikeAttributes) => {
  return DAL.createCommentLike(input)
}

export const unlikeComment = async (input: CommentLikeAttributes) => {
  return DAL.deleteCommentLike(input)
}
