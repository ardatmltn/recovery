import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

type PaddleWebhookEvent = {
  event_type: string
  data: {
    status?: string
    custom_data?: {
      user_id?: string
      org_id?: string
      plan?: string
    }
    subscription_id?: string
  }
}

// Paddle-Signature: ts=1234567890;h1=hmac_sha256_hex
function verifyPaddleSignature(
  secret: string,
  body: string,
  signatureHeader: string
): boolean {
  const parts = Object.fromEntries(
    signatureHeader.split(';').map((p) => p.split('=') as [string, string])
  )
  const ts = parts['ts']
  const h1 = parts['h1']
  if (!ts || !h1) return false

  const payload = `${ts}:${body}`
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(h1))
}

export async function POST(request: Request) {
  const body = await request.text()
  const signatureHeader = request.headers.get('Paddle-Signature') ?? ''
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? ''

  if (!secret || !verifyPaddleSignature(secret, body, signatureHeader)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body) as PaddleWebhookEvent
  const orgId = event.data.custom_data?.org_id
  const plan = event.data.custom_data?.plan

  if (!orgId || !plan) {
    return NextResponse.json({ received: true })
  }

  const supabase = createServiceClient()

  if (
    event.event_type === 'transaction.completed' ||
    event.event_type === 'subscription.created' ||
    event.event_type === 'subscription.updated'
  ) {
    await supabase
      .from('organizations')
      .update({ plan: plan as 'starter' | 'growth' | 'pro', updated_at: new Date().toISOString() })
      .eq('id', orgId)
  }

  if (
    event.event_type === 'subscription.canceled' ||
    event.event_type === 'subscription.past_due'
  ) {
    await supabase
      .from('organizations')
      .update({ plan: 'starter' as const, updated_at: new Date().toISOString() })
      .eq('id', orgId)
  }

  return NextResponse.json({ received: true })
}
