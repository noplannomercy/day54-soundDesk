'use client'

import { useEffect } from 'react'
import { initializeSeedData } from '@/lib/seed'

export default function MainGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initializeSeedData()
  }, [])

  return <>{children}</>
}
