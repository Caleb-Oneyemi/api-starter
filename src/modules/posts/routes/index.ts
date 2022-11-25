import { Router } from 'express'
import { genericQueryValidator } from '../../../common'

import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
  paramPostExists,
  paramPostWithMongoIdExists,
  paramCommentWithMongoIdExists,
  deleteAttachmentValidator,
  updateAttachmentValidator,
} from '../middleware'

import * as Ctrl from '../controllers'

const router = Router()

router.param('id', paramPostExists)

router.param('postId', paramPostWithMongoIdExists)

router.param('commentId', paramCommentWithMongoIdExists)

router
  //POSTS
  .post('/', createPostValidator, Ctrl.createPost)
  .get('/', genericQueryValidator, Ctrl.getAllPosts)
  .get('/by-user', genericQueryValidator, Ctrl.getPostsByUser)
  .patch('/:publicId', updatePostValidator, Ctrl.updatePost)
  .get('/:publicId', Ctrl.getPostByPublicId)
  .delete('/:publicId', deletePostValidator, Ctrl.deletePost)
  //COMMENTS
  .post('/:id/comments', createCommentValidator, Ctrl.createComment)
  .get('/:id/comments', genericQueryValidator, Ctrl.getCommentsByPostId)
  .get('/comments/by-user', [
    genericQueryValidator,
    Ctrl.getLoggedInUserComments,
  ])
  .patch('/:id/comments/:publicId', [
    updateCommentValidator,
    Ctrl.updateComment,
  ])
  .delete('/:id/comments/:publicId', [
    deleteCommentValidator,
    Ctrl.deleteComment,
  ])
  //LIKES
  .post('/:postId/like', Ctrl.likePost)
  .delete('/:postId/unlike', Ctrl.unlikePost)
  .post('/:postId/comments/:commentId/like', Ctrl.likeComment)
  .delete('/:postId/comments/:commentId/unlike', Ctrl.unlikeComment)
  //ATTACHMENTS
  .post('/:postId/attachments', Ctrl.createAttachment)
  .patch('/:postId/attachments/:publicId', [
    updateAttachmentValidator,
    Ctrl.updateAttachment,
  ])
  .delete('/:postId/attachments/:publicId', [
    deleteAttachmentValidator,
    Ctrl.deleteAttachment,
  ])

export { router as postRoutes }
