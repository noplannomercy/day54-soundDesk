import { Invoice, InvoiceStatus, InvoiceItem, STORAGE_KEYS } from '@/types'
import { getAll, getById, save, generateId } from '@/lib/storage'
import { getSessionById } from '@/services/sessionService'
import { getRoomById } from '@/services/roomService'
import { getMemberById } from '@/services/memberService'

/**
 * Retrieve all invoices, optionally filtered by artistId and/or status.
 */
export function getInvoices(filters?: {
  artistId?: string
  status?: InvoiceStatus
}): Invoice[] {
  let invoices = getAll<Invoice>(STORAGE_KEYS.INVOICES)

  if (filters?.artistId) {
    invoices = invoices.filter((inv) => inv.artistId === filters.artistId)
  }

  if (filters?.status) {
    invoices = invoices.filter((inv) => inv.status === filters.status)
  }

  return invoices
}

/**
 * Find a single invoice by ID.
 */
export function getInvoiceById(id: string): Invoice | undefined {
  return getById<Invoice>(STORAGE_KEYS.INVOICES, id)
}

/**
 * Create a new invoice and persist it.
 */
export function createInvoice(
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Invoice {
  const now = new Date().toISOString()
  const invoice: Invoice = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  const invoices = getAll<Invoice>(STORAGE_KEYS.INVOICES)
  invoices.push(invoice)
  save(STORAGE_KEYS.INVOICES, invoices)
  return invoice
}

/**
 * Partially update an existing invoice by ID.
 * Returns the updated invoice.
 */
export function updateInvoice(
  id: string,
  data: Partial<Omit<Invoice, 'id' | 'createdAt'>>
): Invoice {
  const invoices = getAll<Invoice>(STORAGE_KEYS.INVOICES)
  let updated: Invoice | undefined

  const updatedInvoices = invoices.map((invoice) => {
    if (invoice.id === id) {
      updated = { ...invoice, ...data, updatedAt: new Date().toISOString() }
      return updated
    }
    return invoice
  })

  save(STORAGE_KEYS.INVOICES, updatedInvoices)
  return updated!
}

/**
 * Delete an invoice by ID.
 */
export function deleteInvoice(id: string): void {
  const invoices = getAll<Invoice>(STORAGE_KEYS.INVOICES)
  save(
    STORAGE_KEYS.INVOICES,
    invoices.filter((inv) => inv.id !== id)
  )
}

/**
 * Calculate invoice line items from a list of session IDs.
 *
 * For each session, computes room usage cost based on hourly rate and
 * duration, plus engineer cost if an engineer is assigned and found.
 */
export function calculateInvoiceFromSessions(
  sessionIds: string[]
): { items: InvoiceItem[]; subtotal: number } {
  const items: InvoiceItem[] = []

  for (const sessionId of sessionIds) {
    const session = getSessionById(sessionId)
    if (!session) continue

    const room = getRoomById(session.roomId)
    if (!room) continue

    // Parse HH:mm times and compute duration in hours
    const [startH, startM] = session.startTime.split(':').map(Number)
    const [endH, endM] = session.endTime.split(':').map(Number)
    const hours = (endH * 60 + endM - (startH * 60 + startM)) / 60

    // Room usage cost
    const roomAmount = room.hourlyRate * hours
    items.push({
      label: `${room.name} 룸 사용 (${session.date} ${session.startTime}-${session.endTime})`,
      amount: roomAmount,
    })

    // Engineer cost (if assigned)
    if (session.engineerId) {
      const engineer = getMemberById(session.engineerId)
      if (engineer) {
        const engineerAmount = engineer.hourlyRate * hours
        items.push({
          label: `${engineer.name} 엔지니어 비용`,
          amount: engineerAmount,
        })
      }
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  return { items, subtotal }
}
