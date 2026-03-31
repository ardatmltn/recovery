import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { saveIyzicoCredentials, saveN8nWebhookUrl } from '@/app/actions'

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
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>İyzico</CardTitle>
            <CardDescription>Connect your İyzico account to monitor payments</CardDescription>
          </div>
          <Badge variant={org?.iyzico_connected ? 'default' : 'secondary'}>
            {org?.iyzico_connected ? 'Connected' : 'Not connected'}
          </Badge>
        </CardHeader>
        <CardContent>
          <form action={saveIyzicoCredentials} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iyzico_api_key">API Key</Label>
              <Input id="iyzico_api_key" name="iyzico_api_key" type="password" placeholder="Leave blank to keep existing" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_secret_key">Secret Key</Label>
              <Input id="iyzico_secret_key" name="iyzico_secret_key" type="password" placeholder="Leave blank to keep existing" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_merchant_id">Merchant ID</Label>
              <Input id="iyzico_merchant_id" name="iyzico_merchant_id" defaultValue={org?.iyzico_merchant_id ?? ''} placeholder="Your İyzico merchant ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_base_url">Base URL</Label>
              <Input id="iyzico_base_url" name="iyzico_base_url" defaultValue={org?.iyzico_base_url ?? 'https://sandbox-api.iyzipay.com'} />
            </div>
            <Button type="submit">Save İyzico credentials</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>n8n Webhook</CardTitle>
          <CardDescription>Connect your self-hosted n8n instance</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveN8nWebhookUrl} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n8n_webhook_url">n8n Webhook URL</Label>
              <Input id="n8n_webhook_url" name="n8n_webhook_url" defaultValue={org?.n8n_webhook_url ?? ''} placeholder="https://your-n8n.domain.com/webhook/..." />
            </div>
            <Button type="submit">Save n8n URL</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
