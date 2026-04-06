import { createServerClient } from '@/lib/supabase/server'
import { SettingsGeneralView } from '@/components/dashboard/views/settings-general-view'

export default async function GeneralSettingsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('*, organizations(*)').eq('id', user!.id).single()

  const org = userData?.organizations as { name: string; slug: string; plan: string } | null

  return (
    <SettingsGeneralView
      email={user?.email ?? ''}
      fullName={userData?.full_name ?? ''}
      orgName={org?.name ?? ''}
      orgPlan={org?.plan ?? 'starter'}
    />
  )
}
