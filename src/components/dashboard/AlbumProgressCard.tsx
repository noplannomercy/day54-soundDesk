'use client'

import { useState, useEffect } from 'react'
import { Album, Track, STORAGE_KEYS } from '@/types'
import { getAll } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AlbumProgressCardProps {
  albums: Album[]
}

interface AlbumWithProgress {
  album: Album
  finalTracks: number
  totalTracks: number
  progressPct: number
}

const STATUS_LABEL: Record<string, string> = {
  recording: '녹음 중',
  mixing: '믹싱 중',
  mastering: '마스터링 중',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  recording: 'default',
  mixing: 'secondary',
  mastering: 'outline',
}

export default function AlbumProgressCard({ albums }: AlbumProgressCardProps) {
  const [albumsWithProgress, setAlbumsWithProgress] = useState<AlbumWithProgress[]>([])

  useEffect(() => {
    // Fetch all tracks once to avoid per-album service calls
    const allTracks = getAll<Track>(STORAGE_KEYS.TRACKS)

    const result: AlbumWithProgress[] = albums.map((album) => {
      const albumTracks = allTracks.filter((t) => t.albumId === album.id)
      const totalTracks = albumTracks.length || album.totalTracks || 0
      const finalTracks = albumTracks.filter((t) => t.status === 'final').length
      const progressPct = totalTracks > 0 ? Math.round((finalTracks / totalTracks) * 100) : 0

      return { album, finalTracks, totalTracks, progressPct }
    })

    setAlbumsWithProgress(result)
  }, [albums])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">진행 중인 앨범</CardTitle>
      </CardHeader>
      <CardContent>
        {albumsWithProgress.length === 0 ? (
          <p className="text-sm text-muted-foreground">진행 중인 앨범이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {albumsWithProgress.map(({ album, finalTracks, totalTracks, progressPct }) => (
              <div key={album.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{album.title}</span>
                  <Badge variant={STATUS_VARIANT[album.status] ?? 'outline'}>
                    {STATUS_LABEL[album.status] ?? album.status}
                  </Badge>
                </div>
                <Progress value={progressPct} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {finalTracks} / {totalTracks} 트랙 완료 ({progressPct}%)
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
