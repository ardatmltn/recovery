import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { saveIyzicoCredentials, saveN8nWebhookUrl } from '@/app/actions'
import { IyzicoTestButton } from '@/components/dashboard/iyzico-test-button'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import type { Lang } from '@/lib/language-context'

export default async function IntegrationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('recoverly-lang')?.value ?? 'en') as Lang
  const t = dashboardTranslations[lang].settings.integrations

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
            <CardTitle>{t.iyzicoTitle}</CardTitle>
            <CardDescription>{t.iyzicoDesc}</CardDescription>
          </div>
          <Badge variant={org?.iyzico_connected ? 'default' : 'secondary'}>
            {org?.iyzico_connected ? t.connected : t.notConnected}
          </Badge>
        </CardHeader>
        <CardContent>
          <form action={saveIyzicoCredentials} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iyzico_api_key">{t.apiKey}</Label>
              <Input id="iyzico_api_key" name="iyzico_api_key" type="password" placeholder={t.leaveBlank} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_secret_key">{t.secretKey}</Label>
              <Input id="iyzico_secret_key" name="iyzico_secret_key" type="password" placeholder={t.leaveBlank} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_merchant_id">{t.merchantId}</Label>
              <Input id="iyzico_merchant_id" name="iyzico_merchant_id" defaultValue={org?.iyzico_merchant_id ?? ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_base_url">{t.baseUrl}</Label>
              <Input id="iyzico_base_url" name="iyzico_base_url" defaultValue={org?.iyzico_base_url ?? 'https://sandbox-api.iyzipay.com'} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">{t.saveCredentials}</Button>
              {org?.iyzico_connected && <IyzicoTestButton />}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.n8nTitle}</CardTitle>
          <CardDescription>{t.n8nDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveN8nWebhookUrl} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n8n_webhook_url">{t.n8nUrl}</Label>
              <Input id="n8n_webhook_url" name="n8n_webhook_url" defaultValue={org?.n8n_webhook_url ?? ''} placeholder="https://your-n8n.domain.com/webhook/..." />
            </div>
            <Button type="submit">{t.saveN8n}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
