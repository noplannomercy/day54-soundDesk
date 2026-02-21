'use client'

import { useState, useEffect } from 'react'
import { Session } from '@/types'
import { getRoomById } from '@/services/roomService'
import { getArtistById } from '@/services/artistService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User } from 'lucide-react'

interface SessionTimelineProps {
  sessions: Session[]
  title: string
}

interface EnrichedSession {
  session: Session
  roomName: string
  artistName: string
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'outline',
  'in-progress': 'default',
  completed: 'secondary',
  cancelled: 'destructive',
}

const STATUS_LABEL: Record<string, string> = {
  scheduled: '예정',
  'in-progress': '진행 중',
  completed: '완료',
  cancelled: '취소',
}

export default function SessionTimeline({ sessions, title }: SessionTimelineProps) {
  const [enriched, setEnriched] = useState<EnrichedSession[]>([])

  useEffect(() => {
    const data = sessions.map((session) => {
      const room = getRoomById(session.roomId)
      const artist = getArtistById(session.artistId)
      return {
        session,
        roomName: room?.name ?? '알 수 없음',
        artistName: artist?.name ?? '알 수 없음',
      }
    })

    // Sort by date then startTime ascending
    data.sort((a, b) => {
      const dateCompare = a.session.date.localeCompare(b.session.date)
      if (dateCompare !== 0) return dateCompare
      return a.session.startTime.localeCompare(b.session.startTime)
    })

    setEnriched(data)
  }, [sessions])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {enriched.length === 0 ? (
          <p className="text-sm text-muted-foreground">예정된 세션이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {enriched.map(({ session, roomName, artistName }) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {session.date} {session.startTime} ~ {session.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {roomName}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {artistName}
                    </span>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[session.status] ?? 'outline'}>
                  {STATUS_LABEL[session.status] ?? session.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
