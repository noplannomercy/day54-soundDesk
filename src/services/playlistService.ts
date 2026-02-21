import { Playlist, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all playlists.
 */
export function getPlaylists(): Playlist[] {
  return getAll<Playlist>(STORAGE_KEYS.PLAYLISTS)
}

/**
 * Find a single playlist by ID.
 */
export function getPlaylistById(id: string): Playlist | undefined {
  return getById<Playlist>(STORAGE_KEYS.PLAYLISTS, id)
}

/**
 * Create a new playlist and persist it.
 */
export function createPlaylist(
  data: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>
): Playlist {
  const now = new Date().toISOString()
  const playlist: Playlist = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const playlists = getAll<Playlist>(STORAGE_KEYS.PLAYLISTS)
  playlists.push(playlist)
  save(STORAGE_KEYS.PLAYLISTS, playlists)
  return playlist
}

/**
 * Partially update an existing playlist by ID.
 * Returns the updated playlist.
 */
export function updatePlaylist(
  id: string,
  data: Partial<Omit<Playlist, 'id' | 'createdAt'>>
): Playlist {
  const playlists = getAll<Playlist>(STORAGE_KEYS.PLAYLISTS)
  let updated: Playlist | undefined

  const updatedPlaylists = playlists.map((playlist) => {
    if (playlist.id === id) {
      updated = { ...playlist, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return playlist
  })

  save(STORAGE_KEYS.PLAYLISTS, updatedPlaylists)
  return updated!
}

/**
 * Delete a playlist by ID.
 */
export function deletePlaylist(id: string): void {
  const playlists = getAll<Playlist>(STORAGE_KEYS.PLAYLISTS)
  save(
    STORAGE_KEYS.PLAYLISTS,
    playlists.filter((p) => p.id !== id)
  )
}
