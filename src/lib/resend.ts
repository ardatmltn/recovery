import { Resend } from 'resend'

// Instantiated lazily so build-time absence of RESEND_API_KEY doesn't crash
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  return _resend
}

// Template variable substitution
export function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    template
  )
}

// Wraps plain-text body in a clean, branded HTML email
export function wrapInEmailHtml(opts: {
  body: string
  orgName: string
  ctaText?: string
  ctaUrl?: string
}): string {
  const { body, orgName, ctaText, ctaUrl } = opts

  // Convert newlines to <br> and detect [CTA text] patterns for button
  const bodyHtml = body
    .replace(/\[([^\]]+)\]/g, (_, text) => {
      const url = ctaUrl ?? '#'
      return `</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
          <tr>
            <td align="center">
              <a href="${url}" style="display:inline-block;background:#22c55e;color:#000;font-weight:700;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:8px;">${text}</a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 16px;color:#a1a1aa;font-size:15px;line-height:1.6;">`
    })
    .split('\n')
    .filter(line => line !== '')
    .join('<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${orgName}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#22c55e;border-radius:8px;padding:8px 10px;vertical-align:middle;">
                    <span style="color:#000;font-size:16px;font-weight:700;">⚡</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;font-weight:700;">${orgName}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:40px;">
              <p style="margin:0 0 16px;color:#a1a1aa;font-size:15px;line-height:1.6;">${bodyHtml}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;" align="center">
              <p style="margin:0;color:#52525b;font-size:12px;line-height:1.6;">
                You received this email because you are a customer of ${orgName}.<br/>
                Powered by <a href="https://recoverly.io" style="color:#22c55e;text-decoration:none;">Recoverly</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export type SendEmailParams = {
  to: string
  subject: string
  body: string
  orgName: string
  ctaUrl?: string
  fromEmail?: string
  fromName?: string
}

export async function sendRecoveryEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, body, orgName, ctaUrl, fromEmail, fromName } = params

  const html = wrapInEmailHtml({ body, orgName, ctaUrl })

  const from = fromEmail
    ? `${fromName ?? orgName} <${fromEmail}>`
    : `${orgName} <recovery@recoverly.io>`

  try {
    const { data, error } = await getResend().emails.send({ from, to, subject, html })
    if (error) return { success: false, error: error.message }
    return { success: true, messageId: data?.id }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
