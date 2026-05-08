import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

type AnalysisRequestBody = {
  name: string
  email: string
  revenue: string
  provider: string
}

export async function POST(request: Request) {
  let body: AnalysisRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name, email, revenue, provider } = body
  if (!name || !email || !revenue || !provider) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const notifyEmail = process.env.FOUNDER_EMAIL ?? 'temelatanarda@gmail.com'

  try {
    await resend.emails.send({
      from: 'Recoverly <noreply@recoverly.io>',
      to: notifyEmail,
      subject: `Yeni Analiz İsteği — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#09090b;color:#fff;border-radius:12px;">
          <h2 style="color:#9fff88;margin:0 0 24px;">Yeni Gelir Kaçağı Analizi İsteği</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#a1a1aa;font-size:13px;">İşletme</td><td style="padding:10px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#a1a1aa;font-size:13px;">E-posta</td><td style="padding:10px 0;font-weight:600;"><a href="mailto:${email}" style="color:#9fff88;">${email}</a></td></tr>
            <tr><td style="padding:10px 0;color:#a1a1aa;font-size:13px;">Aylık Gelir</td><td style="padding:10px 0;font-weight:600;">${revenue}</td></tr>
            <tr><td style="padding:10px 0;color:#a1a1aa;font-size:13px;">Ödeme Sağlayıcı</td><td style="padding:10px 0;font-weight:600;">${provider}</td></tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#52525b;">10 dakika içinde analizi gönder.</p>
        </div>
      `,
    })
  } catch {
    // Don't fail the user-facing request if email fails
  }

  return NextResponse.json({ ok: true })
}
