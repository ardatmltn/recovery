'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Check, Sparkles, Zap } from 'lucide-react'

interface PlanOption {
  id: string
  name: string
  price: string
  description: string
  features: string[]
}

const recoverlyPlans: PlanOption[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$59',
    description: 'For small SaaS with simple needs',
    features: ['1 payment provider', 'Email recovery only', 'Default sequences', 'Basic analytics'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$99',
    description: 'For growing teams',
    features: ['2 providers', 'Email + SMS recovery', 'AI personalization', 'Risk scoring', 'Advanced analytics'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$149',
    description: 'For high-volume businesses',
    features: ['Unlimited providers', 'All channels', 'Custom sequences', 'Priority support', 'Full API access'],
  },
]

function ModalPricing({ plans = recoverlyPlans }: { plans?: PlanOption[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('growth')

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium rounded-full transition-all duration-200"
      >
        <Sparkles className="w-3.5 h-3.5 text-green-400" />
        Upgrade Plan
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton
          className="sm:max-w-[460px] bg-zinc-950 border border-zinc-800 p-0 overflow-hidden ring-0"
        >
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2 text-white font-display font-bold text-lg">
              <div className="w-7 h-7 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-green-400" />
              </div>
              Choose Your Plan
            </DialogTitle>
            <p className="text-zinc-500 text-sm mt-1.5">
              Upgrade or downgrade at any time. Changes apply immediately.
            </p>
          </DialogHeader>

          <RadioGroup
            defaultValue={selectedPlan}
            onValueChange={setSelectedPlan}
            className="flex flex-col gap-2 px-6 py-5"
          >
            {plans.map((plan) => (
              <label
                key={plan.id}
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border transition-all duration-150 ${
                  selectedPlan === plan.id
                    ? 'border-green-500/40 bg-green-500/[0.04]'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
                }`}
              >
                <RadioGroupItem value={plan.id} className="sr-only" />
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-0.5 shrink-0 ml-4">
                    <span className="font-display font-black text-white text-xl">{plan.price}</span>
                    <span className="text-zinc-500 text-[11px]">/mo</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-zinc-400">
                      <Check className="w-3 h-3 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {selectedPlan === plan.id && (
                  <div className="absolute -top-2 -right-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-2.5 w-2.5 text-black" />
                    </span>
                  </div>
                )}
              </label>
            ))}
          </RadioGroup>

          <div className="px-6 pb-6 space-y-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full text-sm transition-all shadow-[0_0_24px_rgba(34,197,94,0.15)] hover:shadow-[0_0_32px_rgba(34,197,94,0.28)] hover:-translate-y-0.5"
            >
              Confirm selection
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ModalPricing }
export type { PlanOption }
