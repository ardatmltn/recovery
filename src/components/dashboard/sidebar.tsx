'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  GitBranch,
  Mail,
  BarChart3,
  Settings,
  Zap,
  ChevronsRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/failures', label: 'Failures', icon: AlertCircle, badge: true },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/sequences', label: 'Sequences', icon: GitBranch },
  { href: '/dashboard/templates', label: 'Templates', icon: Mail },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open')
    if (saved !== null) setOpen(saved === 'true')
  }, [])

  function toggle() {
    const next = !open
    setOpen(next)
    localStorage.setItem('sidebar-open', String(next))
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'relative shrink-0 border-r border-zinc-800 bg-[#09090B] flex flex-col h-full transition-all duration-300 ease-in-out',
        open ? 'w-56' : 'w-[60px]'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-[18px] border-b border-zinc-800 overflow-hidden">
        <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-black" />
        </div>
        {open && (
          <span className="font-display font-bold text-white text-base whitespace-nowrap transition-opacity duration-200">
            Recoverly
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-hidden">
        {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              title={!open ? label : undefined}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                open ? '' : 'justify-center px-0',
                active
                  ? 'bg-zinc-800 text-white border-l-2 border-green-500'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-green-400' : '')} />
              {open && <span className="truncate">{label}</span>}
              {badge && open && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500/60 shrink-0" />
              )}
              {badge && !open && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500/60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan badge */}
      {open && (
        <div className="px-3 pb-2">
          <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-0.5">Plan</p>
            <p className="text-white text-xs font-semibold">Starter</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="border-t border-zinc-800 hover:bg-zinc-900 transition-colors"
      >
        <div className={cn('flex items-center p-3', !open && 'justify-center')}>
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            <ChevronsRight
              className={cn(
                'w-4 h-4 text-zinc-500 transition-transform duration-300',
                open && 'rotate-180'
              )}
            />
          </div>
          {open && (
            <span className="ml-2 text-sm font-medium text-zinc-500">Hide</span>
          )}
        </div>
      </button>
    </aside>
  )
}
