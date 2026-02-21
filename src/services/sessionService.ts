import { Session, SessionStatus, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all sessions, optionally filtered by room, artist, engineer, status,
 * and/or date range.
 */
export function getSessions(filters?: {
  roomId?: string
  artistId?: string
  engineerId?: string
  status?: SessionStatus
  dateFrom?: string
  dateTo?: string
}): Session[] {
  let sessions = getAll<Session>(STORAGE_KEYS.SESSIONS)

  if (filters?.roomId) {
    sessions = sessions.filter((s) => s.roomId === filters.roomId)
  }

  if (filters?.artistId) {
    sessions = sessions.filter((s) => s.artistId === filters.artistId)
  }

  if (filters?.engineerId) {
    sessions = sessions.filter((s) => s.engineerId === filters.engineerId)
  }

  if (filters?.status) {
    sessions = sessions.filter((s) => s.status === filters.status)
  }

  if (filters?.dateFrom) {
    sessions = sessions.filter((s) => s.date >= filters.dateFrom!)
  }

  if (filters?.dateTo) {
    sessions = sessions.filter((s) => s.date <= filters.dateTo!)
  }

  return sessions
}

/**
 * Find a single session by its ID.
 */
export function getSessionById(id: string): Session | undefined {
  return getById<Session>(STORAGE_KEYS.SESSIONS, id)
}

/**
 * Check whether a room is available for the given date and time range.
 * Returns an array of conflicting sessions (empty if no conflicts).
 *
 * Conflict condition: same roomId + same date + time overlap + status !== 'cancelled'.
 * Time overlap: existing.startTime < endTime && existing.endTime > startTime.
 *
 * @param excludeSessionId - Exclude this session from conflict check (used for updates).
 */
export function checkRoomAvailability(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeSessionId?: string
): Session[] {
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS)

  return sessions.filter((s) => {
    if (s.roomId !== roomId) return false
    if (s.date !== date) return false
    if (s.status === 'cancelled') return false
    if (excludeSessionId && s.id === excludeSessionId) return false

    // Time overlap: the two ranges [startTime, endTime) and [s.startTime, s.endTime) overlap
    // when s.startTime < endTime AND s.endTime > startTime
    return s.startTime < endTime && s.endTime > startTime
  })
}

/**
 * Create a new session and persist it.
 * Throws an Error if the room is already booked for the requested time slot.
 */
export function createSession(
  data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>
): Session {
  const conflicts = checkRoomAvailability(
    data.roomId,
    data.date,
    data.startTime,
    data.endTime
  )

  if (conflicts.length > 0) {
    throw new Error('Room is already booked for this time slot')
  }

  const now = new Date().toISOString()
  const session: Session = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS)
  sessions.push(session)
  save(STORAGE_KEYS.SESSIONS, sessions)
  return session
}

/**
 * Partially update an existing session by ID.
 * Throws an Error if the updated time slot conflicts with another booking.
 * Returns the updated session.
 */
export function updateSession(
  id: string,
  data: Partial<Omit<Session, 'id' | 'createdAt'>>
): Session {
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS)
  const existing = sessions.find((s) => s.id === id)

  if (!existing) {
    throw new Error('Session not found')
  }

  // Build the merged state to check availability against
  const merged = { ...existing, ...data }

  const conflicts = checkRoomAvailability(
    merged.roomId,
    merged.date,
    merged.startTime,
    merged.endTime,
    id
  )

  if (conflicts.length > 0) {
    throw new Error('Room is already booked for this time slot')
  }

  let updated: Session | undefined

  const updatedSessions = sessions.map((session) => {
    if (session.id === id) {
      updated = { ...session, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return session
  })

  save(STORAGE_KEYS.SESSIONS, updatedSessions)
  return updated!
}

/**
 * Delete a session by ID.
 */
export function deleteSession(id: string): void {
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS)
  save(
    STORAGE_KEYS.SESSIONS,
    sessions.filter((s) => s.id !== id)
  )
}

/**
 * Update only the status of a session.
 * Convenience wrapper around updateSession that bypasses room availability
 * check (status changes do not alter time slot).
 */
export function updateSessionStatus(id: string, status: SessionStatus): Session {
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS)
  let updated: Session | undefined

  const updatedSessions = sessions.map((session) => {
    if (session.id === id) {
      updated = { ...session, status, updatedAt: new Date().toISOString() }
      return updated
    }
    return session
  })

  save(STORAGE_KEYS.SESSIONS, updatedSessions)
  return updated!
}
