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
} from '../middleware'

import * as Ctrl from '../controllers'

const router = Router()

router.param('postId', async (req, res, next, postId) => {
  try {
    await paramPostExists(postId)
    next()
  } catch (err) {
    next(err)
  }
})

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

export { router as postRoutes }
