'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { saveEmailNotificationSettings, saveSlackNotificationSettings } from '@/app/actions'
import { Bell, Hash } from 'lucide-react'

type Props = {
  emailOnFailure: boolean
  emailOnRecovery: boolean
  dailySummary: boolean
  weeklyReport: boolean
  notificationEmail: string
  slackWebhookUrl: string
}

function Toggle({ name, defaultChecked, label, desc }: {
  name: string
  defaultChecked: boolean
  label: string
  desc: string
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-zinc-700'
        }`}
      >
        <input type="hidden" name={name} value={checked ? 'on' : 'off'} />
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export function SettingsNotificationsView(props: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings.notifications

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Email notifications */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Bell className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.emailTitle}</p>
            <p className="text-[11px] text-zinc-500">{t.emailDesc}</p>
          </div>
        </div>
        <form action={saveEmailNotificationSettings} className="px-6 pb-6">
          <div className="divide-y divide-zinc-800/60">
            <Toggle
              name="email_on_failure"
              defaultChecked={props.emailOnFailure}
              label={t.failureAlert}
              desc={t.failureAlertDesc}
            />
            <Toggle
              name="email_on_recovery"
              defaultChecked={props.emailOnRecovery}
              label={t.recoveryAlert}
              desc={t.recoveryAlertDesc}
            />
            <Toggle
              name="daily_summary"
              defaultChecked={props.dailySummary}
              label={t.dailySummary}
              desc={t.dailySummaryDesc}
            />
            <Toggle
              name="weekly_report"
              defaultChecked={props.weeklyReport}
              label={t.weeklyReport}
              desc={t.weeklyReportDesc}
            />
          </div>

          <div className="mt-5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.notificationEmail}
            </label>
            <input
              name="notification_email"
              type="email"
              defaultValue={props.notificationEmail}
              placeholder="alerts@yourcompany.com"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10"
            >
              {t.savePreferences}
            </button>
          </div>
        </form>
      </div>

      {/* Slack */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Hash className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.slackTitle}</p>
            <p className="text-[11px] text-zinc-500">{t.slackDesc}</p>
          </div>
        </div>
        <form action={saveSlackNotificationSettings} className="p-6 space-y-4">
          <div>
            <label htmlFor="slack_webhook_url" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.slackUrl}
            </label>
            <input
              id="slack_webhook_url"
              name="slack_webhook_url"
              defaultValue={props.slackWebhookUrl}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10"
            >
              {t.saveSlack}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
