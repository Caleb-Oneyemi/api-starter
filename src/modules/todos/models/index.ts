import { Schema, model } from 'mongoose'
import { UserTypes } from '../../../common'
import { TodoAttributes, TodoDoc, TodoModel } from '../types'

const todoSchema = new Schema<TodoAttributes>(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: UserTypes.APP_USER,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  },
)

todoSchema.index({ publicId: 1, owner: 1 }, { unique: true })
todoSchema.index({ task: 1, owner: 1 }, { unique: true })
todoSchema.index({ task: 1, description: 1 })

todoSchema.statics.build = (input: TodoAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Todo(input).save()
}

export const Todo = model<TodoDoc, TodoModel>('Todo', todoSchema)
