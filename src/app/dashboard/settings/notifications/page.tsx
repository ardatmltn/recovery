import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { saveEmailNotificationSettings, saveSlackNotificationSettings } from '@/app/actions'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import type { Lang } from '@/lib/language-context'

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('recoverly-lang')?.value ?? 'en') as Lang
  const t = dashboardTranslations[lang].settings.notifications

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: settings } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('org_id', userData?.org_id ?? '')
    .single()

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t.emailTitle}</CardTitle>
          <CardDescription>{t.emailDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveEmailNotificationSettings} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.failureAlert}</Label>
                <p className="text-xs text-muted-foreground">{t.failureAlertDesc}</p>
              </div>
              <Switch name="email_on_failure" defaultChecked={settings?.email_on_failure ?? true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.recoveryAlert}</Label>
                <p className="text-xs text-muted-foreground">{t.recoveryAlertDesc}</p>
              </div>
              <Switch name="email_on_recovery" defaultChecked={settings?.email_on_recovery ?? true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.dailySummary}</Label>
                <p className="text-xs text-muted-foreground">{t.dailySummaryDesc}</p>
              </div>
              <Switch name="daily_summary" defaultChecked={settings?.daily_summary ?? true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.weeklyReport}</Label>
                <p className="text-xs text-muted-foreground">{t.weeklyReportDesc}</p>
              </div>
              <Switch name="weekly_report" defaultChecked={settings?.weekly_report ?? true} />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="notification_email">{t.notificationEmail}</Label>
              <Input id="notification_email" name="notification_email" type="email" defaultValue={settings?.notification_email ?? ''} placeholder="alerts@yourcompany.com" />
            </div>
            <Button type="submit">{t.savePreferences}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.slackTitle}</CardTitle>
          <CardDescription>{t.slackDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSlackNotificationSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack_webhook_url">{t.slackUrl}</Label>
              <Input id="slack_webhook_url" name="slack_webhook_url" defaultValue={settings?.slack_webhook_url ?? ''} placeholder="https://hooks.slack.com/services/..." />
            </div>
            <Button type="submit">{t.saveSlack}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
