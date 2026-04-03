'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, Loader2, ArrowRight, Zap } from 'lucide-react'

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
      title: 'Connect İyzico',
      desc: 'Save your API Key and Secret Key in Integrations settings.',
      done: iyzicoConnected,
      action: (
        <Link
          href="/dashboard/settings/integrations"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Go to Integrations <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
    {
      num: 2,
      title: 'Configure n8n Webhook',
      desc: 'Enter your n8n instance webhook URL to enable automation workflows.',
      done: n8nConfigured,
      action: (
        <Link
          href="/dashboard/settings/integrations"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Go to Integrations <ArrowRight className="w-3 h-3" />
        </Link>
      ),
    },
    {
      num: 3,
      title: 'Simulate a failed payment',
      desc: 'Create a test payment failure to verify your dashboard is working.',
      done: false,
      action: (
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={simulating}
            onClick={() => {
              startSimulate(async () => {
                try {
                  const res = await fetch('/api/test/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: 199.90, currency: 'TRY' }),
                  })
                  const json = await res.json()
                  if (json.success) {
                    setSimResult('✓ ' + json.message)
                    window.location.reload()
                  } else {
                    setSimResult('✗ ' + (json.error ?? 'Unknown error'))
                  }
                } catch {
                  setSimResult('✗ Network error')
                }
              })
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {simulating && <Loader2 className="w-3 h-3 animate-spin" />}
            Simulate payment failure
          </button>
          {simResult && (
            <span className={`text-xs ${simResult.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
              {simResult}
            </span>
          )}
        </div>
      ),
    },
  ]

  const completedCount = steps.filter((s) => s.done).length

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-base">Get started with Recoverly</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Complete these steps to start recovering failed payments. ({completedCount}/3 done)
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-4">
            <div className="flex flex-col items-center">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
              )}
              {step.num < 3 && <div className="w-px flex-1 bg-border mt-1.5 mb-0" />}
            </div>
            <div className="pb-5 last:pb-0 min-w-0">
              <p className={`text-sm font-medium ${step.done ? 'line-through text-muted-foreground' : ''}`}>
                {step.title}
              </p>
              {!step.done && (
                <>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">{step.desc}</p>
                  {step.action}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
