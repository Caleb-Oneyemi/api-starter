import { z } from 'zod'

export const createPostSchema = z
  .object({
    title: z.string().trim().min(1).max(50),
    content: z.string().trim().min(1).max(1000).optional(),
  })
  .strict()

export const updatePostSchema = createPostSchema.partial().refine(
  (input) => {
    if (Object.keys(input).length === 0) return false
    return true
  },
  {
    message: 'update must contain at least one property',
  },
)

export const createCommentSchema = z
  .object({
    body: z.string().trim().min(1).max(1000),
  })
  .strict()

export const updateCommentSchema = createCommentSchema.partial().refine(
  (input) => {
    if (Object.keys(input).length === 0) return false
    return true
  },
  {
    message: 'update must contain at least one property',
  },
)
