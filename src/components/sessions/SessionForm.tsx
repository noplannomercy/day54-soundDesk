'use client'

import { useState, useEffect, useMemo } from 'react'
import { Session, SessionStatus, Room, Artist, Album, Track, Member } from '@/types'
import {
  createSession,
  updateSession,
  checkRoomAvailability,
} from '@/services/sessionService'
import { getRooms } from '@/services/roomService'
import { getArtists } from '@/services/artistService'
import { getAlbums } from '@/services/albumService'
import { getTracks } from '@/services/trackService'
import { getMembers } from '@/services/memberService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { AlertCircle } from 'lucide-react'

interface SessionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Session
}

export default function SessionForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: SessionFormProps) {
  const [roomId, setRoomId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [artistId, setArtistId] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [trackId, setTrackId] = useState('')
  const [engineerId, setEngineerId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const [rooms, setRooms] = useState<Room[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [conflicts, setConflicts] = useState<Session[]>([])

  useEffect(() => {
    if (open) {
      setRooms(getRooms())
      setArtists(getArtists())
      setAlbums(getAlbums())
      setMembers(
        getMembers().filter(
          (m) => m.role === 'engineer' || m.role === 'owner' || m.role === 'assistant'
        )
      )
    }
  }, [open])

  useEffect(() => {
    if (initialData) {
      setRoomId(initialData.roomId)
      setDate(initialData.date)
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
      setArtistId(initialData.artistId)
      setAlbumId(initialData.albumId ?? '')
      setTrackId(initialData.trackId ?? '')
      setEngineerId(initialData.engineerId)
      setNotes(initialData.notes)
    } else {
      setRoomId('')
      setDate('')
      setStartTime('')
      setEndTime('')
      setArtistId('')
      setAlbumId('')
      setTrackId('')
      setEngineerId('')
      setNotes('')
    }
    setError('')
    setConflicts([])
  }, [initialData, open])

  // Load tracks when albumId changes
  useEffect(() => {
    if (albumId) {
      setTracks(getTracks(albumId))
    } else {
      setTracks([])
      setTrackId('')
    }
  }, [albumId])

  // Check for conflicts when room, date, and time are all filled
  useEffect(() => {
    if (roomId && date && startTime && endTime && startTime < endTime) {
      const found = checkRoomAvailability(
        roomId,
        date,
        startTime,
        endTime,
        initialData?.id
      )
      setConflicts(found)
    } else {
      setConflicts([])
    }
  }, [roomId, date, startTime, endTime, initialData?.id])

  // Filter albums by selected artist
  const filteredAlbums = useMemo(() => {
    if (!artistId) return albums
    return albums.filter((a) => a.artistId === artistId)
  }, [albums, artistId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const formData = {
      roomId,
      date,
      startTime,
      endTime,
      artistId,
      albumId: albumId || null,
      trackId: trackId || null,
      engineerId,
      status: (initialData?.status ?? 'scheduled') as SessionStatus,
      notes,
    }

    try {
      if (initialData) {
        updateSession(initialData.id, formData)
      } else {
        createSession(formData)
      }
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '세션 저장에 실패했습니다.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '세션 편집' : '새 세션 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="session-room">룸</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="룸 선택" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-date">날짜</Label>
            <Input
              id="session-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-start">시작 시간</Label>
              <Input
                id="session-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-end">종료 시간</Label>
              <Input
                id="session-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {conflicts.length > 0 && (
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
              <div className="flex items-center gap-2 font-medium mb-1">
                <AlertCircle className="h-4 w-4" />
                시간 충돌 {conflicts.length}건
              </div>
              {conflicts.map((c) => (
                <div key={c.id} className="ml-6">
                  {c.date} {c.startTime}~{c.endTime}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="session-artist">아티스트</Label>
            <Select value={artistId} onValueChange={setArtistId}>
              <SelectTrigger>
                <SelectValue placeholder="아티스트 선택" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-album">앨범</Label>
            <Select
              value={albumId || '__none__'}
              onValueChange={(v) => setAlbumId(v === '__none__' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="앨범 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">없음</SelectItem>
                {filteredAlbums.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-track">트랙</Label>
            <Select
              value={trackId || '__none__'}
              onValueChange={(v) => setTrackId(v === '__none__' ? '' : v)}
              disabled={!albumId}
            >
              <SelectTrigger>
                <SelectValue placeholder={albumId ? '트랙 선택' : '앨범을 먼저 선택하세요'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">없음</SelectItem>
                {tracks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.trackNumber}. {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-engineer">엔지니어</Label>
            <Select value={engineerId} onValueChange={setEngineerId}>
              <SelectTrigger>
                <SelectValue placeholder="엔지니어 선택" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-notes">메모</Label>
            <Textarea
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="세션 관련 메모"
              rows={3}
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
            <Button type="submit" disabled={conflicts.length > 0}>
              {initialData ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
