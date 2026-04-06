import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, body, templateName } = await request.json() as {
    subject: string
    body: string
    templateName: string
  }

  if (!subject || !body) {
    return NextResponse.json({ error: 'subject and body required' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 })
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert at writing empathetic, conversion-focused payment recovery emails for SaaS companies.
Your goal is to help recover failed payments while maintaining a positive relationship with the customer.

Rules:
- Keep the subject line concise and non-alarming (avoid words like "URGENT", "FINAL NOTICE" for first emails)
- The body should be warm, human, and clear — not robotic or threatening
- Preserve these template variables exactly as-is: {{customer_name}}, {{amount}}, {{org_name}}, {{failure_reason}}
- Preserve any [Button text] CTA markers exactly as-is
- Keep the same overall structure and length
- Return JSON with keys: "subject" and "body"`,
      },
      {
        role: 'user',
        content: `This is a "${templateName}" payment recovery email template. Please improve it to be more empathetic and conversion-focused while keeping the same intent.

Subject: ${subject}

Body:
${body}

Return only valid JSON: {"subject": "...", "body": "..."}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1000,
  })

  const result = JSON.parse(completion.choices[0].message.content ?? '{}') as {
    subject?: string
    body?: string
  }

  if (!result.subject || !result.body) {
    return NextResponse.json({ error: 'AI returned invalid response' }, { status: 500 })
  }

  return NextResponse.json({ subject: result.subject, body: result.body })
}
