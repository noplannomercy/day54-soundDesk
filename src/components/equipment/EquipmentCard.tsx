'use client'

import { Equipment, EquipmentCategory } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Mic,
  Headphones,
  Monitor,
  Sliders,
  PlugZap,
  Music,
  Cable,
  Package,
} from 'lucide-react'

interface EquipmentCardProps {
  equipment: Equipment
  roomName: string | null
  onEdit: () => void
  onDelete: () => void
}

const CATEGORY_ICONS: Record<EquipmentCategory, React.ComponentType<{ className?: string }>> = {
  microphone: Mic,
  headphone: Headphones,
  monitor: Monitor,
  mixer: Sliders,
  interface: PlugZap,
  instrument: Music,
  cable: Cable,
  other: Package,
}

const CONDITION_CLASSES: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-red-100 text-red-800',
}

export default function EquipmentCard({
  equipment,
  roomName,
  onEdit,
  onDelete,
}: EquipmentCardProps) {
  const Icon = CATEGORY_ICONS[equipment.category]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">
              {equipment.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {equipment.brand} {equipment.model}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{equipment.category}</Badge>
          <Badge className={CONDITION_CLASSES[equipment.condition]} variant="secondary">
            {equipment.condition}
          </Badge>
          <Badge
            className={
              equipment.isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }
            variant="secondary"
          >
            {equipment.isAvailable ? '사용가능' : '사용불가'}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          위치: {roomName ?? '미배정'}
        </p>
        <p className="font-medium">
          {equipment.purchasePrice.toLocaleString('ko-KR')}원
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          편집
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>장비 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{equipment.name}&quot;을(를) 삭제하시겠습니까? 이 작업은
                되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
