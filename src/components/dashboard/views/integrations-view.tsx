'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, RefreshCw, Terminal, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type IntegrationStatus = 'active' | 'inactive' | 'error'

type Integration = {
  id: string
  name: string
  description: string
  category: 'payment' | 'automation' | 'email' | 'ai'
  status: IntegrationStatus
  initials: string
  bgColor: string
  textColor: string
  settingsHref?: string
}

type Props = {
  iyzicoConnected: boolean
  n8nConfigured: boolean
  resendConfigured: boolean
}

const CATEGORIES = [
  { id: 'all', label: 'Hepsi' },
  { id: 'payment', label: 'Ödeme Ağ Geçitleri' },
  { id: 'automation', label: 'Otomasyon' },
  { id: 'email', label: 'E-posta' },
  { id: 'ai', label: 'Yapay Zeka' },
]

export function IntegrationsView({ iyzicoConnected, n8nConfigured, resendConfigured }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const integrations: Integration[] = [
    {
      id: 'iyzico',
      name: 'İyzico',
      description: 'Türkiye\'nin önde gelen ödeme altyapısı. Kredi kartı, banka kartı ve taksit ödemelerini yönetin.',
      category: 'payment',
      status: iyzicoConnected ? 'active' : 'inactive',
      initials: 'İY',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      settingsHref: '/dashboard/settings/integrations',
    },
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Kurtarma sekansları ve bildirimler için iş akışı otomasyon motoru. Webhook entegrasyonuyla çalışır.',
      category: 'automation',
      status: n8nConfigured ? 'active' : 'inactive',
      initials: 'n8n',
      bgColor: 'bg-orange-500',
      textColor: 'text-white',
      settingsHref: '/dashboard/settings/integrations',
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Geliştiriciler için modern e-posta altyapısı. Kurtarma e-postalarını güvenilir biçimde gönderin.',
      category: 'email',
      status: resendConfigured ? 'active' : 'inactive',
      initials: 'R',
      bgColor: 'bg-zinc-700',
      textColor: 'text-white',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Global ödemeler ve abonelik yönetimi için uçtan uca altyapı desteği.',
      category: 'payment',
      status: 'inactive',
      initials: 'S',
      bgColor: 'bg-indigo-600',
      textColor: 'text-white',
    },
    {
      id: 'lemonsqueezy',
      name: 'LemonSqueezy',
      description: 'Dijital ürünler ve abonelik yönetimi için modern ödeme platformu.',
      category: 'payment',
      status: 'inactive',
      initials: 'LS',
      bgColor: 'bg-yellow-400',
      textColor: 'text-zinc-900',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Kurtarma mesajlarını kişiselleştirmek için yapay zeka dil modelleri. Growth ve Pro planlarda aktif.',
      category: 'ai',
      status: 'inactive',
      initials: 'AI',
      bgColor: 'bg-emerald-600',
      textColor: 'text-white',
    },
  ]

  const filtered = activeCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === activeCategory)

  const activeCount = integrations.filter(i => i.status === 'active').length

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Entegrasyonlar</h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Ödeme sağlayıcılarınızı, otomasyon araçlarınızı ve iletişim sistemlerinizi tek bir merkezden yönetin.
            Veri akışını otomatize ederek operasyonel hızınızı artırın.
          </p>
        </div>
        <div className="flex-shrink-0 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-xs font-bold text-[#9fff88] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9fff88] animate-pulse" />
          {activeCount} AKTİF SERVİS
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-[#9fff88] text-zinc-900 font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            )}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Integration Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(integration => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </section>

      {/* Custom API Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-[#9fff88]/10 rounded-lg">
              <Terminal className="w-5 h-5 text-[#9fff88]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Custom API Gateway</h2>
          </div>
          <p className="text-zinc-400 text-base leading-relaxed mb-7">
            Özel ihtiyaçlarınız için kendi webhook'larınızı veya API entegrasyonlarınızı oluşturun.
            Recoverly Webhook API'si ile tam kontrol elinizde.
          </p>
          <div className="flex gap-4 flex-wrap items-center">
            <a
              href="https://docs.recoverly.io"
              className="bg-[#9fff88] text-zinc-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"
            >
              API Dokümantasyonu
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button className="text-zinc-400 hover:text-white font-medium text-sm border-b border-transparent hover:border-[#9fff88] transition-all pb-0.5">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5 font-mono text-xs overflow-hidden">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-[#9fff88]" />
            <span className="ml-3 text-zinc-500 font-sans text-xs">webhook.ts</span>
          </div>
          <pre className="text-zinc-400 leading-relaxed text-[11px] whitespace-pre-wrap">
{`import Recoverly from '@recoverly/sdk'

const client = new Recoverly({
  orgId: process.env.ORG_ID,
  secret: process.env.SECRET,
})

/* Kurtarma sekansı başlat */
client.on('payment.failed', async (event) => {
  await client.recovery.start({
    customerId: event.customerId,
    amount: event.amount,
  })
})`}
          </pre>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h4 className="text-xl font-bold text-white mb-2">Aradığınızı bulamadınız mı?</h4>
          <p className="text-zinc-400 text-sm">Özel entegrasyon talepleriniz veya teknik destek için ekibimizle iletişime geçin.</p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold text-sm hover:bg-zinc-700 transition-all border border-zinc-700">
          Destekle İletişime Geç
        </button>
      </footer>
    </div>
  )
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const { status, name, description, initials, bgColor, textColor, settingsHref } = integration
  const isActive = status === 'active'
  const isError = status === 'error'

  return (
    <div
      className={cn(
        'relative rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 group',
        isActive && 'bg-zinc-800/80 border-l-2 border-l-[#9fff88] border-t border-t-zinc-700/50 border-r border-r-zinc-700/50 border-b border-b-zinc-700/50',
        isError && 'bg-zinc-800/80 border-l-2 border-l-red-500 border-t border-t-zinc-700/50 border-r border-r-zinc-700/50 border-b border-b-zinc-700/50',
        !isActive && !isError && 'bg-zinc-900 border border-zinc-800'
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center font-black text-sm shrink-0', bgColor, textColor)}>
          {initials}
        </div>
        <StatusBadge status={status} />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
      <p className="text-zinc-400 text-sm mb-7 leading-relaxed">{description}</p>

      <div className="flex items-center justify-between">
        {isActive && (
          <>
            {settingsHref ? (
              <Link href={settingsHref} className="text-xs font-bold text-white hover:text-[#9fff88] transition-colors">
                Ayarlar
              </Link>
            ) : (
              <span className="text-xs text-zinc-500">Aktif</span>
            )}
            {settingsHref && (
              <Link
                href={settingsHref}
                className="bg-zinc-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-600 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Yeniden Yapılandır
              </Link>
            )}
          </>
        )}
        {isError && (
          <>
            <button className="text-xs font-bold text-red-400 hover:underline">Sorun Gider</button>
            <button className="bg-zinc-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-600 transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              Yeniden Bağla
            </button>
          </>
        )}
        {!isActive && !isError && (
          <>
            <span className="text-xs text-zinc-500">Henüz bağlanmadı</span>
            <Link
              href="/dashboard/settings/integrations"
              className="bg-[#9fff88] text-zinc-900 px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all"
            >
              Bağlan
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: IntegrationStatus }) {
  if (status === 'active') {
    return (
      <span className="px-2 py-1 bg-[#9fff88]/10 text-[#9fff88] text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Aktif
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Hata
      </span>
    )
  }
  return (
    <span className="px-2 py-1 bg-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded">
      Bağlı Değil
    </span>
  )
}
