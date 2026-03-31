'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type RealtimeOptions = {
  table: string
  orgId: string
  onInsert?: (payload: Record<string, unknown>) => void
  onUpdate?: (payload: Record<string, unknown>) => void
}

export function useRealtime({ table, orgId, onInsert, onUpdate }: RealtimeOptions) {
  useEffect(() => {
    if (!orgId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`${table}:${orgId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table, filter: `org_id=eq.${orgId}` },
        (payload) => onInsert?.(payload.new as Record<string, unknown>)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter: `org_id=eq.${orgId}` },
        (payload) => onUpdate?.(payload.new as Record<string, unknown>)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [table, orgId, onInsert, onUpdate])
}
