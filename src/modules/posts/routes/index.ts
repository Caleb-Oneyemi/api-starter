import { Router } from 'express'
import { isAuthenticated } from '../../../common'

import {
  createPostValidator,
  getPostsValidator,
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
  .get('/', isAuthenticated, getPostsValidator, getAllPosts)
  .get('/by-user', isAuthenticated, getPostsValidator, getPostsByUser)
  .patch('/:publicId', isAuthenticated, updatePostValidator, updatePost)
  .get('/:publicId', isAuthenticated, getPostByPublicId)
  .delete('/:publicId', isAuthenticated, deletePostValidator, deletePost)

export { router as postRoutes }
