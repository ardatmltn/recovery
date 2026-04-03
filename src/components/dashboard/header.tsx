import { createServerClient } from '@/lib/supabase/server'
import { SignOutButton } from './sign-out-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export async function Header() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="h-14 border-b border-zinc-800 bg-[#09090B] flex items-center justify-end px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors focus:outline-none">
          <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <span className="text-green-400 text-[10px] font-bold">{initials}</span>
          </div>
          <span className="text-zinc-400 text-xs max-w-[140px] truncate hidden sm:block">
            {user?.email}
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200">
          <div className="px-2 py-1.5 text-xs text-zinc-500 truncate">
            {user?.email}
          </div>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
            <a href="/dashboard/settings" className="w-full text-sm">Settings</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
