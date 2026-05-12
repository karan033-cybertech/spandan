import { z } from 'zod'

// Auth validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['teacher', 'student'], {
    errorMap: () => ({ message: 'Role must be either teacher or student' })
  })
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
})

// Room validation schemas
export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(200),
  settings: z.object({
    allowLateJoin: z.boolean().optional(),
    showResultsImmediately: z.boolean().optional(),
    requireCorrectAnswer: z.boolean().optional()
  }).optional()
})

// Question validation schemas
export const createQuestionSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
  correctOptionIndex: z.number().min(0),
  roomId: z.string(),
  source: z.enum(['manual', 'ai', 'upload', 'transcript']).optional(),
  timer: z.number().min(5).max(300).optional()
})

// Response validation schema
export const submitResponseSchema = z.object({
  questionId: z.string(),
  selectedOption: z.number().min(0),
  responseTime: z.number().min(0)
})

// Middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.parse(req.body)
      req.validatedBody = result
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        })
      }
      next(error)
    }
  }
}