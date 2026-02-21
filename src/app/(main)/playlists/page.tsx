'use client'

import { useState, useEffect, useMemo } from 'react'
import { Playlist, Track, STORAGE_KEYS, Member } from '@/types'
import { getPlaylists, deletePlaylist } from '@/services/playlistService'
import { getMembers } from '@/services/memberService'
import { getAll } from '@/lib/storage'
import MainLayout from '@/components/layout/MainLayout'
import PlaylistForm from '@/components/playlists/PlaylistForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListMusic, Pencil, Trash2 } from 'lucide-react'

function formatTotalDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0분 0초'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}분 ${seconds}초`
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [allTracks, setAllTracks] = useState<Track[]>([])
  const [filterPublic, setFilterPublic] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | undefined>(undefined)

  function loadData() {
    setPlaylists(getPlaylists())
    setMembers(getMembers())
    setAllTracks(getAll<Track>(STORAGE_KEYS.TRACKS))
  }

  useEffect(() => {
    loadData()
  }, [])

  const trackMap = useMemo(() => {
    const map = new Map<string, Track>()
    allTracks.forEach((t) => map.set(t.id, t))
    return map
  }, [allTracks])

  const memberMap = useMemo(() => {
    const map = new Map<string, string>()
    members.forEach((m) => map.set(m.id, m.name))
    return map
  }, [members])

  const filteredPlaylists = useMemo(() => {
    return playlists.filter((pl) => {
      if (filterPublic === 'public' && !pl.isPublic) return false
      if (filterPublic === 'private' && pl.isPublic) return false
      return true
    })
  }, [playlists, filterPublic])

  function getTrackCount(playlist: Playlist): number {
    try {
      const ids = JSON.parse(playlist.trackIds) as string[]
      return ids.length
    } catch {
      return 0
    }
  }

  function getTotalDuration(playlist: Playlist): number {
    try {
      const ids = JSON.parse(playlist.trackIds) as string[]
      return ids.reduce((sum, id) => {
        const track = trackMap.get(id)
        return sum + (track ? track.duration : 0)
      }, 0)
    } catch {
      return 0
    }
  }

  function getMemberName(memberId: string): string {
    return memberMap.get(memberId) ?? '알 수 없음'
  }

  function handleAdd() {
    setEditingPlaylist(undefined)
    setFormOpen(true)
  }

  function handleEdit(playlist: Playlist) {
    setEditingPlaylist(playlist)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deletePlaylist(id)
    loadData()
  }

  function handleSuccess() {
    loadData()
  }

  return (
    <MainLayout title="플레이리스트">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            총 {filteredPlaylists.length}개의 플레이리스트
          </p>
          <Button onClick={handleAdd}>새 플레이리스트 추가</Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={filterPublic}
            onValueChange={(v) => setFilterPublic(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="공개 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="public">공개</SelectItem>
              <SelectItem value="private">비공개</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {playlists.length === 0
                ? '등록된 플레이리스트가 없습니다.'
                : '필터 조건에 맞는 플레이리스트가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlaylists.map((playlist) => (
              <Card key={playlist.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <ListMusic className="h-5 w-5 shrink-0 text-muted-foreground" />
                      <CardTitle className="truncate">{playlist.name}</CardTitle>
                    </div>
                    <Badge variant={playlist.isPublic ? 'default' : 'secondary'}>
                      {playlist.isPublic ? '공개' : '비공개'}
                    </Badge>
                  </div>
                  {playlist.description && (
                    <CardDescription className="line-clamp-2">
                      {playlist.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">트랙 수</span>
                      <span>{getTrackCount(playlist)}곡</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">총 재생시간</span>
                      <span>{formatTotalDuration(getTotalDuration(playlist))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">생성자</span>
                      <span>{getMemberName(playlist.createdBy)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(playlist)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    편집
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(playlist.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <PlaylistForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleSuccess}
        initialData={editingPlaylist}
      />
    </MainLayout>
  )
}
