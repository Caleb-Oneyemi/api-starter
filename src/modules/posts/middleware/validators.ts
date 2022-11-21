import {
  createCommentSchema,
  createPostSchema,
  updateCommentSchema,
  updatePostSchema,
} from './schemas'

import { getCommentByPublicId, getPostByPublicId } from '../data'
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
  async ({ input, params }): Promise<void> => {
    await createCommentSchema.parseAsync(input)
    const existingPost = await getPostByPublicId(params.postId)
    if (!existingPost) {
      throw new NotFoundError('post not found')
    }
  },
)

export const getCommentsValidator = middlewareWrapper(
  async ({ params }): Promise<void> => {
    const existingPost = await getPostByPublicId(params.postId)
    if (!existingPost) {
      throw new NotFoundError('post not found')
    }
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
