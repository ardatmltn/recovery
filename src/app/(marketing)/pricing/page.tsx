import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ModalPricing } from '@/components/ui/modal-pricing'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 59,
    description: 'Perfect for early-stage SaaS products',
    features: [
      '1 payment provider (İyzico)',
      'Email recovery only',
      'Up to 3-step sequences',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start with Starter',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 99,
    description: 'For growing products with more recovery needs',
    features: [
      '2 payment providers',
      'Email + SMS recovery',
      'AI personalization',
      'Custom sequences (unlimited steps)',
      'Advanced analytics',
      'Priority email support',
    ],
    cta: 'Start with Growth',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    description: 'Maximum recovery for established products',
    features: [
      'Unlimited payment providers',
      'All channels (Email, SMS)',
      'AI personalization',
      'Custom sequences',
      'Full analytics + exports',
      'Dedicated support',
      'Slack integration',
    ],
    cta: 'Start with Pro',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Recoverly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
            <Link href="/register"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-4">Simple, predictable pricing</h1>
          <p className="text-muted-foreground text-lg">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={plan.popular ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && <Badge>Most popular</Badge>}
                </div>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center border-t pt-16">
          <h2 className="text-2xl font-bold mb-2">Already a customer?</h2>
          <p className="text-muted-foreground mb-8">Upgrade or change your plan at any time.</p>
          <ModalPricing />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            {[
              { q: 'How does the free trial work?', a: 'You get 14 days of full access to all features. No credit card required. Cancel anytime.' },
              { q: 'What payment providers do you support?', a: 'Currently İyzico. More providers are coming soon.' },
              { q: 'How much can I expect to recover?', a: 'Our customers typically recover 20-35% of failed payments. The exact amount depends on your failure reasons and customer base.' },
              { q: 'Is my İyzico data secure?', a: 'Yes. We only store the minimum data needed. Your İyzico API key is encrypted at rest. We never store raw card data.' },
            ].map(({ q, a }) => (
              <div key={q} className="border rounded-lg p-4 space-y-2">
                <p className="font-medium">{q}</p>
                <p className="text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
