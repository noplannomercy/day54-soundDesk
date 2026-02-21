'use client'

import MainLayout from '@/components/layout/MainLayout'
import RevenueChart from '@/components/reports/RevenueChart'
import RoomUtilizationChart from '@/components/reports/RoomUtilizationChart'
import ArtistRevenueChart from '@/components/reports/ArtistRevenueChart'
import EquipmentValueChart from '@/components/reports/EquipmentValueChart'
import EngineerActivityChart from '@/components/reports/EngineerActivityChart'

export default function ReportsPage() {
  return (
    <MainLayout title="보고서">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">보고서</h2>
        <RevenueChart />
        <RoomUtilizationChart />
        <ArtistRevenueChart />
        <EquipmentValueChart />
        <EngineerActivityChart />
      </div>
    </MainLayout>
  )
}
