'use client'

import { useState, useEffect, useCallback } from 'react'
import { Session, SessionStatus, Room } from '@/types'
import { getSessions } from '@/services/sessionService'
import { getRooms } from '@/services/roomService'
import { getArtists } from '@/services/artistService'
import MainLayout from '@/components/layout/MainLayout'
import SessionForm from '@/components/sessions/SessionForm'
import CalendarView from '@/components/sessions/CalendarView'
import TimelineView from '@/components/sessions/TimelineView'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, List } from 'lucide-react'

type ViewMode = 'calendar' | 'list'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'scheduled', label: '예정' },
  { value: 'in-progress', label: '진행중' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('calendar')

  // Filters
  const [filterRoomId, setFilterRoomId] = useState('all')
  const [filterArtistId, setFilterArtistId] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const [artists, setArtists] = useState<{ id: string; name: string }[]>([])

  const reload = useCallback(() => {
    const filters: Parameters<typeof getSessions>[0] = {}
    if (filterRoomId !== 'all') filters.roomId = filterRoomId
    if (filterArtistId !== 'all') filters.artistId = filterArtistId
    if (filterStatus !== 'all') filters.status = filterStatus as SessionStatus
    if (filterDateFrom) filters.dateFrom = filterDateFrom
    if (filterDateTo) filters.dateTo = filterDateTo

    setSessions(getSessions(filters))
  }, [filterRoomId, filterArtistId, filterStatus, filterDateFrom, filterDateTo])

  useEffect(() => {
    setRooms(getRooms())
    setArtists(getArtists().map((a) => ({ id: a.id, name: a.name })))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return (
    <MainLayout title="세션 관리">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">세션 관리</h1>
        <Button onClick={() => setFormOpen(true)}>새 세션 추가</Button>
      </div>

      {/* View toggle and filters */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            <Calendar className="h-4 w-4 mr-1" />
            캘린더
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4 mr-1" />
            리스트
          </Button>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label className="text-xs">룸</Label>
            <Select value={filterRoomId} onValueChange={setFilterRoomId}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">아티스트</Label>
            <Select value={filterArtistId} onValueChange={setFilterArtistId}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {artists.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">상태</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">시작일</Label>
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">종료일</Label>
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-[160px]"
            />
          </div>
        </div>
      </div>

      {/* View content */}
      {view === 'calendar' ? (
        <CalendarView sessions={sessions} rooms={rooms} />
      ) : (
        <TimelineView sessions={sessions} />
      )}

      <SessionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={reload}
      />
    </MainLayout>
  )
}
