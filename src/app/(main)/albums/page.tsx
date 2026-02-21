'use client'

import { useState, useEffect, useMemo } from 'react'
import { Album, AlbumStatus, Artist } from '@/types'
import { getAlbums, deleteAlbum } from '@/services/albumService'
import { getArtists } from '@/services/artistService'
import { getTracks } from '@/services/trackService'
import MainLayout from '@/components/layout/MainLayout'
import AlbumCard from '@/components/albums/AlbumCard'
import AlbumForm from '@/components/albums/AlbumForm'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const STATUS_OPTIONS: { value: AlbumStatus; label: string }[] = [
  { value: 'planning', label: '기획' },
  { value: 'recording', label: '녹음' },
  { value: 'mixing', label: '믹싱' },
  { value: 'mastering', label: '마스터링' },
  { value: 'released', label: '발매' },
]

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [trackCounts, setTrackCounts] = useState<Record<string, number>>({})
  const [filterStatus, setFilterStatus] = useState('')
  const [filterGenre, setFilterGenre] = useState('')
  const [filterArtistId, setFilterArtistId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | undefined>(undefined)

  function loadData() {
    const loadedAlbums = getAlbums()
    setAlbums(loadedAlbums)
    setArtists(getArtists())
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const counts: Record<string, number> = {}
    albums.forEach((a) => {
      counts[a.id] = getTracks(a.id).filter((t) => t.status === 'final').length
    })
    setTrackCounts(counts)
  }, [albums])

  const genres = useMemo(() => {
    const genreSet = new Set(albums.map((a) => a.genre).filter(Boolean))
    return Array.from(genreSet).sort()
  }, [albums])

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      if (filterStatus && album.status !== filterStatus) return false
      if (filterGenre && album.genre !== filterGenre) return false
      if (filterArtistId && album.artistId !== filterArtistId) return false
      return true
    })
  }, [albums, filterStatus, filterGenre, filterArtistId])

  function handleEdit(album: Album) {
    setEditingAlbum(album)
    setFormOpen(true)
  }

  function handleAdd() {
    setEditingAlbum(undefined)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteAlbum(id)
    loadData()
  }

  function handleSuccess() {
    loadData()
  }

  function getArtistName(artistId: string): string {
    return artists.find((a) => a.id === artistId)?.name ?? '알 수 없음'
  }

  return (
    <MainLayout title="앨범 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            총 {filteredAlbums.length}개의 앨범
          </p>
          <Button onClick={handleAdd}>새 앨범 추가</Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterGenre}
            onValueChange={(v) => setFilterGenre(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="장르 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 장르</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterArtistId}
            onValueChange={(v) => setFilterArtistId(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="아티스트 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 아티스트</SelectItem>
              {artists.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredAlbums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {albums.length === 0
                ? '등록된 앨범이 없습니다.'
                : '필터 조건에 맞는 앨범이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                artistName={getArtistName(album.artistId)}
                finalTracks={trackCounts[album.id] ?? 0}
                onEdit={() => handleEdit(album)}
                onDelete={() => handleDelete(album.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AlbumForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleSuccess}
        initialData={editingAlbum}
      />
    </MainLayout>
  )
}
