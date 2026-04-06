import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'
import type { PlanKey } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await request.json() as { plan: PlanKey }
  const planConfig = PLANS[plan]
  if (!planConfig || !planConfig.priceId) {
    return NextResponse.json({ error: 'Invalid plan or price not configured' }, { status: 400 })
  }

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user.id).single()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success&plan=${plan}`,
    cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      org_id: userData?.org_id ?? '',
      plan,
    },
  })

  return NextResponse.json({ url: session.url })
}
