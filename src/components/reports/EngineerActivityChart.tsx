'use client'

import { useState, useEffect, useMemo } from 'react'
import { Session, Member } from '@/types'
import { getSessions } from '@/services/sessionService'
import { getMembers } from '@/services/memberService'
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
  Legend,
} from 'recharts'

interface EngineerActivityChartProps {
  month?: number
  year?: number
}

interface EngineerData {
  name: string
  sessions: number
  hours: number
}

export default function EngineerActivityChart({
  month: initialMonth,
  year: initialYear,
}: EngineerActivityChartProps) {
  const now = new Date()
  const [month, setMonth] = useState(initialMonth ?? now.getMonth() + 1)
  const [year, setYear] = useState(initialYear ?? now.getFullYear())
  const [sessions, setSessions] = useState<Session[]>([])
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    setSessions(getSessions())
    setMembers(getMembers())
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

  const data = useMemo<EngineerData[]>(() => {
    const memberNameMap = new Map<string, string>()
    for (const m of members) {
      memberNameMap.set(m.id, m.name)
    }

    const sessionCountMap = new Map<string, number>()
    const hoursMap = new Map<string, number>()

    for (const s of sessions) {
      const d = new Date(s.date)
      if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue
      if (s.status === 'cancelled') continue
      if (!s.engineerId) continue

      sessionCountMap.set(
        s.engineerId,
        (sessionCountMap.get(s.engineerId) ?? 0) + 1
      )

      const [sh, sm] = s.startTime.split(':').map(Number)
      const [eh, em] = s.endTime.split(':').map(Number)
      const hours = ((eh * 60 + em) - (sh * 60 + sm)) / 60

      hoursMap.set(
        s.engineerId,
        (hoursMap.get(s.engineerId) ?? 0) + hours
      )
    }

    const entries: EngineerData[] = []
    for (const [engineerId, count] of sessionCountMap) {
      entries.push({
        name: memberNameMap.get(engineerId) ?? '알 수 없음',
        sessions: count,
        hours: Math.round((hoursMap.get(engineerId) ?? 0) * 10) / 10,
      })
    }

    entries.sort((a, b) => b.sessions - a.sessions)
    return entries
  }, [sessions, members, month, year])

  const formatSessions = (value: number | string | Array<number | string> | undefined): string => {
    if (value === undefined) return ''
    const num = Array.isArray(value) ? Number(value[0]) : Number(value)
    return num + '건'
  }

  const formatHours = (value: number | string | Array<number | string> | undefined): string => {
    if (value === undefined) return ''
    const num = Array.isArray(value) ? Number(value[0]) : Number(value)
    return num + '시간'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>엔지니어 활동</CardTitle>
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
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">해당 기간의 엔지니어 활동 데이터가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number | string | Array<number | string> | undefined, name: string | undefined) => {
                  if (name === 'sessions') return formatSessions(value)
                  return formatHours(value)
                }}
              />
              <Legend
                formatter={(value: string) => {
                  if (value === 'sessions') return '세션 수'
                  return '총 시간'
                }}
              />
              <Bar yAxisId="left" dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
