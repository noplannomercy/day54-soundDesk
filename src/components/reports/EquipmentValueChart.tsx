'use client'

import { useState, useEffect, useMemo } from 'react'
import { Equipment, EquipmentCategory } from '@/types'
import { getEquipment } from '@/services/equipmentService'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#64748b']

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  microphone: '마이크',
  headphone: '헤드폰',
  monitor: '모니터',
  mixer: '믹서',
  interface: '인터페이스',
  instrument: '악기',
  cable: '케이블',
  other: '기타',
}

interface CategoryValue {
  name: string
  value: number
}

export default function EquipmentValueChart() {
  const [equipment, setEquipment] = useState<Equipment[]>([])

  useEffect(() => {
    setEquipment(getEquipment())
  }, [])

  const data = useMemo<CategoryValue[]>(() => {
    const categoryMap = new Map<EquipmentCategory, number>()

    for (const eq of equipment) {
      categoryMap.set(
        eq.category,
        (categoryMap.get(eq.category) ?? 0) + eq.purchasePrice
      )
    }

    const entries: CategoryValue[] = []
    for (const [category, value] of categoryMap) {
      entries.push({
        name: CATEGORY_LABELS[category],
        value,
      })
    }

    entries.sort((a, b) => b.value - a.value)
    return entries
  }, [equipment])

  const totalValue = useMemo(() => {
    return data.reduce((sum, d) => sum + d.value, 0)
  }, [data])

  const formatKRW = (value: number | string | Array<number | string> | undefined): string => {
    if (value === undefined) return ''
    const num = Array.isArray(value) ? Number(value[0]) : Number(value)
    return num.toLocaleString('ko-KR') + '원'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>카테고리별 장비 자산</CardTitle>
          <span className="text-muted-foreground text-sm">
            총 {totalValue.toLocaleString('ko-KR')}원
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">장비 데이터가 없습니다.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={(props: { name?: string | number; percent?: number }) =>
                  `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatKRW} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
