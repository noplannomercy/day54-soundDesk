'use client'

import { useState, useEffect } from 'react'
import { Equipment, EquipmentCategory, EquipmentCondition, Room } from '@/types'
import { createEquipment, updateEquipment } from '@/services/equipmentService'
import { getRooms } from '@/services/roomService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EquipmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Equipment
}

const CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: 'microphone', label: 'Microphone' },
  { value: 'headphone', label: 'Headphone' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'mixer', label: 'Mixer' },
  { value: 'interface', label: 'Interface' },
  { value: 'instrument', label: 'Instrument' },
  { value: 'cable', label: 'Cable' },
  { value: 'other', label: 'Other' },
]

const CONDITIONS: { value: EquipmentCondition; label: string }[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

export default function EquipmentForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: EquipmentFormProps) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [category, setCategory] = useState<EquipmentCategory>('microphone')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [condition, setCondition] = useState<EquipmentCondition>('good')
  const [location, setLocation] = useState<string>('none')
  const [isAvailable, setIsAvailable] = useState(true)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    setRooms(getRooms())
  }, [open])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setBrand(initialData.brand)
      setModel(initialData.model)
      setSerialNumber(initialData.serialNumber)
      setCategory(initialData.category)
      setPurchaseDate(initialData.purchaseDate)
      setPurchasePrice(initialData.purchasePrice)
      setCondition(initialData.condition)
      setLocation(initialData.location ?? 'none')
      setIsAvailable(initialData.isAvailable)
    } else {
      setName('')
      setBrand('')
      setModel('')
      setSerialNumber('')
      setCategory('microphone')
      setPurchaseDate('')
      setPurchasePrice(0)
      setCondition('good')
      setLocation('none')
      setIsAvailable(true)
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      name,
      brand,
      model,
      serialNumber,
      category,
      purchaseDate,
      purchasePrice,
      condition,
      location: location === 'none' ? null : location,
      isAvailable,
    }

    if (initialData) {
      updateEquipment(initialData.id, formData)
    } else {
      createEquipment(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '장비 편집' : '새 장비 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eq-name">장비명</Label>
            <Input
              id="eq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="장비 이름"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eq-brand">브랜드</Label>
              <Input
                id="eq-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="예: Neumann"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eq-model">모델</Label>
              <Input
                id="eq-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="예: U87"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eq-serial">시리얼 번호</Label>
            <Input
              id="eq-serial"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="시리얼 번호"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eq-category">카테고리</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as EquipmentCategory)}>
                <SelectTrigger id="eq-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eq-condition">상태</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as EquipmentCondition)}>
                <SelectTrigger id="eq-condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eq-date">구매일</Label>
              <Input
                id="eq-date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eq-price">구매가 (원)</Label>
              <Input
                id="eq-price"
                type="number"
                min={0}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eq-location">배치 룸</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="eq-location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="eq-available"
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked === true)}
            />
            <Label htmlFor="eq-available">사용 가능</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit">
              {initialData ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
