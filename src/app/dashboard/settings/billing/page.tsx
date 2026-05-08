import { createServerClient } from '@/lib/supabase/server'
import { SettingsBillingView } from '@/components/dashboard/views/settings-billing-view'

export default async function BillingPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: org } = await supabase
    .from('organizations')
    .select('plan, plan_status')
    .eq('id', userData?.org_id ?? '')
    .single()

  return (
    <SettingsBillingView
      currentPlan={org?.plan ?? 'starter'}
      planStatus={org?.plan_status ?? 'trialing'}
    />
  )
}
