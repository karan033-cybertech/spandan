// Authorization decision for a socket `room:join`.
//
// The socket layer must decide whether a caller may SUBSCRIBE to a room's live
// channel (questions, counts, leaderboard, results) before doing socket.join.
// This is a pure function so it is unit-testable; it runs on the server-derived
// socket identity (role/userId), never on client-claimed fields.
//
// Model: rooms are joined by their short code (the intended UX, mirrored by the
// REST GET /rooms/join/:code). So a student with the code may join an active
// room, but a teacher may only join a room they OWN, and nobody may subscribe to
// a room that does not exist or (for students) has ended.
//
// Returns { ok: true } or { ok: false, error: '<reason>' }.
export function canJoinRoom({ role, userId, room, coHostCode, teacherApprovalStatus }) {
  if (!room) return { ok: false, error: 'Room not found' }

  // room.teacher may be a raw ObjectId or a populated user doc — handle both.
  const teacherId = String(room.teacher?._id ?? room.teacher)
  const uid = String(userId)

  if (role === 'teacher') {
    // 1. Owning teacher (Host)
    if (teacherId === uid) {
      return { ok: true, isOwner: true }
    }

    // 2. Existing Co-Host (Reconnect case)
    const isCoHost = Array.isArray(room.coHosts) && room.coHosts.some(ch => {
      const chId = String(ch.userId?._id ?? ch.userId)
      return chId === uid
    })
    if (isCoHost) {
      return { ok: true, isCoHost: true }
    }

    // 3. New Co-Host joining with code
    if (coHostCode) {
      if (teacherApprovalStatus && teacherApprovalStatus !== 'approved') {
        return { ok: false, error: 'Your teacher account is awaiting admin approval' }
      }
      if (!room.coHostCode || room.coHostCode.toUpperCase() !== String(coHostCode).trim().toUpperCase()) {
        return { ok: false, error: 'Invalid co-host join code' }
      }
      if (!room.coHostCodeExpiresAt || new Date(room.coHostCodeExpiresAt).getTime() <= Date.now()) {
        return { ok: false, error: 'Co-host join code has expired' }
      }
      const currentCoHostsCount = Array.isArray(room.coHosts) ? room.coHosts.length : 0
      const maxSlots = room.maxCoHosts ?? 0
      if (currentCoHostsCount >= maxSlots) {
        return { ok: false, error: 'Co-host slots are full for this room' }
      }
      return { ok: true, canAddCoHost: true }
    }

    return { ok: false, error: 'Not authorized for this room' }
  }

  if (role === 'student') {
    return room.endedAt
      ? { ok: false, error: 'This room has ended' }
      : { ok: true }
  }

  return { ok: false, error: 'Not authorized' }
}

