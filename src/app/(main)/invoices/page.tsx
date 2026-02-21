'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Invoice, InvoiceStatus, Currency } from '@/types'
import { getInvoices } from '@/services/invoiceService'
import { getArtists } from '@/services/artistService'
import MainLayout from '@/components/layout/MainLayout'
import InvoiceForm from '@/components/invoices/InvoiceForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'draft', label: '초안' },
  { value: 'sent', label: '발송됨' },
  { value: 'paid', label: '결제 완료' },
  { value: 'overdue', label: '기한 초과' },
  { value: 'cancelled', label: '취소됨' },
]

function getStatusBadgeClass(status: InvoiceStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'sent':
      return 'bg-blue-100 text-blue-800'
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'overdue':
      return 'bg-red-100 text-red-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-500'
  }
}

function getStatusLabel(status: InvoiceStatus): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

function formatAmount(amount: number, currency: Currency): string {
  if (currency === 'KRW') {
    return amount.toLocaleString('ko-KR') + '원'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [artistMap, setArtistMap] = useState<Record<string, string>>({})
  const [filterArtist, setFilterArtist] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  function loadData() {
    setInvoices(getInvoices())
    const map: Record<string, string> = {}
    for (const a of getArtists()) {
      map[a.id] = a.name
    }
    setArtistMap(map)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => filterArtist === 'all' || inv.artistId === filterArtist)
      .filter((inv) => filterStatus === 'all' || inv.status === filterStatus)
  }, [invoices, filterArtist, filterStatus])

  // Monthly revenue chart data — group paid invoices by month
  const revenueData = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const months: { name: string; revenue: number }[] = []

    for (let m = 0; m < 12; m++) {
      const monthStr = String(m + 1).padStart(2, '0')
      months.push({ name: `${monthStr}월`, revenue: 0 })
    }

    const paidInvoices = invoices.filter((inv) => inv.status === 'paid')
    for (const inv of paidInvoices) {
      const d = new Date(inv.createdAt)
      if (d.getFullYear() === year) {
        months[d.getMonth()].revenue += inv.total
      }
    }

    return months
  }, [invoices])

  function handleFormSuccess() {
    loadData()
  }

  return (
    <MainLayout title="인보이스 관리">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">인보이스</h2>
          <Button onClick={() => setFormOpen(true)}>새 인보이스 추가</Button>
        </div>

        <div className="flex gap-4">
          <Select value={filterArtist} onValueChange={setFilterArtist}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="전체 아티스트" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 아티스트</SelectItem>
              {Object.entries(artistMap).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="전체 상태" />
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
        </div>

        {/* Revenue chart */}
        <div className="rounded border p-4">
          <h3 className="mb-4 text-lg font-semibold">월별 매출</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number | string | undefined) =>
                  value !== undefined ? Number(value).toLocaleString('ko-KR') + '원' : ''
                }
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice table */}
        {filteredInvoices.length === 0 ? (
          <p className="text-muted-foreground">인보이스가 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>아티스트</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">합계</TableHead>
                <TableHead>기한</TableHead>
                <TableHead>생성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/invoices/${inv.id}`)}
                >
                  <TableCell>
                    {artistMap[inv.artistId] ?? '알 수 없음'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusBadgeClass(inv.status)}
                    >
                      {getStatusLabel(inv.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(inv.total, inv.currency)}
                  </TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell>
                    {new Date(inv.createdAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <InvoiceForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSuccess={handleFormSuccess}
        />
      </div>
    </MainLayout>
  )
}
