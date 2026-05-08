import { NextResponse } from 'next/server'

// Payment system integration pending — will be wired up once provider is confirmed.
export async function POST() {
  return NextResponse.json(
    { error: 'Payment system is not yet configured.' },
    { status: 503 }
  )
}
