'use client'

import { useState, useEffect, useRef } from 'react'
import { EntityType, Tag } from '@/types'
import {
  getTags,
  getEntityTags,
  addTagToEntity,
  removeTagFromEntity,
} from '@/services/tagService'
import TagBadge from '@/components/tags/TagBadge'
import { Input } from '@/components/ui/input'

interface TagSelectorProps {
  entityType: EntityType
  entityId: string
  onTagsChanged?: () => void
}

export default function TagSelector({
  entityType,
  entityId,
  onTagsChanged,
}: TagSelectorProps) {
  const [assignedTags, setAssignedTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function loadTags() {
    setAssignedTags(getEntityTags(entityType, entityId))
    setAllTags(getTags())
  }

  useEffect(() => {
    loadTags()
  }, [entityType, entityId])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const assignedIds = new Set(assignedTags.map((t) => t.id))

  const availableTags = allTags.filter(
    (t) =>
      !assignedIds.has(t.id) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(tagId: string) {
    addTagToEntity(entityType, entityId, tagId)
    setSearch('')
    setDropdownOpen(false)
    loadTags()
    onTagsChanged?.()
  }

  function handleRemove(tagId: string) {
    removeTagFromEntity(entityType, entityId, tagId)
    loadTags()
    onTagsChanged?.()
  }

  return (
    <div className="space-y-3">
      {assignedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {assignedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => handleRemove(tag.id)}
            />
          ))}
        </div>
      )}

      <div className="relative" ref={containerRef}>
        <Input
          placeholder="태그 검색..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setDropdownOpen(true)
          }}
          onFocus={() => setDropdownOpen(true)}
          className="h-8 text-sm"
        />
        {dropdownOpen && availableTags.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleAdd(tag.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
              >
                <span
                  className="inline-block h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            ))}
          </div>
        )}
        {dropdownOpen && search && availableTags.length === 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
            <p className="px-3 py-2 text-sm text-muted-foreground">
              일치하는 태그가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
