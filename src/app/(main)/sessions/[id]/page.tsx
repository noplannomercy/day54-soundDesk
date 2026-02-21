'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Session } from '@/types'
import {
  getSessionById,
  updateSession,
  updateSessionStatus,
  deleteSession,
} from '@/services/sessionService'
import { getRoomById } from '@/services/roomService'
import { getArtistById } from '@/services/artistService'
import { getAlbumById } from '@/services/albumService'
import { getTrackById } from '@/services/trackService'
import { getMembers, getMemberById } from '@/services/memberService'
import MainLayout from '@/components/layout/MainLayout'
import SessionForm from '@/components/sessions/SessionForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

const STATUS_BADGE: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  scheduled: { label: '예정', variant: 'default' },
  'in-progress': { label: '진행중', variant: 'secondary' },
  completed: { label: '완료', variant: 'outline' },
  cancelled: { label: '취소', variant: 'destructive' },
}

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [session, setSession] = useState<Session | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  // Resolved names
  const [roomName, setRoomName] = useState('')
  const [artistName, setArtistName] = useState('')
  const [albumTitle, setAlbumTitle] = useState('')
  const [trackTitle, setTrackTitle] = useState('')
  const [engineerName, setEngineerName] = useState('')

  const reload = () => {
    const s = getSessionById(id)
    if (!s) {
      setSession(null)
      return
    }
    setSession(s)

    setRoomName(getRoomById(s.roomId)?.name ?? '알 수 없음')
    setArtistName(getArtistById(s.artistId)?.name ?? '미지정')
    setAlbumTitle(s.albumId ? (getAlbumById(s.albumId)?.title ?? '') : '')
    setTrackTitle(s.trackId ? (getTrackById(s.trackId)?.title ?? '') : '')
    setEngineerName(getMemberById(s.engineerId)?.name ?? '미지정')
  }

  useEffect(() => {
    reload()
  }, [id])

  function handleStatusChange(status: 'in-progress' | 'completed' | 'cancelled') {
    updateSessionStatus(id, status)
    reload()
  }

  function handleEngineerChange(newEngineerId: string) {
    updateSession(id, { engineerId: newEngineerId })
    reload()
  }

  function handleDelete() {
    deleteSession(id)
    router.push('/sessions')
  }

  function handleFormSuccess() {
    setFormOpen(false)
    reload()
  }

  if (!session) {
    return (
      <MainLayout title="세션 상세">
        <p className="text-muted-foreground">세션을 찾을 수 없습니다.</p>
      </MainLayout>
    )
  }

  const badge = STATUS_BADGE[session.status] ?? STATUS_BADGE.scheduled
  const engineers = getMembers().filter(
    (m) => m.role === 'engineer' || m.role === 'owner' || m.role === 'assistant'
  )

  return (
    <MainLayout title="세션 상세">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/sessions')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          목록으로
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">세션 상세</h1>
          <Badge variant={badge.variant}>{badge.label}</Badge>
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
                <AlertDialogTitle>세션 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  이 세션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status transition buttons */}
      <div className="flex gap-2 mb-6">
        {session.status === 'scheduled' && (
          <Button onClick={() => handleStatusChange('in-progress')}>
            시작
          </Button>
        )}
        {session.status === 'in-progress' && (
          <>
            <Button onClick={() => handleStatusChange('completed')}>
              완료
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusChange('cancelled')}
            >
              취소
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>세션 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">룸</p>
                <p className="font-medium">{roomName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">아티스트</p>
                <p className="font-medium">{artistName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">날짜</p>
                <p className="font-medium">{session.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">시간</p>
                <p className="font-medium">
                  {session.startTime} ~ {session.endTime}
                </p>
              </div>
              {albumTitle && (
                <div>
                  <p className="text-sm text-muted-foreground">앨범</p>
                  <p className="font-medium">{albumTitle}</p>
                </div>
              )}
              {trackTitle && (
                <div>
                  <p className="text-sm text-muted-foreground">트랙</p>
                  <p className="font-medium">{trackTitle}</p>
                </div>
              )}
            </div>
            {session.notes && (
              <div>
                <p className="text-sm text-muted-foreground">메모</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{session.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>엔지니어</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">현재 엔지니어</p>
              <p className="font-medium mb-3">{engineerName}</p>
              <Select
                value={session.engineerId}
                onValueChange={handleEngineerChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="엔지니어 변경" />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>관련 장비</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              장비 서비스 구현 후 이 룸에 배정된 장비가 표시됩니다.
            </p>
          </CardContent>
        </Card>
      </div>

      <SessionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
        initialData={session ?? undefined}
      />
    </MainLayout>
  )
}
