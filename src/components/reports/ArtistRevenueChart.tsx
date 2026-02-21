'use client'

import { useState, useEffect, useMemo } from 'react'
import { Invoice, Artist } from '@/types'
import { getInvoices } from '@/services/invoiceService'
import { getArtists } from '@/services/artistService'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface ArtistRevData {
  name: string
  revenue: number
}

export default function ArtistRevenueChart() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [artists, setArtists] = useState<Artist[]>([])

  useEffect(() => {
    setInvoices(getInvoices({ status: 'paid' }))
    setArtists(getArtists())
  }, [])

  const data = useMemo<ArtistRevData[]>(() => {
    const artistNameMap = new Map<string, string>()
    for (const a of artists) {
      artistNameMap.set(a.id, a.name)
    }

    const revenueMap = new Map<string, number>()
    for (const inv of invoices) {
      revenueMap.set(
        inv.artistId,
        (revenueMap.get(inv.artistId) ?? 0) + inv.total
      )
    }

    const entries: ArtistRevData[] = []
    for (const [artistId, revenue] of revenueMap) {
      entries.push({
        name: artistNameMap.get(artistId) ?? '알 수 없음',
        revenue,
      })
    }

    entries.sort((a, b) => b.revenue - a.revenue)
    return entries.slice(0, 10)
  }, [invoices, artists])

  const formatKRW = (value: number | string | Array<number | string> | undefined): string => {
    if (value === undefined) return ''
    const num = Array.isArray(value) ? Number(value[0]) : Number(value)
    return num.toLocaleString('ko-KR') + '원'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>아티스트별 매출 (상위 10)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">결제 완료된 인보이스 데이터가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={formatKRW} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
