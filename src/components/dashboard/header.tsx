import { createServerClient } from '@/lib/supabase/server'
import { HeaderDropdown } from './header-dropdown'

export async function Header() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const email = user?.email ?? ''

  const { data: userData } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user?.id ?? '')
    .single()

  const fullName = userData?.full_name ?? email.split('@')[0] ?? 'Kullanıcı'
  const initials = fullName
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'

  return (
    <HeaderDropdown email={email} initials={initials} fullName={fullName} />
  )
}
