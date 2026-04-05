'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { LanguageSwitcher } from './language-switcher'
import { useLanguage } from '@/lib/language-context'
import { translations } from './translations'

interface MarketingNavProps {
  showUpgradeButton?: React.ReactNode
}

export function MarketingNav({ showUpgradeButton }: MarketingNavProps) {
  const { lang } = useLanguage()
  const tx = translations[lang].nav

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#09090B]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.3)]">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">Recoverly</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {showUpgradeButton}
          <Link href="/pricing" className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            {tx.pricing}
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-full transition-all bg-zinc-900/50 hover:bg-zinc-800/60"
          >
            {tx.signIn}
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-black text-sm font-semibold rounded-full transition-all shadow-[0_0_16px_rgba(59,130,246,0.2)] hover:shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:-translate-y-px"
          >
            {tx.getStarted}
          </Link>
        </div>
      </div>
    </nav>
  )
}
