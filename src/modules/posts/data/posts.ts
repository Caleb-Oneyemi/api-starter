import { ClientSession } from 'mongoose'
import { QueryInput } from '../../../common'
import { Post, PostLike } from '../models'
import { PostAttributes, PostLikeAttributes } from '../types'

export const createPost = (input: PostAttributes) => {
  return Post.build(input)
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getAllPosts = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  filter,
}: QueryInput & { filter: Record<string, unknown> }) => {
  return Post.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate({
      path: 'owner',
      select: 'firstName lastName photoUrl -_id -type',
    })
    .populate('likes')
    .populate('attachments')
    .exec()
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getPostsByUser = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  filter,
}: QueryInput & { filter: Record<string, unknown> }) => {
  return Post.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('likes')
    .populate('attachments')
    .exec()
}

export const getPostByPublicId = async (publicId: string, populate = false) => {
  if (!populate) {
    return Post.findOne({ publicId })
  }

  return Post.findOne({ publicId })
    .populate({
      path: 'owner',
      select: 'firstName lastName photoUrl -_id -type',
    })
    .populate('likes')
    .populate('attachments')
    .exec()
}

export const getPostById = async (id: string) => {
  return Post.findById(id).exec()
}

export const updatePost = (
  publicId: string,
  input: Partial<PostAttributes>,
) => {
  return Post.findOneAndUpdate(
    { publicId },
    { $set: input },
    { new: true },
  ).exec()
}

export const deletePost = (publicId: string) => {
  return Post.findOneAndDelete({ publicId }).exec()
}

export const getTotalPostCount = (filter: Record<string, unknown>) => {
  return Post.countDocuments(filter)
}

export const getTotalUserPostCount = (filter: Record<string, unknown>) => {
  return Post.countDocuments(filter)
}

export const createPostLike = (input: PostLikeAttributes) => {
  return PostLike.build(input)
}

export const deletePostLike = (input: PostLikeAttributes) => {
  return PostLike.findOneAndDelete(input)
}

/** FOR SCHEDULED USER DELETION */
export const deleteUserPosts = (ownerId: string, session: ClientSession) => {
  return Post.deleteMany({ owner: ownerId }, { session })
}
