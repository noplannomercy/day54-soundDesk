'use client'

import { Contract } from '@/types'
import { getDaysUntilExpiry } from '@/services/contractService'
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

interface ContractCardProps {
  contract: Contract
  artistName: string
  onEdit: () => void
  onDelete: () => void
}

const TYPE_CLASSES: Record<string, string> = {
  session: 'bg-blue-100 text-blue-800',
  album: 'bg-purple-100 text-purple-800',
  retainer: 'bg-orange-100 text-orange-800',
}

const TYPE_LABELS: Record<string, string> = {
  session: '세션',
  album: '앨범',
  retainer: '리테이너',
}

const STATUS_CLASSES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  terminated: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<string, string> = {
  draft: '초안',
  active: '활성',
  completed: '완료',
  terminated: '해지',
}

export default function ContractCard({
  contract,
  artistName,
  onEdit,
  onDelete,
}: ContractCardProps) {
  const daysLeft = getDaysUntilExpiry(contract.endDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate text-base font-semibold">{artistName}</span>
          <div className="flex gap-2">
            <Badge className={TYPE_CLASSES[contract.type]} variant="secondary">
              {TYPE_LABELS[contract.type]}
            </Badge>
            <Badge className={STATUS_CLASSES[contract.status]} variant="secondary">
              {STATUS_LABELS[contract.status]}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium text-lg">
          {contract.totalValue.toLocaleString('ko-KR')}원
        </p>
        <p className="text-muted-foreground">
          {contract.startDate} ~ {contract.endDate}
        </p>
        {contract.status === 'active' && daysLeft <= 30 && daysLeft >= 0 && (
          <Badge className={daysLeft <= 7 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'} variant="secondary">
            D-{daysLeft}
          </Badge>
        )}
        {daysLeft < 0 && contract.status === 'active' && (
          <Badge className="bg-red-100 text-red-800" variant="secondary">
            만료됨
          </Badge>
        )}
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
              <AlertDialogTitle>계약 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                이 계약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
