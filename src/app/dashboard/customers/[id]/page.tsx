import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { CustomerDetailView } from '@/components/dashboard/views/customer-detail-view'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()
  const orgId = userData?.org_id ?? ''

  const { data: customer } = await supabase
    .from('customers')
    .select('name, email, provider_customer_id, risk_score, total_failed_payments, total_recovered_amount')
    .eq('id', id).eq('org_id', orgId).single()

  if (!customer) notFound()

  const { data: events } = await supabase
    .from('payment_events')
    .select('id, amount, currency, status, failure_code, created_at')
    .eq('customer_id', id).eq('org_id', orgId)
    .order('created_at', { ascending: false }).limit(20)

  return <CustomerDetailView customer={customer} events={events ?? []} />
}
