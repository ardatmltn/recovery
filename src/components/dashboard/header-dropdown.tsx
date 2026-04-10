'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LanguageSwitcher } from '@/components/marketing/language-switcher'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, HelpCircle, Search, ExternalLink } from 'lucide-react'

interface Props {
  email: string
  initials: string
  fullName: string
}

export function HeaderDropdown({ email, initials, fullName }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].header
  const [hasNotif] = useState(true)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#0e0e0e]/80 backdrop-blur-xl flex justify-between items-center h-16 px-8">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          className="w-full bg-black border-none rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-green-500/40 placeholder:text-zinc-600 focus:outline-none"
          placeholder="İşlem veya müşteri ara..."
          type="text"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative text-zinc-500 hover:text-white transition-colors focus:outline-none">
            <Bell className="w-5 h-5" />
            {hasNotif && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#9fff88] rounded-full border-2 border-[#0e0e0e]" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-zinc-900 border-zinc-800 text-zinc-200 p-0">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-xs font-bold text-white uppercase tracking-widest">
                {lang === 'tr' ? 'Bildirimler' : 'Notifications'}
              </p>
            </div>
            <div className="px-4 py-8 text-center text-xs text-zinc-500">
              {lang === 'tr' ? 'Yeni bildirim yok.' : 'No new notifications.'}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <DropdownMenu>
          <DropdownMenuTrigger className="text-zinc-500 hover:text-white transition-colors focus:outline-none">
            <HelpCircle className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-zinc-900 border-zinc-800 text-zinc-200">
            <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer p-0">
              <a href="/dashboard/settings" className="w-full px-2 py-1.5 text-sm">
                {lang === 'tr' ? 'Ayarlar' : 'Settings'}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer p-0">
              <a href="mailto:support@recoverly.io" className="w-full flex items-center gap-2 px-2 py-1.5 text-sm">
                <ExternalLink className="w-3.5 h-3.5" />
                {lang === 'tr' ? 'Destek' : 'Support'}
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Divider */}
        <div className="h-8 w-px bg-zinc-800" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">{fullName}</p>
              <p className="text-[10px] text-zinc-500">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 group-hover:border-green-500/40 flex items-center justify-center transition-colors">
              <span className="text-green-400 text-sm font-bold">{initials}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200">
            <div className="px-2 py-1.5 text-xs text-zinc-500 truncate">{email}</div>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer p-0">
              <a href="/dashboard/settings" className="w-full px-2 py-1.5 text-sm">
                {t.settings}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
              {t.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
