import { createServerClient } from '@/lib/supabase/server'
import { SettingsIntegrationsView } from '@/components/dashboard/views/settings-integrations-view'

export default async function IntegrationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: org } = await supabase
    .from('organizations')
    .select('iyzico_connected, iyzico_merchant_id, iyzico_base_url, n8n_webhook_url')
    .eq('id', userData?.org_id ?? '')
    .single()

  return (
    <SettingsIntegrationsView
      iyzicoConnected={!!org?.iyzico_connected}
      iyzicoMerchantId={org?.iyzico_merchant_id ?? ''}
      iyzicoBaseUrl={org?.iyzico_base_url ?? 'https://sandbox-api.iyzipay.com'}
      n8nWebhookUrl={org?.n8n_webhook_url ?? ''}
    />
  )
}
