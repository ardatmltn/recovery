'use client'

import { useLanguage, type Lang } from '@/lib/language-context'

const flags: Record<Lang, { emoji: string; label: string }> = {
  tr: { emoji: '🇹🇷', label: 'TR' },
  en: { emoji: '🇬🇧', label: 'EN' },
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-full gap-0.5">
      {(['tr', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            lang === l
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="text-sm leading-none">{flags[l].emoji}</span>
          {flags[l].label}
        </button>
      ))}
    </div>
  )
}
