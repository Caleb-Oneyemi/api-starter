import { Router } from 'express'
import { genericQueryValidator, isAuthenticated } from '../../../common'

import {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
} from '../middleware'

import {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostByPublicId,
  updatePost,
  deletePost,
} from '../controllers'

const router = Router()

router
  .post('/', isAuthenticated, createPostValidator, createPost)
  .get('/', isAuthenticated, genericQueryValidator, getAllPosts)
  .get('/by-user', isAuthenticated, genericQueryValidator, getPostsByUser)
  .patch('/:publicId', isAuthenticated, updatePostValidator, updatePost)
  .get('/:publicId', isAuthenticated, getPostByPublicId)
  .delete('/:publicId', isAuthenticated, deletePostValidator, deletePost)

export { router as postRoutes }
