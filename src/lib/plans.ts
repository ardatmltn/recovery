export const PLANS = {
  starter: { name: 'Starter', price: '1770.00', currency: 'TRY', usdLabel: '$59' },
  growth:  { name: 'Growth',  price: '2970.00', currency: 'TRY', usdLabel: '$99' },
  pro:     { name: 'Pro',     price: '4470.00', currency: 'TRY', usdLabel: '$149' },
} as const

export type PlanKey = keyof typeof PLANS
