'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Studio, Room } from '@/types'
import { getStudio, deleteStudio } from '@/services/studioService'
import { getRooms, deleteRoom, updateRoom } from '@/services/roomService'
import MainLayout from '@/components/layout/MainLayout'
import StudioForm from '@/components/studio/StudioForm'
import RoomCard from '@/components/rooms/RoomCard'
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

export default function StudioPage() {
  const router = useRouter()
  const [studio, setStudio] = useState<Studio | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    setStudio(getStudio())
    setRooms(getRooms())
  }, [])

  function handleFormSuccess() {
    setStudio(getStudio())
    setFormOpen(false)
  }

  function handleDeleteStudio() {
    deleteStudio()
    setStudio(null)
  }

  function handleDeleteRoom(id: string) {
    deleteRoom(id)
    setRooms(getRooms())
  }

  function handleToggleRoomAvailability(room: Room) {
    updateRoom(room.id, { isAvailable: !room.isAvailable })
    setRooms(getRooms())
  }

  if (!studio) {
    return (
      <MainLayout title="스튜디오 관리">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              스튜디오 정보가 없습니다.
            </p>
            <Button onClick={() => setFormOpen(true)}>스튜디오 등록</Button>
          </CardContent>
        </Card>
        <StudioForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSuccess={handleFormSuccess}
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout title="스튜디오 관리">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">스튜디오 관리</h1>
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
                <AlertDialogTitle>스튜디오 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  스튜디오 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수
                  없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteStudio}>
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{studio.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">설명</p>
              <p>{studio.description || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">주소</p>
              <p>{studio.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">전화번호</p>
              <p>{studio.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이메일</p>
              <p>{studio.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">운영 시간</p>
              <p>
                {studio.openTime} ~ {studio.closeTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">룸 목록</h2>
          <Button asChild>
            <a href="/rooms">룸 관리 &rarr;</a>
          </Button>
        </div>
        {rooms.length === 0 ? (
          <p className="text-muted-foreground">등록된 룸이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={() => router.push(`/rooms/${room.id}`)}
                onDelete={() => handleDeleteRoom(room.id)}
                onToggleAvailability={() =>
                  handleToggleRoomAvailability(room)
                }
              />
            ))}
          </div>
        )}
      </div>

      <StudioForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
        initialData={studio ?? undefined}
      />
    </MainLayout>
  )
}
