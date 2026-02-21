'use client'

import { useState, useEffect } from 'react'
import { Room, RoomType } from '@/types'
import { createRoom, updateRoom } from '@/services/roomService'
import { getStudio } from '@/services/studioService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RoomFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Room
}

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'recording', label: 'Recording' },
  { value: 'mixing', label: 'Mixing' },
  { value: 'mastering', label: 'Mastering' },
  { value: 'rehearsal', label: 'Rehearsal' },
]

export default function RoomForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: RoomFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<RoomType>('recording')
  const [hourlyRate, setHourlyRate] = useState(0)
  const [capacity, setCapacity] = useState(1)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setType(initialData.type)
      setHourlyRate(initialData.hourlyRate)
      setCapacity(initialData.capacity)
      setIsAvailable(initialData.isAvailable)
    } else {
      setName('')
      setType('recording')
      setHourlyRate(0)
      setCapacity(1)
      setIsAvailable(true)
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      name,
      type,
      hourlyRate,
      capacity,
      isAvailable,
    }

    if (initialData) {
      updateRoom(initialData.id, formData)
    } else {
      createRoom({
        ...formData,
        studioId: getStudio()?.id ?? '',
        equipment: '[]',
      })
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '룸 편집' : '새 룸 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">이름</Label>
            <Input
              id="room-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="룸 이름"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-type">유형</Label>
            <Select value={type} onValueChange={(v) => setType(v as RoomType)}>
              <SelectTrigger>
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-rate">시간당 요금 (원)</Label>
            <Input
              id="room-rate"
              type="number"
              min={0}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-capacity">수용 인원</Label>
            <Input
              id="room-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="room-available">이용 가능</Label>
            <Button
              id="room-available"
              type="button"
              variant={isAvailable ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAvailable(!isAvailable)}
            >
              {isAvailable ? '가능' : '불가'}
            </Button>
          </div>

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
