'use client'

import { useState, useEffect } from 'react'
import { Invoice, InvoiceItem, Currency, Session } from '@/types'
import { createInvoice, getInvoices, calculateInvoiceFromSessions } from '@/services/invoiceService'
import { getArtists } from '@/services/artistService'
import { getSessions } from '@/services/sessionService'
import { getRoomById } from '@/services/roomService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: Invoice
}

export default function InvoiceForm({
  open,
  onOpenChange,
  onSuccess,
}: InvoiceFormProps) {
  const [artistId, setArtistId] = useState('')
  const [currency, setCurrency] = useState<Currency>('KRW')
  const [tax, setTax] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([])
  const [calculatedItems, setCalculatedItems] = useState<InvoiceItem[]>([])
  const [subtotal, setSubtotal] = useState(0)

  const [artists, setArtists] = useState<{ id: string; name: string }[]>([])
  const [availableSessions, setAvailableSessions] = useState<Session[]>([])

  useEffect(() => {
    if (open) {
      setArtists(getArtists().map((a) => ({ id: a.id, name: a.name })))
      resetForm()
    }
  }, [open])

  // When artist changes, load sessions that are not already in paid invoices
  useEffect(() => {
    if (!artistId) {
      setAvailableSessions([])
      setSelectedSessionIds([])
      return
    }

    const artistSessions = getSessions({ artistId })
    const allInvoices = getInvoices()

    // Collect session IDs that are already attached to non-draft invoices
    const invoicedSessionIds = new Set<string>()
    for (const inv of allInvoices) {
      if (inv.status === 'paid' || inv.status === 'sent') {
        try {
          const ids = JSON.parse(inv.sessionIds) as string[]
          ids.forEach((sid) => invoicedSessionIds.add(sid))
        } catch {
          // skip malformed data
        }
      }
    }

    const available = artistSessions.filter(
      (s) => !invoicedSessionIds.has(s.id)
    )
    setAvailableSessions(available)
    setSelectedSessionIds([])
    setCalculatedItems([])
    setSubtotal(0)
  }, [artistId])

  // Recalculate when session selection changes
  useEffect(() => {
    if (selectedSessionIds.length === 0) {
      setCalculatedItems([])
      setSubtotal(0)
      return
    }
    const result = calculateInvoiceFromSessions(selectedSessionIds)
    setCalculatedItems(result.items)
    setSubtotal(result.subtotal)
  }, [selectedSessionIds])

  function resetForm() {
    setArtistId('')
    setCurrency('KRW')
    setTax(0)
    setDueDate('')
    setNotes('')
    setSelectedSessionIds([])
    setCalculatedItems([])
    setSubtotal(0)
  }

  function toggleSession(sessionId: string) {
    setSelectedSessionIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    )
  }

  function formatAmount(amount: number): string {
    if (currency === 'KRW') {
      return amount.toLocaleString('ko-KR') + '원'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  function getRoomName(roomId: string): string {
    const room = getRoomById(roomId)
    return room?.name ?? '알 수 없는 룸'
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!artistId || selectedSessionIds.length === 0) return

    const total = subtotal + tax

    createInvoice({
      artistId,
      sessionIds: JSON.stringify(selectedSessionIds),
      items: JSON.stringify(calculatedItems),
      subtotal,
      tax,
      total,
      currency,
      status: 'draft',
      dueDate,
      paidDate: null,
      notes,
    })

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>새 인보이스 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>아티스트</Label>
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

          {artistId && (
            <div className="space-y-2">
              <Label>세션 선택</Label>
              {availableSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  인보이스에 추가할 수 있는 세션이 없습니다.
                </p>
              ) : (
                <div className="max-h-48 space-y-2 overflow-y-auto rounded border p-3">
                  {availableSessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`session-${session.id}`}
                        checked={selectedSessionIds.includes(session.id)}
                        onCheckedChange={() => toggleSession(session.id)}
                      />
                      <label
                        htmlFor={`session-${session.id}`}
                        className="text-sm"
                      >
                        {session.date} | {getRoomName(session.roomId)} |{' '}
                        {session.startTime}-{session.endTime}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {calculatedItems.length > 0 && (
            <div className="space-y-2">
              <Label>항목 내역</Label>
              <div className="rounded border p-3">
                {calculatedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b py-1 text-sm last:border-0"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium">
                      {formatAmount(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                  <span>소계</span>
                  <span>{formatAmount(subtotal)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>통화</Label>
              <Select
                value={currency}
                onValueChange={(v) => setCurrency(v as Currency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KRW">KRW (원)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-tax">세금</Label>
              <Input
                id="invoice-tax"
                type="number"
                min={0}
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-between rounded bg-muted p-3 font-semibold">
            <span>합계</span>
            <span>{formatAmount(subtotal + tax)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-due-date">결제 기한</Label>
            <Input
              id="invoice-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-notes">비고</Label>
            <Textarea
              id="invoice-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="비고 사항"
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
            <Button
              type="submit"
              disabled={!artistId || selectedSessionIds.length === 0}
            >
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
