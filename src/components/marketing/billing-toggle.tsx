'use client'

import { useRef, useEffect, useState } from 'react'

type BillingPeriod = 'monthly' | 'annual'

type Props = {
  value: BillingPeriod
  onChange: (value: BillingPeriod) => void
  monthlyLabel?: string
  annualLabel?: string
  savingsLabel?: string
}

export function BillingToggle({
  value,
  onChange,
  monthlyLabel = 'Aylık',
  annualLabel = 'Yıllık',
  savingsLabel = '%20 indirim',
}: Props) {
  const monthlyRef = useRef<HTMLButtonElement | null>(null)
  const annualRef = useRef<HTMLButtonElement | null>(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const activeRef = value === 'monthly' ? monthlyRef : annualRef
    const el = activeRef.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    const parentRect = parent.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setPillStyle({
      left: elRect.left - parentRect.left,
      width: elRect.width,
    })
  }, [value])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center rounded-full p-1 bg-zinc-900 border border-zinc-800">
        {/* Sliding pill */}
        <div
          className="absolute top-1 bottom-1 rounded-full bg-white/10 border border-white/15 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
          }}
        />

        <button
          ref={monthlyRef}
          onClick={() => onChange('monthly')}
          className={[
            'relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            value === 'monthly' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
          ].join(' ')}
        >
          {monthlyLabel}
        </button>

        <button
          ref={annualRef}
          onClick={() => onChange('annual')}
          className={[
            'relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            value === 'annual' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
          ].join(' ')}
        >
          {annualLabel}
        </button>
      </div>

      {/* Savings badge — animates in when annual is selected */}
      <div
        className={[
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
          'bg-green-500/10 border border-green-500/20 text-green-400',
          'transition-all duration-300',
          value === 'annual'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1 pointer-events-none',
        ].join(' ')}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        {savingsLabel}
      </div>
    </div>
  )
}
