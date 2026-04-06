import { createServerClient } from '@/lib/supabase/server'
import { CustomersView } from '@/components/dashboard/views/customers-view'

export default async function CustomersPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, email, risk_score, total_failed_payments, total_recovered_amount, last_payment_failed_at')
    .eq('org_id', userData?.org_id ?? '')
    .order('risk_score', { ascending: false })
    .limit(50)

  return <CustomersView customers={customers ?? []} />
}
