import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createPaddleCheckoutUrl, PADDLE_PLANS } from '@/lib/paddle'
import type { PaddlePlanKey } from '@/lib/paddle'

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await request.json() as { plan: PaddlePlanKey }
  const planConfig = PADDLE_PLANS[plan]
  if (!planConfig) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  if (!planConfig.priceId) {
    return NextResponse.json({ error: 'Plan not configured yet' }, { status: 503 })
  }

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user.id).single()

  const url = await createPaddleCheckoutUrl({
    priceId: planConfig.priceId,
    email: user.email ?? '',
    userId: user.id,
    orgId: userData?.org_id ?? '',
    plan,
  })

  if (!url) {
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 })
  }

  return NextResponse.json({ url })
}
