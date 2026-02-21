import { Track, TrackStatus, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all tracks for a given album, sorted by trackNumber ascending.
 */
export function getTracks(albumId: string): Track[] {
  return getAll<Track>(STORAGE_KEYS.TRACKS)
    .filter((t) => t.albumId === albumId)
    .sort((a, b) => a.trackNumber - b.trackNumber)
}

/**
 * Find a single track by ID.
 */
export function getTrackById(id: string): Track | undefined {
  return getById<Track>(STORAGE_KEYS.TRACKS, id)
}

/**
 * Create a new track and persist it.
 */
export function createTrack(
  data: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>
): Track {
  const now = new Date().toISOString()
  const track: Track = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const tracks = getAll<Track>(STORAGE_KEYS.TRACKS)
  tracks.push(track)
  save(STORAGE_KEYS.TRACKS, tracks)
  return track
}

/**
 * Partially update an existing track by ID.
 * Returns the updated track.
 */
export function updateTrack(
  id: string,
  data: Partial<Omit<Track, 'id' | 'createdAt'>>
): Track {
  const tracks = getAll<Track>(STORAGE_KEYS.TRACKS)
  let updated: Track | undefined

  const updatedTracks = tracks.map((track) => {
    if (track.id === id) {
      updated = { ...track, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return track
  })

  save(STORAGE_KEYS.TRACKS, updatedTracks)
  return updated!
}

/**
 * Delete a track by ID.
 */
export function deleteTrack(id: string): void {
  const tracks = getAll<Track>(STORAGE_KEYS.TRACKS)
  save(
    STORAGE_KEYS.TRACKS,
    tracks.filter((t) => t.id !== id)
  )
}

/**
 * Update only the status of a track.
 * Convenience wrapper around updateTrack.
 */
export function updateTrackStatus(id: string, status: TrackStatus): Track {
  return updateTrack(id, { status })
}
