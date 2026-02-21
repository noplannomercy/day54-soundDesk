'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Artist, Album, Session, Invoice, Contract, Review, InvoiceStatus, ContractStatus, ContractType } from '@/types'
import { getArtistById, deleteArtist } from '@/services/artistService'
import { getAlbums } from '@/services/albumService'
import { getSessions } from '@/services/sessionService'
import { getInvoices } from '@/services/invoiceService'
import { getContracts } from '@/services/contractService'
import { getReviews, deleteReview } from '@/services/reviewService'
import { getRoomById } from '@/services/roomService'
import MainLayout from '@/components/layout/MainLayout'
import ArtistForm from '@/components/artists/ArtistForm'
import ReviewForm from '@/components/reviews/ReviewForm'
import StarRating from '@/components/reviews/StarRating'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

function getInvoiceStatusBadgeClass(status: InvoiceStatus): string {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800'
    case 'sent': return 'bg-blue-100 text-blue-800'
    case 'paid': return 'bg-green-100 text-green-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    case 'cancelled': return 'bg-gray-100 text-gray-500'
  }
}

function getInvoiceStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: '초안', sent: '발송됨', paid: '결제 완료',
    overdue: '기한 초과', cancelled: '취소됨',
  }
  return labels[status]
}

function getContractTypeBadgeClass(type: ContractType): string {
  switch (type) {
    case 'session': return 'bg-blue-100 text-blue-800'
    case 'album': return 'bg-purple-100 text-purple-800'
    case 'retainer': return 'bg-yellow-100 text-yellow-800'
  }
}

function getContractStatusLabel(status: ContractStatus): string {
  const labels: Record<ContractStatus, string> = {
    draft: '초안', active: '활성', completed: '완료', terminated: '종료',
  }
  return labels[status]
}

export default function ArtistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [artist, setArtist] = useState<Artist | null>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)

  function loadData() {
    const found = getArtistById(id)
    setArtist(found ?? null)
    if (found) {
      setAlbums(getAlbums({ artistId: id }))
      setSessions(getSessions({ artistId: id }))
      setInvoices(getInvoices({ artistId: id }))
      setContracts(getContracts({ artistId: id }))
      setReviews(getReviews({ artistId: id }))
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleDelete() {
    deleteArtist(id)
    router.push('/artists')
  }

  function handleFormSuccess() {
    loadData()
    setFormOpen(false)
  }

  function getRoomName(roomId: string): string {
    const room = getRoomById(roomId)
    return room?.name ?? '알 수 없는 룸'
  }

  function formatKRW(amount: number): string {
    return amount.toLocaleString('ko-KR') + '원'
  }

  if (!artist) {
    return (
      <MainLayout title="아티스트 상세">
        <p className="text-muted-foreground">아티스트를 찾을 수 없습니다.</p>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={artist.name}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {artist.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-semibold">{artist.name}</p>
                  <Badge variant="secondary">{artist.genre}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setFormOpen(true)}>
                  편집
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>아티스트 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        &quot;{artist.name}&quot;을(를) 삭제하시겠습니까? 이
                        작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">레이블:</span> {artist.label}
            </p>
            <p>
              <span className="font-medium">이메일:</span> {artist.email}
            </p>
            <p>
              <span className="font-medium">전화번호:</span> {artist.phone}
            </p>
            {artist.bio && (
              <p>
                <span className="font-medium">소개:</span> {artist.bio}
              </p>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="albums" className="mt-6">
          <TabsList>
            <TabsTrigger value="albums">앨범</TabsTrigger>
            <TabsTrigger value="sessions">세션</TabsTrigger>
            <TabsTrigger value="invoices">인보이스</TabsTrigger>
            <TabsTrigger value="contracts">계약</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>

          <TabsContent value="albums">
            {albums.length === 0 ? (
              <p className="text-muted-foreground">앨범이 없습니다.</p>
            ) : (
              albums.map((album) => (
                <div key={album.id} className="mb-2 rounded border p-4">
                  <span className="font-medium">{album.title}</span>{' '}
                  <Badge variant="outline">{album.status}</Badge>
                  {album.genre && (
                    <Badge variant="secondary" className="ml-2">
                      {album.genre}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="sessions">
            {sessions.length === 0 ? (
              <p className="text-muted-foreground">세션 없음</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="rounded border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{session.date}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                      <Badge variant="outline">{session.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getRoomName(session.roomId)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invoices">
            {invoices.length === 0 ? (
              <p className="text-muted-foreground">인보이스 없음</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">합계</TableHead>
                    <TableHead>기한</TableHead>
                    <TableHead>생성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getInvoiceStatusBadgeClass(inv.status)}
                        >
                          {getInvoiceStatusLabel(inv.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatKRW(inv.total)}
                      </TableCell>
                      <TableCell>{inv.dueDate}</TableCell>
                      <TableCell>
                        {new Date(inv.createdAt).toLocaleDateString('ko-KR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="contracts">
            {contracts.length === 0 ? (
              <p className="text-muted-foreground">계약 없음</p>
            ) : (
              <div className="space-y-2">
                {contracts.map((contract) => (
                  <div key={contract.id} className="rounded border p-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getContractTypeBadgeClass(contract.type)}
                      >
                        {contract.type}
                      </Badge>
                      <Badge variant="outline">
                        {getContractStatusLabel(contract.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm">
                      {formatKRW(contract.totalValue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contract.startDate} ~ {contract.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  {reviews.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      평균 평점:{' '}
                      {(
                        Math.round(
                          (reviews.reduce((sum, r) => sum + r.rating, 0) /
                            reviews.length) *
                            10
                        ) / 10
                      ).toFixed(1)}{' '}
                      ★ ({reviews.length}개)
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => setReviewFormOpen(true)}
                >
                  새 리뷰 추가
                </Button>
              </div>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">리뷰가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded border p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <StarRating value={review.rating} size="sm" />
                          {review.comment && (
                            <p className="text-sm">{review.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
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
                                onClick={() => {
                                  deleteReview(review.id)
                                  loadData()
                                }}
                              >
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <ArtistForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSuccess={handleFormSuccess}
          initialData={artist ?? undefined}
        />

        <ReviewForm
          open={reviewFormOpen}
          onOpenChange={setReviewFormOpen}
          onSuccess={() => {
            loadData()
            setReviewFormOpen(false)
          }}
          preselectedArtistId={id}
        />
      </div>
    </MainLayout>
  )
}
