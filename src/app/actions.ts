'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient, createServerClient } from '@/lib/supabase/server'
import { testConnectionWithConfig } from '@/lib/iyzico'

// ── helpers ──────────────────────────────────────────────────────────────────

async function getOrgId(): Promise<string> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data } = await supabase
    .from('users').select('org_id').eq('id', user.id).single()
  if (!data?.org_id) throw new Error('Organization not found')
  return data.org_id
}

// ── General settings ─────────────────────────────────────────────────────────

export async function updateFullName(formData: FormData) {
  const fullName = formData.get('full_name') as string
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('users')
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  revalidatePath('/dashboard/settings/general')
}

// ── İyzico credentials ───────────────────────────────────────────────────────

export async function saveIyzicoCredentials(formData: FormData) {
  const orgId = await getOrgId()

  const apiKey = formData.get('iyzico_api_key') as string
  const secretKey = formData.get('iyzico_secret_key') as string
  const merchantId = formData.get('iyzico_merchant_id') as string
  const baseUrl = (formData.get('iyzico_base_url') as string) || 'https://sandbox-api.iyzipay.com'

  // Only update key fields if provided (not empty — preserve existing)
  const update: Record<string, string | boolean> = {
    iyzico_merchant_id: merchantId,
    iyzico_base_url: baseUrl,
    updated_at: new Date().toISOString(),
  }
  if (apiKey) update['iyzico_api_key_encrypted'] = apiKey
  if (secretKey) update['iyzico_secret_key_encrypted'] = secretKey
  if (merchantId) update['iyzico_connected'] = true

  const supabase = createServiceClient()
  await supabase.from('organizations').update(update).eq('id', orgId)

  revalidatePath('/dashboard/settings/integrations')
}

// ── İyzico connection test ────────────────────────────────────────────────────

export async function testIyzicoConnection(): Promise<{ success: boolean; message: string }> {
  const orgId = await getOrgId()
  const supabase = createServiceClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('iyzico_api_key_encrypted, iyzico_secret_key_encrypted, iyzico_base_url')
    .eq('id', orgId)
    .single()

  if (!org?.iyzico_api_key_encrypted || !org?.iyzico_secret_key_encrypted) {
    return { success: false, message: 'Please save your API Key and Secret Key first.' }
  }

  return testConnectionWithConfig({
    apiKey: org.iyzico_api_key_encrypted,
    secretKey: org.iyzico_secret_key_encrypted,
    baseUrl: org.iyzico_base_url ?? 'https://sandbox-api.iyzipay.com',
  })
}

// ── n8n webhook URL ───────────────────────────────────────────────────────────

export async function saveN8nWebhookUrl(formData: FormData) {
  const orgId = await getOrgId()
  const url = formData.get('n8n_webhook_url') as string

  const supabase = createServiceClient()
  await supabase
    .from('organizations')
    .update({ n8n_webhook_url: url, updated_at: new Date().toISOString() })
    .eq('id', orgId)

  revalidatePath('/dashboard/settings/integrations')
}

// ── Notification settings ────────────────────────────────────────────────────

// ── Recovery sequences ───────────────────────────────────────────────────────

export async function createRecoverySequence(formData: FormData) {
  const orgId = await getOrgId()
  const name = formData.get('name') as string
  if (!name?.trim()) return

  const supabase = createServiceClient()
  await supabase.from('recovery_sequences').insert({
    org_id: orgId,
    name: name.trim(),
    is_default: false,
    is_active: true,
    steps: [
      { step: 1, type: 'retry',  delay_hours: 1  },
      { step: 2, type: 'email',  delay_hours: 24 },
      { step: 3, type: 'email',  delay_hours: 72 },
    ],
  })

  revalidatePath('/dashboard/sequences')
}

export async function toggleSequenceActive(formData: FormData) {
  const orgId = await getOrgId()
  const id = formData.get('id') as string
  const currentActive = formData.get('is_active') === 'true'

  const supabase = createServiceClient()
  await supabase
    .from('recovery_sequences')
    .update({ is_active: !currentActive, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId)

  revalidatePath('/dashboard/sequences')
}

// ── Notification settings ────────────────────────────────────────────────────

export async function saveNotificationSettings(formData: FormData) {
  const orgId = await getOrgId()

  const supabase = createServiceClient()
  await supabase
    .from('notification_settings')
    .upsert({
      org_id: orgId,
      email_on_failure: formData.get('email_on_failure') === 'on',
      email_on_recovery: formData.get('email_on_recovery') === 'on',
      daily_summary: formData.get('daily_summary') === 'on',
      weekly_report: formData.get('weekly_report') === 'on',
      notification_email: formData.get('notification_email') as string || null,
      slack_webhook_url: formData.get('slack_webhook_url') as string || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'org_id' })

  revalidatePath('/dashboard/settings/notifications')
}
