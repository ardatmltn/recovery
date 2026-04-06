import { NextResponse } from 'next/server'
import { retrieveCheckoutForm } from '@/lib/iyzico'

export async function POST(request: Request) {
  const text = await request.text()
  const params = new URLSearchParams(text)
  const token = params.get('token')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/pricing?checkout=error`)
  }

  const result = await retrieveCheckoutForm(token)

  if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
    return NextResponse.redirect(`${baseUrl}/dashboard?checkout=success`)
  }

  return NextResponse.redirect(`${baseUrl}/pricing?checkout=failed`)
}
