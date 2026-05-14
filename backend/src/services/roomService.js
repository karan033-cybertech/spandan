import Room from '../models/Room.js'
import Question from '../models/Question.js'

export const createRoom = async (name, teacherId, settings = {}) => {
  const room = new Room({
    name,
    teacher: teacherId,
    settings
  })

  await room.save()
  return room
}

export const getRoomById = async (id) => {
  const room = await Room.findById(id).populate('teacher', 'name email')
  if (!room) {
    throw new Error('Room not found')
  }
  return room
}

export const getRoomByCode = async (code) => {
  const room = await Room.findOne({ code: code.toUpperCase() }).populate('teacher', 'name email')
  if (!room) {
    throw new Error('Room not found')
  }
  return room
}

export const getRoomsByTeacher = async (teacherId) => {
  const rooms = await Room.find({ teacher: teacherId }).sort({ createdAt: -1 })
  
  // Get question counts for each room
  const roomIds = rooms.map(r => r._id)
  const questionCounts = await Question.aggregate([
    { $match: { roomId: { $in: roomIds } } },
    { $group: { _id: '$roomId', count: { $sum: 1 } } }
  ])
  
  const countMap = new Map(questionCounts.map(q => [q._id.toString(), q.count]))
  
  // Attach questionCount to each room
  return rooms.map(room => ({
    ...room.toObject(),
    questionCount: countMap.get(room._id.toString()) || 0
  }))
}

export const updateRoom = async (roomId, updates) => {
  const room = await Room.findByIdAndUpdate(
    roomId,
    { $set: updates },
    { new: true, runValidators: true }
  )
  
  if (!room) {
    throw new Error('Room not found')
  }
  
  return room
}

export const deleteRoom = async (roomId) => {
  const room = await Room.findByIdAndDelete(roomId)
  if (!room) {
    throw new Error('Room not found')
  }
  return room
}

export const setCurrentQuestion = async (roomId, questionId) => {
  const room = await Room.findByIdAndUpdate(
    roomId,
    { $set: { currentQuestion: questionId } },
    { new: true }
  )
  
  if (!room) {
    throw new Error('Room not found')
  }
  
  return room
}

export const deactivateRoom = async (roomId) => {
  const room = await Room.findByIdAndUpdate(
    roomId,
    { $set: { isActive: false, endedAt: new Date() } },
    { new: true, runValidators: true }
  )
  
  if (!room) {
    throw new Error('Room not found')
  }
  
  return room
}