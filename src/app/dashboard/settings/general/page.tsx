import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateFullName } from '@/app/actions'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import type { Lang } from '@/lib/language-context'

export default async function GeneralSettingsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('recoverly-lang')?.value ?? 'en') as Lang
  const t = dashboardTranslations[lang].settings.general

  const { data: userData } = await supabase
    .from('users').select('*, organizations(*)').eq('id', user!.id).single()

  const org = userData?.organizations as { name: string; slug: string; plan: string } | null

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t.organization}</CardTitle>
          <CardDescription>{t.orgDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.orgName}</Label>
            <Input defaultValue={org?.name ?? ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>{t.plan}</Label>
            <Input defaultValue={org?.plan ?? 'starter'} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.profile}</CardTitle>
          <CardDescription>{t.profileDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateFullName} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.email}</Label>
              <Input defaultValue={user?.email ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">{t.fullName}</Label>
              <Input id="full_name" name="full_name" defaultValue={userData?.full_name ?? ''} />
            </div>
            <Button type="submit">{t.saveChanges}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
