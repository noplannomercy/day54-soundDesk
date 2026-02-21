'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Invoice } from '@/types'
import { getInvoiceById } from '@/services/invoiceService'
import { getArtistById } from '@/services/artistService'
import MainLayout from '@/components/layout/MainLayout'
import InvoiceDetail from '@/components/invoices/InvoiceDetail'
import { Button } from '@/components/ui/button'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [artistName, setArtistName] = useState('')

  function loadData() {
    const found = getInvoiceById(id)
    setInvoice(found ?? null)
    if (found) {
      const artist = getArtistById(found.artistId)
      setArtistName(artist?.name ?? '알 수 없음')
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!invoice) {
    return (
      <MainLayout title="인보이스 상세">
        <p className="text-muted-foreground">
          인보이스를 찾을 수 없습니다.
        </p>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={`인보이스 #${invoice.id.slice(0, 8)}`}>
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/invoices')}>
          목록으로
        </Button>
        <InvoiceDetail
          invoice={invoice}
          artistName={artistName}
          onStatusChange={loadData}
        />
      </div>
    </MainLayout>
  )
}
