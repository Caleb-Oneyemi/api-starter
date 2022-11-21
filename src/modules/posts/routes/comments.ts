import { Router } from 'express'
import { genericQueryValidator, isAuthenticated } from '../../../common'

import {
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
  getCommentsValidator,
} from '../middleware'

import {
  createComment,
  getCommentsByPostId,
  getLoggedInUserComments,
  updateComment,
  deleteComment,
} from '../controllers'

const router = Router()

router
  .post('/:postId', isAuthenticated, createCommentValidator, createComment)
  .patch('/:publicId', isAuthenticated, updateCommentValidator, updateComment)
  .delete('/:publicId', isAuthenticated, deleteCommentValidator, deleteComment)
  .get('/by-user', [
    isAuthenticated,
    genericQueryValidator,
    getLoggedInUserComments,
  ])
  .get('/by-post/:postId', [
    isAuthenticated,
    genericQueryValidator,
    getCommentsValidator,
    getCommentsByPostId,
  ])

export { router as commentRoutes }
