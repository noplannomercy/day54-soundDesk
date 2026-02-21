'use client'

import { useState, useEffect, useMemo } from 'react'
import { Session, Room } from '@/types'
import { getSessions } from '@/services/sessionService'
import { getRooms } from '@/services/roomService'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface RoomUtilizationChartProps {
  month?: number
  year?: number
}

interface RoomUtilData {
  name: string
  utilization: number
}

/** Maximum available minutes per room per month (30 days x 10 hours) */
const MAX_MINUTES_PER_MONTH = 30 * 10 * 60

export default function RoomUtilizationChart({
  month: initialMonth,
  year: initialYear,
}: RoomUtilizationChartProps) {
  const now = new Date()
  const [month, setMonth] = useState(initialMonth ?? now.getMonth() + 1)
  const [year, setYear] = useState(initialYear ?? now.getFullYear())
  const [sessions, setSessions] = useState<Session[]>([])
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    setSessions(getSessions())
    setRooms(getRooms())
  }, [])

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: String(i + 1).padStart(2, '0') + '월',
    }))
  }, [])

  const yearOptions = useMemo(() => {
    const currentYear = now.getFullYear()
    const options: number[] = []
    for (let y = currentYear - 2; y <= currentYear + 2; y++) {
      options.push(y)
    }
    return options
  }, [now])

  const data = useMemo<RoomUtilData[]>(() => {
    const roomMinutes = new Map<string, number>()

    for (const s of sessions) {
      const d = new Date(s.date)
      if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue
      if (s.status === 'cancelled') continue

      const [sh, sm] = s.startTime.split(':').map(Number)
      const [eh, em] = s.endTime.split(':').map(Number)
      const minutes = (eh * 60 + em) - (sh * 60 + sm)

      roomMinutes.set(
        s.roomId,
        (roomMinutes.get(s.roomId) ?? 0) + minutes
      )
    }

    return rooms.map((room) => {
      const minutes = roomMinutes.get(room.id) ?? 0
      const utilization = Math.min(
        Math.round((minutes / MAX_MINUTES_PER_MONTH) * 100),
        100
      )
      return { name: room.name, utilization }
    })
  }, [sessions, rooms, month, year])

  const formatPercent = (value: number | string | Array<number | string> | undefined): string => {
    if (value === undefined) return ''
    const num = Array.isArray(value) ? Number(value[0]) : Number(value)
    return num + '%'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>룸 가동률</CardTitle>
          <div className="flex gap-2">
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(month)}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={formatPercent} />
            <Bar dataKey="utilization" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
