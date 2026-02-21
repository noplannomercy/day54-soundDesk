'use client'

import { useState, useEffect, useMemo } from 'react'
import { Equipment, EquipmentCategory, Room } from '@/types'
import { getEquipment, deleteEquipment } from '@/services/equipmentService'
import { getRooms } from '@/services/roomService'
import MainLayout from '@/components/layout/MainLayout'
import EquipmentCard from '@/components/equipment/EquipmentCard'
import EquipmentForm from '@/components/equipment/EquipmentForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const CATEGORY_TABS: { value: string; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'microphone', label: 'Microphone' },
  { value: 'headphone', label: 'Headphone' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'mixer', label: 'Mixer' },
  { value: 'interface', label: 'Interface' },
  { value: 'instrument', label: 'Instrument' },
  { value: 'cable', label: 'Cable' },
  { value: 'other', label: 'Other' },
]

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [availableFilter, setAvailableFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>(undefined)

  function loadData() {
    setEquipment(getEquipment())
    setRooms(getRooms())
  }

  useEffect(() => {
    loadData()
  }, [])

  const roomNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    rooms.forEach((r) => { map[r.id] = r.name })
    return map
  }, [rooms])

  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((e) => categoryFilter === 'all' || e.category === categoryFilter)
      .filter((e) => conditionFilter === 'all' || e.condition === conditionFilter)
      .filter((e) => {
        if (locationFilter === 'all') return true
        if (locationFilter === 'none') return e.location === null
        return e.location === locationFilter
      })
      .filter((e) => {
        if (availableFilter === 'all') return true
        return availableFilter === 'available' ? e.isAvailable : !e.isAvailable
      })
  }, [equipment, categoryFilter, conditionFilter, locationFilter, availableFilter])

  const totalAssetValue = useMemo(() => {
    return filteredEquipment.reduce((sum, e) => sum + e.purchasePrice, 0)
  }, [filteredEquipment])

  function handleEdit(item: Equipment) {
    setEditingEquipment(item)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteEquipment(id)
    loadData()
  }

  function handleFormSuccess() {
    loadData()
    setEditingEquipment(undefined)
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditingEquipment(undefined)
    }
  }

  return (
    <MainLayout title="장비 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">장비 관리</h2>
          <Button onClick={() => setFormOpen(true)}>새 장비 추가</Button>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">총 자산 가치</p>
          <p className="text-2xl font-bold">
            {totalAssetValue.toLocaleString('ko-KR')}원
          </p>
          <Badge variant="secondary" className="mt-1">
            {filteredEquipment.length}개 장비
          </Badge>
        </div>

        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-4">
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="위치" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 위치</SelectItem>
              <SelectItem value="none">미배정</SelectItem>
              {rooms.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availableFilter} onValueChange={setAvailableFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="사용 가능" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="available">사용가능</SelectItem>
              <SelectItem value="unavailable">사용불가</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredEquipment.length === 0 ? (
          <p className="text-muted-foreground">등록된 장비가 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                roomName={item.location ? roomNameMap[item.location] ?? null : null}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}

        <EquipmentForm
          open={formOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleFormSuccess}
          initialData={editingEquipment}
        />
      </div>
    </MainLayout>
  )
}
