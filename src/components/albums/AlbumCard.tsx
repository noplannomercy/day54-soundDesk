'use client'

import { Album, AlbumStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardFooter,
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
import { Music } from 'lucide-react'
import Link from 'next/link'

interface AlbumCardProps {
  album: Album
  artistName: string
  finalTracks: number
  onEdit: () => void
  onDelete: () => void
}

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

export default function AlbumCard({
  album,
  artistName,
  finalTracks,
  onEdit,
  onDelete,
}: AlbumCardProps) {
  const progress =
    album.totalTracks > 0 ? (finalTracks / album.totalTracks) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {album.coverArt ? (
            <img
              src={album.coverArt}
              alt={album.title}
              className="h-16 w-16 rounded object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">
              <Link
                href={`/albums/${album.id}`}
                className="hover:underline"
              >
                {album.title}
              </Link>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {artistName}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge
            className={STATUS_BADGE_CLASSES[album.status]}
            variant="secondary"
          >
            {STATUS_LABELS[album.status]}
          </Badge>
          {album.genre && (
            <Badge variant="outline">{album.genre}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>트랙 진행률</span>
            <span>
              {finalTracks} / {album.totalTracks} 트랙 완료
            </span>
          </div>
          <Progress value={progress} />
        </div>
        {album.releaseDate && (
          <p className="text-sm text-muted-foreground">
            발매일: {album.releaseDate}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          편집
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>앨범 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{album.title}&quot;을(를) 삭제하시겠습니까? 이 작업은 되돌릴
                수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
