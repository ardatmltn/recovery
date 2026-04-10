'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { Mail, Sparkles, Info, Loader2 } from 'lucide-react'
import { saveTemplate } from '@/app/actions'
import { useRef, useState } from 'react'

type Template = {
  id: string
  name: string
  subject: string | null
  body: string | null
  is_default: boolean
  ai_enhanced: boolean
}

function TemplateForm({ template, idx }: { template: Template; idx: number }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].templates

  const subjectRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const [enhancing, setEnhancing] = useState(false)
  const [enhanced, setEnhanced] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    const subject = subjectRef.current?.value ?? ''
    const body = bodyRef.current?.value ?? ''
    if (!subject || !body) return

    setEnhancing(true)
    setError(null)

    try {
      const res = await fetch('/api/ai/enhance-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, templateName: template.name }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'AI enhancement failed')
        return
      }

      const data = await res.json() as { subject: string; body: string }
      if (subjectRef.current) subjectRef.current.value = data.subject
      if (bodyRef.current) bodyRef.current.value = data.body
      setEnhanced(true)
    } catch {
      setError('Network error')
    } finally {
      setEnhancing(false)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {t.stepEmail(idx + 2)}
              {template.is_default && (
                <span className="ml-2 text-[10px] font-normal text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">{t.defaultBadge}</span>
              )}
            </p>
            <p className="text-xs text-zinc-500">{template.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(template.ai_enhanced || enhanced) && (
            <div className="flex items-center gap-1 text-xs text-purple-400">
              <Sparkles className="w-3 h-3" />
              {t.aiEnhanced}
            </div>
          )}
          <button
            type="button"
            onClick={handleEnhance}
            disabled={enhancing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enhancing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            {enhancing ? t.enhancing : t.enhanceWithAI}
          </button>
        </div>
      </div>
      {error && (
        <div className="px-5 pt-3 text-xs text-red-400">{error}</div>
      )}
      <form action={saveTemplate} className="p-5 space-y-4">
        <input type="hidden" name="id" value={template.id} />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">{t.templateName}</label>
          <input name="name" defaultValue={template.name}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">{t.subjectLine}</label>
          <input ref={subjectRef} name="subject" defaultValue={template.subject ?? ''}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">{t.body}</label>
          <textarea ref={bodyRef} name="body" defaultValue={template.body ?? ''} rows={10}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-y font-mono leading-relaxed" />
        </div>
        <div className="flex justify-end">
          <button type="submit"
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded-lg transition-colors">
            {t.saveTemplate}
          </button>
        </div>
      </form>
    </div>
  )
}

export function TemplatesView({ templates }: { templates: Template[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].templates

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">{t.title}</h1>
        <p className="text-zinc-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
        <Info className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          {t.availableVars}{' '}
          {['{{customer_name}}', '{{amount}}', '{{org_name}}', '{{failure_reason}}'].map((v) => (
            <code key={v} className="mx-1 px-1.5 py-0.5 bg-zinc-800 rounded text-green-400 text-[11px]">{v}</code>
          ))}
          {' '}· {t.use}{' '}
          <code className="mx-1 px-1.5 py-0.5 bg-zinc-800 rounded text-green-400 text-[11px]">[Button text]</code>
          {' '}{t.ctaNote}
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 py-12 text-center">
          <p className="text-zinc-500 text-sm">{t.noTemplates}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {templates.map((template, idx) => (
            <TemplateForm key={template.id} template={template} idx={idx} />
          ))}
        </div>
      )}
    </div>
  )
}
