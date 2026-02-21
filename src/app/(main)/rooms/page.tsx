'use client'

import { useState, useEffect } from 'react'
import { Room } from '@/types'
import { getRooms, deleteRoom, updateRoom } from '@/services/roomService'
import MainLayout from '@/components/layout/MainLayout'
import RoomCard from '@/components/rooms/RoomCard'
import RoomForm from '@/components/rooms/RoomForm'
import { Button } from '@/components/ui/button'

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'recording', label: 'Recording' },
  { value: 'mixing', label: 'Mixing' },
  { value: 'mastering', label: 'Mastering' },
  { value: 'rehearsal', label: 'Rehearsal' },
]

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const reload = () => setRooms(getRooms())

  useEffect(() => {
    reload()
  }, [])

  const filteredRooms =
    filterType === 'all'
      ? rooms
      : rooms.filter((r) => r.type === filterType)

  function handleEdit(room: Room) {
    setEditingRoom(room)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteRoom(id)
    reload()
  }

  function handleToggleAvailability(room: Room) {
    updateRoom(room.id, { isAvailable: !room.isAvailable })
    reload()
  }

  function handleAdd() {
    setEditingRoom(null)
    setFormOpen(true)
  }

  return (
    <MainLayout title="룸 관리">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">룸 관리</h1>
        <Button onClick={handleAdd}>새 룸 추가</Button>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filterType === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {filteredRooms.length === 0 ? (
        <p className="text-muted-foreground">등록된 룸이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={() => handleEdit(room)}
              onDelete={() => handleDelete(room.id)}
              onToggleAvailability={() => handleToggleAvailability(room)}
            />
          ))}
        </div>
      )}

      <RoomForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={reload}
        initialData={editingRoom ?? undefined}
      />
    </MainLayout>
  )
}
