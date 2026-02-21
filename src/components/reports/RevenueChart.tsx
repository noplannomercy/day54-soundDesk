'use client'

import { useState, useEffect, useMemo } from 'react'
import { Invoice } from '@/types'
import { getInvoices } from '@/services/invoiceService'
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface RevenueChartProps {
  year?: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
}

export default function RevenueChart({ year: initialYear }: RevenueChartProps) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(initialYear ?? currentYear)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    setInvoices(getInvoices({ status: 'paid' }))
  }, [])

  const yearOptions = useMemo(() => {
    const options: number[] = []
    for (let y = currentYear - 2; y <= currentYear + 2; y++) {
      options.push(y)
    }
    return options
  }, [currentYear])

  const data = useMemo<MonthlyRevenue[]>(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: String(i + 1).padStart(2, '0') + '월',
      revenue: 0,
    }))

    for (const inv of invoices) {
      const d = new Date(inv.createdAt)
      if (d.getFullYear() === year) {
        months[d.getMonth()].revenue += inv.total
      }
    }

    return months
  }, [invoices, year])

  const formatKRW = (value: number | string | Array<number | string> | undefined): string => {
    if (value === undefined) return ''
    const num = Array.isArray(value) ? Number(value[0]) : Number(value)
    return num.toLocaleString('ko-KR') + '원'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>월별 매출 추이</CardTitle>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
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
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={formatKRW} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
