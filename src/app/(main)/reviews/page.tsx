'use client'

import { useState, useEffect, useMemo } from 'react'
import { Review, Artist, Session } from '@/types'
import { getReviews, deleteReview } from '@/services/reviewService'
import { getArtists } from '@/services/artistService'
import { getSessionById } from '@/services/sessionService'
import MainLayout from '@/components/layout/MainLayout'
import ReviewForm from '@/components/reviews/ReviewForm'
import StarRating from '@/components/reviews/StarRating'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [filterArtistId, setFilterArtistId] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | undefined>()

  function loadData() {
    const filters: { artistId?: string; rating?: number } = {}
    if (filterArtistId) filters.artistId = filterArtistId
    if (filterRating) filters.rating = Number(filterRating)
    setReviews(getReviews(filters))
    setArtists(getArtists())
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterArtistId, filterRating])

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  const artistMap = useMemo(() => {
    const map = new Map<string, string>()
    artists.forEach((a) => map.set(a.id, a.name))
    return map
  }, [artists])

  function getSessionDate(sessionId: string | null): string | null {
    if (!sessionId) return null
    const session: Session | undefined = getSessionById(sessionId)
    return session ? session.date : null
  }

  function handleEdit(review: Review) {
    setEditingReview(review)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteReview(id)
    loadData()
  }

  function handleFormSuccess() {
    setEditingReview(undefined)
    loadData()
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditingReview(undefined)
    }
  }

  return (
    <MainLayout title="리뷰 관리">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">리뷰 관리</h1>
            {reviews.length > 0 && (
              <p className="mt-1 text-muted-foreground">
                평균 평점: {averageRating} ★ ({reviews.length}개 리뷰)
              </p>
            )}
          </div>
          <Button onClick={() => setFormOpen(true)}>새 리뷰 추가</Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="w-48">
            <Select
              value={filterArtistId || 'all'}
              onValueChange={(v) => setFilterArtistId(v === 'all' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="아티스트 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 아티스트</SelectItem>
                {artists.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-36">
            <Select
              value={filterRating || 'all'}
              onValueChange={(v) => setFilterRating(v === 'all' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="평점 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 평점</SelectItem>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r}점
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Review cards */}
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">리뷰가 없습니다.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => {
              const sessionDate = getSessionDate(review.sessionId)
              return (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {artistMap.get(review.artistId) ?? '알 수 없는 아티스트'}
                        </p>
                        <StarRating value={review.rating} size="sm" />
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(review)}
                        >
                          편집
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              삭제
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(review.id)}
                              >
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      {sessionDate && <span>세션: {sessionDate}</span>}
                      <span>
                        {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <ReviewForm
          open={formOpen}
          onOpenChange={handleFormOpenChange}
          onSuccess={handleFormSuccess}
          initialData={editingReview}
        />
      </div>
    </MainLayout>
  )
}
