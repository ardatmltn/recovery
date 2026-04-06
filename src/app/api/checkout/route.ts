import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { initializeCheckoutForm } from '@/lib/iyzico'
import { PLANS } from '@/lib/plans'
import type { PlanKey } from '@/lib/plans'

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await request.json() as { plan: PlanKey }
  const planConfig = PLANS[plan]
  if (!planConfig) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { data: userData } = await supabase
    .from('users').select('full_name').eq('id', user.id).single()

  const nameParts = (userData?.full_name ?? 'Recoverly User').split(' ')
  const firstName = nameParts[0] ?? 'User'
  const lastName = nameParts.slice(1).join(' ') || 'User'

  const conversationId = `rcvr-${plan}-${user.id.slice(0, 8)}-${Date.now()}`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const result = await initializeCheckoutForm({
    conversationId,
    price: planConfig.price,
    currency: planConfig.currency,
    callbackUrl: `${baseUrl}/api/checkout/callback`,
    buyer: {
      id: user.id,
      name: firstName,
      surname: lastName,
      email: user.email ?? '',
    },
    planName: planConfig.name,
  })

  if (result.status !== 'success' || !result.token) {
    return NextResponse.json(
      { error: result.errorMessage ?? 'Checkout initialization failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    token: result.token,
    checkoutFormContent: result.checkoutFormContent,
  })
}
