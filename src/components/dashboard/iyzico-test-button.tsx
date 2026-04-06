'use client'

import { useState, useTransition } from 'react'
import { testIyzicoConnection } from '@/app/actions'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'

export function IyzicoTestButton() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings.integrations

  function handleTest() {
    setResult(null)
    startTransition(async () => {
      const res = await testIyzicoConnection()
      setResult(res)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleTest}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {t.testConnection}
      </button>

      {result && (
        <div
          className={`flex items-start gap-2 text-sm px-3 py-2 rounded-md ${
            result.success
              ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  )
}
