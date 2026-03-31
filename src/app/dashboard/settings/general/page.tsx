import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateFullName } from '@/app/actions'

export default async function GeneralSettingsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('*, organizations(*)').eq('id', user!.id).single()

  const org = userData?.organizations as { name: string; slug: string; plan: string } | null

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Organization name</Label>
            <Input defaultValue={org?.name ?? ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <Input defaultValue={org?.plan ?? 'starter'} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateFullName} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={userData?.full_name ?? ''} />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
