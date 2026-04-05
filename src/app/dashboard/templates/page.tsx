import { createServerClient } from '@/lib/supabase/server'
import { Mail, Sparkles, Info } from 'lucide-react'
import { saveTemplate } from '@/app/actions'

export default async function TemplatesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: templates } = await supabase
    .from('message_templates')
    .select('*')
    .eq('org_id', userData?.org_id ?? '')
    .eq('type', 'email')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Message Templates</h1>
        <p className="text-muted-foreground text-sm">Customize the emails sent to your customers during recovery sequences.</p>
      </div>

      {/* Variable reference */}
      <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
        <Info className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          Available variables:{' '}
          {['{{customer_name}}', '{{amount}}', '{{org_name}}', '{{failure_reason}}'].map((v) => (
            <code key={v} className="mx-1 px-1.5 py-0.5 bg-zinc-800 rounded text-green-400 text-[11px]">{v}</code>
          ))}
          {' '}· Use{' '}
          <code className="mx-1 px-1.5 py-0.5 bg-zinc-800 rounded text-green-400 text-[11px]">[Button text]</code>
          {' '}to add a call-to-action button.
        </p>
      </div>

      {!templates || templates.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 py-12 text-center">
          <p className="text-muted-foreground text-sm">No templates yet. They will be created automatically on first login.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {templates.map((template, idx) => (
            <div key={template.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Step {idx + 2} Email
                      {template.is_default && (
                        <span className="ml-2 text-[10px] font-normal text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">default</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500">{template.name}</p>
                  </div>
                </div>
                {template.ai_enhanced && (
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <Sparkles className="w-3 h-3" />
                    AI enhanced
                  </div>
                )}
              </div>

              {/* Edit form */}
              <form action={saveTemplate} className="p-5 space-y-4">
                <input type="hidden" name="id" value={template.id} />

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Template name</label>
                  <input
                    name="name"
                    defaultValue={template.name}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Subject line</label>
                  <input
                    name="subject"
                    defaultValue={template.subject ?? ''}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Body</label>
                  <textarea
                    name="body"
                    defaultValue={template.body ?? ''}
                    rows={10}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-y font-mono leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded-lg transition-colors"
                  >
                    Save template
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
