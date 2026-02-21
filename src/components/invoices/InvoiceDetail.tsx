'use client'

import { Invoice, InvoiceItem, InvoiceStatus, Currency } from '@/types'
import { updateInvoice } from '@/services/invoiceService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface InvoiceDetailProps {
  invoice: Invoice
  artistName: string
  onStatusChange: () => void
}

const STATUS_BADGE: Record<
  InvoiceStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { label: '초안', variant: 'secondary' },
  sent: { label: '발송됨', variant: 'default' },
  paid: { label: '결제 완료', variant: 'default' },
  overdue: { label: '기한 초과', variant: 'destructive' },
  cancelled: { label: '취소됨', variant: 'outline' },
}

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

function formatAmount(amount: number, currency: Currency): string {
  if (currency === 'KRW') {
    return amount.toLocaleString('ko-KR') + '원'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function InvoiceDetail({
  invoice,
  artistName,
  onStatusChange,
}: InvoiceDetailProps) {
  let items: InvoiceItem[] = []
  try {
    items = JSON.parse(invoice.items) as InvoiceItem[]
  } catch {
    // malformed data
  }

  let sessionIds: string[] = []
  try {
    sessionIds = JSON.parse(invoice.sessionIds) as string[]
  } catch {
    // malformed data
  }

  function handleStatusChange(newStatus: InvoiceStatus) {
    const update: Partial<Invoice> = { status: newStatus }
    if (newStatus === 'paid') {
      update.paidDate = new Date().toISOString().split('T')[0]
    }
    updateInvoice(invoice.id, update)
    onStatusChange()
  }

  const statusInfo = STATUS_BADGE[invoice.status]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                인보이스 #{invoice.id.slice(0, 8)}
              </p>
              <p className="text-sm text-muted-foreground">
                아티스트: {artistName}
              </p>
              <p className="text-sm text-muted-foreground">
                생성일: {new Date(invoice.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <Badge
              variant={statusInfo.variant}
              className={getStatusBadgeClass(invoice.status)}
            >
              {statusInfo.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status transition buttons */}
          <div className="flex gap-2">
            {invoice.status === 'draft' && (
              <Button size="sm" onClick={() => handleStatusChange('sent')}>
                발송
              </Button>
            )}
            {invoice.status === 'sent' && (
              <>
                <Button size="sm" onClick={() => handleStatusChange('paid')}>
                  결제 확인
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusChange('overdue')}
                >
                  기한 초과
                </Button>
              </>
            )}
            {invoice.status === 'overdue' && (
              <Button size="sm" onClick={() => handleStatusChange('paid')}>
                결제 확인
              </Button>
            )}
            {invoice.status === 'paid' && invoice.paidDate && (
              <p className="text-sm text-muted-foreground">
                결제일: {invoice.paidDate}
              </p>
            )}
          </div>

          {/* Items table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>항목</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell className="text-right">
                    {formatAmount(item.amount, invoice.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="space-y-1 rounded bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span>소계</span>
              <span>{formatAmount(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>세금</span>
              <span>{formatAmount(invoice.tax, invoice.currency)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>합계</span>
              <span>{formatAmount(invoice.total, invoice.currency)}</span>
            </div>
          </div>

          {/* Meta info */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>연결된 세션: {sessionIds.length}건</p>
            <p>결제 기한: {invoice.dueDate}</p>
            {invoice.notes && <p>비고: {invoice.notes}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
