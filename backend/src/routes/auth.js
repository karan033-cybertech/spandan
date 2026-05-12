import express from 'express'
import { register, login, getUserById, checkEmailExists, updateUserRole } from '../services/authService.js'
import { generateToken } from '../middleware/auth.js'
import { validate, registerSchema, loginSchema } from '../middleware/validation.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Register new user
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password, role } = req.validatedBody
    const user = await register(name, email, password, role)
    const token = generateToken(user._id)

    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      token
    })
  } catch (error) {
    const status = error.message === 'Email already registered' ? 400 : 500
    res.status(status).json({ error: error.message })
  }
})

// Login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody
    const user = await login(email, password)
    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

// Update user role (called after registration role selection)
router.put('/role', authenticate, async (req, res) => {
  try {
    const { role } = req.body
    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }
    
    const user = await updateUserRole(req.user._id, role)
    res.json({ 
      message: 'Role updated successfully',
      user 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const exists = await checkEmailExists(req.params.email)
    res.json({ available: !exists })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router