import { ClientSession } from 'mongoose'
import { QueryInput } from '../../../common'
import { Comment, CommentLike } from '../models'
import { CommentAttributes, CommentLikeAttributes } from '../types'

export const createComment = (input: CommentAttributes) => {
  return Comment.build(input)
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getAllComments = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  filter,
}: QueryInput & { filter: Record<'postId', string> }) => {
  return Comment.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate({
      path: 'owner',
      select: 'firstName lastName photoUrl -_id -type',
    })
    .populate('likes')
    .exec()
}

/** PAGINATED WITH DEFAULT OF TEN DOCUMENTS PER PAGE */
export const getCommentsByUser = ({
  page = 1,
  limit = 10,
  sort = 'desc',
  filter,
}: QueryInput & { filter: Record<'owner', string> }) => {
  return Comment.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('likes')
    .exec()
}

export const getCommentByPublicId = async (publicId: string) => {
  return Comment.findOne({ publicId })
}

export const getCommentById = async (id: string) => {
  return Comment.findById(id).exec()
}

export const updateComment = (
  publicId: string,
  input: Partial<CommentAttributes>,
) => {
  return Comment.findOneAndUpdate(
    { publicId },
    { $set: input },
    { new: true },
  ).exec()
}

export const deleteComment = (publicId: string) => {
  return Comment.findOneAndDelete({ publicId }).exec()
}

export const getTotalCommentCount = (filter: Record<'postId', string>) => {
  return Comment.countDocuments(filter)
}

export const getTotalUserCommentCount = (filter: Record<'owner', string>) => {
  return Comment.countDocuments(filter)
}

export const createCommentLike = (input: CommentLikeAttributes) => {
  return CommentLike.build(input)
}

export const deleteCommentLike = (input: CommentLikeAttributes) => {
  return CommentLike.findOneAndDelete(input)
}

/** FOR SCHEDULED USER DELETION */
export const deleteUserComments = (ownerId: string, session: ClientSession) => {
  return Comment.deleteMany({ owner: ownerId }, { session })
}
