import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendRecoveryEmail, renderTemplate } from '@/lib/resend'

// Called by n8n Workflow 04 after a recovery attempt is scheduled
// Payload: { attempt_id, org_id }
export async function POST(request: Request) {
  // Verify internal secret so only n8n can call this
  const authHeader = request.headers.get('authorization')
  const internalSecret = process.env.INTERNAL_API_SECRET
  if (internalSecret && authHeader !== `Bearer ${internalSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { attempt_id?: string; org_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { attempt_id, org_id } = body
  if (!attempt_id || !org_id) {
    return NextResponse.json({ error: 'attempt_id and org_id are required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Fetch attempt + payment event + customer in one query
  const { data: attempt } = await supabase
    .from('recovery_attempts')
    .select(`
      id, type, status,
      payment_events ( amount, currency, failure_code, failure_message ),
      customers ( name, email ),
      message_templates ( subject, body )
    `)
    .eq('id', attempt_id)
    .eq('org_id', org_id)
    .single()

  if (!attempt) {
    return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
  }

  if (attempt.type !== 'email') {
    return NextResponse.json({ error: 'Not an email attempt' }, { status: 400 })
  }

  const customer = attempt.customers as { name?: string; email?: string } | null
  const event = attempt.payment_events as { amount?: number; currency?: string; failure_code?: string } | null
  const template = attempt.message_templates as { subject?: string; body?: string } | null

  if (!customer?.email) {
    return NextResponse.json({ error: 'No customer email' }, { status: 400 })
  }

  if (!template?.subject || !template?.body) {
    return NextResponse.json({ error: 'No template found for this attempt' }, { status: 400 })
  }

  // Fetch org info for branding
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', org_id)
    .single()

  const orgName = org?.name ?? 'Recoverly'
  const amount = event?.amount
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: (event.currency ?? 'usd').toUpperCase() }).format(event.amount / 100)
    : ''

  const vars: Record<string, string> = {
    customer_name: customer.name ?? 'Valued Customer',
    amount,
    org_name: orgName,
    failure_reason: event?.failure_code ?? 'card declined',
  }

  const subject = renderTemplate(template.subject, vars)
  const bodyText = renderTemplate(template.body, vars)

  const result = await sendRecoveryEmail({
    to: customer.email,
    subject,
    body: bodyText,
    orgName,
  })

  if (!result.success) {
    // Mark attempt as failed
    await supabase
      .from('recovery_attempts')
      .update({ status: 'failed', executed_at: new Date().toISOString() })
      .eq('id', attempt_id)

    console.error('Email send failed:', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  // Mark attempt as sent
  await supabase
    .from('recovery_attempts')
    .update({
      status: 'sent',
      executed_at: new Date().toISOString(),
      provider_message_id: result.messageId ?? null,
    })
    .eq('id', attempt_id)

  return NextResponse.json({ success: true, messageId: result.messageId })
}
