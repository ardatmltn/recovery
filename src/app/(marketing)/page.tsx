'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/components/marketing/translations'
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  ScanLine,
  Workflow,
  CheckCircle,
  Check,
  AlertCircle,
  Shield,
  Building2,
  TrendingDown,
} from 'lucide-react'

function AnimatedBackground() {
  const dataLines = [
    { left: '10%', duration: '8s', delay: '1s' },
    { left: '25%', duration: '12s', delay: '5s' },
    { left: '45%', duration: '7s', delay: '2s' },
    { left: '65%', duration: '15s', delay: '0s' },
    { left: '85%', duration: '10s', delay: '3s' },
    { left: '92%', duration: '9s', delay: '7s' },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none">
      <div
        className="absolute inset-0 animate-grid-move pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,255,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,0,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-20%) scale(2)',
          transformOrigin: 'top',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-0.5 animate-scan-line pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,0,0.2), transparent)' }}
      />
      {dataLines.map((line, i) => (
        <div
          key={i}
          className="absolute w-px h-24 animate-data-flow pointer-events-none"
          style={{
            left: line.left,
            animationDuration: line.duration,
            animationDelay: line.delay,
            background: 'linear-gradient(to bottom, transparent, #00FF00, transparent)',
          }}
        />
      ))}
    </div>
  )
}

