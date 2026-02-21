import { Studio, STORAGE_KEYS } from '@/types'
import { getObject, saveObject, removeKey, generateId } from '@/lib/storage'

/**
 * Retrieve the singleton Studio object.
 * Returns null if no studio has been created yet.
 */
export function getStudio(): Studio | null {
  return getObject<Studio>(STORAGE_KEYS.STUDIO)
}

/**
 * Create a new studio. Overwrites any existing studio record.
 */
export function createStudio(
  data: Omit<Studio, 'id' | 'createdAt' | 'updatedAt'>
): Studio {
  const now = new Date().toISOString()
  const studio: Studio = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  saveObject(STORAGE_KEYS.STUDIO, studio)
  return studio
}

/**
 * Partially update the existing studio.
 * Returns the updated studio, or null if no studio exists to update.
 */
export function updateStudio(
  data: Partial<Omit<Studio, 'id' | 'createdAt'>>
): Studio | null {
  const existing = getStudio()
  if (!existing) return null

  const updated: Studio = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveObject(STORAGE_KEYS.STUDIO, updated)
  return updated
}

/**
 * Delete the studio record from localStorage.
 */
export function deleteStudio(): void {
  removeKey(STORAGE_KEYS.STUDIO)
}
