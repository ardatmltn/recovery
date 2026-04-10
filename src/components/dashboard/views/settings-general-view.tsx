'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { updateFullName } from '@/app/actions'
import { Building2, User } from 'lucide-react'

type Props = {
  email: string
  fullName: string
  orgName: string
  orgPlan: string
}

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter — $59/mo',
  growth: 'Growth — $99/mo',
  pro: 'Pro — $149/mo',
}

export function SettingsGeneralView({ email, fullName, orgName, orgPlan }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings.general

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Organization */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.organization}</p>
            <p className="text-[11px] text-zinc-500">{t.orgDesc}</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.orgName}
            </label>
            <input
              value={orgName}
              disabled
              className="w-full bg-zinc-800/30 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.plan}
            </label>
            <div className="flex items-center gap-3">
              <input
                value={PLAN_LABELS[orgPlan] ?? orgPlan}
                disabled
                className="flex-1 bg-zinc-800/30 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
              />
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/30">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <User className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.profile}</p>
            <p className="text-[11px] text-zinc-500">{t.profileDesc}</p>
          </div>
        </div>
        <form action={updateFullName} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.email}
            </label>
            <input
              value={email}
              disabled
              className="w-full bg-zinc-800/30 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="full_name" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.fullName}
            </label>
            <input
              id="full_name"
              name="full_name"
              defaultValue={fullName}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
