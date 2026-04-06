'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { saveEmailNotificationSettings, saveSlackNotificationSettings } from '@/app/actions'

type Props = {
  emailOnFailure: boolean
  emailOnRecovery: boolean
  dailySummary: boolean
  weeklyReport: boolean
  notificationEmail: string
  slackWebhookUrl: string
}

export function SettingsNotificationsView(props: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings.notifications

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
              <Switch name="email_on_failure" defaultChecked={props.emailOnFailure} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.recoveryAlert}</Label>
                <p className="text-xs text-muted-foreground">{t.recoveryAlertDesc}</p>
              </div>
              <Switch name="email_on_recovery" defaultChecked={props.emailOnRecovery} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.dailySummary}</Label>
                <p className="text-xs text-muted-foreground">{t.dailySummaryDesc}</p>
              </div>
              <Switch name="daily_summary" defaultChecked={props.dailySummary} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t.weeklyReport}</Label>
                <p className="text-xs text-muted-foreground">{t.weeklyReportDesc}</p>
              </div>
              <Switch name="weekly_report" defaultChecked={props.weeklyReport} />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="notification_email">{t.notificationEmail}</Label>
              <Input id="notification_email" name="notification_email" type="email"
                defaultValue={props.notificationEmail} placeholder="alerts@yourcompany.com" />
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
              <Input id="slack_webhook_url" name="slack_webhook_url"
                defaultValue={props.slackWebhookUrl} placeholder="https://hooks.slack.com/services/..." />
            </div>
            <Button type="submit">{t.saveSlack}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
