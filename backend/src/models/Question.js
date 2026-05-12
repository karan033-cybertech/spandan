import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctOptionIndex: {
    type: Number,
    required: [true, 'Correct option index is required'],
    min: 0
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['manual', 'ai', 'upload', 'transcript'],
    default: 'manual'
  },
  timer: {
    type: Number,
    default: 30,
    min: 5,
    max: 300
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Validate options array has at least 2 options
questionSchema.pre('validate', function(next) {
  if (this.options.length < 2) {
    this.invalidate('options', 'Question must have at least 2 options')
  }
  if (this.correctOptionIndex >= this.options.length) {
    this.invalidate('correctOptionIndex', 'Correct option index is out of bounds')
  }
  next()
})

const Question = mongoose.model('Question', questionSchema)

export default Question