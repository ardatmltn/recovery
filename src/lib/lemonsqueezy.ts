import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

export function setupLemonSqueezy() {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! })
}

// Plan variant IDs — set these in Vercel env vars after creating products in LemonSqueezy dashboard
export const LS_PLANS = {
  starter: {
    name: 'Starter',
    variantId: process.env.LS_VARIANT_STARTER ?? '',
    usdLabel: '$59/mo',
  },
  growth: {
    name: 'Growth',
    variantId: process.env.LS_VARIANT_GROWTH ?? '',
    usdLabel: '$99/mo',
  },
  pro: {
    name: 'Pro',
    variantId: process.env.LS_VARIANT_PRO ?? '',
    usdLabel: '$149/mo',
  },
} as const

export type LSPlanKey = keyof typeof LS_PLANS

export async function createCheckoutUrl(params: {
  variantId: string
  email: string
  userId: string
  orgId: string
  plan: string
}): Promise<string | null> {
  setupLemonSqueezy()

  const storeId = process.env.LEMONSQUEEZY_STORE_ID ?? ''
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { data, error } = await createCheckout(storeId, params.variantId, {
    checkoutOptions: {
      embed: false,
      media: false,
    },
    checkoutData: {
      email: params.email,
      custom: {
        user_id: params.userId,
        org_id: params.orgId,
        plan: params.plan,
      },
    },
    productOptions: {
      redirectUrl: `${baseUrl}/dashboard?checkout=success`,
      receiptThankYouNote: 'Welcome to Recoverly! Your account has been upgraded.',
    },
  })

  if (error || !data) return null
  return data.data.attributes.url
}
