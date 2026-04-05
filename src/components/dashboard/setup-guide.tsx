'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, Loader2, ArrowRight, Zap, Plug, Webhook, CreditCard } from 'lucide-react'

interface Props {
  iyzicoConnected: boolean
  n8nConfigured: boolean
}

export function SetupGuide({ iyzicoConnected, n8nConfigured }: Props) {
  const [simulating, startSimulate] = useTransition()
  const [simResult, setSimResult] = useState<string | null>(null)

  const steps = [
    {
      num: 1,
      icon: Plug,
      title: 'Connect İyzico',
      desc: 'Save your API Key and Secret Key in Integrations settings.',
      done: iyzicoConnected,
      action: (
        <Link
          href="/dashboard/settings/integrations"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
        >
          Go to Integrations
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ),
    },
    {
      num: 2,
      icon: Webhook,
      title: 'Configure n8n Webhook',
      desc: 'Enter your n8n instance webhook URL to enable automation.',
      done: n8nConfigured,
      action: (
        <Link
          href="/dashboard/settings/integrations"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
        >
          Go to Integrations
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ),
    },
    {
      num: 3,
      icon: CreditCard,
      title: 'Simulate a failed payment',
      desc: 'Create a test failure to verify your dashboard is working.',
      done: false,
      action: (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={simulating}
            onClick={() => {
              startSimulate(async () => {
                try {
                  const res = await fetch('/api/test/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: 9900, currency: 'usd' }),
                  })
                  const json = await res.json()
                  if (json.success) {
                    setSimResult('✓ ' + json.message)
                    setTimeout(() => window.location.reload(), 800)
                  } else {
                    setSimResult('✗ ' + (json.error ?? 'Unknown error'))
                  }
                } catch {
                  setSimResult('✗ Network error')
                }
              })
            }}
            className="relative overflow-hidden group/btn inline-flex items-center gap-2 text-xs font-semibold bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg px-3 py-1.5 transition-colors duration-200 w-fit"
          >
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative flex items-center gap-1.5">
              {simulating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              {simulating ? 'Creating…' : 'Simulate payment failure'}
            </span>
          </button>
          {simResult && (
            <span className={`text-xs font-medium ${simResult.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {simResult}
            </span>
          )}
        </div>
      ),
    },
  ]

  const completedCount = steps.filter((s) => s.done).length
  const progressPct = Math.round((completedCount / 3) * 100)

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Get started with Recoverly</p>
            <p className="text-[11px] text-zinc-400">{completedCount}/3 steps completed</p>
          </div>
        </div>
        <span className="text-xs font-bold text-zinc-400">{progressPct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div key={step.num} className={`flex gap-3 ${step.done ? 'opacity-50' : ''}`}>
              <div className="flex flex-col items-center pt-0.5">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-zinc-300">{step.num}</span>
                  </div>
                )}
                {step.num < 3 && <div className="w-px flex-1 bg-zinc-800 mt-1.5" />}
              </div>
              <div className="pb-4 last:pb-0 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3.5 h-3.5 text-zinc-400" />
                  <p className={`text-sm font-medium ${step.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                    {step.title}
                  </p>
                </div>
                {!step.done && (
                  <>
                    <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{step.desc}</p>
                    {step.action}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
