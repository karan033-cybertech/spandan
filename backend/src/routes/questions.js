import express from 'express'
import { generateQuestions, AI_PROVIDERS } from '../services/questionService.js'

const router = express.Router()

// Get available AI providers
router.get('/providers', (req, res) => {
  const providers = Object.entries(AI_PROVIDERS).map(([key, value]) => ({
    id: key,
    name: value.name,
    icon: value.icon,
    enabled: value.enabled
  }))
  
  res.json({
    success: true,
    providers
  })
})

// POST /api/questions/generate - Generate questions from transcript
router.post('/generate', async (req, res) => {
  try {
    const { transcript, config } = req.body
    const { 
      numQuestions = 2, 
      difficulty = 'medium',
      provider = 'minimax'
    } = config || {}

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Transcript is required'
      })
    }

    console.log(`Generating ${numQuestions} questions with ${provider}...`)

    const questions = await generateQuestions(transcript, {
      numQuestions,
      difficulty,
      provider
    })

    console.log(`Generated ${questions.length} questions successfully`)

    res.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error('Question generation error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate questions'
    })
  }
})

// Create a question (for manual creation)
router.post('/', async (req, res) => {
  try {
    const { authenticate } = await import('../middleware/auth.js')
    // Simple auth check
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const Question = (await import('../models/Question.js')).default
    const { 
      roomId, 
      type, 
      question, 
      options, 
      timeToAnswer = 30, 
      points = 100,
      status = 'approved',
      segmentIndex = 0
    } = req.body

    if (!roomId || !type || !question || !options) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newQuestion = new Question({
      roomId,
      type,
      question,
      options,
      timeToAnswer,
      points,
      status,
      segmentIndex
    })

    await newQuestion.save()

    res.status(201).json({
      success: true,
      question: newQuestion
    })
  } catch (error) {
    console.error('Error creating question:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create question'
    })
  }
})

// GET /api/questions?roomId=xxx - Get all questions for a room
router.get('/', async (req, res) => {
  try {
    const { roomId } = req.query
    if (!roomId) {
      return res.status(400).json({ error: 'roomId is required' })
    }

    const Question = (await import('../models/Question.js')).default
    const questions = await Question.find({ roomId }).sort({ createdAt: -1 }).lean()
    
    res.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions'
    })
  }
})

export default router