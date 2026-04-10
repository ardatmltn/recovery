'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { saveIyzicoCredentials, saveN8nWebhookUrl } from '@/app/actions'
import { IyzicoTestButton } from '@/components/dashboard/iyzico-test-button'
import { CreditCard, Workflow, CheckCircle2, XCircle } from 'lucide-react'

type Props = {
  iyzicoConnected: boolean
  iyzicoMerchantId: string
  iyzicoBaseUrl: string
  n8nWebhookUrl: string
}

export function SettingsIntegrationsView({ iyzicoConnected, iyzicoMerchantId, iyzicoBaseUrl, n8nWebhookUrl }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings.integrations

  return (
    <div className="space-y-8 max-w-2xl">
      {/* İyzico */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{t.iyzicoTitle}</p>
              <p className="text-[11px] text-zinc-500">{t.iyzicoDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {iyzicoConnected ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <XCircle className="w-4 h-4 text-zinc-600" />
            )}
            <span className={`text-[10px] font-black uppercase tracking-wider ${iyzicoConnected ? 'text-green-400' : 'text-zinc-600'}`}>
              {iyzicoConnected ? t.connected : t.notConnected}
            </span>
          </div>
        </div>

        <form action={saveIyzicoCredentials} className="p-6 space-y-4">
          <div>
            <label htmlFor="iyzico_api_key" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.apiKey}
            </label>
            <input
              id="iyzico_api_key"
              name="iyzico_api_key"
              type="password"
              placeholder={t.leaveBlank}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div>
            <label htmlFor="iyzico_secret_key" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.secretKey}
            </label>
            <input
              id="iyzico_secret_key"
              name="iyzico_secret_key"
              type="password"
              placeholder={t.leaveBlank}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div>
            <label htmlFor="iyzico_merchant_id" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.merchantId}
            </label>
            <input
              id="iyzico_merchant_id"
              name="iyzico_merchant_id"
              defaultValue={iyzicoMerchantId}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div>
            <label htmlFor="iyzico_base_url" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.baseUrl}
            </label>
            <input
              id="iyzico_base_url"
              name="iyzico_base_url"
              defaultValue={iyzicoBaseUrl}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10"
            >
              {t.saveCredentials}
            </button>
            {iyzicoConnected && <IyzicoTestButton />}
          </div>
        </form>
      </div>

      {/* n8n */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Workflow className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.n8nTitle}</p>
            <p className="text-[11px] text-zinc-500">{t.n8nDesc}</p>
          </div>
        </div>
        <form action={saveN8nWebhookUrl} className="p-6 space-y-4">
          <div>
            <label htmlFor="n8n_webhook_url" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
              {t.n8nUrl}
            </label>
            <input
              id="n8n_webhook_url"
              name="n8n_webhook_url"
              defaultValue={n8nWebhookUrl}
              placeholder="https://your-n8n.domain.com/webhook/..."
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10"
            >
              {t.saveN8n}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
