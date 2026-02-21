'use client'

import { useState, useEffect, useMemo } from 'react'
import { Album, Track } from '@/types'
import { getAlbums } from '@/services/albumService'
import { getTracks } from '@/services/trackService'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUp, ArrowDown, X } from 'lucide-react'

interface TrackPickerProps {
  selectedTrackIds: string[]
  onChange: (trackIds: string[]) => void
}

function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export default function TrackPicker({ selectedTrackIds, onChange }: TrackPickerProps) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState('')
  const [albumTracks, setAlbumTracks] = useState<Track[]>([])

  useEffect(() => {
    setAlbums(getAlbums())
  }, [])

  useEffect(() => {
    if (selectedAlbumId) {
      setAlbumTracks(getTracks(selectedAlbumId))
    } else {
      setAlbumTracks([])
    }
  }, [selectedAlbumId])

  // Build a map of trackId -> Track for selected tracks display
  const selectedTracksMap = useMemo(() => {
    const map = new Map<string, Track>()
    albumTracks.forEach((t) => map.set(t.id, t))
    return map
  }, [albumTracks])

  // For tracks that were previously selected but are from different albums,
  // we need to look them up. We collect all track info we can from albumTracks.
  // The ordered list will show track title if known, otherwise the ID.
  const allKnownTracks = useMemo(() => {
    const map = new Map<string, Track>()
    // Include current album tracks
    albumTracks.forEach((t) => map.set(t.id, t))
    return map
  }, [albumTracks])

  function handleToggleTrack(trackId: string, checked: boolean) {
    if (checked) {
      onChange([...selectedTrackIds, trackId])
    } else {
      onChange(selectedTrackIds.filter((id) => id !== trackId))
    }
  }

  function handleMoveUp(index: number) {
    if (index <= 0) return
    const next = [...selectedTrackIds]
    const temp = next[index - 1]
    next[index - 1] = next[index]
    next[index] = temp
    onChange(next)
  }

  function handleMoveDown(index: number) {
    if (index >= selectedTrackIds.length - 1) return
    const next = [...selectedTrackIds]
    const temp = next[index + 1]
    next[index + 1] = next[index]
    next[index] = temp
    onChange(next)
  }

  function handleRemove(trackId: string) {
    onChange(selectedTrackIds.filter((id) => id !== trackId))
  }

  return (
    <div className="space-y-4">
      {/* Album selector */}
      <div className="space-y-2">
        <Label>앨범 선택</Label>
        <Select value={selectedAlbumId} onValueChange={setSelectedAlbumId}>
          <SelectTrigger>
            <SelectValue placeholder="앨범을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {albums.map((album) => (
              <SelectItem key={album.id} value={album.id}>
                {album.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Track checkboxes from selected album */}
      {selectedAlbumId && albumTracks.length > 0 && (
        <div className="space-y-2">
          <Label>트랙 목록</Label>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
            {albumTracks.map((track) => {
              const isSelected = selectedTrackIds.includes(track.id)
              return (
                <label
                  key={track.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded px-2 py-1"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleToggleTrack(track.id, checked === true)
                    }
                  />
                  <span className="flex-1 text-sm">
                    {track.trackNumber}. {track.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(track.duration)}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {selectedAlbumId && albumTracks.length === 0 && (
        <p className="text-sm text-muted-foreground">이 앨범에 트랙이 없습니다.</p>
      )}

      {/* Selected tracks ordered list */}
      {selectedTrackIds.length > 0 && (
        <div className="space-y-2">
          <Label>선택된 트랙 ({selectedTrackIds.length}곡)</Label>
          <div className="border rounded-md divide-y">
            {selectedTrackIds.map((trackId, index) => {
              const track = allKnownTracks.get(trackId)
              return (
                <div
                  key={trackId}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <span className="text-sm text-muted-foreground w-6 text-right">
                    {index + 1}.
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {track ? track.title : trackId.slice(0, 8)}
                  </span>
                  {track && (
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(track.duration)}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedTrackIds.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleRemove(trackId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
