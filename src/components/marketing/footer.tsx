'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/components/marketing/translations'

export function MarketingFooter() {
  const { lang } = useLanguage()
  const tx = translations[lang].footer

  return (
    <footer className="border-t border-zinc-800 bg-[#09090B]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-display font-semibold text-white text-base">Recoverly</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">{tx.tagline}</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">{tx.product}</p>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">{tx.pricing}</Link></li>
              <li><Link href="/register" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">{tx.register}</Link></li>
              <li><Link href="/login" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">{tx.signIn}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">{tx.legal}</p>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">{tx.privacy}</Link></li>
              <li><Link href="/terms" className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors">{tx.terms}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <p className="text-zinc-600 text-xs">{tx.copyright}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-zinc-600 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
