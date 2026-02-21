'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface RevenueCardProps {
  monthRevenue: number
  lastMonthRevenue: number
}

export default function RevenueCard({ monthRevenue, lastMonthRevenue }: RevenueCardProps) {
  // Calculate percentage change vs last month
  let changePct = 0
  let changeDirection: 'up' | 'down' | 'flat' = 'flat'

  if (lastMonthRevenue > 0) {
    changePct = ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    changeDirection = changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'flat'
  } else if (monthRevenue > 0) {
    changePct = 100
    changeDirection = 'up'
  }

  const formattedRevenue = monthRevenue.toLocaleString('ko-KR')
  const formattedPct = Math.abs(Math.round(changePct))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">이번 달 매출</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{formattedRevenue}원</p>
          <div className="flex items-center gap-1 text-sm">
            {changeDirection === 'up' && (
              <>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+{formattedPct}%</span>
              </>
            )}
            {changeDirection === 'down' && (
              <>
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-red-600">-{formattedPct}%</span>
              </>
            )}
            {changeDirection === 'flat' && (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">변동 없음</span>
              </>
            )}
            <span className="text-muted-foreground">지난달 대비</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
