'use client'

import { useState, useEffect } from 'react'
import { Studio } from '@/types'
import { createStudio, updateStudio } from '@/services/studioService'
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

interface StudioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Studio
}

export default function StudioForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: StudioFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [openTime, setOpenTime] = useState('09:00')
  const [closeTime, setCloseTime] = useState('22:00')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setAddress(initialData.address)
      setPhone(initialData.phone)
      setEmail(initialData.email)
      setOpenTime(initialData.openTime)
      setCloseTime(initialData.closeTime)
    } else {
      setName('')
      setDescription('')
      setAddress('')
      setPhone('')
      setEmail('')
      setOpenTime('09:00')
      setCloseTime('22:00')
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      name,
      description,
      address,
      phone,
      email,
      openTime,
      closeTime,
    }

    if (initialData) {
      updateStudio(formData)
    } else {
      createStudio(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '스튜디오 편집' : '스튜디오 등록'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studio-name">이름</Label>
            <Input
              id="studio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="스튜디오 이름"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-description">설명</Label>
            <textarea
              id="studio-description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="스튜디오 설명"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-address">주소</Label>
            <Input
              id="studio-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studio-phone">전화번호</Label>
              <Input
                id="studio-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="02-1234-5678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio-email">이메일</Label>
              <Input
                id="studio-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@studio.kr"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studio-open">운영 시작</Label>
              <Input
                id="studio-open"
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio-close">운영 종료</Label>
              <Input
                id="studio-close"
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                required
              />
            </div>
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
              {initialData ? '수정' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
