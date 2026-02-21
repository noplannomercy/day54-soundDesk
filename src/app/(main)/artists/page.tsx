'use client'

import { useState, useEffect, useMemo } from 'react'
import { Artist } from '@/types'
import { getArtists, deleteArtist } from '@/services/artistService'
import MainLayout from '@/components/layout/MainLayout'
import ArtistCard from '@/components/artists/ArtistCard'
import ArtistForm from '@/components/artists/ArtistForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [search, setSearch] = useState('')
  const [filterGenre, setFilterGenre] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingArtist, setEditingArtist] = useState<Artist | undefined>(
    undefined
  )

  function loadArtists() {
    setArtists(getArtists())
  }

  useEffect(() => {
    loadArtists()
  }, [])

  const uniqueGenres = useMemo(
    () => [...new Set(artists.map((a) => a.genre))],
    [artists]
  )

  const filteredArtists = useMemo(() => {
    return artists
      .filter(
        (a) =>
          !search ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.label.toLowerCase().includes(search.toLowerCase())
      )
      .filter((a) => filterGenre === 'all' || a.genre === filterGenre)
  }, [artists, search, filterGenre])

  function handleEdit(artist: Artist) {
    setEditingArtist(artist)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteArtist(id)
    loadArtists()
  }

  function handleFormSuccess() {
    loadArtists()
    setEditingArtist(undefined)
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditingArtist(undefined)
    }
  }

  return (
    <MainLayout title="아티스트 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">아티스트</h2>
          <Button onClick={() => setFormOpen(true)}>새 아티스트 추가</Button>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="이름, 레이블 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterGenre} onValueChange={setFilterGenre}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="전체 장르" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 장르</SelectItem>
              {uniqueGenres.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredArtists.length === 0 ? (
          <p className="text-muted-foreground">등록된 아티스트가 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onEdit={() => handleEdit(artist)}
                onDelete={() => handleDelete(artist.id)}
              />
            ))}
          </div>
        )}

        <ArtistForm
          open={formOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleFormSuccess}
          initialData={editingArtist}
        />
      </div>
    </MainLayout>
  )
}
