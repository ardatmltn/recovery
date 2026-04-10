'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, RefreshCw, Terminal, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'

type IntegrationStatus = 'active' | 'inactive' | 'error'

type IntegrationCategory = 'payment' | 'automation' | 'email' | 'ai' | 'analytics' | 'crm' | 'logistics'

type Integration = {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  status: IntegrationStatus
  initials: string
  iconBg: string
  iconText: string
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
  { id: 'analytics', label: 'Analitik' },
  { id: 'crm', label: 'CRM' },
  { id: 'logistics', label: 'Lojistik' },
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
      iconBg: 'bg-blue-600',
      iconText: 'text-white',
      settingsHref: '/dashboard/settings/integrations',
    },
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Kurtarma sekansları ve bildirimler için iş akışı otomasyon motoru.',
      category: 'automation' as IntegrationCategory,
      status: n8nConfigured ? 'active' : 'inactive',
      initials: 'n8',
      iconBg: 'bg-orange-500',
      iconText: 'text-white',
      settingsHref: '/dashboard/settings/integrations',
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Geliştiriciler için modern e-posta altyapısı. Kurtarma e-postalarını güvenilir biçimde gönderin.',
      category: 'email' as IntegrationCategory,
      status: resendConfigured ? 'active' : 'inactive',
      initials: 'R',
      iconBg: 'bg-zinc-700',
      iconText: 'text-white',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Global ödemeler ve abonelik yönetimi için uçtan uca altyapı desteği.',
      category: 'payment',
      status: 'inactive',
      initials: 'S',
      iconBg: 'bg-indigo-600',
      iconText: 'text-white',
    },
    {
      id: 'paddle',
      name: 'Paddle',
      description: 'Dijital ürünler ve abonelik yönetimi için modern ödeme platformu.',
      category: 'payment',
      status: 'inactive',
      initials: 'P',
      iconBg: 'bg-emerald-600',
      iconText: 'text-white',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Kurtarma mesajlarını kişiselleştirmek için yapay zeka dil modelleri.',
      category: 'ai' as IntegrationCategory,
      status: 'inactive',
      initials: 'AI',
      iconBg: 'bg-zinc-600',
      iconText: 'text-white',
    },
  ]

  const filtered = activeCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === (activeCategory as IntegrationCategory))

  const activeCount = integrations.filter(i => i.status === 'active').length

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">Entegrasyonlar</h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            Ödeme sağlayıcılarınızı, otomasyon araçlarınızı ve iletişim sistemlerinizi tek bir merkezden yönetin.
          </p>
        </div>
        <div className="flex-shrink-0 bg-[#9fff88]/10 border border-[#9fff88]/20 px-4 py-2 rounded-full text-xs font-bold text-[#9fff88] flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#9fff88] animate-pulse" />
          {activeCount} AKTİF SERVİS
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-[#9fff88] text-black'
                : 'bg-[#201f1f] text-zinc-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(integration => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* Custom API Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-[#131313] border border-zinc-800 rounded-xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#9fff88]/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#9fff88]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Custom API Gateway</h2>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Özel ihtiyaçlarınız için kendi webhook'larınızı veya API entegrasyonlarınızı oluşturun.
              Recoverly Webhook API'si ile tam kontrol elinizde.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="https://docs.recoverly.io"
              className="flex items-center gap-2 bg-[#9fff88] text-black px-5 py-2.5 rounded-xl text-xs font-black hover:bg-[#8aee72] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              API Dokümantasyonu
            </a>
            <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800 bg-[#131313]">
            <div className="w-3 h-3 rounded-full bg-[#ff7351]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-[#9fff88]" />
            <span className="ml-3 text-zinc-500 text-xs font-mono">webhook.ts</span>
          </div>
          <div className="p-5 font-mono text-[11px] leading-relaxed overflow-x-auto">
            <div><span className="text-purple-400">import</span> <span className="text-white">Recoverly</span> <span className="text-purple-400">from</span> <span className="text-[#9fff88]">'@recoverly/sdk'</span></div>
            <div className="mt-3">
              <span className="text-purple-400">const</span> <span className="text-blue-400">client</span> <span className="text-zinc-500">= new</span> <span className="text-white">Recoverly</span><span className="text-zinc-500">({'{'}</span>
            </div>
            <div className="ml-4"><span className="text-zinc-400">orgId</span><span className="text-zinc-500">: process.env.</span><span className="text-[#9fff88]">ORG_ID</span><span className="text-zinc-500">,</span></div>
            <div className="ml-4"><span className="text-zinc-400">secret</span><span className="text-zinc-500">: process.env.</span><span className="text-[#9fff88]">SECRET</span><span className="text-zinc-500">,</span></div>
            <div><span className="text-zinc-500">{'}'})</span></div>
            <div className="mt-3 text-zinc-600">{'/* Kurtarma sekansı başlat */'}</div>
            <div><span className="text-blue-400">client</span><span className="text-zinc-500">.on(</span><span className="text-[#9fff88]">'payment.failed'</span><span className="text-zinc-500">, </span><span className="text-purple-400">async</span> <span className="text-zinc-500">(event) =&gt; {'{'}</span></div>
            <div className="ml-4"><span className="text-purple-400">await</span> <span className="text-blue-400">client</span><span className="text-zinc-500">.recovery.start({'{'}</span></div>
            <div className="ml-8"><span className="text-zinc-400">customerId</span><span className="text-zinc-500">: event.customerId,</span></div>
            <div className="ml-8"><span className="text-zinc-400">amount</span><span className="text-zinc-500">: event.amount,</span></div>
            <div className="ml-4"><span className="text-zinc-500">{'}'})</span></div>
            <div><span className="text-zinc-500">{'}'}</span><span className="text-zinc-500">)</span></div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-[#131313] border border-zinc-800 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9fff88]/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h4 className="text-2xl font-bold text-white mb-2">Aradığınızı bulamadınız mı?</h4>
          <p className="text-zinc-500 text-sm">Özel entegrasyon talepleriniz veya teknik destek için ekibimizle iletişime geçin.</p>
        </div>
        <button className="relative z-10 flex-shrink-0 flex items-center gap-2 bg-[#201f1f] text-white px-6 py-3 rounded-xl text-xs font-black border border-zinc-700 hover:border-[#9fff88]/30 transition-all whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-[#9fff88]" />
          Destekle İletişime Geç
        </button>
      </div>
    </div>
  )
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const { status, name, description, initials, iconBg, iconText, settingsHref } = integration
  const isActive = status === 'active'
  const isError = status === 'error'

  return (
    <div
      className={`relative rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 ${
        isActive
          ? 'bg-[#201f1f] border-l-2 border-[#9fff88]'
          : isError
          ? 'bg-[#201f1f] border-l-2 border-[#ff7351]'
          : 'bg-[#131313] border border-zinc-800'
      }`}
      style={isActive ? { boxShadow: '-2px 0 10px rgba(159,255,136,0.15)' } : isError ? { boxShadow: '-2px 0 10px rgba(255,115,81,0.15)' } : undefined}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${iconBg} ${iconText}`}>
          {initials}
        </div>
        <StatusBadge status={status} />
      </div>

      <h3 className="text-base font-bold text-white mb-2">{name}</h3>
      <p className="text-zinc-500 text-sm mb-7 leading-relaxed">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
        {isActive && (
          <>
            {settingsHref ? (
              <Link href={settingsHref} className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                Ayarlar
              </Link>
            ) : (
              <span className="text-xs text-zinc-600">Aktif</span>
            )}
            <Link
              href={settingsHref ?? '/dashboard/settings/integrations'}
              className="bg-[#262626] px-4 py-2 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Yeniden Yapılandır
            </Link>
          </>
        )}
        {isError && (
          <>
            <button className="text-xs font-bold text-[#ff7351] hover:underline">Sorun Gider</button>
            <button className="bg-[#262626] px-4 py-2 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              Yeniden Bağla
            </button>
          </>
        )}
        {!isActive && !isError && (
          <>
            <span className="text-xs text-zinc-600">Henüz bağlanmadı</span>
            <Link
              href="/dashboard/settings/integrations"
              className="bg-[#9fff88] text-black px-5 py-2 rounded-lg text-xs font-black hover:bg-[#8aee72] transition-all"
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
      <span className="px-2.5 py-1 bg-[#9fff88]/10 text-[#9fff88] text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Aktif
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="px-2.5 py-1 bg-[#ff7351]/10 text-[#ff7351] text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Hata
      </span>
    )
  }
  return (
    <span className="px-2.5 py-1 bg-[#262626] text-[#adaaaa] text-[10px] font-bold uppercase tracking-wider rounded-full">
      Bağlı Değil
    </span>
  )
}
