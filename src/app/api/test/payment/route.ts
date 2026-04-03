import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

// Only enabled in non-production environments
const isAllowed = process.env.NODE_ENV !== 'production' || process.env.ENABLE_TEST_ENDPOINTS === 'true'

export async function POST(req: NextRequest) {
  if (!isAllowed) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user.id).single()
  const orgId = userData?.org_id
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const amount = Number(body.amount) || 199.90
  const currency = body.currency || 'TRY'

  const service = createServiceClient()

  // Upsert a test customer
  const providerCustomerId = `test-customer-${Date.now()}`
  const { data: customer, error: customerError } = await service
    .from('customers')
    .insert({
      org_id: orgId,
      provider_customer_id: providerCustomerId,
      name: 'Test Customer',
      email: 'test@example.com',
      risk_score: 40,
    })
    .select()
    .single()

  if (customerError) {
    return NextResponse.json({ error: customerError.message }, { status: 500 })
  }

  const providerEventId = `test-evt-${Date.now()}`
  const { data: event, error: eventError } = await service
    .from('payment_events')
    .insert({
      org_id: orgId,
      customer_id: customer.id,
      provider_event_id: providerEventId,
      event_type: 'payment_failed',
      amount,
      currency,
      status: 'new',
      failure_code: 'insufficient_funds',
      failure_message: 'Simulated failure — insufficient funds',
      raw_data: { simulated: true, amount, currency },
    })
    .select()
    .single()

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    event_id: event.id,
    customer_id: customer.id,
    message: `Test payment failure created: ${currency} ${amount}`,
  })
}
