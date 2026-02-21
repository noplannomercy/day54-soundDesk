'use client'

import { useState, useEffect } from 'react'
import { Review, Session, Artist } from '@/types'
import { getArtists } from '@/services/artistService'
import { getSessions } from '@/services/sessionService'
import { createReview, updateReview } from '@/services/reviewService'
import StarRating from '@/components/reviews/StarRating'
import { Button } from '@/components/ui/button'
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

interface ReviewFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Review
  /** Pre-select the artist (used from artist detail page) */
  preselectedArtistId?: string
}

export default function ReviewForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
  preselectedArtistId,
}: ReviewFormProps) {
  const [artistId, setArtistId] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const [artists, setArtists] = useState<Artist[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  // Load artists list once when dialog opens
  useEffect(() => {
    if (open) {
      setArtists(getArtists())
    }
  }, [open])

  // Populate form fields from initialData or preselectedArtistId
  useEffect(() => {
    if (initialData) {
      setArtistId(initialData.artistId)
      setSessionId(initialData.sessionId)
      setRating(initialData.rating)
      setComment(initialData.comment)
    } else {
      setArtistId(preselectedArtistId ?? '')
      setSessionId(null)
      setRating(5)
      setComment('')
    }
  }, [initialData, preselectedArtistId])

  // Load sessions when artistId changes
  useEffect(() => {
    if (artistId) {
      setSessions(getSessions({ artistId }))
    } else {
      setSessions([])
    }
  }, [artistId])

  function handleArtistChange(value: string) {
    setArtistId(value)
    setSessionId(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!artistId) return

    const formData = {
      artistId,
      sessionId,
      rating,
      comment,
    }

    if (initialData) {
      updateReview(initialData.id, formData)
    } else {
      createReview(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '리뷰 편집' : '새 리뷰 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="review-artist">아티스트</Label>
            <Select value={artistId} onValueChange={handleArtistChange}>
              <SelectTrigger id="review-artist">
                <SelectValue placeholder="아티스트 선택" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-session">세션 (선택사항)</Label>
            <Select
              value={sessionId ?? 'none'}
              onValueChange={(v) => setSessionId(v === 'none' ? null : v)}
            >
              <SelectTrigger id="review-session">
                <SelectValue placeholder="세션 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.date} ({s.startTime} - {s.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>평점</Label>
            <div>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment">코멘트</Label>
            <textarea
              id="review-comment"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="리뷰 내용을 입력하세요"
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
            <Button type="submit" disabled={!artistId}>
              {initialData ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
