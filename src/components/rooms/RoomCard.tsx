'use client'

import { Room, RoomType } from '@/types'
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

interface RoomCardProps {
  room: Room
  onEdit: () => void
  onDelete: () => void
  onToggleAvailability: () => void
}

const TYPE_BADGE_CLASSES: Record<RoomType, string> = {
  recording: 'bg-blue-100 text-blue-800',
  mixing: 'bg-purple-100 text-purple-800',
  mastering: 'bg-orange-100 text-orange-800',
  rehearsal: 'bg-green-100 text-green-800',
}

export default function RoomCard({
  room,
  onEdit,
  onDelete,
  onToggleAvailability,
}: RoomCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{room.name}</span>
        </CardTitle>
        <div className="flex gap-2">
          <Badge className={TYPE_BADGE_CLASSES[room.type]} variant="secondary">
            {room.type}
          </Badge>
          <Badge variant={room.isAvailable ? 'default' : 'destructive'}>
            {room.isAvailable ? '이용 가능' : '이용 불가'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>수용 인원: {room.capacity}명</p>
        <p>시간당 요금: {room.hourlyRate.toLocaleString('ko-KR')}원/시간</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onToggleAvailability}>
          {room.isAvailable ? '비활성화' : '활성화'}
        </Button>
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
              <AlertDialogTitle>룸 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{room.name}&quot;을(를) 삭제하시겠습니까? 이 작업은 되돌릴
                수 없습니다.
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
