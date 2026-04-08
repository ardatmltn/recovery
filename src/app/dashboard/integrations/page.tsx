import { createServerClient } from '@/lib/supabase/server'
import { IntegrationsView } from '@/components/dashboard/views/integrations-view'

export default async function IntegrationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: org } = await supabase
    .from('organizations')
    .select('iyzico_connected, n8n_webhook_url')
    .eq('id', userData?.org_id ?? '')
    .single()

  const resendConfigured = !!process.env.RESEND_API_KEY

  return (
    <IntegrationsView
      iyzicoConnected={!!org?.iyzico_connected}
      n8nConfigured={!!org?.n8n_webhook_url}
      resendConfigured={resendConfigured}
    />
  )
}
