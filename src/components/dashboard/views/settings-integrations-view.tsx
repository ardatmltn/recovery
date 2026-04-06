'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { saveIyzicoCredentials, saveN8nWebhookUrl } from '@/app/actions'
import { IyzicoTestButton } from '@/components/dashboard/iyzico-test-button'

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
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{t.iyzicoTitle}</CardTitle>
            <CardDescription>{t.iyzicoDesc}</CardDescription>
          </div>
          <Badge variant={iyzicoConnected ? 'default' : 'secondary'}>
            {iyzicoConnected ? t.connected : t.notConnected}
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
              <Input id="iyzico_merchant_id" name="iyzico_merchant_id" defaultValue={iyzicoMerchantId} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iyzico_base_url">{t.baseUrl}</Label>
              <Input id="iyzico_base_url" name="iyzico_base_url" defaultValue={iyzicoBaseUrl} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">{t.saveCredentials}</Button>
              {iyzicoConnected && <IyzicoTestButton />}
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
              <Input id="n8n_webhook_url" name="n8n_webhook_url" defaultValue={n8nWebhookUrl}
                placeholder="https://your-n8n.domain.com/webhook/..." />
            </div>
            <Button type="submit">{t.saveN8n}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
