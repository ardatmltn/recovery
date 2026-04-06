import { createServerClient } from '@/lib/supabase/server'
import { HeaderDropdown } from './header-dropdown'

export async function Header() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const email = user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="h-14 border-b border-zinc-800 bg-[#09090B] flex items-center justify-end px-6">
      <HeaderDropdown email={email} initials={initials} />
    </header>
  )
}
