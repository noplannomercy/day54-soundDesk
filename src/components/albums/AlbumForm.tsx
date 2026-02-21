'use client'

import { useState, useEffect } from 'react'
import { Album, AlbumStatus, Artist } from '@/types'
import { createAlbum, updateAlbum } from '@/services/albumService'
import { getArtists } from '@/services/artistService'
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

interface AlbumFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Album
}

const ALBUM_STATUSES: { value: AlbumStatus; label: string }[] = [
  { value: 'planning', label: '기획' },
  { value: 'recording', label: '녹음' },
  { value: 'mixing', label: '믹싱' },
  { value: 'mastering', label: '마스터링' },
  { value: 'released', label: '발매' },
]

export default function AlbumForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: AlbumFormProps) {
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [status, setStatus] = useState<AlbumStatus>('planning')
  const [artistId, setArtistId] = useState('')
  const [totalTracks, setTotalTracks] = useState(0)
  const [artists, setArtists] = useState<Artist[]>([])

  useEffect(() => {
    if (open) {
      setArtists(getArtists())
    }
  }, [open])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setGenre(initialData.genre)
      setReleaseDate(initialData.releaseDate ?? '')
      setStatus(initialData.status)
      setArtistId(initialData.artistId)
      setTotalTracks(initialData.totalTracks)
    } else {
      setTitle('')
      setGenre('')
      setReleaseDate('')
      setStatus('planning')
      setArtistId('')
      setTotalTracks(0)
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      title,
      genre,
      releaseDate: releaseDate || null,
      status,
      artistId,
      totalTracks,
      coverArt: initialData?.coverArt ?? null,
    }

    if (initialData) {
      updateAlbum(initialData.id, formData)
    } else {
      createAlbum(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? '앨범 편집' : '새 앨범 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="album-title">앨범 제목</Label>
            <Input
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="앨범 제목"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-artist">아티스트</Label>
            <Select value={artistId} onValueChange={setArtistId}>
              <SelectTrigger>
                <SelectValue placeholder="아티스트 선택" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-genre">장르</Label>
            <Input
              id="album-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="장르"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-total-tracks">총 트랙 수</Label>
            <Input
              id="album-total-tracks"
              type="number"
              min={0}
              value={totalTracks}
              onChange={(e) => setTotalTracks(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-release-date">발매일</Label>
            <Input
              id="album-release-date"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-status">상태</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as AlbumStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                {ALBUM_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
