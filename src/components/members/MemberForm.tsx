'use client'

import { useState, useEffect } from 'react'
import { Member, MemberRole, MemberSpeciality } from '@/types'
import { createMember, updateMember } from '@/services/memberService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface MemberFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Member
}

const ROLES: { value: MemberRole; label: string }[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'assistant', label: 'Assistant' },
  { value: 'intern', label: 'Intern' },
]

const SPECIALITIES: { value: MemberSpeciality; label: string }[] = [
  { value: 'recording', label: 'Recording' },
  { value: 'mixing', label: 'Mixing' },
  { value: 'mastering', label: 'Mastering' },
  { value: 'general', label: 'General' },
]

export default function MemberForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: MemberFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<MemberRole>('engineer')
  const [speciality, setSpeciality] = useState<MemberSpeciality>('general')
  const [hourlyRate, setHourlyRate] = useState(0)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setEmail(initialData.email)
      setPhone(initialData.phone)
      setRole(initialData.role)
      setSpeciality(initialData.speciality)
      setHourlyRate(initialData.hourlyRate)
    } else {
      setName('')
      setEmail('')
      setPhone('')
      setRole('engineer')
      setSpeciality('general')
      setHourlyRate(0)
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      name,
      email,
      phone,
      role,
      speciality,
      hourlyRate,
      avatar: initialData?.avatar ?? null,
    }

    if (initialData) {
      updateMember(initialData.id, formData)
    } else {
      createMember(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '스태프 편집' : '새 스태프 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-name">이름</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="스태프 이름"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-email">이메일</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-phone">전화번호</Label>
            <Input
              id="member-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">역할</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as MemberRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-speciality">전문 분야</Label>
            <Select
              value={speciality}
              onValueChange={(v) => setSpeciality(v as MemberSpeciality)}
            >
              <SelectTrigger>
                <SelectValue placeholder="전문 분야 선택" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALITIES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-rate">시급 (원)</Label>
            <Input
              id="member-rate"
              type="number"
              min={0}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              required
            />
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
