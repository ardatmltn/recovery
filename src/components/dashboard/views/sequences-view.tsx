'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRecoverySequence, toggleSequenceActive } from '@/app/actions'
import type { SequenceStep } from '@/types/database'

type Sequence = {
  id: string
  name: string
  is_default: boolean
  is_active: boolean
  updated_at: string
  steps: unknown
}

export function SequencesView({ sequences }: { sequences: Sequence[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].sequences

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{t.newSequence}</CardTitle></CardHeader>
        <CardContent>
          <form action={createRecoverySequence} className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="name" className="sr-only">{t.newSequence}</Label>
              <Input id="name" name="name" placeholder={t.namePlaceholder} required />
            </div>
            <Button type="submit">{t.createBtn}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sequences.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">{t.noSequences}</CardContent>
          </Card>
        ) : (
          sequences.map((seq) => {
            const steps = (seq.steps as SequenceStep[]) ?? []
            return (
              <Card key={seq.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{seq.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{t.updated} {formatDate(seq.updated_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {seq.is_default && <Badge variant="secondary">{t.defaultBadge}</Badge>}
                    <Badge variant={seq.is_active ? 'default' : 'outline'}>
                      {seq.is_active ? t.activeBadge : t.inactiveBadge}
                    </Badge>
                    <form action={toggleSequenceActive}>
                      <input type="hidden" name="id" value={seq.id} />
                      <input type="hidden" name="is_active" value={String(seq.is_active)} />
                      <Button type="submit" variant="ghost" size="sm">
                        {seq.is_active ? t.deactivate : t.activate}
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    {steps.map((step) => (
                      <div key={step.step} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                        <span className="font-medium">{t.step} {step.step}</span>
                        <span className="text-muted-foreground capitalize">{step.type}</span>
                        <span className="text-muted-foreground">+{step.delay_hours}h</span>
                      </div>
                    ))}
                    {steps.length === 0 && <p className="text-sm text-muted-foreground">{t.noSteps}</p>}
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
