import { createPostSchema, getPostsSchema, updatePostSchema } from './schemas'
import { getPostByPublicId } from '../data'
import { PostDoc } from '../types'
import { middlewareWrapper, checkPermissions } from '../../../common'

export const createPostValidator = middlewareWrapper(
  async ({ input }): Promise<void> => {
    await createPostSchema.parseAsync(input)
  },
)

export const getPostsValidator = middlewareWrapper(
  async ({ query }): Promise<void> => {
    await getPostsSchema.parseAsync(query)
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
