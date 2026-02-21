'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Album, AlbumStatus, Artist } from '@/types'
import { getAlbumById, deleteAlbum } from '@/services/albumService'
import { getArtistById } from '@/services/artistService'
import { getTracks } from '@/services/trackService'
import MainLayout from '@/components/layout/MainLayout'
import AlbumForm from '@/components/albums/AlbumForm'
import TrackList from '@/components/tracks/TrackList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import TagSelector from '@/components/tags/TagSelector'
import { Music } from 'lucide-react'

const STATUS_BADGE_CLASSES: Record<AlbumStatus, string> = {
  planning: 'bg-gray-100 text-gray-800',
  recording: 'bg-blue-100 text-blue-800',
  mixing: 'bg-purple-100 text-purple-800',
  mastering: 'bg-orange-100 text-orange-800',
  released: 'bg-green-100 text-green-800',
}

const STATUS_LABELS: Record<AlbumStatus, string> = {
  planning: '기획',
  recording: '녹음',
  mixing: '믹싱',
  mastering: '마스터링',
  released: '발매',
}

export default function AlbumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [album, setAlbum] = useState<Album | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [finalTracks, setFinalTracks] = useState(0)
  const [formOpen, setFormOpen] = useState(false)

  function loadAlbum() {
    const a = getAlbumById(id)
    setAlbum(a ?? null)
    if (a) {
      setArtist(getArtistById(a.artistId) ?? null)
      setFinalTracks(getTracks(id).filter((t) => t.status === 'final').length)
    }
  }

  useEffect(() => {
    loadAlbum()
  }, [id])

  function handleDelete() {
    deleteAlbum(id)
    router.push('/albums')
  }

  function handleEditSuccess() {
    loadAlbum()
    setFormOpen(false)
  }

  if (!album) {
    return (
      <MainLayout title="앨범 상세">
        <div className="text-center py-12">
          <p className="text-muted-foreground">앨범을 찾을 수 없습니다.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/albums')}
          >
            앨범 목록으로 돌아가기
          </Button>
        </div>
      </MainLayout>
    )
  }

  const progress =
    album.totalTracks > 0 ? (finalTracks / album.totalTracks) * 100 : 0

  return (
    <MainLayout title={album.title}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              {album.coverArt ? (
                <img
                  src={album.coverArt}
                  alt={album.title}
                  className="h-32 w-32 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
                  <Music className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{album.title}</CardTitle>
                  <Badge
                    className={STATUS_BADGE_CLASSES[album.status]}
                    variant="secondary"
                  >
                    {STATUS_LABELS[album.status]}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>아티스트: {artist?.name ?? '알 수 없음'}</p>
                  <p>장르: {album.genre}</p>
                  <p>발매일: {album.releaseDate ?? '미발매'}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>트랙 진행률</span>
                <span>
                  {finalTracks}/{album.totalTracks} 트랙 완료
                </span>
              </div>
              <Progress value={progress} />
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
                    <AlertDialogTitle>앨범 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      &quot;{album.title}&quot;을(를) 삭제하시겠습니까? 이 작업은
                      되돌릴 수 없습니다.
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
              <Button
                variant="outline"
                onClick={() => router.push('/albums')}
              >
                목록으로
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <TrackList albumId={id} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">연결된 세션</h2>
          <p className="text-muted-foreground text-sm">
            Wave 3에서 연결 예정
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">태그</h2>
          <TagSelector entityType="album" entityId={id} />
        </div>
      </div>

      <AlbumForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleEditSuccess}
        initialData={album ?? undefined}
      />
    </MainLayout>
  )
}
