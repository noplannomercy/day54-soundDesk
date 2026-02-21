'use client'

import { ActivityItem } from '@/services/dashboardService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, FileText, Music } from 'lucide-react'

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

const ICON_MAP: Record<ActivityItem['type'], React.ElementType> = {
  session: Calendar,
  invoice: FileText,
  album: Music,
}

/**
 * Format an ISO date string as a relative time label in Korean.
 * Supports minutes, hours, days up to 30 days, then falls back to absolute date.
 */
function formatRelativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diffMs = now - then

  if (diffMs < 0) return '방금 전'

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  const days = Math.floor(hours / 24)
  if (days === 1) return '어제'
  if (days < 30) return `${days}일 전`

  // Fallback: absolute date
  return isoDate.slice(0, 10)
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">최근 활동이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = ICON_MAP[activity.type]
              return (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-muted p-1.5">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.date)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
