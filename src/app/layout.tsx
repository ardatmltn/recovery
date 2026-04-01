import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Outfit } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Recoverly — Automated Payment Recovery',
  description: 'Recover up to 25% of failed payments automatically. Smart retries, AI-personalized emails, real-time analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(outfit.variable, geistSans.variable, geistMono.variable)}>
      <body className={cn('antialiased', geistSans.className)}>
        {children}
      </body>
    </html>
  )
}
