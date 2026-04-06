import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-03-31.basil',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER ?? '',
    price: 59,
  },
  growth: {
    name: 'Growth',
    priceId: process.env.STRIPE_PRICE_GROWTH ?? '',
    price: 99,
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO ?? '',
    price: 149,
  },
} as const

export type PlanKey = keyof typeof PLANS
