'use client'

import { Tag } from '@/types'
import { X } from 'lucide-react'

interface TagBadgeProps {
  tag: Tag
  onRemove?: () => void
}

/**
 * Compute relative luminance from a hex color string (#RRGGBB).
 * Returns true if the color is dark enough to warrant white text.
 */
function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // ITU-R BT.709 luminance formula
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance < 0.5
}

export default function TagBadge({ tag, onRemove }: TagBadgeProps) {
  const textColor = isDarkColor(tag.color) ? '#ffffff' : '#1e293b'

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: tag.color, color: textColor }}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 inline-flex items-center rounded-full p-0.5 hover:opacity-70 transition-opacity"
          style={{ color: textColor }}
          aria-label={`${tag.name} 태그 제거`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
