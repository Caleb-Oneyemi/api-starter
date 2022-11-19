import { Router } from 'express'
import { isAuthenticated } from '../../../common'

import {
  createTodoValidator,
  getTodosValidator,
  updateTodoValidator,
  deleteTodoValidator,
} from '../middleware'

import {
  createTodo,
  getAllTodos,
  getUserTodos,
  getTodoByPublicId,
  updateTodo,
  deleteTodo,
} from '../controllers'

const router = Router()

router
  .post('/', isAuthenticated, createTodoValidator, createTodo)
  .get('/', isAuthenticated, getTodosValidator, getAllTodos)
  .get('/by-user', isAuthenticated, getTodosValidator, getUserTodos)
  .patch('/:publicId', isAuthenticated, updateTodoValidator, updateTodo)
  .get('/:publicId', isAuthenticated, getTodoByPublicId)
  .delete('/:publicId', isAuthenticated, deleteTodoValidator, deleteTodo)

export { router as todoRoutes }
