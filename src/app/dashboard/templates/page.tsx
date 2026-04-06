import { createServerClient } from '@/lib/supabase/server'
import { TemplatesView } from '@/components/dashboard/views/templates-view'

export default async function TemplatesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: templates } = await supabase
    .from('message_templates')
    .select('id, name, subject, body, is_default, ai_enhanced')
    .eq('org_id', userData?.org_id ?? '')
    .eq('type', 'email')
    .order('created_at', { ascending: true })

  return <TemplatesView templates={templates ?? []} />
}