function formatAmount(amount: number, currency: string): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ${currency}`
  if (amount >= 1000) return `${Math.round(amount / 1000)}K ${currency}`
  return `${amount} ${currency}`
}

const STAT_ICONS = [TrendingUp, Zap, Clock]

export default function HomePage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const [form, setForm] = useState({ name: '', email: '', revenue: '', provider: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [mrr, setMrr] = useState(250000)
  const [failureRate, setFailureRate] = useState(7)

  const atRisk = Math.round(mrr * failureRate / 100)
  const recoverable = Math.round(atRisk * 0.27)
  const currency = lang === 'tr' ? 'TL' : 'TRY'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.revenue || !form.provider) return
    setLoading(true)
    try {
      await fetch('/api/analysis-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 transition-all'
  const labelClass = 'block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2'

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      <MarketingNav />

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <AnimatedBackground />
          <div
            className="absolute inset-0 z-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(159,255,136,0.05) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-400/5 rounded-full blur-[120px] z-0 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 bg-zinc-900 px-4 py-1.5 rounded-full w-fit border border-green-400/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-400">
                  {t.hero.badge}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-[1.1] tracking-tighter text-white">
                {t.hero.line1} <br />
                <span className="text-green-400" style={{ textShadow: '0 0 15px rgba(159,255,136,0.4)' }}>
                  {t.hero.line2}
                </span>
              </h1>

              <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
                {t.hero.desc}
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <a
                  href="#analiz"
                  className="bg-green-400 text-black font-display font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-green-300 transition-all shadow-[0_0_20px_rgba(159,255,136,0.2)]"
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#nasil-calisir"
                  className="bg-zinc-800 text-white font-display font-bold px-8 py-4 rounded-xl border border-zinc-700/20 hover:bg-zinc-700 transition-all"
                >
                  {t.hero.cta2}
                </a>
              </div>

              <div className="flex flex-wrap gap-6">
                {t.hero.trust.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard mock card */}
            <div className="hidden lg:block relative">
              <div
                className="p-8 rounded-2xl border border-white/5 relative overflow-hidden"
                style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(20px)' }}
              >
                {/* Sample data label */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold text-zinc-600 bg-zinc-800/60 px-2 py-0.5 rounded-full border border-zinc-700/50">
                    {t.hero.card.sampleLabel}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-1">
                      {t.hero.card.label}
                    </p>
                    <p className="text-2xl font-bold font-display text-green-400">
                      + 14.820 TL
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">{t.hero.card.rateLabel}</p>
                    <p className="text-lg font-bold text-white">26.5%</p>
                    <p className="text-[10px] text-zinc-500">{t.hero.card.rateCompare}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs text-zinc-400">{t.hero.card.failed}</span>
                    </div>
                    <span className="text-sm font-bold text-red-400">34</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-zinc-400">{t.hero.card.recovered}</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">9</span>
                  </div>
                </div>

                <div className="h-16 w-full rounded-lg flex items-end gap-1 px-1">
                  {[20, 45, 30, 70, 40, 85, 55, 90, 60, 75].map((h, i) => (
                    <div
                      key={i}
                      className="w-full rounded-sm"
                      style={{ height: `${h}%`, background: `rgba(159,255,136,${0.1 + i * 0.08})` }}
                    />
                  ))}
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-400/10 blur-3xl rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats (problem framing) ── */}
        <section className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {t.stats.map(({ value, label }, i) => {
                const Icon = STAT_ICONS[i]
                const borders = ['border-green-400', 'border-green-400/40', 'border-green-400/20']
                return (
                  <div key={value} className={`bg-zinc-900 p-10 rounded-2xl border-l-2 ${borders[i]}`}>
                    <div className="mb-6 bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-4xl font-extrabold font-display mb-2 text-white">{value}</h3>
                    <p className="text-zinc-400 font-medium">{label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── ROI Calculator ── */}
        <section className="py-32">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4">
                {t.roiCalc.sectionLabel}
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold font-display mb-4">
                {t.roiCalc.title}
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto">
                {t.roiCalc.subtitle}
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Inputs */}
                <div className="space-y-8">
                  <div>
                    <label className={labelClass}>{t.roiCalc.mrrLabel}</label>
                    <select
                      value={mrr}
                      onChange={e => setMrr(Number(e.target.value))}
                      className={inputClass}
                    >
                      {t.roiCalc.mrrOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass + ' mb-0'}>{t.roiCalc.failureRateLabel}</label>
                      <span className="text-sm font-bold text-white">{failureRate}{t.roiCalc.failureRateSuffix}</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={15}
                      step={1}
                      value={failureRate}
                      onChange={e => setFailureRate(Number(e.target.value))}
                      className="w-full accent-green-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                      <span>3%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{t.roiCalc.riskLabel}</p>
                    </div>
                    <p className="text-3xl font-extrabold font-display text-red-400">
                      {formatAmount(atRisk, currency)}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">{lang === 'tr' ? 'aylık' : 'per month'}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{t.roiCalc.recoveryLabel}</p>
                    </div>
                    <p className="text-3xl font-extrabold font-display text-green-400">
                      {formatAmount(recoverable, currency)}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">{t.roiCalc.recoveryNote}</p>
                  </div>

                  <p className="text-xs text-zinc-600 text-center pt-1">{t.roiCalc.gainNote}</p>

                  <a
                    href="#analiz"
                    className="w-full bg-green-400 hover:bg-green-300 text-black font-display font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {t.roiCalc.ctaLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="nasil-calisir" className="py-32 relative overflow-hidden bg-zinc-950">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4">
                {t.howItWorks.sectionLabel}
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold font-display mb-6">
                {t.howItWorks.title}{' '}
                <span className="text-green-400">{t.howItWorks.titleAccent}</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {t.howItWorks.steps.map(({ num, title, desc }, i) => {
                const StepIcons = [ScanLine, Workflow, CheckCircle]
                const Icon = StepIcons[i]
                return (
                  <div key={num} className="relative">
                    <div className="text-green-400 font-display font-extrabold text-7xl opacity-10 absolute -top-10 -left-4 select-none">
                      {num}
                    </div>
                    <div className="bg-zinc-900 p-8 rounded-2xl h-full border border-white/5">
                      <Icon className="w-8 h-8 text-green-400 mb-6" />
                      <h4 className="text-xl font-bold font-display mb-4">{title}</h4>
                      <p className="text-zinc-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Who is it for? ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4">
                {t.forWho.sectionLabel}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">
                {t.forWho.title}
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">{t.forWho.subtitle}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {t.forWho.types.map(type => (
                <div
                  key={type}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-green-500/20 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm text-white font-medium">{type}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-zinc-500">{t.forWho.activeNote}</p>
          </div>
        </section>

        {/* ── Security & Trust ── */}
        <section className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4">
                {t.trust.sectionLabel}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">
                {t.trust.title}
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">{t.trust.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.trust.items.map(item => (
                <div key={item.label} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-green-500/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1 text-sm">{item.label}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Beta Offer Banner ── */}
        <section className="py-8 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full uppercase tracking-wider">
                      {t.betaOffer.badge}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{t.betaOffer.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.betaOffer.desc}</p>
                </div>
              </div>
              <a
                href="#analiz"
                className="text-sm font-bold text-green-400 hover:text-green-300 transition-colors shrink-0 whitespace-nowrap"
              >
                {t.betaOffer.cta}
              </a>
            </div>
          </div>
        </section>

        {/* ── Analysis Form ── */}
        <section id="analiz" className="py-24 bg-zinc-950">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4">
                {t.analysisForm.sectionLabel}
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold font-display mb-6">
                {t.analysisForm.title}
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                {t.analysisForm.subtitle}
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {submitted ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">{t.analysisForm.success}</p>
                  <p className="text-zinc-500 text-sm">{form.email}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>{t.analysisForm.fields.name.label}</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder={t.analysisForm.fields.name.placeholder}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.analysisForm.fields.email.label}</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder={t.analysisForm.fields.email.placeholder}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.analysisForm.fields.revenue.label}</label>
                      <select
                        required
                        value={form.revenue}
                        onChange={e => setForm(f => ({ ...f, revenue: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="" disabled>—</option>
                        {t.analysisForm.fields.revenue.options.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>{t.analysisForm.fields.provider.label}</label>
                      <select
                        required
                        value={form.provider}
                        onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="" disabled>—</option>
                        {t.analysisForm.fields.provider.options.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
                    <div className="flex flex-wrap gap-4">
                      {t.analysisForm.promise.map(p => (
                        <div key={p} className="flex items-center gap-1.5 text-zinc-500 text-xs">
                          <Check className="w-3 h-3 text-green-400 shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="shrink-0 bg-green-400 hover:bg-green-300 disabled:opacity-60 text-black font-display font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(159,255,136,0.15)] flex items-center gap-2"
                    >
                      {loading ? t.analysisForm.submitting : t.analysisForm.submit}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── Integrations ── */}
        <section className="py-20 border-t border-zinc-800/30">
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-10 text-center">
              {t.integrations.sectionLabel}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-10">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {t.integrations.activeLabel}
                </span>
                {t.integrations.active.map(name => (
                  <span key={name} className="text-xl font-bold tracking-tighter text-white font-display">
                    {name}
                  </span>
                ))}
              </div>
              <div className="hidden sm:block w-px h-8 bg-zinc-800" />
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {t.integrations.soonLabel}
                </span>
                <div className="flex gap-4">
                  {t.integrations.soon.map(name => (
                    <span key={name} className="text-xl font-bold tracking-tighter text-zinc-600 font-display">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-8">
          <div
            className="max-w-5xl mx-auto rounded-[2rem] p-px"
            style={{ background: 'linear-gradient(135deg, rgba(159,255,136,0.2), transparent)' }}
          >
            <div className="bg-black rounded-[1.9rem] p-12 md:p-20 text-center">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-6">
                {t.cta.sectionLabel}
              </p>
              <h2 className="text-4xl md:text-6xl font-extrabold font-display mb-8">
                {t.cta.title}
              </h2>
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                {t.cta.desc}
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a
                  href="#analiz"
                  className="bg-green-400 text-black font-display font-bold px-10 py-4 rounded-xl hover:bg-green-300 transition-all text-center"
                >
                  {t.cta.btn1}
                </a>
                <Link
                  href="/pricing"
                  className="bg-zinc-800 text-white font-display font-bold px-10 py-4 rounded-xl border border-zinc-700/20 hover:bg-zinc-700 transition-all text-center"
                >
                  {t.cta.btn2}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
