'use client'

import { useState, useEffect } from 'react'
import { Track, TrackStatus } from '@/types'
import { createTrack, updateTrack } from '@/services/trackService'
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

interface TrackFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  albumId: string
  initialData?: Track
}

const TRACK_STATUSES: { value: TrackStatus; label: string }[] = [
  { value: 'pending', label: '대기' },
  { value: 'recording', label: '녹음 중' },
  { value: 'recorded', label: '녹음 완료' },
  { value: 'mixing', label: '믹싱 중' },
  { value: 'mixed', label: '믹싱 완료' },
  { value: 'mastered', label: '마스터링 완료' },
  { value: 'final', label: '최종' },
]

export default function TrackForm({
  open,
  onOpenChange,
  onSuccess,
  albumId,
  initialData,
}: TrackFormProps) {
  const [title, setTitle] = useState('')
  const [trackNumber, setTrackNumber] = useState(1)
  const [duration, setDuration] = useState(0)
  const [bpm, setBpm] = useState('')
  const [musicalKey, setMusicalKey] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<TrackStatus>('pending')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setTrackNumber(initialData.trackNumber)
      setDuration(initialData.duration)
      setBpm(initialData.bpm != null ? String(initialData.bpm) : '')
      setMusicalKey(initialData.key ?? '')
      setNotes(initialData.notes)
      setStatus(initialData.status)
    } else {
      setTitle('')
      setTrackNumber(1)
      setDuration(0)
      setBpm('')
      setMusicalKey('')
      setNotes('')
      setStatus('pending')
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      title,
      trackNumber: Number(trackNumber),
      duration: Number(duration),
      bpm: bpm ? Number(bpm) : null,
      key: musicalKey || null,
      notes,
      status,
      albumId,
    }

    if (initialData) {
      updateTrack(initialData.id, formData)
    } else {
      createTrack(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '트랙 편집' : '트랙 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="track-title">제목</Label>
            <Input
              id="track-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="트랙 제목"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="track-number">트랙 번호</Label>
              <Input
                id="track-number"
                type="number"
                min={1}
                value={trackNumber}
                onChange={(e) => setTrackNumber(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track-duration">재생 시간 (초)</Label>
              <Input
                id="track-duration"
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="초 단위"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="track-bpm">BPM</Label>
              <Input
                id="track-bpm"
                type="number"
                min={1}
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="선택사항"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track-key">Key</Label>
              <Input
                id="track-key"
                value={musicalKey}
                onChange={(e) => setMusicalKey(e.target.value)}
                placeholder="예: C major"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="track-status">상태</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as TrackStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {TRACK_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="track-notes">메모</Label>
            <textarea
              id="track-notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="트랙에 대한 메모"
            />
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
