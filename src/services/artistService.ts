import { Artist, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all artists, optionally filtered by genre and/or search term.
 * Search matches against name or label (case-insensitive).
 */
export function getArtists(filters?: {
  genre?: string
  search?: string
}): Artist[] {
  let artists = getAll<Artist>(STORAGE_KEYS.ARTISTS)

  if (filters?.search) {
    const term = filters.search.toLowerCase()
    artists = artists.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.label.toLowerCase().includes(term)
    )
  }

  if (filters?.genre) {
    artists = artists.filter((a) => a.genre === filters.genre)
  }

  return artists
}

/**
 * Find a single artist by ID.
 */
export function getArtistById(id: string): Artist | undefined {
  return getById<Artist>(STORAGE_KEYS.ARTISTS, id)
}

/**
 * Create a new artist and persist it.
 */
export function createArtist(
  data: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>
): Artist {
  const now = new Date().toISOString()
  const artist: Artist = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const artists = getAll<Artist>(STORAGE_KEYS.ARTISTS)
  artists.push(artist)
  save(STORAGE_KEYS.ARTISTS, artists)
  return artist
}

/**
 * Partially update an existing artist by ID.
 * Returns the updated artist.
 */
export function updateArtist(
  id: string,
  data: Partial<Omit<Artist, 'id' | 'createdAt'>>
): Artist {
  const artists = getAll<Artist>(STORAGE_KEYS.ARTISTS)
  let updated: Artist | undefined

  const updatedArtists = artists.map((artist) => {
    if (artist.id === id) {
      updated = { ...artist, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return artist
  })

  save(STORAGE_KEYS.ARTISTS, updatedArtists)
  return updated!
}

/**
 * Delete an artist by ID.
 */
export function deleteArtist(id: string): void {
  const artists = getAll<Artist>(STORAGE_KEYS.ARTISTS)
  save(
    STORAGE_KEYS.ARTISTS,
    artists.filter((a) => a.id !== id)
  )
}
