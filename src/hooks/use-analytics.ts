'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DailyAnalytics } from '@/types/database'

export function useAnalytics(orgId: string | null, days = 30) {
  const [data, setData] = useState<DailyAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    const supabase = createClient()

    async function fetchAnalytics() {
      const from = new Date()
      from.setDate(from.getDate() - days)

      const { data: rows } = await supabase
        .from('daily_analytics')
        .select('*')
        .eq('org_id', orgId as string)
        .gte('date', from.toISOString().split('T')[0])
        .order('date', { ascending: true })

      setData(rows ?? [])
      setLoading(false)
    }

    fetchAnalytics()
  }, [orgId, days])

  return { data, loading }
}
