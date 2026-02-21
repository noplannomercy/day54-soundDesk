'use client'

import { useState, useEffect } from 'react'
import { getDashboardData, DashboardData } from '@/services/dashboardService'
import MainLayout from '@/components/layout/MainLayout'
import SessionTimeline from '@/components/dashboard/SessionTimeline'
import RoomAvailability from '@/components/dashboard/RoomAvailability'
import RevenueCard from '@/components/dashboard/RevenueCard'
import AlbumProgressCard from '@/components/dashboard/AlbumProgressCard'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    setData(getDashboardData())
  }, [])

  if (!data) {
    return (
      <MainLayout title="대시보드">
        <div className="text-muted-foreground">로딩 중...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="대시보드">
      <div className="space-y-6">
        {/* Row 1: Revenue + Album Progress */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueCard
            monthRevenue={data.monthRevenue}
            lastMonthRevenue={data.monthRevenueLastMonth}
          />
          <AlbumProgressCard albums={data.activeAlbums} />
        </div>

        {/* Row 2: Today's Sessions (full width) */}
        <SessionTimeline sessions={data.todaySessions} title="오늘의 세션" />

        {/* Row 3: Room Availability + Activity Timeline */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RoomAvailability />
          <ActivityTimeline activities={data.recentActivities} />
        </div>
      </div>
    </MainLayout>
  )
}
