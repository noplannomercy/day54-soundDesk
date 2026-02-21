'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Room, RoomType, Equipment, EquipmentCategory } from '@/types'
import { getRoomById, deleteRoom } from '@/services/roomService'
import { getEquipment } from '@/services/equipmentService'
import MainLayout from '@/components/layout/MainLayout'
import RoomForm from '@/components/rooms/RoomForm'
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
  Mic,
  Headphones,
  Monitor,
  Sliders,
  PlugZap,
  Music,
  Cable,
  Package,
} from 'lucide-react'

const CATEGORY_ICONS: Record<EquipmentCategory, React.ComponentType<{ className?: string }>> = {
  microphone: Mic,
  headphone: Headphones,
  monitor: Monitor,
  mixer: Sliders,
  interface: PlugZap,
  instrument: Music,
  cable: Cable,
  other: Package,
}

const CONDITION_CLASSES: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-red-100 text-red-800',
}

const TYPE_BADGE_CLASSES: Record<RoomType, string> = {
  recording: 'bg-blue-100 text-blue-800',
  mixing: 'bg-purple-100 text-purple-800',
  mastering: 'bg-orange-100 text-orange-800',
  rehearsal: 'bg-green-100 text-green-800',
}

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [room, setRoom] = useState<Room | null>(null)
  const [roomEquipment, setRoomEquipment] = useState<Equipment[]>([])
  const [formOpen, setFormOpen] = useState(false)

  function loadRoomData() {
    const r = getRoomById(id)
    setRoom(r ?? null)
    setRoomEquipment(getEquipment({ roomId: id }))
  }

  useEffect(() => {
    loadRoomData()
  }, [id])

  function handleDelete() {
    deleteRoom(id)
    router.push('/rooms')
  }

  function handleFormSuccess() {
    setFormOpen(false)
    loadRoomData()
  }

  if (!room) {
    return (
      <MainLayout title="룸 상세">
        <p className="text-muted-foreground">룸을 찾을 수 없습니다.</p>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={room.name}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{room.name}</h1>
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
                <AlertDialogTitle>룸 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  &quot;{room.name}&quot;을(를) 삭제하시겠습니까? 이 작업은
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
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>룸 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">유형</p>
              <Badge
                className={TYPE_BADGE_CLASSES[room.type]}
                variant="secondary"
              >
                {room.type}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">상태</p>
              <Badge variant={room.isAvailable ? 'default' : 'destructive'}>
                {room.isAvailable ? '이용 가능' : '이용 불가'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">시간당 요금</p>
              <p className="font-medium">
                {room.hourlyRate.toLocaleString('ko-KR')}원/시간
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">수용 인원</p>
              <p className="font-medium">{room.capacity}명</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>보유 장비</CardTitle>
        </CardHeader>
        <CardContent>
          {roomEquipment.length === 0 ? (
            <p className="text-muted-foreground">이 룸에 배정된 장비가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {roomEquipment.map((eq) => {
                const Icon = CATEGORY_ICONS[eq.category]
                return (
                  <div key={eq.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.brand} {eq.model}
                      </p>
                    </div>
                    <Badge variant="secondary">{eq.category}</Badge>
                    <Badge className={CONDITION_CLASSES[eq.condition]} variant="secondary">
                      {eq.condition}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <RoomForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
        initialData={room ?? undefined}
      />
    </MainLayout>
  )
}
