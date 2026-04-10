export const PADDLE_PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.PADDLE_PRICE_STARTER ?? '',
    usdLabel: '$59/mo',
  },
  growth: {
    name: 'Growth',
    priceId: process.env.PADDLE_PRICE_GROWTH ?? '',
    usdLabel: '$99/mo',
  },
  pro: {
    name: 'Pro',
    priceId: process.env.PADDLE_PRICE_PRO ?? '',
    usdLabel: '$149/mo',
  },
} as const

export type PaddlePlanKey = keyof typeof PADDLE_PLANS

const PADDLE_API_BASE =
  process.env.PADDLE_SANDBOX === 'true'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com'

type PaddleTransactionResponse = {
  data?: {
    checkout?: {
      url?: string
    }
  }
}

export async function createPaddleCheckoutUrl(params: {
  priceId: string
  email: string
  userId: string
  orgId: string
  plan: string
}): Promise<string | null> {
  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey || !params.priceId) return null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const res = await fetch(`${PADDLE_API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: params.priceId, quantity: 1 }],
      customer: { email: params.email },
      custom_data: {
        user_id: params.userId,
        org_id: params.orgId,
        plan: params.plan,
      },
      checkout: {
        url: `${baseUrl}/dashboard?checkout=success`,
      },
    }),
  })

  if (!res.ok) {
    console.error('Paddle transaction create failed:', await res.text())
    return null
  }

  const data = (await res.json()) as PaddleTransactionResponse
  return data.data?.checkout?.url ?? null
}
