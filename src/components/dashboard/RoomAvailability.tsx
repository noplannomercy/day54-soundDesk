'use client'

import { useState, useEffect } from 'react'
import { Room, Session } from '@/types'
import { getRooms } from '@/services/roomService'
import { getSessions } from '@/services/sessionService'
import { getStudio } from '@/services/studioService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface RoomUsage {
  room: Room
  bookedMinutes: number
  totalMinutes: number
  usagePct: number
}

/**
 * Parse HH:mm into total minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export default function RoomAvailability() {
  const [roomUsages, setRoomUsages] = useState<RoomUsage[]>([])

  useEffect(() => {
    const rooms = getRooms()
    const today = new Date().toISOString().slice(0, 10)
    const todaySessions = getSessions({ dateFrom: today, dateTo: today })
      .filter((s) => s.status !== 'cancelled')

    const studio = getStudio()

    // Determine daily operating minutes
    let dailyMinutes = 600 // default 10 hours
    if (studio) {
      const openMin = timeToMinutes(studio.openTime)
      const closeMin = timeToMinutes(studio.closeTime)
      if (closeMin > openMin) {
        dailyMinutes = closeMin - openMin
      }
    }

    // Accumulate booked minutes per room for today
    const minutesByRoom = new Map<string, number>()
    for (const session of todaySessions) {
      const duration = timeToMinutes(session.endTime) - timeToMinutes(session.startTime)
      if (duration > 0) {
        minutesByRoom.set(
          session.roomId,
          (minutesByRoom.get(session.roomId) ?? 0) + duration
        )
      }
    }

    const usages: RoomUsage[] = rooms.map((room) => {
      const booked = minutesByRoom.get(room.id) ?? 0
      return {
        room,
        bookedMinutes: booked,
        totalMinutes: dailyMinutes,
        usagePct: Math.min(Math.round((booked / dailyMinutes) * 100), 100),
      }
    })

    setRoomUsages(usages)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">룸 현황</CardTitle>
      </CardHeader>
      <CardContent>
        {roomUsages.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 룸이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {roomUsages.map(({ room, bookedMinutes, totalMinutes, usagePct }) => (
              <div key={room.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{room.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(bookedMinutes / 60)}시간 {bookedMinutes % 60}분 /{' '}
                      {Math.floor(totalMinutes / 60)}시간
                    </span>
                    <Badge variant={room.isAvailable ? 'default' : 'destructive'}>
                      {room.isAvailable ? '사용 가능' : '사용 불가'}
                    </Badge>
                  </div>
                </div>
                <Progress value={usagePct} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
