import { Document, Model } from 'mongoose'
import { UserAttributes } from '../../../common'

export interface TodoAttributes {
  customId: string
  task: string
  dueDate: Date
  owner: string | UserAttributes
  description?: string
  isCompleted?: boolean
}

export interface TodoDoc extends TodoAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface TodoModel extends Model<TodoDoc> {
  build(input: TodoAttributes): TodoDoc
}

export interface TodoQueryInput {
  page?: number
  limit?: number
  search?: string
  sort?: 'asc' | 'desc'
}

export type UserTodoQueryInput = TodoQueryInput & { owner: string }

export type UpdateTodoInput = Partial<
  Omit<TodoAttributes, 'owner' | 'customId'>
>
