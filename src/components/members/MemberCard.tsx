'use client'

import { Member, MemberRole } from '@/types'
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

interface MemberCardProps {
  member: Member
  onEdit: () => void
  onDelete: () => void
}

const ROLE_BADGE_CLASSES: Record<MemberRole, string> = {
  owner: 'bg-yellow-100 text-yellow-800',
  engineer: 'bg-blue-100 text-blue-800',
  assistant: 'bg-green-100 text-green-800',
  intern: 'bg-gray-100 text-gray-800',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function MemberCard({
  member,
  onEdit,
  onDelete,
}: MemberCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
            {getInitials(member.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">{member.name}</p>
            <div className="flex gap-2">
              <Badge
                className={ROLE_BADGE_CLASSES[member.role]}
                variant="secondary"
              >
                {member.role}
              </Badge>
              <Badge variant="outline">{member.speciality}</Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p className="text-muted-foreground">{member.email}</p>
        <p className="font-medium">
          {member.hourlyRate.toLocaleString('ko-KR')}원/시간
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
              <AlertDialogTitle>스태프 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{member.name}&quot;을(를) 삭제하시겠습니까? 이 작업은
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
