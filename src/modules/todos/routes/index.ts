import { Router } from 'express'
import { isAuthenticated } from '../../../common'

import {
  createTodoValidator,
  getTodosValidator,
  updateTodoValidator,
} from '../middleware'

import {
  createTodo,
  getAllTodos,
  getUserTodos,
  getTodoByCustomId,
  updateTodo,
  deleteTodo,
} from '../controllers'

const router = Router()

router
  .post('/', isAuthenticated, createTodoValidator, createTodo)
  .get('/', isAuthenticated, getTodosValidator, getAllTodos)
  .get('/by-user', isAuthenticated, getTodosValidator, getUserTodos)
  .patch('/:customId', isAuthenticated, updateTodoValidator, updateTodo)
  .get('/:customId', isAuthenticated, getTodoByCustomId)
  .delete('/:customId', isAuthenticated, deleteTodo)

export { router as todoRoutes }
