import { createServerClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import type { SequenceStep } from '@/types/database'
import { createRecoverySequence, toggleSequenceActive } from '@/app/actions'

export default async function SequencesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: sequences } = await supabase
    .from('recovery_sequences')
    .select('*')
    .eq('org_id', userData?.org_id ?? '')
    .order('is_default', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recovery Sequences</h1>
          <p className="text-muted-foreground">Configure automated recovery steps</p>
        </div>
      </div>

      {/* New sequence form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRecoverySequence} className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input id="name" name="name" placeholder="e.g. High-value customer sequence" required />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      {/* Sequence list */}
      <div className="grid gap-4">
        {!sequences || sequences.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No sequences yet. A default sequence will be created automatically on first login.
            </CardContent>
          </Card>
        ) : (
          sequences.map((seq) => {
            const steps = (seq.steps as SequenceStep[]) ?? []
            return (
              <Card key={seq.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{seq.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Updated {formatDate(seq.updated_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {seq.is_default && <Badge variant="secondary">Default</Badge>}
                    <Badge variant={seq.is_active ? 'default' : 'outline'}>
                      {seq.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <form action={toggleSequenceActive}>
                      <input type="hidden" name="id" value={seq.id} />
                      <input type="hidden" name="is_active" value={String(seq.is_active)} />
                      <Button type="submit" variant="ghost" size="sm">
                        {seq.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    {steps.map((step) => (
                      <div key={step.step} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                        <span className="font-medium">Step {step.step}</span>
                        <span className="text-muted-foreground capitalize">{step.type}</span>
                        <span className="text-muted-foreground">+{step.delay_hours}h</span>
                      </div>
                    ))}
                    {steps.length === 0 && (
                      <p className="text-sm text-muted-foreground">No steps configured.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
