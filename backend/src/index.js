import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Import routes
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'

// Import models for reference
import './models/index.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}))
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '0.2.0',
    timestamp: new Date().toISOString() 
  })
})

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Join room
  socket.on('room:join', (roomCode) => {
    socket.join(roomCode)
    console.log(`Client ${socket.id} joined room ${roomCode}`)
    io.to(roomCode).emit('room:joined', { roomCode })
  })

  // Leave room
  socket.on('room:leave', (roomCode) => {
    socket.leave(roomCode)
    console.log(`Client ${socket.id} left room ${roomCode}`)
  })

  // Submit response
  socket.on('response:submit', (data) => {
    io.to(data.roomCode).emit('response:new', data)
  })

  // Question events
  socket.on('question:start', (data) => {
    io.to(data.roomCode).emit('question:started', data)
  })

  socket.on('question:end', (data) => {
    io.to(data.roomCode).emit('question:ended', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spandan'
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })
    
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    console.log('Server will continue without database connection')
  }
}

const PORT = process.env.PORT || 3001

// Start server
const startServer = async () => {
  await connectDB()
  
  httpServer.listen(PORT, () => {
    console.log(`Spandan backend v0.2 running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer().catch(console.error)

export { app, io }