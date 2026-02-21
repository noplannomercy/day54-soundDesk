'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  Calendar,
  Settings2,
  Users,
  Disc3,
  UserCheck,
  FileText,
  FileSignature,
  ListMusic,
  Star,
  Tag,
  BarChart3,
  Settings,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '운영',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Studio', href: '/studio', icon: Building2 },
      { label: 'Rooms', href: '/rooms', icon: DoorOpen },
      { label: 'Sessions', href: '/sessions', icon: Calendar },
      { label: 'Equipment', href: '/equipment', icon: Settings2 },
    ],
  },
  {
    title: '아티스트',
    items: [
      { label: 'Artists', href: '/artists', icon: Users },
      { label: 'Albums', href: '/albums', icon: Disc3 },
      { label: 'Members', href: '/members', icon: UserCheck },
    ],
  },
  {
    title: '비즈니스',
    items: [
      { label: 'Invoices', href: '/invoices', icon: FileText },
      { label: 'Contracts', href: '/contracts', icon: FileSignature },
      { label: 'Playlists', href: '/playlists', icon: ListMusic },
      { label: 'Reviews', href: '/reviews', icon: Star },
      { label: 'Tags', href: '/tags', icon: Tag },
    ],
  },
  {
    title: '분석',
    items: [
      { label: 'Reports', href: '/reports', icon: BarChart3 },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  /**
   * Determine whether a nav item is active.
   * Exact match for /dashboard; startsWith for all others
   * to highlight parent links when on detail pages.
   */
  function isActive(href: string): boolean {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo / App name */}
      <div className="flex h-14 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight">SoundDesk</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
