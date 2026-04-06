'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  orgId: string
}

export function RealtimeUpdater({ orgId }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (!orgId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`payment_events:${orgId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'payment_events',
          filter: `org_id=eq.${orgId}`,
        },
        () => {
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payment_events',
          filter: `org_id=eq.${orgId}`,
        },
        () => {
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId, router])

  return null
}
