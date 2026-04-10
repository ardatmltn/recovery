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
  Plug2,
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'

export function Sidebar() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].sidebar

  const navItems = [
    { href: '/dashboard', label: t.overview, icon: LayoutDashboard, exact: true },
    { href: '/dashboard/failures', label: t.failures, icon: AlertCircle },
    { href: '/dashboard/customers', label: t.customers, icon: Users },
    { href: '/dashboard/sequences', label: t.sequences, icon: GitBranch },
    { href: '/dashboard/templates', label: t.templates, icon: Mail },
    { href: '/dashboard/analytics', label: t.analytics, icon: BarChart3 },
    { href: '/dashboard/integrations', label: t.integrations, icon: Plug2 },
  ]

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#131313] flex flex-col py-8 px-6 z-50 shadow-2xl shadow-[#9fff88]/5">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/">
          <div className="text-2xl font-extrabold tracking-tighter text-[#9fff88]">Recoverly</div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-3 px-4 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'text-[#9fff88] font-bold border-r-2 border-[#9fff88] bg-[#201f1f]'
                  : 'text-zinc-500 hover:bg-[#201f1f] hover:text-[#9fff88]'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="pt-6 border-t border-zinc-800">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 py-3 px-4 text-sm font-medium transition-all duration-200 ${
            pathname.startsWith('/dashboard/settings')
              ? 'text-[#9fff88] font-bold border-r-2 border-[#9fff88] bg-[#201f1f]'
              : 'text-zinc-500 hover:bg-[#201f1f] hover:text-[#9fff88]'
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span>{t.settings}</span>
        </Link>
      </div>
    </aside>
  )
}
