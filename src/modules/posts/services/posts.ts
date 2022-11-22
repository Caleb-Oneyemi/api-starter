import * as DAL from '../data'
import {
  BadRequestError,
  generatePublicId,
  NotFoundError,
  QueryInput,
} from '../../../common'

import {
  PostsByUserQueryInput,
  UpdatePostInput,
  CreatePostInput,
  PostLikeAttributes,
} from '../types'

export const createPost = async (input: CreatePostInput) => {
  const publicId = await generatePublicId()
  return DAL.createPost({
    ...input,
    publicId,
  })
}

export const getAllPosts = async ({
  page = 1,
  limit = 10,
  sort,
  search,
}: QueryInput) => {
  const filter = {}
  if (search) {
    Object.assign(filter, {
      $or: [{ title: { $regex: search, $options: 'i' } }],
    })
  }

  const count = await DAL.getTotalPostCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1
  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const posts = await DAL.getAllPosts({
    page: +page,
    limit: +limit,
    sort,
    filter,
  })

  return {
    posts,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const getPostsByUser = async ({
  owner,
  page = 1,
  limit = 10,
  sort,
  search,
}: PostsByUserQueryInput) => {
  const filter = { owner }
  if (search) {
    Object.assign(filter, {
      $or: [{ title: { $regex: search, $options: 'i' } }],
    })
  }

  const count = await DAL.getTotalUserPostCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1
  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const posts = await DAL.getPostsByUser({
    page: +page,
    limit: +limit,
    sort,
    filter,
  })

  return {
    posts,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const getPostByPublicId = async (publicId: string) => {
  const post = await DAL.getPostByPublicId(publicId, true)
  if (!post) {
    throw new NotFoundError('post record does not exist')
  }

  return post
}

export const updatePost = async (publicId: string, input: UpdatePostInput) => {
  const post = await DAL.updatePost(publicId, input)
  if (!post) {
    throw new NotFoundError('post record does not exist')
  }

  return post
}

export const deletePost = async (publicId: string) => {
  const post = await DAL.deletePost(publicId)
  if (!post) {
    throw new NotFoundError('post record does not exist')
  }
}

export const likePost = async (input: PostLikeAttributes) => {
  return DAL.createPostLike(input)
}

export const unlikePost = async (input: PostLikeAttributes) => {
  return DAL.deletePostLike(input)
}
