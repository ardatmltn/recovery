import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 59,
    features: ['1 payment provider', 'Email recovery only', 'Basic analytics', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 99,
    features: ['2 payment providers', 'Email + SMS recovery', 'AI personalization', 'Advanced analytics', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    features: ['Unlimited providers', 'All channels', 'AI personalization', 'Custom sequences', 'Dedicated support'],
  },
]

export default async function BillingPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: org } = await supabase
    .from('organizations')
    .select('plan, plan_status')
    .eq('id', userData?.org_id ?? '')
    .single()

  const currentPlan = org?.plan ?? 'starter'

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are on the {currentPlan} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold capitalize">{currentPlan}</span>
            <Badge variant={org?.plan_status === 'active' ? 'default' : 'secondary'}>
              {org?.plan_status ?? 'trialing'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={currentPlan === plan.id ? 'border-primary' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {currentPlan === plan.id && <Badge>Current</Badge>}
              </div>
              <p className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={currentPlan === plan.id ? 'outline' : 'default'}
                className="w-full"
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current plan' : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
