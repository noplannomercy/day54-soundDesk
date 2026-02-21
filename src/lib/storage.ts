// ============================================================
// localStorage Utility Functions
//
// All localStorage access goes through these helpers.
// Service layer (src/services/*.ts) should call these;
// components should NOT call these directly.
//
// Studio uses getObject/saveObject (single object).
// All other entities use getAll/save (array of objects).
// ============================================================

/**
 * Generate a new unique identifier using the Web Crypto API.
 * Returns a UUID v4 string.
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Retrieve all items of type T stored under the given key.
 * Returns an empty array when running on the server (SSR),
 * when the key does not exist, or when parsing fails.
 */
export function getAll<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

/**
 * Find a single item by its id within a stored array.
 * Returns undefined if the key or id is not found.
 */
export function getById<T extends { id: string }>(key: string, id: string): T | undefined {
  return getAll<T>(key).find((item) => item.id === id)
}

/**
 * Persist an array of items under the given key.
 * No-op when running on the server (SSR).
 */
export function save<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(items))
}

/**
 * Retrieve a single object stored under the given key.
 * Used for singleton entities like Studio and AppSettings.
 * Returns null when running on the server, when the key
 * does not exist, or when parsing fails.
 */
export function getObject<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Persist a single object under the given key.
 * Used for singleton entities like Studio and AppSettings.
 * No-op when running on the server (SSR).
 */
export function saveObject<T>(key: string, obj: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(obj))
}

/**
 * Remove a key and its value from localStorage.
 * No-op when running on the server (SSR).
 */
export function removeKey(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}
