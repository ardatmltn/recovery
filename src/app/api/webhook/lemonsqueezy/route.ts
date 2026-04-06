import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

type LSWebhookPayload = {
  meta: {
    event_name: string
    custom_data?: {
      user_id?: string
      org_id?: string
      plan?: string
    }
  }
  data: {
    attributes: {
      status: string
      user_email?: string
      first_order_item?: {
        variant_name?: string
      }
    }
  }
}

function verifySignature(secret: string, body: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(body).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''

  if (!secret || !verifySignature(secret, body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(body) as LSWebhookPayload
  const event = payload.meta.event_name
  const orgId = payload.meta.custom_data?.org_id
  const plan = payload.meta.custom_data?.plan

  if (!orgId || !plan) {
    return NextResponse.json({ received: true })
  }

  const supabase = createServiceClient()

  if (event === 'order_created' || event === 'subscription_created') {
    await supabase
      .from('organizations')
      .update({ plan: plan as 'starter' | 'growth' | 'pro', updated_at: new Date().toISOString() })
      .eq('id', orgId)
  }

  if (event === 'subscription_expired' || event === 'subscription_cancelled') {
    await supabase
      .from('organizations')
      .update({ plan: 'starter' as const, updated_at: new Date().toISOString() })
      .eq('id', orgId)
  }

  return NextResponse.json({ received: true })
}
