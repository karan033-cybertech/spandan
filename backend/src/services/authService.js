import User from '../models/User.js'

export const register = async (name, email, password, role) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new Error('Email already registered')
  }

  // Create new user
  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role
  })

  await user.save()
  return user
}

export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  return user
}

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const getUserByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase() }).select('-password')
}

export const updatePassword = async (userId, newPassword) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  user.password = newPassword
  await user.save()
  return true
}

export const checkEmailExists = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  return !!user
}
export const updateUserRole = async (userId, role) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  
  user.role = role
  await user.save()
  return user
}
