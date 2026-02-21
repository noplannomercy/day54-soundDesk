'use client'

import { useState, useEffect, useCallback } from 'react'
import { Track, TrackStatus } from '@/types'
import { getTracks, deleteTrack } from '@/services/trackService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import TrackForm from '@/components/tracks/TrackForm'

interface TrackListProps {
  albumId: string
}

const STATUS_BADGE_CLASSES: Record<TrackStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  recording: 'bg-blue-100 text-blue-800',
  recorded: 'bg-sky-100 text-sky-800',
  mixing: 'bg-purple-100 text-purple-800',
  mixed: 'bg-violet-100 text-violet-800',
  mastered: 'bg-orange-100 text-orange-800',
  final: 'bg-green-100 text-green-800',
}

const STATUS_LABELS: Record<TrackStatus, string> = {
  pending: '대기',
  recording: '녹음 중',
  recorded: '녹음 완료',
  mixing: '믹싱 중',
  mixed: '믹싱 완료',
  mastered: '마스터링 완료',
  final: '최종',
}

function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export default function TrackList({ albumId }: TrackListProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)

  const reload = useCallback(() => {
    setTracks(getTracks(albumId))
  }, [albumId])

  useEffect(() => {
    reload()
  }, [reload])

  function handleEdit(track: Track) {
    setEditingTrack(track)
    setFormOpen(true)
  }

  function handleAdd() {
    setEditingTrack(null)
    setFormOpen(true)
  }

  function handleDelete(trackId: string) {
    deleteTrack(trackId)
    reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">트랙 목록</h3>
        <Button onClick={handleAdd}>트랙 추가</Button>
      </div>

      {tracks.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          등록된 트랙이 없습니다.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>시간</TableHead>
              <TableHead>BPM</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>{track.trackNumber}</TableCell>
                <TableCell className="font-medium">{track.title}</TableCell>
                <TableCell>{formatDuration(track.duration)}</TableCell>
                <TableCell>{track.bpm ?? '-'}</TableCell>
                <TableCell>{track.key ?? '-'}</TableCell>
                <TableCell>
                  <Badge
                    className={STATUS_BADGE_CLASSES[track.status]}
                    variant="secondary"
                  >
                    {STATUS_LABELS[track.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(track)}
                    >
                      편집
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>트랙 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            &quot;{track.title}&quot;을(를) 삭제하시겠습니까? 이
                            작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(track.id)}
                          >
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TrackForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={reload}
        albumId={albumId}
        initialData={editingTrack ?? undefined}
      />
    </div>
  )
}
