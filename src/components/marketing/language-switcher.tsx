'use client'

import { useLanguage, type Lang } from '@/lib/language-context'

const langs: Record<Lang, { src: string; label: string }> = {
  tr: { src: 'https://flagcdn.com/w40/tr.png', label: 'TR' },
  en: { src: 'https://flagcdn.com/w40/gb.png', label: 'EN' },
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-full gap-0.5">
      {(['tr', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          title={langs[l].label}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            lang === l
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <img
            src={langs[l].src}
            alt={langs[l].label}
            width={20}
            height={14}
            className="rounded-sm object-cover"
          />
        </button>
      ))}
    </div>
  )
}
