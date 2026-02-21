'use client'

import { useState, useEffect } from 'react'
import { Tag } from '@/types'
import { createTag, updateTag } from '@/services/tagService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TagFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Tag
}

export default function TagForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: TagFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3b82f6')

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name)
        setColor(initialData.color)
      } else {
        setName('')
        setColor('#3b82f6')
      }
    }
  }, [open, initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    if (initialData) {
      updateTag(initialData.id, { name: trimmedName, color })
    } else {
      createTag({ name: trimmedName, color })
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '태그 수정' : '새 태그 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">태그 이름</Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="태그 이름을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag-color">색상</Label>
            <div className="flex items-center gap-3">
              <input
                id="tag-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border p-1"
              />
              <span className="text-sm text-muted-foreground">{color}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit">
              {initialData ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
