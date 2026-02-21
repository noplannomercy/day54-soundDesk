'use client'

import { useState, useMemo } from 'react'
import { Session, Room } from '@/types'
import { getArtists } from '@/services/artistService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarViewProps {
  sessions: Session[]
  rooms: Room[]
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export default function CalendarView({ sessions, rooms }: CalendarViewProps) {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))

  const weekDays = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      days.push(d)
    }
    return days
  }, [weekStart])

  // Build artist name lookup
  const artistMap = useMemo(() => {
    const map = new Map<string, string>()
    const artists = getArtists()
    artists.forEach((a) => map.set(a.id, a.name))
    return map
  }, [])

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  function getSessionsForCell(roomId: string, date: string): Session[] {
    return sessions.filter((s) => s.roomId === roomId && s.date === date)
  }

  const weekEndDate = weekDays[6]
  const headerLabel = `${formatDate(weekStart)} ~ ${formatDate(weekEndDate!)}`

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={prevWeek}>
          <ChevronLeft className="h-4 w-4" />
          이전 주
        </Button>
        <span className="font-medium text-sm">{headerLabel}</span>
        <Button variant="outline" size="sm" onClick={nextWeek}>
          다음 주
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border p-2 bg-muted text-left min-w-[120px]">룸</th>
              {weekDays.map((d, i) => (
                <th key={i} className="border p-2 bg-muted text-center min-w-[120px]">
                  <div>{DAY_LABELS[i]}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.getMonth() + 1}/{d.getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="border p-2 font-medium bg-muted/50">
                  {room.name}
                </td>
                {weekDays.map((d, i) => {
                  const dateStr = formatDate(d)
                  const cellSessions = getSessionsForCell(room.id, dateStr)
                  return (
                    <td key={i} className="border p-1 align-top h-20">
                      {cellSessions.map((s) => (
                        <div
                          key={s.id}
                          className={`text-xs p-1 mb-1 rounded border ${STATUS_COLORS[s.status] ?? ''}`}
                        >
                          <div className="font-medium">
                            {s.startTime}~{s.endTime}
                          </div>
                          <div className="truncate">
                            {artistMap.get(s.artistId) ?? '미지정'}
                          </div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
