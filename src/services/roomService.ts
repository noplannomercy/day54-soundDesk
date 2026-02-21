import { Room, RoomType, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all rooms, optionally filtered by type and/or availability.
 */
export function getRooms(filters?: {
  type?: RoomType
  isAvailable?: boolean
}): Room[] {
  let rooms = getAll<Room>(STORAGE_KEYS.ROOMS)

  if (filters?.type) {
    rooms = rooms.filter((r) => r.type === filters.type)
  }
  if (filters?.isAvailable !== undefined) {
    rooms = rooms.filter((r) => r.isAvailable === filters.isAvailable)
  }

  return rooms
}

/**
 * Find a single room by its ID.
 */
export function getRoomById(id: string): Room | undefined {
  return getById<Room>(STORAGE_KEYS.ROOMS, id)
}

/**
 * Create a new room and persist it.
 */
export function createRoom(
  data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>
): Room {
  const now = new Date().toISOString()
  const room: Room = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const rooms = getAll<Room>(STORAGE_KEYS.ROOMS)
  rooms.push(room)
  save(STORAGE_KEYS.ROOMS, rooms)
  return room
}

/**
 * Partially update an existing room by ID.
 * Returns the updated room.
 */
export function updateRoom(
  id: string,
  data: Partial<Omit<Room, 'id' | 'createdAt'>>
): Room {
  const rooms = getAll<Room>(STORAGE_KEYS.ROOMS)
  let updated: Room | undefined

  const updatedRooms = rooms.map((room) => {
    if (room.id === id) {
      updated = { ...room, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return room
  })

  save(STORAGE_KEYS.ROOMS, updatedRooms)
  return updated!
}

/**
 * Delete a room by ID.
 */
export function deleteRoom(id: string): void {
  const rooms = getAll<Room>(STORAGE_KEYS.ROOMS)
  save(
    STORAGE_KEYS.ROOMS,
    rooms.filter((r) => r.id !== id)
  )
}
