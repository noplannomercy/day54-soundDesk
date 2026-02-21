'use client'

import { useState, useEffect } from 'react'
import { Artist } from '@/types'
import { createArtist, updateArtist } from '@/services/artistService'
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

interface ArtistFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Artist
}

export default function ArtistForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: ArtistFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [genre, setGenre] = useState('')
  const [label, setLabel] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setEmail(initialData.email)
      setPhone(initialData.phone)
      setGenre(initialData.genre)
      setLabel(initialData.label)
      setBio(initialData.bio)
    } else {
      setName('')
      setEmail('')
      setPhone('')
      setGenre('')
      setLabel('')
      setBio('')
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      name,
      email,
      phone,
      genre,
      label,
      bio,
      avatar: initialData?.avatar ?? null,
    }

    if (initialData) {
      updateArtist(initialData.id, formData)
    } else {
      createArtist(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '아티스트 편집' : '새 아티스트 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="artist-name">이름</Label>
            <Input
              id="artist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="아티스트 이름"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist-email">이메일</Label>
            <Input
              id="artist-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist-phone">전화번호</Label>
            <Input
              id="artist-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist-genre">장르</Label>
            <Input
              id="artist-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="예: indie rock, k-pop, jazz"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist-label">레이블</Label>
            <Input
              id="artist-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="소속 레이블"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist-bio">소개</Label>
            <textarea
              id="artist-bio"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="아티스트 소개"
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
