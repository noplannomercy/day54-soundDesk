'use client'

import { useState, useEffect } from 'react'
import { Playlist, Member } from '@/types'
import { createPlaylist, updatePlaylist } from '@/services/playlistService'
import { getMembers } from '@/services/memberService'
import TrackPicker from '@/components/playlists/TrackPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface PlaylistFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Playlist
}

export default function PlaylistForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: PlaylistFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [createdBy, setCreatedBy] = useState('')
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([])
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    if (open) {
      setMembers(getMembers())
    }
  }, [open])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setIsPublic(initialData.isPublic)
      setCreatedBy(initialData.createdBy)
      try {
        setSelectedTrackIds(JSON.parse(initialData.trackIds) as string[])
      } catch {
        setSelectedTrackIds([])
      }
    } else {
      setName('')
      setDescription('')
      setIsPublic(false)
      setCreatedBy('')
      setSelectedTrackIds([])
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      name,
      description,
      trackIds: JSON.stringify(selectedTrackIds),
      isPublic,
      createdBy,
    }

    if (initialData) {
      updatePlaylist(initialData.id, formData)
    } else {
      createPlaylist(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '플레이리스트 편집' : '새 플레이리스트 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">이름</Label>
            <Input
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="플레이리스트 이름"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlist-description">설명</Label>
            <Textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="플레이리스트 설명"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="playlist-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
            />
            <Label htmlFor="playlist-public" className="cursor-pointer">
              공개
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlist-created-by">생성자</Label>
            <Select value={createdBy} onValueChange={setCreatedBy}>
              <SelectTrigger>
                <SelectValue placeholder="멤버 선택" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TrackPicker
            selectedTrackIds={selectedTrackIds}
            onChange={setSelectedTrackIds}
          />

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
