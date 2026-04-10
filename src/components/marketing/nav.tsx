'use client'

import Link from 'next/link'
import { LanguageSwitcher } from './language-switcher'
import { useLanguage } from '@/lib/language-context'
import { translations } from './translations'

export function MarketingNav() {
  const { lang } = useLanguage()
  const t = translations[lang].nav

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_40px_rgba(159,255,136,0.04)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-[#9fff88]">Recoverly</Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link href="/pricing" className="text-[#adaaaa] font-medium text-sm tracking-tight hover:text-[#9fff88] transition-colors duration-300">
            {t.pricing}
          </Link>
          <Link href="/login" className="text-[#adaaaa] font-medium text-sm tracking-tight hover:text-[#9fff88] transition-colors duration-300">
            {t.signIn}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/register"
            className="bg-[#9fff88] text-black font-bold text-sm px-6 py-2.5 rounded-lg active:scale-95 transition-transform hover:bg-[#8aee72]"
          >
            {t.getStartedShort}
          </Link>
        </div>
      </div>
    </nav>
  )
}
