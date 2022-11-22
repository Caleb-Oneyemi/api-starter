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
} from '../middleware'

import * as Ctrl from '../controllers'

const router = Router()

router.param('postId', paramPostExists)

router.param('id', paramPostWithMongoIdExists)

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
  .post('/:postId/comments', createCommentValidator, Ctrl.createComment)
  .get('/:postId/comments', genericQueryValidator, Ctrl.getCommentsByPostId)
  .get('/comments/by-user', [
    genericQueryValidator,
    Ctrl.getLoggedInUserComments,
  ])
  .patch('/:postId/comments/:publicId', [
    updateCommentValidator,
    Ctrl.updateComment,
  ])
  .delete('/:postId/comments/:publicId', [
    deleteCommentValidator,
    Ctrl.deleteComment,
  ])
  //LIKES
  .post('/:id/like', Ctrl.likePost)
  .delete('/:id/unlike', Ctrl.unlikePost)
  .post('/:id/comments/:commentId/like', Ctrl.likeComment)
  .delete('/:id/comments/:commentId/unlike', Ctrl.unlikeComment)

export { router as postRoutes }
