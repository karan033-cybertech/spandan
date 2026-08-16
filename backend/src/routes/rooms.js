import express from 'express'
import { createRoom, getRoomById, getRoomByCode, getRoomsByTeacher, getRoomsByStudent, getActiveRoomsByStudent, updateRoom, deleteRoom } from '../services/roomService.js'
import { authenticate } from '../middleware/auth.js'
import { authorize, requireApprovedTeacher } from '../middleware/auth.js'
import { validate, createRoomSchema } from '../middleware/validation.js'
import { rebuildSnapshot } from '../services/resultsSnapshot.js'
import { checkRoomOwnership, checkRoomEditor } from '../utils/roomOwnership.js'


const router = express.Router()

// Create new room
router.post('/', authenticate, authorize('teacher'), requireApprovedTeacher, validate(createRoomSchema), async (req, res) => {
  try {
    const { name, settings } = req.validatedBody
    const room = await createRoom(name, req.user._id, settings)

    res.status(201).json({
      message: 'Room created successfully',
      room
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get rooms for current teacher
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
    const skip = (pageNum - 1) * limitNum

    if (req.user.role === 'teacher') {
      const [rooms, total] = await Promise.all([
        getRoomsByTeacher(req.user._id, { skip, limit: limitNum }),
        req.user.model || Promise.resolve(null)
      ])
      // Count total rooms for teacher
      const Room = (await import('../models/Room.js')).default
      const totalCount = await Room.countDocuments({ teacher: req.user._id })
      res.json({ 
        rooms,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          pages: Math.ceil(totalCount / limitNum)
        }
      })
    } else {
      res.status(403).json({ error: 'Only teachers can view room list' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get active rooms where current teacher is a co-host
router.get('/teacher/cohost/active', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const Room = (await import('../models/Room.js')).default
    const rooms = await Room.find({
      'coHosts.userId': req.user._id,
      endedAt: null
    }).populate('teacher', 'name email').sort({ createdAt: -1 })
    res.json({ rooms })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get room history where current teacher was/is a co-host
router.get('/teacher/cohost/history', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const Room = (await import('../models/Room.js')).default
    const rooms = await Room.find({
      'coHosts.userId': req.user._id
    }).populate('teacher', 'name email').sort({ createdAt: -1 })
    res.json({ rooms })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get room by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const room = await getRoomById(req.params.id)
    const RoomMember = (await import('../models/RoomMember.js')).default
    
    // Check if user is the room owner/co-host OR a student member
    const editorAuth = checkRoomEditor(room, req.user._id)
    const isStudentMember = await RoomMember.findOne({ roomId: req.params.id, studentId: req.user._id })
    
    if (!editorAuth.ok && !isStudentMember) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Seed the live participant count so a teacher opening/refreshing the room sees the current
    // number immediately (the room:joined/room:left socket events keep it updated after load).
    const participants = await RoomMember.countDocuments({ roomId: req.params.id })

    res.json({ room, participants })
  } catch (error) {
    const status = error.message === 'Room not found' ? 404 : 500
    res.status(status).json({ error: error.message })
  }
})

// Join room by code (for students)
router.get('/join/:code', authenticate, authorize('student'), async (req, res) => {
  try {
    const RoomMember = (await import('../models/RoomMember.js')).default
    const room = await getRoomByCode(req.params.code)
    
    // Check if room has ended
    if (room.endedAt) {
      return res.status(400).json({ error: 'This room has ended and can no longer be joined' })
    }
    
    // Ensure student is added to RoomMember (idempotent - safe to call multiple times)
    await RoomMember.findOneAndUpdate(
      { roomId: room._id, studentId: req.user._id },
      { roomId: room._id, studentId: req.user._id, joinedAt: new Date() },
      { upsert: true, new: true }
    )
    
    res.json({ room })
  } catch (error) {
    const status = error.message === 'Room not found' ? 404 : 500
    res.status(status).json({ error: error.message })
  }
})

// Get rooms student has attended (for room history)
router.get('/student/room-history', authenticate, authorize('student'), async (req, res) => {
  try {
    const rooms = await getRoomsByStudent(req.user._id)
    res.json({ rooms })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get active rooms for student (rooms that can be rejoined)
router.get('/student/active', authenticate, authorize('student'), async (req, res) => {
  try {
    const rooms = await getActiveRoomsByStudent(req.user._id)
    res.json({ rooms })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update room
router.put('/:id', authenticate, authorize('teacher'), requireApprovedTeacher, async (req, res) => {
  try {
    const room = await getRoomById(req.params.id)
    
    const editorAuth = checkRoomEditor(room, req.user._id)
    if (!editorAuth.ok) {
      return res.status(editorAuth.status).json({ error: editorAuth.error })
    }

    // Owner-only operations check:
    // - Ending room (isActive = false)
    // - Updating maxCoHosts, coHostCode, coHostCodeExpiresAt, or coHosts
    const isEndingRoom = req.body.isActive === false
    const isCoHostConfigChange = req.body.maxCoHosts !== undefined || req.body.coHostCode !== undefined || req.body.coHosts !== undefined

    if (isEndingRoom || isCoHostConfigChange) {
      const ownerAuth = checkRoomOwnership(room, req.user._id)
      if (!ownerAuth.ok) {
        return res.status(ownerAuth.status).json({ error: ownerAuth.error })
      }
    }

    if (req.body.maxCoHosts !== undefined) {
      const currentCoHostsCount = Array.isArray(room.coHosts) ? room.coHosts.length : 0
      if (req.body.maxCoHosts < currentCoHostsCount) {
        return res.status(400).json({ error: `maxCoHosts cannot be set below current co-hosts count (${currentCoHostsCount})` })
      }
    }

    // Prevent reactivating an ended room
    if (room.endedAt && req.body.isActive === true) {
      return res.status(400).json({ error: 'Cannot reactivate an ended room' })
    }

    const updatedRoom = await updateRoom(req.params.id, req.body)
    
    // If room is being ended, emit socket event to notify all participants
    if (req.body.isActive === false && updatedRoom.endedAt) {
      const io = req.app.get('io')
      io.to(room.code).emit('room:ended', { roomId: room._id, endedAt: updatedRoom.endedAt })
      req.app.get('liveUpdates')?.refreshLeaderboardNow(room._id)
      rebuildSnapshot(room._id).catch((e) => console.error('[rooms] snapshot pre-warm failed:', e.message))
    }
    
    res.json({ message: 'Room updated successfully', room: updatedRoom })
  } catch (error) {
    const status = error.message === 'Room not found' ? 404 : 500
    res.status(status).json({ error: error.message })
  }
})

// Delete room
router.delete('/:id', authenticate, authorize('teacher'), requireApprovedTeacher, async (req, res) => {
  try {
    const room = await getRoomById(req.params.id)
    
    const ownerAuth = checkRoomOwnership(room, req.user._id)
    if (!ownerAuth.ok) {
      return res.status(ownerAuth.status).json({ error: ownerAuth.error })
    }

    await deleteRoom(req.params.id)
    res.json({ message: 'Room deleted successfully' })
  } catch (error) {
    const status = error.message === 'Room not found' ? 404 : 500
    res.status(status).json({ error: error.message })
  }
})

export default router