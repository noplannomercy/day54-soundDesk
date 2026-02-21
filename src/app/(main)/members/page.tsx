'use client'

import { useState, useEffect, useMemo } from 'react'
import { Member, MemberRole, MemberSpeciality } from '@/types'
import { getMembers, deleteMember } from '@/services/memberService'
import { getSessions } from '@/services/sessionService'
import MainLayout from '@/components/layout/MainLayout'
import MemberCard from '@/components/members/MemberCard'
import MemberForm from '@/components/members/MemberForm'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filterRole, setFilterRole] = useState('all')
  const [filterSpeciality, setFilterSpeciality] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | undefined>(
    undefined
  )
  const [monthlySessionCounts, setMonthlySessionCounts] = useState<
    Record<string, number>
  >({})

  function loadMembers() {
    const allMembers = getMembers()
    setMembers(allMembers)

    // Calculate monthly session counts per member
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const counts: Record<string, number> = {}
    for (const member of allMembers) {
      counts[member.id] = getSessions({
        engineerId: member.id,
        dateFrom: monthStart,
        dateTo: monthEnd,
      }).length
    }
    setMonthlySessionCounts(counts)
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => filterRole === 'all' || m.role === filterRole)
      .filter((m) => filterSpeciality === 'all' || m.speciality === filterSpeciality)
  }, [members, filterRole, filterSpeciality])

  function handleEdit(member: Member) {
    setEditingMember(member)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteMember(id)
    loadMembers()
  }

  function handleFormSuccess() {
    loadMembers()
    setEditingMember(undefined)
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditingMember(undefined)
    }
  }

  return (
    <MainLayout title="스태프 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">스태프</h2>
          <Button onClick={() => setFormOpen(true)}>새 스태프 추가</Button>
        </div>

        <div className="flex gap-4">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="전체 역할" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 역할</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSpeciality} onValueChange={setFilterSpeciality}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="전체 전문 분야" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 전문 분야</SelectItem>
              {SPECIALITIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredMembers.length === 0 ? (
          <p className="text-muted-foreground">등록된 스태프가 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <div key={member.id}>
                <MemberCard
                  member={member}
                  onEdit={() => handleEdit(member)}
                  onDelete={() => handleDelete(member.id)}
                />
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  이번 달 세션: {monthlySessionCounts[member.id] ?? 0}건
                </p>
              </div>
            ))}
          </div>
        )}

        <MemberForm
          open={formOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleFormSuccess}
          initialData={editingMember}
        />
      </div>
    </MainLayout>
  )
}
