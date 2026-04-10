'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatDate } from '@/lib/utils'
import { createRecoverySequence, toggleSequenceActive } from '@/app/actions'
import { GitBranch, Plus, RefreshCw, Mail, MessageSquare, Zap } from 'lucide-react'
import type { SequenceStep } from '@/types/database'

type Sequence = {
  id: string
  name: string
  is_default: boolean
  is_active: boolean
  updated_at: string
  steps: unknown
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  retry: <RefreshCw className="w-3 h-3" />,
  email: <Mail className="w-3 h-3" />,
  sms: <MessageSquare className="w-3 h-3" />,
}

const STEP_COLORS: Record<string, string> = {
  retry: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  email: 'bg-green-500/10 text-green-400 border-green-500/30',
  sms: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

export function SequencesView({ sequences }: { sequences: Sequence[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].sequences

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">{t.title}</h1>
          <p className="text-zinc-500 text-sm">{t.subtitle}</p>
        </div>
      </div>

      {/* New sequence form */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">{t.newSequence}</p>
        <form action={createRecoverySequence} className="flex gap-3">
          <input
            name="name"
            placeholder={t.namePlaceholder}
            required
            className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.createBtn}
          </button>
        </form>
      </div>

      {/* Sequence list */}
      <div className="space-y-4">
        {sequences.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 py-16 text-center">
            <GitBranch className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">{t.noSequences}</p>
          </div>
        ) : (
          sequences.map((seq) => {
            const steps = (seq.steps as SequenceStep[]) ?? []
            return (
              <div key={seq.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-800 bg-zinc-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{seq.name}</p>
                        {seq.is_default && (
                          <span className="text-[10px] font-black text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {t.defaultBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-600">{t.updated} {formatDate(seq.updated_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      seq.is_active
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}>
                      {seq.is_active ? t.activeBadge : t.inactiveBadge}
                    </span>
                    <form action={toggleSequenceActive}>
                      <input type="hidden" name="id" value={seq.id} />
                      <input type="hidden" name="is_active" value={String(seq.is_active)} />
                      <button
                        type="submit"
                        className="text-xs font-bold text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        {seq.is_active ? t.deactivate : t.activate}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="px-6 py-5">
                  {steps.length === 0 ? (
                    <p className="text-sm text-zinc-600">{t.noSteps}</p>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      {steps.map((step, i) => (
                        <div key={step.step} className="flex items-center gap-2">
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${STEP_COLORS[step.type] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                            {STEP_ICONS[step.type]}
                            <span>{t.step} {step.step}</span>
                            <span className="opacity-60">+{step.delay_hours}h</span>
                          </div>
                          {i < steps.length - 1 && (
                            <div className="w-4 h-px bg-zinc-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
