import { createServerClient } from '@/lib/supabase/server'
import { SequencesView } from '@/components/dashboard/views/sequences-view'

export default async function SequencesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: sequences } = await supabase
    .from('recovery_sequences').select('*')
    .eq('org_id', userData?.org_id ?? '')
    .order('is_default', { ascending: false })

  return <SequencesView sequences={sequences ?? []} />
}
