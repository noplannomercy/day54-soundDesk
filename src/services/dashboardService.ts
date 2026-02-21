import { Session, Invoice, Album, Track, STORAGE_KEYS } from '@/types'
import { getAll } from '@/lib/storage'
import { getSessions } from '@/services/sessionService'
import { getInvoices } from '@/services/invoiceService'
import { getAlbums } from '@/services/albumService'
import { getRooms } from '@/services/roomService'
import { getStudio } from '@/services/studioService'

// ============================================================
// Dashboard Service
//
// Aggregates data from multiple entity services to power the
// dashboard page widgets: today/week sessions, monthly revenue,
// active albums, room utilization, and revenue trends.
// ============================================================

export interface ActivityItem {
  type: 'session' | 'invoice' | 'album'
  id: string
  description: string
  date: string // ISO string for sorting
}

export interface DashboardData {
  todaySessions: Session[]
  weekSessions: Session[]
  monthRevenue: number
  monthRevenueLastMonth: number
  activeAlbums: Album[]
  recentActivities: ActivityItem[]
}

export interface RoomUtilizationItem {
  roomId: string
  roomName: string
  utilizationPct: number
}

export interface RevenueDataItem {
  month: string
  revenue: number
}

/**
 * Get the Monday (start) and Sunday (end) of the week containing the given date.
 * Week starts on Monday per Korean/ISO convention.
 */
function getWeekRange(date: Date): { weekStart: string; weekEnd: string } {
  const day = date.getDay()
  // day: 0=Sun, 1=Mon, ... 6=Sat
  // Offset to Monday: if Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const diffToMonday = day === 0 ? 6 : day - 1
  const monday = new Date(date)
  monday.setDate(date.getDate() - diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  }
}

/**
 * Parse HH:mm time string into total minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Aggregate dashboard data: today's sessions, this week's sessions,
 * monthly revenue comparison, active albums, and recent activities.
 */
export function getDashboardData(): DashboardData {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const { weekStart, weekEnd } = getWeekRange(now)

  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-indexed

  // Today's sessions
  const todaySessions = getSessions({ dateFrom: today, dateTo: today })

  // This week's sessions
  const weekSessions = getSessions({ dateFrom: weekStart, dateTo: weekEnd })

  // Revenue calculation for current and previous month
  const paidInvoices = getInvoices({ status: 'paid' })

  const monthRevenue = paidInvoices
    .filter((inv) => {
      const refDate = inv.paidDate ?? inv.createdAt
      const d = new Date(refDate)
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth
    })
    .reduce((sum, inv) => sum + inv.total, 0)

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
  const lastMonthYear = lastMonthDate.getFullYear()
  const lastMonth = lastMonthDate.getMonth()

  const monthRevenueLastMonth = paidInvoices
    .filter((inv) => {
      const refDate = inv.paidDate ?? inv.createdAt
      const d = new Date(refDate)
      return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth
    })
    .reduce((sum, inv) => sum + inv.total, 0)

  // Active albums (in production stages)
  const allAlbums = getAlbums()
  const activeStatuses = new Set(['recording', 'mixing', 'mastering'])
  const activeAlbums = allAlbums.filter((a) => activeStatuses.has(a.status))

  // Recent activities: last 5 sessions + last 3 invoices + last 2 albums
  const allSessions = getSessions()
  const allInvoices = getInvoices()

  const sessionActivities: ActivityItem[] = allSessions
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((s) => ({
      type: 'session' as const,
      id: s.id,
      description: `세션 예약 (${s.date} ${s.startTime}~${s.endTime})`,
      date: s.createdAt,
    }))

  const invoiceActivities: ActivityItem[] = allInvoices
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3)
    .map((inv) => ({
      type: 'invoice' as const,
      id: inv.id,
      description: `인보이스 ${inv.status === 'paid' ? '결제 완료' : '발행'} (${inv.total.toLocaleString('ko-KR')}원)`,
      date: inv.createdAt,
    }))

  const albumActivities: ActivityItem[] = allAlbums
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 2)
    .map((a) => ({
      type: 'album' as const,
      id: a.id,
      description: `앨범 "${a.title}" ${a.status === 'released' ? '발매' : '작업 중'}`,
      date: a.createdAt,
    }))

  const recentActivities = [...sessionActivities, ...invoiceActivities, ...albumActivities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  return {
    todaySessions,
    weekSessions,
    monthRevenue,
    monthRevenueLastMonth,
    activeAlbums,
    recentActivities,
  }
}

/**
 * Calculate room utilization percentage for each room in a given month/year.
 *
 * Utilization = (total session minutes in room) / (available operating minutes) * 100
 *
 * Available minutes are derived from studio operating hours (openTime - closeTime).
 * Falls back to 10 hours/day (600 min) if no studio is configured.
 * Days in month are computed from the actual calendar month.
 */
export function getRoomUtilization(month: string, year: string): RoomUtilizationItem[] {
  const rooms = getRooms()
  const studio = getStudio()

  // Calculate daily available minutes from studio hours
  let dailyMinutes = 600 // default: 10 hours
  if (studio) {
    const openMin = timeToMinutes(studio.openTime)
    const closeMin = timeToMinutes(studio.closeTime)
    if (closeMin > openMin) {
      dailyMinutes = closeMin - openMin
    }
  }

  // Get actual number of days in the target month
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate()
  const totalAvailableMinutes = dailyMinutes * daysInMonth

  // Build date range for the target month (YYYY-MM-DD format)
  const monthPadded = month.padStart(2, '0')
  const dateFrom = `${year}-${monthPadded}-01`
  const dateTo = `${year}-${monthPadded}-${String(daysInMonth).padStart(2, '0')}`

  // Get all sessions in the target month (exclude cancelled)
  const sessions = getSessions({ dateFrom, dateTo })
    .filter((s) => s.status !== 'cancelled')

  // Accumulate session minutes per room
  const minutesByRoom = new Map<string, number>()
  for (const session of sessions) {
    const duration = timeToMinutes(session.endTime) - timeToMinutes(session.startTime)
    if (duration > 0) {
      minutesByRoom.set(
        session.roomId,
        (minutesByRoom.get(session.roomId) ?? 0) + duration
      )
    }
  }

  return rooms.map((room) => {
    const usedMinutes = minutesByRoom.get(room.id) ?? 0
    const utilizationPct = Math.min((usedMinutes / totalAvailableMinutes) * 100, 100)

    return {
      roomId: room.id,
      roomName: room.name,
      utilizationPct: Math.round(utilizationPct * 10) / 10, // 1 decimal place
    }
  })
}

/**
 * Get monthly revenue data for a given year.
 * Returns 12 objects, one per month, with summed paid invoice totals.
 * Uses paidDate when available, otherwise falls back to createdAt.
 */
export function getRevenueData(year: number): RevenueDataItem[] {
  const monthLabels = [
    '01월', '02월', '03월', '04월', '05월', '06월',
    '07월', '08월', '09월', '10월', '11월', '12월',
  ]

  const revenueByMonth = new Array<number>(12).fill(0)

  const paidInvoices = getInvoices({ status: 'paid' })
  for (const inv of paidInvoices) {
    const refDate = inv.paidDate ?? inv.createdAt
    const d = new Date(refDate)
    if (d.getFullYear() === year) {
      revenueByMonth[d.getMonth()] += inv.total
    }
  }

  return monthLabels.map((label, idx) => ({
    month: label,
    revenue: revenueByMonth[idx],
  }))
}
