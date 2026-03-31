import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, TrendingUp, Mail, RefreshCw, BarChart3, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Recoverly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
            <Link href="/register"><Button size="sm">Get started free</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6">Payment Recovery Automation</Badge>
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Recover 25% of your<br />
          <span className="text-primary">failed payments</span> automatically
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Recoverly automatically retries failed payments, sends personalized emails,
          and follows up at the right time — so you get paid without lifting a finger.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register"><Button size="lg">Start free trial</Button></Link>
          <Link href="/pricing"><Button variant="outline" size="lg">See pricing</Button></Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">No credit card required · 14-day free trial</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to recover revenue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: RefreshCw, title: 'Smart Retry Logic', desc: 'Automatically retries failed payments at the optimal time based on failure reason and customer history.' },
            { icon: Mail, title: 'AI-Personalized Emails', desc: 'Send recovery emails that feel human. AI tailors the message to each customer for higher open rates.' },
            { icon: TrendingUp, title: 'Risk Scoring', desc: 'Every customer gets a risk score so you can prioritize high-value recovery efforts.' },
            { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track recovered revenue, recovery rates, and channel performance with live dashboards.' },
            { icon: Shield, title: 'Secure & Compliant', desc: 'Bank-level security with end-to-end encryption. Your data never leaves your control.' },
            { icon: Zap, title: 'Works in Minutes', desc: "Connect your İyzico account, configure a recovery sequence, and you're live. No engineering required." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-4xl font-bold mb-3">$0 → $9,900 MRR</p>
          <p className="text-muted-foreground">Our target: 100 customers recovering payments on autopilot</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Stop losing revenue to failed payments</h2>
        <p className="text-muted-foreground mb-8">
          Every day without Recoverly is money left on the table. Start your free trial today.
        </p>
        <Link href="/register">
          <Button size="lg">Start recovering payments →</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 Recoverly</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
