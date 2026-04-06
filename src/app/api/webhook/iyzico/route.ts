import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyWebhookSignature, IYZICO_STATUS, IYZICO_FAILURE_CODES } from '@/lib/iyzico'
import { calculateRiskScore } from '@/lib/risk-score'
import type { Json } from '@/types/database'

// İyzico webhook payload types
type IyzicoWebhookPayload = {
  paymentConversationId: string
  iyziReferenceCode: string
  merchantId: string
  status: string
  fraudStatus?: string
  token?: string
  paymentId?: string
  errorCode?: string
  errorMessage?: string
  errorGroup?: string
  price?: string
  paidPrice?: string
  currency?: string
  // İyzico also sends these for subscriptions
  subscriptionStatus?: string
  subscriptionReferenceCode?: string
}

export async function POST(request: Request) {
  let payload: IyzicoWebhookPayload

  const contentType = request.headers.get('content-type') ?? ''

  // İyzico sends either JSON or form-encoded
  if (contentType.includes('application/json')) {
    payload = await request.json()
  } else {
    const text = await request.text()
    const params = new URLSearchParams(text)
    payload = Object.fromEntries(params.entries()) as unknown as IyzicoWebhookPayload
  }

  const supabase = createServiceClient()

  // Identify org by merchant ID first — we need the org's own secret key
  const { data: org } = await supabase
    .from('organizations')
    .select('id, iyzico_secret_key_encrypted, n8n_webhook_url')
    .eq('iyzico_merchant_id', payload.merchantId ?? '')
    .single()

  if (!org) {
    // Merchant not registered — not our tenant
    return NextResponse.json({ received: true })
  }

  // Signature verification — always required, using org's own secret
  const receivedSignature = request.headers.get('x-iyz-signature') ?? payload.token ?? ''
  if (!receivedSignature) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
  }

  const secretKey = org.iyzico_secret_key_encrypted ?? process.env.IYZICO_SECRET_KEY!
  const isValid = verifyWebhookSignature(
    secretKey,
    payload.paymentConversationId ?? '',
    payload.iyziReferenceCode ?? '',
    payload.merchantId ?? '',
    payload.status ?? '',
    receivedSignature
  )
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  // Only process failed payments
  if (payload.status !== IYZICO_STATUS.FAILURE) {
    return NextResponse.json({ received: true })
  }

  const orgId = org.id

  // Parse amount (İyzico sends as string like "100.00")
  const amount = payload.price ? Math.round(parseFloat(payload.price) * 100) : 0
  const currency = (payload.currency ?? 'TRY').toLowerCase()
  const failureCode = payload.errorCode ?? null
  const failureMessage = payload.errorMessage
    ? (IYZICO_FAILURE_CODES[payload.errorCode ?? ''] ?? payload.errorMessage)
    : null

  // Upsert customer via conversationId reference
  let customerId: string | null = null
  const conversationId = payload.paymentConversationId

  if (conversationId) {
    // Try to find existing customer by metadata
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('org_id', orgId)
      .eq('provider_customer_id', conversationId)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({ org_id: orgId, provider_customer_id: conversationId })
        .select('id')
        .single()
      customerId = newCustomer?.id ?? null
    }
  }

  // Idempotency check — provider_event_id = iyziReferenceCode
  const providerEventId = payload.iyziReferenceCode ?? payload.paymentId ?? null

  if (providerEventId) {
    const { data: existing } = await supabase
      .from('payment_events')
      .select('id')
      .eq('org_id', orgId)
      .eq('provider_event_id', providerEventId)
      .single()

    if (existing) {
      return NextResponse.json({ received: true })
    }
  }

  // Insert payment event
  const { data: paymentEvent, error: insertError } = await supabase
    .from('payment_events')
    .insert({
      org_id: orgId,
      customer_id: customerId,
      provider_event_id: providerEventId,
      provider_payment_id: payload.paymentId ?? null,
      provider_reference_code: payload.iyziReferenceCode ?? null,
      event_type: 'iyzico.payment_failed',
      amount,
      currency,
      failure_code: failureCode,
      failure_message: failureMessage,
      status: 'new' as const,
      raw_data: payload as unknown as Json,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('Failed to insert iyzico payment event:', insertError)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  // Update customer risk score after new failure
  if (customerId) {
    const { data: stats } = await supabase
      .from('payment_events')
      .select('status, amount')
      .eq('org_id', orgId)
      .eq('customer_id', customerId)

    const failureCount = stats?.filter((e) => e.status !== 'recovered').length ?? 0
    const recoveredCount = stats?.filter((e) => e.status === 'recovered').length ?? 0
    const totalFailedAmount = stats?.filter((e) => e.status !== 'recovered').reduce((s, e) => s + (e.amount ?? 0), 0) ?? 0

    const riskScore = calculateRiskScore({
      failureCount,
      recoveredCount,
      lastFailedAt: new Date().toISOString(),
      totalFailedAmount,
    })

    await supabase
      .from('customers')
      .update({ risk_score: riskScore, updated_at: new Date().toISOString() })
      .eq('id', customerId)
      .eq('org_id', orgId)
  }

  // Trigger n8n recovery workflow — prefer org's own URL, fall back to global
  const n8nUrl = org.n8n_webhook_url ?? process.env.N8N_WEBHOOK_URL
  if (n8nUrl && paymentEvent) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_id: orgId,
        event_id: paymentEvent.id,
        customer_id: customerId,
        amount,
        currency,
        failure_code: failureCode,
        event_type: 'iyzico.payment_failed',
      }),
    }).catch((err) => console.error('n8n trigger failed:', err))
  }

  return NextResponse.json({ received: true })
}
