import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { FailureDetailView } from '@/components/dashboard/views/failure-detail-view'

export default async function FailureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()
  const orgId = userData?.org_id ?? ''

  const { data: event } = await supabase
    .from('payment_events')
    .select('provider_event_id, amount, currency, status, failure_code, failure_message, created_at, customers(name, email)')
    .eq('id', id).eq('org_id', orgId).single()

  if (!event) notFound()

  const { data: attempts } = await supabase
    .from('recovery_attempts')
    .select('id, step_number, type, status, scheduled_at, executed_at, message_templates(name, type)')
    .eq('payment_event_id', id).eq('org_id', orgId)
    .order('step_number', { ascending: true })

  const mappedAttempts = (attempts ?? []).map((a) => ({
    id: a.id,
    step_number: a.step_number,
    type: a.type,
    status: a.status,
    scheduled_at: a.scheduled_at,
    executed_at: a.executed_at,
    message_templates: a.message_templates as { name: string; type: string } | null,
  }))

  return (
    <FailureDetailView
      event={{
        provider_event_id: event.provider_event_id,
        amount: event.amount,
        currency: event.currency,
        status: event.status,
        failure_code: event.failure_code,
        failure_message: event.failure_message,
        created_at: event.created_at,
        customers: event.customers as { name?: string; email?: string } | null,
      }}
      attempts={mappedAttempts}
    />
  )
}
