import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { saveNotificationSettings } from '@/app/actions'

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

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
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what events trigger email alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveNotificationSettings} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment failure alert</Label>
                <p className="text-xs text-muted-foreground">Get notified when a payment fails</p>
              </div>
              <Switch name="email_on_failure" defaultChecked={settings?.email_on_failure ?? true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Recovery success alert</Label>
                <p className="text-xs text-muted-foreground">Get notified when a payment is recovered</p>
              </div>
              <Switch name="email_on_recovery" defaultChecked={settings?.email_on_recovery ?? true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Daily summary</Label>
                <p className="text-xs text-muted-foreground">Daily digest of failures and recoveries</p>
              </div>
              <Switch name="daily_summary" defaultChecked={settings?.daily_summary ?? true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly report</Label>
                <p className="text-xs text-muted-foreground">Weekly performance report</p>
              </div>
              <Switch name="weekly_report" defaultChecked={settings?.weekly_report ?? true} />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="notification_email">Notification email</Label>
              <Input id="notification_email" name="notification_email" type="email" defaultValue={settings?.notification_email ?? ''} placeholder="alerts@yourcompany.com" />
            </div>
            <Button type="submit">Save preferences</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slack</CardTitle>
          <CardDescription>Send notifications to a Slack channel</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveNotificationSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack_webhook_url">Slack Webhook URL</Label>
              <Input id="slack_webhook_url" name="slack_webhook_url" defaultValue={settings?.slack_webhook_url ?? ''} placeholder="https://hooks.slack.com/services/..." />
            </div>
            <Button type="submit">Save Slack webhook</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
