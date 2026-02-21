import { Equipment, EquipmentCategory, EquipmentCondition, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'

/**
 * Retrieve all equipment, optionally filtered by category, condition,
 * roomId (location), and/or availability.
 */
export function getEquipment(filters?: {
  category?: EquipmentCategory
  condition?: EquipmentCondition
  roomId?: string | null
  isAvailable?: boolean
}): Equipment[] {
  let equipment = getAll<Equipment>(STORAGE_KEYS.EQUIPMENT)

  if (filters?.category) {
    equipment = equipment.filter((e) => e.category === filters.category)
  }

  if (filters?.condition) {
    equipment = equipment.filter((e) => e.condition === filters.condition)
  }

  if (filters?.roomId !== undefined) {
    equipment = equipment.filter((e) => e.location === filters.roomId)
  }

  if (filters?.isAvailable !== undefined) {
    equipment = equipment.filter((e) => e.isAvailable === filters.isAvailable)
  }

  return equipment
}

/**
 * Find a single equipment item by ID.
 */
export function getEquipmentById(id: string): Equipment | undefined {
  return getById<Equipment>(STORAGE_KEYS.EQUIPMENT, id)
}

/**
 * Create a new equipment item and persist it.
 */
export function createEquipment(
  data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>
): Equipment {
  const now = new Date().toISOString()
  const equipment: Equipment = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const items = getAll<Equipment>(STORAGE_KEYS.EQUIPMENT)
  items.push(equipment)
  save(STORAGE_KEYS.EQUIPMENT, items)
  return equipment
}

/**
 * Partially update an existing equipment item by ID.
 * Returns the updated equipment.
 */
export function updateEquipment(
  id: string,
  data: Partial<Omit<Equipment, 'id' | 'createdAt'>>
): Equipment {
  const items = getAll<Equipment>(STORAGE_KEYS.EQUIPMENT)
  let updated: Equipment | undefined

  const updatedItems = items.map((item) => {
    if (item.id === id) {
      updated = { ...item, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return item
  })

  save(STORAGE_KEYS.EQUIPMENT, updatedItems)
  return updated!
}

/**
 * Delete an equipment item by ID.
 */
export function deleteEquipment(id: string): void {
  const items = getAll<Equipment>(STORAGE_KEYS.EQUIPMENT)
  save(
    STORAGE_KEYS.EQUIPMENT,
    items.filter((e) => e.id !== id)
  )
}
