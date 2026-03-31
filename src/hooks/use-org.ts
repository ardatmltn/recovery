'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Organization } from '@/types/database'

export function useOrg() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchOrg() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: userData } = await supabase
        .from('users').select('org_id').eq('id', user.id).single()

      if (!userData?.org_id) { setLoading(false); return }

      const { data } = await supabase
        .from('organizations').select('*').eq('id', userData.org_id).single()

      setOrg(data)
      setLoading(false)
    }

    fetchOrg()
  }, [])

  return { org, loading }
}
