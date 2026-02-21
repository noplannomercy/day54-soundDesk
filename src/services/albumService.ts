import { Album, AlbumStatus, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all albums, optionally filtered by status, genre, and/or artistId.
 */
export function getAlbums(filters?: {
  status?: AlbumStatus
  genre?: string
  artistId?: string
}): Album[] {
  let albums = getAll<Album>(STORAGE_KEYS.ALBUMS)

  if (filters?.status) {
    albums = albums.filter((a) => a.status === filters.status)
  }

  if (filters?.genre) {
    albums = albums.filter((a) => a.genre === filters.genre)
  }

  if (filters?.artistId) {
    albums = albums.filter((a) => a.artistId === filters.artistId)
  }

  return albums
}

/**
 * Find a single album by ID.
 */
export function getAlbumById(id: string): Album | undefined {
  return getById<Album>(STORAGE_KEYS.ALBUMS, id)
}

/**
 * Create a new album and persist it.
 */
export function createAlbum(
  data: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>
): Album {
  const now = new Date().toISOString()
  const album: Album = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const albums = getAll<Album>(STORAGE_KEYS.ALBUMS)
  albums.push(album)
  save(STORAGE_KEYS.ALBUMS, albums)
  return album
}

/**
 * Partially update an existing album by ID.
 * Returns the updated album.
 */
export function updateAlbum(
  id: string,
  data: Partial<Omit<Album, 'id' | 'createdAt'>>
): Album {
  const albums = getAll<Album>(STORAGE_KEYS.ALBUMS)
  let updated: Album | undefined

  const updatedAlbums = albums.map((album) => {
    if (album.id === id) {
      updated = { ...album, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return album
  })

  save(STORAGE_KEYS.ALBUMS, updatedAlbums)
  return updated!
}

/**
 * Delete an album by ID.
 */
export function deleteAlbum(id: string): void {
  const albums = getAll<Album>(STORAGE_KEYS.ALBUMS)
  save(
    STORAGE_KEYS.ALBUMS,
    albums.filter((a) => a.id !== id)
  )
}

/**
 * Update only the status of an album.
 * Convenience wrapper around updateAlbum.
 */
export function updateAlbumStatus(id: string, status: AlbumStatus): Album {
  return updateAlbum(id, { status })
}
