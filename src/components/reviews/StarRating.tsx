'use client'

import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
}

export default function StarRating({
  value,
  onChange,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const interactive = typeof onChange === 'function'

  return (
    <div
      className={`inline-flex gap-0.5 ${sizeClasses[size]}`}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive
          ? star <= (hovered || value)
          : star <= value

        return (
          <span
            key={star}
            className={`${
              filled ? 'text-amber-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer select-none' : ''}`}
            onMouseEnter={() => interactive && setHovered(star)}
            onClick={() => interactive && onChange(star)}
            role={interactive ? 'button' : undefined}
            aria-label={interactive ? `${star}점` : undefined}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
