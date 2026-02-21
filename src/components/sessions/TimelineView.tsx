'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@/types'
import { getRoomById } from '@/services/roomService'
import { getArtists } from '@/services/artistService'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TimelineViewProps {
  sessions: Session[]
}

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled: { label: '예정', variant: 'default' },
  'in-progress': { label: '진행중', variant: 'secondary' },
  completed: { label: '완료', variant: 'outline' },
  cancelled: { label: '취소', variant: 'destructive' },
}

function getToday(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getWeekRange(): { start: string; end: string } {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  }
}

function formatDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function TimelineView({ sessions }: TimelineViewProps) {
  const router = useRouter()
  const today = getToday()
  const week = getWeekRange()

  // Build artist and room name lookups
  const artistMap = useMemo(() => {
    const map = new Map<string, string>()
    const artists = getArtists()
    artists.forEach((a) => map.set(a.id, a.name))
    return map
  }, [])

  const todaySessions = sessions
    .filter((s) => s.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const weekSessions = sessions
    .filter((s) => s.date >= week.start && s.date <= week.end)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))

  const upcomingSessions = sessions
    .filter(
      (s) => s.date > today && s.status !== 'completed' && s.status !== 'cancelled'
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))

  const completedSessions = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))

  function renderRow(session: Session) {
    const roomName = getRoomById(session.roomId)?.name ?? '알 수 없음'
    const artistName = artistMap.get(session.artistId) ?? '미지정'
    const badge = STATUS_BADGE[session.status] ?? STATUS_BADGE.scheduled

    return (
      <div
        key={session.id}
        className="flex items-center gap-4 p-3 rounded-md border hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={() => router.push(`/sessions/${session.id}`)}
      >
        <div className="text-sm font-medium min-w-[90px]">{session.date}</div>
        <div className="text-sm min-w-[110px]">
          {session.startTime} ~ {session.endTime}
        </div>
        <div className="text-sm min-w-[120px] truncate">{roomName}</div>
        <div className="text-sm flex-1 truncate">{artistName}</div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>
    )
  }

  function renderEmpty() {
    return (
      <p className="text-muted-foreground text-sm py-4">해당 세션이 없습니다.</p>
    )
  }

  return (
    <Tabs defaultValue="today">
      <TabsList>
        <TabsTrigger value="today">오늘</TabsTrigger>
        <TabsTrigger value="week">이번주</TabsTrigger>
        <TabsTrigger value="upcoming">예정</TabsTrigger>
        <TabsTrigger value="completed">완료</TabsTrigger>
      </TabsList>

      <TabsContent value="today" className="space-y-2 mt-4">
        {todaySessions.length === 0 ? renderEmpty() : todaySessions.map(renderRow)}
      </TabsContent>

      <TabsContent value="week" className="space-y-2 mt-4">
        {weekSessions.length === 0 ? renderEmpty() : weekSessions.map(renderRow)}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-2 mt-4">
        {upcomingSessions.length === 0
          ? renderEmpty()
          : upcomingSessions.map(renderRow)}
      </TabsContent>

      <TabsContent value="completed" className="space-y-2 mt-4">
        {completedSessions.length === 0
          ? renderEmpty()
          : completedSessions.map(renderRow)}
      </TabsContent>
    </Tabs>
  )
}
