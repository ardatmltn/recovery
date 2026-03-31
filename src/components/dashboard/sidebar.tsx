'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  GitBranch,
  Mail,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/failures', label: 'Failures', icon: AlertCircle },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/sequences', label: 'Sequences', icon: GitBranch },
  { href: '/dashboard/templates', label: 'Templates', icon: Mail },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 shrink-0 border-r bg-background flex flex-col h-full">
      <div className="h-16 flex items-center gap-2 px-6 border-b">
        <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg">Recoverly</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive(href, exact)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
