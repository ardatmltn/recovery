import Link from 'next/link'
import { Zap, TrendingUp, Mail, RefreshCw, BarChart3, Shield, ArrowRight, Check } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

const FEATURES = [
  { icon: RefreshCw, title: 'Smart Retry Logic', desc: 'Automatically retries failed payments at the optimal time based on failure reason and customer history.' },
  { icon: Mail, title: 'AI-Personalized Emails', desc: 'Send recovery emails that feel human. AI tailors the message to each customer for higher open rates.' },
  { icon: TrendingUp, title: 'Risk Scoring', desc: 'Every customer gets a risk score so you can prioritize high-value recovery efforts.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track recovered revenue, recovery rates, and channel performance with live dashboards.' },
  { icon: Shield, title: 'Secure & Compliant', desc: 'Bank-level security with end-to-end encryption. Your data never leaves your control.' },
  { icon: Zap, title: 'Works in Minutes', desc: 'Connect your İyzico account, configure a recovery sequence, and you\'re live. No engineering required.' },
]

const STATS = [
  { value: '25%', label: 'Average revenue recovered' },
  { value: '< 5 min', label: 'Setup time' },
  { value: '3x', label: 'More recovery attempts than manual' },
  { value: '24/7', label: 'Automated monitoring' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Payment Recovery Automation
        </div>
        <h1 className="font-display font-extralight text-6xl md:text-8xl leading-[1.0] tracking-tight mb-6">
          Recover 25% of your<br />
          <span className="text-green-400">failed payments</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Recoverly automatically retries failed payments, sends AI-personalized emails,
          and follows up at the right time — so you get paid without lifting a finger.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors">
            Start free trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing"
            className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white rounded-xl transition-colors">
            See pricing
          </Link>
        </div>
        <p className="text-xs text-zinc-500 mt-4">No credit card required · 14-day free trial</p>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="font-display font-extralight text-4xl text-white mb-1">{value}</p>
              <p className="text-zinc-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display font-extralight text-4xl md:text-5xl text-white mb-4">
            Everything you need to recover revenue
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            A complete payment recovery stack — automated, intelligent, and built for SaaS.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-extralight text-4xl text-white mb-4">How it works</h2>
            <p className="text-zinc-400">Three steps from failed payment to recovered revenue</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect İyzico', desc: 'Add your API credentials. Recoverly starts monitoring payments instantly.' },
              { step: '02', title: 'Configure sequence', desc: 'Set up your recovery steps: retry timing, email templates, AI enhancement.' },
              { step: '03', title: 'Recover automatically', desc: 'When a payment fails, Recoverly handles everything. You watch the revenue come back.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="text-5xl font-display font-extralight text-green-500/30 mb-4">{step}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-zinc-800 py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-extralight text-4xl text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 mb-8">
            Starting at $59/month. We pay for itself the first time it recovers a payment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            {['1 payment provider', 'Automated retries', 'Email recovery', 'Real-time dashboard'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors">
            View all plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-extralight text-5xl text-white mb-4">
            Stop losing revenue<br />to failed payments
          </h2>
          <p className="text-zinc-400 mb-10">
            Every day without Recoverly is money left on the table. Start your free trial today.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors text-lg">
            Start recovering payments <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
