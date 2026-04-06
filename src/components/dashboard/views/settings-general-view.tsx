'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateFullName } from '@/app/actions'

type Props = {
  email: string
  fullName: string
  orgName: string
  orgPlan: string
}

export function SettingsGeneralView({ email, fullName, orgName, orgPlan }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings.general

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
            <Input defaultValue={orgName} disabled />
          </div>
          <div className="space-y-2">
            <Label>{t.plan}</Label>
            <Input defaultValue={orgPlan} disabled />
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
              <Input defaultValue={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">{t.fullName}</Label>
              <Input id="full_name" name="full_name" defaultValue={fullName} />
            </div>
            <Button type="submit">{t.saveChanges}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
