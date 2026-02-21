'use client'

import { useState, useEffect, useMemo } from 'react'
import { Contract, Artist } from '@/types'
import { getContracts, deleteContract, getDaysUntilExpiry } from '@/services/contractService'
import { getArtists } from '@/services/artistService'
import MainLayout from '@/components/layout/MainLayout'
import ContractCard from '@/components/contracts/ContractCard'
import ContractForm from '@/components/contracts/ContractForm'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [filterArtist, setFilterArtist] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | undefined>(undefined)

  function loadData() {
    setContracts(getContracts())
    setArtists(getArtists())
  }

  useEffect(() => {
    loadData()
  }, [])

  const artistNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    artists.forEach((a) => { map[a.id] = a.name })
    return map
  }, [artists])

  const filteredContracts = useMemo(() => {
    return contracts
      .filter((c) => filterArtist === 'all' || c.artistId === filterArtist)
      .filter((c) => filterType === 'all' || c.type === filterType)
      .filter((c) => filterStatus === 'all' || c.status === filterStatus)
  }, [contracts, filterArtist, filterType, filterStatus])

  const expiringContracts = useMemo(() => {
    return contracts.filter(
      (c) => c.status === 'active' && getDaysUntilExpiry(c.endDate) <= 30
    )
  }, [contracts])

  function handleEdit(contract: Contract) {
    setEditingContract(contract)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteContract(id)
    loadData()
  }

  function handleFormSuccess() {
    loadData()
    setEditingContract(undefined)
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditingContract(undefined)
    }
  }

  return (
    <MainLayout title="계약 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">계약 관리</h2>
          <Button onClick={() => setFormOpen(true)}>새 계약 추가</Button>
        </div>

        {expiringContracts.length > 0 && (
          <div className="rounded-lg border border-orange-300 bg-orange-50 p-4 space-y-3">
            <h3 className="text-lg font-semibold text-orange-800">
              만료 임박 계약
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {expiringContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  artistName={artistNameMap[contract.artistId] ?? '알 수 없음'}
                  onEdit={() => handleEdit(contract)}
                  onDelete={() => handleDelete(contract.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Select value={filterArtist} onValueChange={setFilterArtist}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="아티스트" />
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

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 유형</SelectItem>
              <SelectItem value="session">세션</SelectItem>
              <SelectItem value="album">앨범</SelectItem>
              <SelectItem value="retainer">리테이너</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="terminated">해지</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredContracts.length === 0 ? (
          <p className="text-muted-foreground">등록된 계약이 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                artistName={artistNameMap[contract.artistId] ?? '알 수 없음'}
                onEdit={() => handleEdit(contract)}
                onDelete={() => handleDelete(contract.id)}
              />
            ))}
          </div>
        )}

        <ContractForm
          open={formOpen}
          onOpenChange={handleOpenChange}
          onSuccess={handleFormSuccess}
          initialData={editingContract}
        />
      </div>
    </MainLayout>
  )
}
