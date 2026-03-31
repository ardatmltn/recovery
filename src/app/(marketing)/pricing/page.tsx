import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModalPricing } from '@/components/ui/modal-pricing'
import { Zap } from 'lucide-react'

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
            <ModalPricing />
            <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
            <Link href="/register"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 py-28 text-center">
        <h1 className="text-4xl font-bold mb-4">Simple, predictable pricing</h1>
        <p className="text-muted-foreground text-lg mb-10">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <ModalPricing />
        <p className="mt-4 text-sm text-muted-foreground">
          Starter $59 · Growth $99 · Pro $149 /month
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
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
  )
}
