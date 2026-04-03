'use client'

import Link from 'next/link'
import { Hero } from '@/components/marketing/hero'
import { MarketingNav } from '@/components/marketing/nav'
import { RefreshCw, Mail, TrendingUp, BarChart3, Shield, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/components/marketing/translations'
import dynamic from 'next/dynamic'
import { Testimonials } from '@/components/marketing/testimonials'
const DottedSurface = dynamic(() => import('@/components/ui/dotted-surface').then(m => ({ default: m.DottedSurface })), { ssr: false })

const featureIcons = [RefreshCw, Mail, TrendingUp, BarChart3, Shield]

export default function LandingPage() {
  const { lang } = useLanguage()
  const tx = translations[lang]

  return (
    <div className="relative min-h-[100dvh]">
      <DottedSurface />
      <div className="relative z-[2]">
      <MarketingNav />
      <Hero />

      {/* Stats bar */}
      <div className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
            {tx.stats.map(({ value, label }, i) => (
              <div key={label} className={`${i > 0 ? 'md:pl-8 md:border-l md:border-zinc-800' : ''}`}>
                <p className="font-display font-black text-white text-2xl mb-0.5">{value}</p>
                <p className="text-zinc-500 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features — Bento grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-28">
        <div className="mb-14">
          <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-3">
            {tx.features.sectionLabel}
          </p>
          <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-[1.05] max-w-xl">
            {tx.features.title}
            <br />
            <span className="text-zinc-400 font-light">{tx.features.titleAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 transition-all duration-300 group">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/15 transition-colors">
              <RefreshCw className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-3">{tx.features.items[0].title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">{tx.features.items[0].desc}</p>
          </div>

          <div className="md:col-span-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 transition-all duration-300 group">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/15 transition-colors">
              <Mail className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-3">{tx.features.items[1].title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{tx.features.items[1].desc}</p>
          </div>

          {tx.features.items.slice(2).map((item, idx) => {
            const Icon = featureIcons[idx + 2]
            return (
              <div key={item.title} className="md:col-span-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 transition-all duration-300 group">
                <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/15 transition-colors">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-14">
            <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-3">
              {tx.howItWorks.sectionLabel}
            </p>
            <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-[1.05]">
              {tx.howItWorks.title}
              <br />
              <span className="text-zinc-400 font-light">{tx.howItWorks.titleAccent}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 rounded-2xl overflow-hidden">
            {tx.howItWorks.steps.map(({ num, title, desc }) => (
              <div key={num} className="bg-[#09090B] p-8 hover:bg-zinc-900/60 transition-colors">
                <p className="font-display font-black text-zinc-800 text-6xl mb-6 leading-none select-none">{num}</p>
                <h3 className="font-display font-bold text-white text-lg mb-3">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-12 md:p-20 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500/[0.05] blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-4">
                {tx.cta.sectionLabel}
              </p>
              <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-[1.05] mb-5 max-w-2xl">
                {tx.cta.title}
              </h2>
              <p className="text-zinc-400 text-base mb-10 max-w-lg leading-relaxed">{tx.cta.desc}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full text-sm transition-all shadow-[0_0_32px_rgba(34,197,94,0.2)] hover:shadow-[0_0_48px_rgba(34,197,94,0.38)] hover:-translate-y-0.5">
                  {tx.cta.btn1}
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium rounded-full text-sm transition-all hover:-translate-y-0.5">
                  {tx.cta.btn2}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-display font-semibold text-white text-sm">Recoverly</span>
          </div>
          <p className="text-zinc-700 text-xs hidden md:block">{tx.footer.copyright}</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">{tx.footer.pricing}</Link>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">{tx.footer.signIn}</Link>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
