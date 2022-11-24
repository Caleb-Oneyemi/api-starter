import httpStatus from 'http-status'
import * as PostService from '../services'
import { CreatePostInput, UpdatePostInput } from '../types'

import {
  ResponseData,
  ControllerInput,
  controllerWrapper,
  QueryInput,
} from '../../../common'

export const createPost = controllerWrapper(
  httpStatus.CREATED,
  async ({
    input,
    user,
  }: ControllerInput<
    Omit<CreatePostInput, 'owner'>
  >): Promise<ResponseData> => {
    const owner = user?.id as string
    return PostService.createPost({ ...input, owner })
  },
)

export const getAllPosts = controllerWrapper(
  httpStatus.OK,
  async ({
    query,
  }: ControllerInput<{}, {}, QueryInput>): Promise<ResponseData> => {
    return PostService.getAllPosts(query)
  },
)

export const getPostsByUser = controllerWrapper(
  httpStatus.OK,
  async ({
    user,
    query,
  }: ControllerInput<{}, {}, QueryInput>): Promise<ResponseData> => {
    const owner = user?.id as string
    return PostService.getPostsByUser({ ...query, owner })
  },
)

export const getPostByPublicId = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return PostService.getPostByPublicId(params.publicId)
  },
)

type UpdatePostData = ControllerInput<UpdatePostInput, { publicId: string }>

export const updatePost = controllerWrapper(
  httpStatus.OK,
  async ({ input, params }: UpdatePostData): Promise<ResponseData> => {
    return PostService.updatePost(params.publicId, input)
  },
)

export const deletePost = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({
    params,
  }: ControllerInput<{}, { publicId: string }>): Promise<ResponseData> => {
    return PostService.deletePost(params.publicId)
  },
)

export const likePost = controllerWrapper(
  httpStatus.OK,
  async ({
    params,
    user,
  }: ControllerInput<{}, { postId: string }>): Promise<ResponseData> => {
    const owner = user?.id as string
    return PostService.likePost({ owner, postId: params.postId })
  },
)

export const unlikePost = controllerWrapper(
  httpStatus.NO_CONTENT,
  async ({
    params,
    user,
  }: ControllerInput<{}, { postId: string }>): Promise<ResponseData> => {
    const owner = user?.id as string
    return PostService.unlikePost({ owner, postId: params.postId })
  },
)
