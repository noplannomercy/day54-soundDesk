'use client'

import { useState, useEffect } from 'react'
import { Contract, ContractType, ContractStatus, Artist, Album } from '@/types'
import { createContract, updateContract } from '@/services/contractService'
import { getArtists } from '@/services/artistService'
import { getAlbums } from '@/services/albumService'
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

interface ContractFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Contract
}

const CONTRACT_TYPES: { value: ContractType; label: string }[] = [
  { value: 'session', label: '세션' },
  { value: 'album', label: '앨범' },
  { value: 'retainer', label: '리테이너' },
]

const CONTRACT_STATUSES: { value: ContractStatus; label: string }[] = [
  { value: 'draft', label: '초안' },
  { value: 'active', label: '활성' },
  { value: 'completed', label: '완료' },
  { value: 'terminated', label: '해지' },
]

export default function ContractForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: ContractFormProps) {
  const [artistId, setArtistId] = useState('')
  const [albumId, setAlbumId] = useState<string>('none')
  const [type, setType] = useState<ContractType>('session')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalValue, setTotalValue] = useState(0)
  const [terms, setTerms] = useState('')
  const [status, setStatus] = useState<ContractStatus>('draft')
  const [signedDate, setSignedDate] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    setArtists(getArtists())
    setAlbums(getAlbums())
  }, [open])

  useEffect(() => {
    if (initialData) {
      setArtistId(initialData.artistId)
      setAlbumId(initialData.albumId ?? 'none')
      setType(initialData.type)
      setStartDate(initialData.startDate)
      setEndDate(initialData.endDate)
      setTotalValue(initialData.totalValue)
      setTerms(initialData.terms)
      setStatus(initialData.status)
      setSignedDate(initialData.signedDate ?? '')
    } else {
      setArtistId('')
      setAlbumId('none')
      setType('session')
      setStartDate('')
      setEndDate('')
      setTotalValue(0)
      setTerms('')
      setStatus('draft')
      setSignedDate('')
    }
  }, [initialData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = {
      artistId,
      albumId: albumId === 'none' ? null : albumId,
      type,
      startDate,
      endDate,
      totalValue,
      terms,
      status,
      signedDate: signedDate || null,
    }

    if (initialData) {
      updateContract(initialData.id, formData)
    } else {
      createContract(formData)
    }

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '계약 편집' : '새 계약 추가'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ct-artist">아티스트</Label>
            <Select value={artistId} onValueChange={setArtistId}>
              <SelectTrigger id="ct-artist">
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
            <Label htmlFor="ct-album">앨범 (선택사항)</Label>
            <Select value={albumId} onValueChange={setAlbumId}>
              <SelectTrigger id="ct-album">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                {albums.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ct-type">계약 유형</Label>
              <Select value={type} onValueChange={(v) => setType(v as ContractType)}>
                <SelectTrigger id="ct-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-status">상태</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ContractStatus)}>
                <SelectTrigger id="ct-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ct-start">시작일</Label>
              <Input
                id="ct-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-end">종료일</Label>
              <Input
                id="ct-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-value">계약 금액 (원)</Label>
            <Input
              id="ct-value"
              type="number"
              min={0}
              value={totalValue}
              onChange={(e) => setTotalValue(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-terms">계약 조건</Label>
            <Textarea
              id="ct-terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="계약 조건을 입력하세요"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-signed">서명일 (선택사항)</Label>
            <Input
              id="ct-signed"
              type="date"
              value={signedDate}
              onChange={(e) => setSignedDate(e.target.value)}
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
