import { NextFunction, Request, Response } from 'express'
import {
  createCommentSchema,
  createPostSchema,
  updateCommentSchema,
  updatePostSchema,
} from './schemas'

import {
  getCommentById,
  getCommentByPublicId,
  getPostById,
  getPostByPublicId,
  getAttachmentByPublicId,
} from '../data'

import { CommentDoc, PostDoc } from '../types'

import {
  middlewareWrapper,
  checkPermissions,
  NotFoundError,
} from '../../../common'

export const createPostValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await createPostSchema.parseAsync(input)
  },
)

export const updatePostValidator = middlewareWrapper(
  async ({ input, params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions<PostDoc>({
      userId,
      recordId: params.publicId,
      getRecord: getPostByPublicId,
    })

    await updatePostSchema.parseAsync(input)
  },
)

export const deletePostValidator = middlewareWrapper(
  async ({ params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions({
      userId,
      recordId: params.publicId,
      getRecord: getPostByPublicId,
    })
  },
)

export const createCommentValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await createCommentSchema.parseAsync(input)
  },
)

export const updateCommentValidator = middlewareWrapper(
  async ({ input, params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions<CommentDoc>({
      userId,
      recordId: params.publicId,
      getRecord: getCommentByPublicId,
    })

    await updateCommentSchema.parseAsync(input)
  },
)

export const deleteCommentValidator = middlewareWrapper(
  async ({ params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions({
      userId,
      recordId: params.publicId,
      getRecord: getCommentByPublicId,
    })
  },
)

export const updateAttachmentValidator = middlewareWrapper(
  async ({ params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions({
      userId,
      recordId: params.publicId,
      getRecord: getAttachmentByPublicId,
    })
  },
)

export const deleteAttachmentValidator = middlewareWrapper(
  async ({ params, user }): Promise<void> => {
    const userId = user?.id as string
    await checkPermissions({
      userId,
      recordId: params.publicId,
      getRecord: getAttachmentByPublicId,
    })
  },
)

export const paramPostExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string,
) => {
  try {
    const existingPost = await getPostByPublicId(id)
    if (!existingPost) {
      return next(new NotFoundError('post not found'))
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const paramPostWithMongoIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
  postId: string,
) => {
  try {
    const existingPost = await getPostById(postId)
    if (!existingPost) {
      return next(new NotFoundError('post not found'))
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const paramCommentWithMongoIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
  commentId: string,
) => {
  try {
    const existingComment = await getCommentById(commentId)
    if (!existingComment) {
      return next(new NotFoundError('comment not found'))
    }

    next()
  } catch (err) {
    next(err)
  }
}
