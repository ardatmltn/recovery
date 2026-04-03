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
    <aside className="w-56 shrink-0 border-r border-zinc-800 bg-[#09090B] flex flex-col h-full">
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-zinc-800">
        <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-black" />
        </div>
        <span className="font-display font-bold text-white text-base">Recoverly</span>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-green-400' : '')} />
              {label}
              {href === '/dashboard/failures' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500/60" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Plan</p>
          <p className="text-white text-xs font-semibold">Starter</p>
        </div>
      </div>
    </aside>
  )
}
