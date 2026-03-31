'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PaymentEventWithCustomer } from '@/types/api'

export function useFailures(orgId: string | null | undefined) {
  const [failures, setFailures] = useState<PaymentEventWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) { setLoading(false); return }
    const supabase = createClient()

    async function fetchFailures() {
      const { data } = await supabase
        .from('payment_events')
        .select('*, customers(id, name, email, risk_score)')
        .eq('org_id', orgId as string)
        .in('status', ['new', 'processing'])
        .order('created_at', { ascending: false })
        .limit(50)

      setFailures((data as PaymentEventWithCustomer[]) ?? [])
      setLoading(false)
    }

    fetchFailures()
  }, [orgId])

  return { failures, loading }
}
