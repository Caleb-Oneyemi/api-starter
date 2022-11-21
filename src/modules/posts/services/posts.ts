import * as PostDAL from '../data'
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
} from '../types'

export const createPost = async (input: CreatePostInput) => {
  const publicId = await generatePublicId()
  return PostDAL.createPost({
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

  const count = await PostDAL.getTotalPostCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1
  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const posts = await PostDAL.getAllPosts({
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

  const count = await PostDAL.getTotalUserPostCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1
  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const posts = await PostDAL.getPostsByUser({
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
  const post = await PostDAL.getPostByPublicId(publicId, true)
  if (!post) {
    throw new NotFoundError('post record does not exist')
  }

  return post
}

export const updatePost = async (publicId: string, input: UpdatePostInput) => {
  const post = await PostDAL.updatePost(publicId, input)
  if (!post) {
    throw new NotFoundError('post record does not exist')
  }

  return post
}

export const deletePost = async (publicId: string) => {
  const post = await PostDAL.deletePost(publicId)
  if (!post) {
    throw new NotFoundError('post record does not exist')
  }
}
