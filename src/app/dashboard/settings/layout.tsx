'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].settings

  const tabs = [
    { href: '/dashboard/settings/general', label: t.tabs.general },
    { href: '/dashboard/settings/integrations', label: t.tabs.integrations },
    { href: '/dashboard/settings/notifications', label: t.tabs.notifications },
    { href: '/dashboard/settings/billing', label: t.tabs.billing },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-white text-2xl">{t.title}</h1>
        <p className="text-zinc-500 text-sm mt-0.5">{t.subtitle}</p>
      </div>
      <div className="flex gap-1 border-b border-zinc-800">
        {tabs.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              pathname === href
                ? 'border-green-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            )}
          >
            {label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  )
}
