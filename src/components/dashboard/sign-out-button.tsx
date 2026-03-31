'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
      Sign out
    </DropdownMenuItem>
  )
}
