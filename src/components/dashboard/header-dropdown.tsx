'use client'

import { useRouter } from 'next/navigation'
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
import { ChevronDown } from 'lucide-react'

interface Props {
  email: string
  initials: string
}

export function HeaderDropdown({ email, initials }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].header

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors focus:outline-none">
          <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-400 text-[10px] font-bold">{initials}</span>
          </div>
          <span className="text-zinc-400 text-xs max-w-[140px] truncate hidden sm:block">
            {email}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200">
          <div className="px-2 py-1.5 text-xs text-zinc-500 truncate">
            {email}
          </div>
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
  )
}
