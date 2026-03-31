import { createServerClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutButton } from './sign-out-button'

export async function Header() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="h-16 border-b flex items-center justify-end px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
            {user?.email}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <a href="/dashboard/settings" className="w-full">Settings</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
