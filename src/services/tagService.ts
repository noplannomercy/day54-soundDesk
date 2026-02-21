import { Tag, EntityTag, EntityType, STORAGE_KEYS } from '@/types'
import { getAll, save, generateId } from '@/lib/storage'

/**
 * Retrieve all tags.
 */
export function getTags(): Tag[] {
  return getAll<Tag>(STORAGE_KEYS.TAGS)
}

/**
 * Find a single tag by ID.
 */
export function getTagById(id: string): Tag | undefined {
  return getAll<Tag>(STORAGE_KEYS.TAGS).find((t) => t.id === id)
}

/**
 * Create a new tag and persist it.
 */
export function createTag(data: Omit<Tag, 'id' | 'createdAt'>): Tag {
  const now = new Date().toISOString()
  const tag: Tag = {
    ...data,
    id: generateId(),
    createdAt: now,
  }
  const tags = getAll<Tag>(STORAGE_KEYS.TAGS)
  tags.push(tag)
  save(STORAGE_KEYS.TAGS, tags)
  return tag
}

/**
 * Partially update an existing tag by ID.
 * Returns the updated tag.
 */
export function updateTag(
  id: string,
  data: Partial<Omit<Tag, 'id' | 'createdAt'>>
): Tag {
  const tags = getAll<Tag>(STORAGE_KEYS.TAGS)
  let updated: Tag | undefined

  const updatedTags = tags.map((tag) => {
    if (tag.id === id) {
      updated = { ...tag, ...data }
      return updated
    }
    return tag
  })

  save(STORAGE_KEYS.TAGS, updatedTags)
  return updated!
}

/**
 * Delete a tag by ID. Also removes all associated EntityTag entries.
 */
export function deleteTag(id: string): void {
  const tags = getAll<Tag>(STORAGE_KEYS.TAGS)
  save(STORAGE_KEYS.TAGS, tags.filter((t) => t.id !== id))

  // Clean up bridge table entries referencing this tag
  const entityTags = getAll<EntityTag>(STORAGE_KEYS.ENTITY_TAGS)
  save(STORAGE_KEYS.ENTITY_TAGS, entityTags.filter((et) => et.tagId !== id))
}

/**
 * Associate a tag with an entity. Prevents duplicate associations.
 */
export function addTagToEntity(
  entityType: EntityType,
  entityId: string,
  tagId: string
): EntityTag {
  const entityTags = getAll<EntityTag>(STORAGE_KEYS.ENTITY_TAGS)

  // Prevent duplicate associations
  const existing = entityTags.find(
    (et) =>
      et.entityType === entityType &&
      et.entityId === entityId &&
      et.tagId === tagId
  )
  if (existing) return existing

  const entityTag: EntityTag = {
    id: generateId(),
    entityType,
    entityId,
    tagId,
  }
  entityTags.push(entityTag)
  save(STORAGE_KEYS.ENTITY_TAGS, entityTags)
  return entityTag
}

/**
 * Remove a tag association from an entity.
 */
export function removeTagFromEntity(
  entityType: EntityType,
  entityId: string,
  tagId: string
): void {
  const entityTags = getAll<EntityTag>(STORAGE_KEYS.ENTITY_TAGS)
  save(
    STORAGE_KEYS.ENTITY_TAGS,
    entityTags.filter(
      (et) =>
        !(
          et.entityType === entityType &&
          et.entityId === entityId &&
          et.tagId === tagId
        )
    )
  )
}

/**
 * Get all Tag objects associated with a specific entity.
 * Joins EntityTag bridge records with the Tags collection.
 */
export function getEntityTags(
  entityType: EntityType,
  entityId: string
): Tag[] {
  const entityTags = getAll<EntityTag>(STORAGE_KEYS.ENTITY_TAGS)
  const tags = getAll<Tag>(STORAGE_KEYS.TAGS)

  const tagIds = entityTags
    .filter((et) => et.entityType === entityType && et.entityId === entityId)
    .map((et) => et.tagId)

  return tags.filter((t) => tagIds.includes(t.id))
}

/**
 * Count how many entities are associated with a given tag.
 */
export function getTagEntityCount(tagId: string): number {
  const entityTags = getAll<EntityTag>(STORAGE_KEYS.ENTITY_TAGS)
  return entityTags.filter((et) => et.tagId === tagId).length
}
