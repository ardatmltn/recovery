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

// ── Brand Logos ──────────────────────────────────────────────────────────────

function IyzicoLogo() {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#003087]">
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
          fill="white" fontSize="15" fontWeight="800" fontFamily="Arial">
          iyzico
        </text>
      </svg>
    </div>
  )
}

function N8nLogo() {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#EA4B71]">
      <svg viewBox="0 0 60 60" className="w-9 h-9" fill="none">
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
          fill="white" fontSize="17" fontWeight="900" fontFamily="Arial">
          n8n
        </text>
      </svg>
    </div>
  )
}

function ResendLogo() {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black border border-zinc-700">
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
        <path d="M3 3h8.5A5.5 5.5 0 0 1 17 8.5c0 2.13-1.22 3.98-3 4.9L17.88 21H14.5l-3.06-7H6v7H3V3zm3 3v5h5.5a2.5 2.5 0 0 0 0-5H6z"/>
      </svg>
    </div>
  )
}

function StripeLogo() {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#635bff]">
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
      </svg>
    </div>
  )
}

function PaddleLogo() {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#0052cc]">
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c1.636 0 3.136.5 4.373 1.35L6.35 16.373A6.966 6.966 0 0 1 5 12c0-3.866 3.134-7 7-7zm0 14a6.966 6.966 0 0 1-4.373-1.35L17.65 7.627A6.966 6.966 0 0 1 19 12c0 3.866-3.134 7-7 7z"/>
      </svg>
    </div>
  )
}

function OpenAILogo() {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#10a37f]">
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371L15.115 7.2a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.662zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    </div>
  )
}

function IntegrationLogoById({ id }: { id: string }) {
  switch (id) {
    case 'iyzico':  return <IyzicoLogo />
    case 'n8n':     return <N8nLogo />
    case 'resend':  return <ResendLogo />
    case 'stripe':  return <StripeLogo />
    case 'paddle':  return <PaddleLogo />
    case 'openai':  return <OpenAILogo />
    default:        return null
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export function IntegrationsView({ iyzicoConnected, n8nConfigured, resendConfigured }: Props) {
  const [activeCategory, setActiveCategory] = useState('all')

  const integrations: Integration[] = [
    {
      id: 'iyzico',
      name: 'İyzico',
      description: 'Türkiye\'nin önde gelen ödeme altyapısı. Kredi kartı, banka kartı ve taksit ödemelerini yönetin.',
      category: 'payment',
      status: iyzicoConnected ? 'active' : 'inactive',
      settingsHref: '/dashboard/settings/integrations',
    },
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Kurtarma sekansları ve bildirimler için iş akışı otomasyon motoru.',
      category: 'automation',
      status: n8nConfigured ? 'active' : 'inactive',
      settingsHref: '/dashboard/settings/integrations',
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Geliştiriciler için modern e-posta altyapısı. Kurtarma e-postalarını güvenilir biçimde gönderin.',
      category: 'email',
      status: resendConfigured ? 'active' : 'inactive',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Global ödemeler ve abonelik yönetimi için uçtan uca altyapı desteği.',
      category: 'payment',
      status: 'inactive',
    },
    {
      id: 'paddle',
      name: 'Paddle',
      description: 'Dijital ürünler ve abonelik yönetimi için modern ödeme platformu.',
      category: 'payment',
      status: 'inactive',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Kurtarma mesajlarını kişiselleştirmek için yapay zeka dil modelleri.',
      category: 'ai',
      status: 'inactive',
    },
  ]

  const filtered = activeCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === activeCategory)

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
              Özel ihtiyaçlarınız için kendi webhook&apos;larınızı veya API entegrasyonlarınızı oluşturun.
              Recoverly Webhook API&apos;si ile tam kontrol elinizde.
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
            <div><span className="text-purple-400">import</span> <span className="text-white">Recoverly</span> <span className="text-purple-400">from</span> <span className="text-[#9fff88]">&apos;@recoverly/sdk&apos;</span></div>
            <div className="mt-3">
              <span className="text-purple-400">const</span> <span className="text-blue-400">client</span> <span className="text-zinc-500">= new</span> <span className="text-white">Recoverly</span><span className="text-zinc-500">({'{'}</span>
            </div>
            <div className="ml-4"><span className="text-zinc-400">orgId</span><span className="text-zinc-500">: process.env.</span><span className="text-[#9fff88]">ORG_ID</span><span className="text-zinc-500">,</span></div>
            <div className="ml-4"><span className="text-zinc-400">secret</span><span className="text-zinc-500">: process.env.</span><span className="text-[#9fff88]">SECRET</span><span className="text-zinc-500">,</span></div>
            <div><span className="text-zinc-500">{'}'})</span></div>
            <div className="mt-3 text-zinc-600">{'/* Kurtarma sekansı başlat */'}</div>
            <div><span className="text-blue-400">client</span><span className="text-zinc-500">.on(</span><span className="text-[#9fff88]">&apos;payment.failed&apos;</span><span className="text-zinc-500">, </span><span className="text-purple-400">async</span> <span className="text-zinc-500">(event) =&gt; {'{'}</span></div>
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

// ── Card ─────────────────────────────────────────────────────────────────────

function IntegrationCard({ integration }: { integration: Integration }) {
  const { id, status, name, description, settingsHref } = integration
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
        <IntegrationLogoById id={id} />
        <StatusBadge status={status} />
      </div>

      <h3 className="text-base font-bold text-white mb-2">{name}</h3>
      <p className="text-zinc-500 text-sm mb-7 leading-relaxed">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
        {isActive && (
          <>
            <Link href={settingsHref ?? '/dashboard/settings/integrations'} className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              Ayarlar
            </Link>
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
