import { createServerClient } from '@/lib/supabase/server'
import { SettingsNotificationsView } from '@/components/dashboard/views/settings-notifications-view'

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: settings } = await supabase
    .from('notification_settings').select('*')
    .eq('org_id', userData?.org_id ?? '').single()

  return (
    <SettingsNotificationsView
      emailOnFailure={settings?.email_on_failure ?? true}
      emailOnRecovery={settings?.email_on_recovery ?? true}
      dailySummary={settings?.daily_summary ?? true}
      weeklyReport={settings?.weekly_report ?? true}
      notificationEmail={settings?.notification_email ?? ''}
      slackWebhookUrl={settings?.slack_webhook_url ?? ''}
    />
  )
}
