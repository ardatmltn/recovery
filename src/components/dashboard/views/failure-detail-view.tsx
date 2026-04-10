'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { ArrowLeft, RefreshCw, Mail, MessageSquare, Check, Zap } from 'lucide-react'

type Attempt = {
  id: string
  step_number: number
  type: string
  status: string
  scheduled_at: string
  executed_at: string | null
  message_templates: { name: string; type: string } | null
}

type Props = {
  event: {
    provider_event_id: string | null
    amount: number
    currency: string
    status: string
    failure_code: string | null
    failure_message: string | null
    created_at: string
    customers: {
      name?: string
      email?: string
      risk_score?: number
      total_recovered_amount?: number
    } | null
  }
  attempts: Attempt[]
}

function getStatusMeta(status: string): { label: string; color: string; pulse: boolean } {
  switch (status) {
    case 'recovered':
      return { label: 'Kurtarıldı', color: 'text-[#9fff88]', pulse: true }
    case 'processing':
      return { label: 'İşleniyor', color: 'text-yellow-400', pulse: true }
    case 'failed':
    case 'ignored':
      return { label: 'Başarısız', color: 'text-[#ff7351]', pulse: false }
    default:
      return { label: 'Beklemede', color: 'text-zinc-400', pulse: false }
  }
}

function getRiskLabel(score: number): string {
  if (score >= 70) return `YÜKSEK (${score}%)`
  if (score >= 40) return `ORTA (${score}%)`
  return `DÜŞÜK (${score}%)`
}

function getRiskColor(score: number): string {
  if (score >= 70) return 'text-[#ff7351]'
  if (score >= 40) return 'text-yellow-400'
  return 'text-[#9fff88]'
}

function AttemptDot({ type, status }: { type: string; status: string }) {
  const isSuccess = status === 'completed' || status === 'success'
  const isFailed = status === 'failed'

  const bg = isFailed
    ? 'bg-[#ff7351] shadow-[0_0_15px_rgba(255,115,81,0.3)]'
    : isSuccess
    ? 'bg-[#9fff88] shadow-[0_0_15px_rgba(159,255,136,0.4)]'
    : 'bg-[#262626] border border-zinc-700'

  const icon =
    type === 'email' ? <Mail className="w-3 h-3" /> :
    type === 'sms' ? <MessageSquare className="w-3 h-3" /> :
    isFailed ? <RefreshCw className="w-3 h-3" /> :
    <Check className="w-3 h-3" />

  const iconColor = isFailed ? 'text-white' : isSuccess ? 'text-black' : 'text-zinc-500'

  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
      <span className={iconColor}>{icon}</span>
    </div>
  )
}

function calcRecoveryHours(createdAt: string, attempts: Attempt[]): number | null {
  const last = attempts.filter((a) => a.executed_at).pop()
  if (!last?.executed_at) return null
  return Math.round((new Date(last.executed_at).getTime() - new Date(createdAt).getTime()) / 3600000)
}

export function FailureDetailView({ event, attempts }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].failures.detail

  const customer = event.customers
  const statusMeta = getStatusMeta(event.status)
  const recoveryHours = calcRecoveryHours(event.created_at, attempts)
  const isRecovered = event.status === 'recovered'

  const initials = ((customer?.name || customer?.email || '?')
    .split(' ').map((w) => w[0]).slice(0, 2).join('')).toUpperCase()

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Back */}
      <Link
        href="/dashboard/failures"
        className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Başarısız Ödemelere Dön
      </Link>

      {/* Hero header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${statusMeta.color}`}>
            <span className={`w-2 h-2 rounded-full ${isRecovered ? 'bg-[#9fff88]' : 'bg-[#ff7351]'} ${statusMeta.pulse ? 'animate-pulse' : ''}`} />
            {statusMeta.label}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            {event.provider_event_id ?? 'TXN_UNKNOWN'}
          </h1>
          <p className="text-zinc-500 text-sm">
            Başlatıldı {formatDateTime(event.created_at)}
            {recoveryHours && ` • ${recoveryHours} saatte ${isRecovered ? 'kurtarıldı' : 'işlendi'}`}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-[#9fff88] tracking-widest uppercase mb-1">
            {isRecovered ? 'Kurtarılan Tutar' : 'İşlem Tutarı'}
          </span>
          <span className={`text-5xl font-black ${isRecovered ? 'text-[#9fff88]' : 'text-white'}`}>
            {formatCurrency(event.amount, event.currency)}
          </span>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Customer Intelligence */}
          <div className="bg-[#201f1f] rounded-xl p-6 border-l-2 border-[#9fff88] relative overflow-hidden"
            style={{ boxShadow: '-2px 0 10px rgba(159,255,136,0.2)' }}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Müşteri Bilgisi
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-[#262626] border border-zinc-700 flex items-center justify-center text-[#9fff88] text-xl font-black shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-tight">{customer?.name ?? '—'}</p>
                <p className="text-sm text-zinc-500">{customer?.email ?? '—'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Abonelik</span>
                <span className="text-white font-medium">Aylık Plan</span>
              </div>
              {customer?.total_recovered_amount !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Kurtarılan Toplam</span>
                  <span className="text-white font-medium">
                    {formatCurrency(customer.total_recovered_amount, event.currency)}
                  </span>
                </div>
              )}
              {customer?.risk_score !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Risk Skoru</span>
                  <span className={`font-bold ${getRiskColor(customer.risk_score)}`}>
                    {getRiskLabel(customer.risk_score)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Error log */}
          <div className="bg-[#201f1f] rounded-xl p-6 border-l-2 border-[#ff7351]/40">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Hata Kaydı
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-black rounded-lg">
                <Zap className="w-4 h-4 text-[#ff7351] shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-500">Hata Kodu</p>
                  <p className="text-sm font-mono font-bold text-[#ff7351]">
                    {event.failure_code ?? 'UNKNOWN'}
                  </p>
                </div>
              </div>
              {event.failure_message && (
                <p className="text-xs text-zinc-500 leading-relaxed">{event.failure_message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column — Recovery Pulse timeline */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-[#131313] rounded-xl p-8 h-full border border-zinc-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white">Recovery Pulse</h3>
              <div className="bg-[#9fff88]/10 border border-[#9fff88]/20 px-3 py-1 rounded-full text-[10px] font-bold text-[#9fff88] uppercase">
                Akıllı Denemeler Aktif
              </div>
            </div>

            {attempts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <RefreshCw className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">{t.noAttempts}</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-[2px]"
                  style={{ background: 'linear-gradient(to bottom, #9fff88, rgba(159,255,136,0.4), #9fff88)' }}
                />

                <div className="space-y-10">
                  {attempts.map((attempt, i) => {
                    const isLast = i === attempts.length - 1 && isRecovered
                    const isFailed = attempt.status === 'failed'
                    const isSuccess = attempt.status === 'completed' || attempt.status === 'success'

                    if (isLast) {
                      return (
                        <div key={attempt.id} className="relative pl-10">
                          <div className="absolute left-[-4px] top-[-4px] w-8 h-8 rounded-full bg-[#9fff88] flex items-center justify-center shadow-[0_0_25px_rgba(159,255,136,0.6)]">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                          <div className="bg-[#9fff88]/5 p-4 rounded-xl border border-[#9fff88]/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-[#9fff88] font-black text-lg">Ödeme Başarılı</h4>
                                <p className="text-sm text-zinc-500 mt-1">
                                  {attempt.message_templates?.name ?? 'Kurtarma tamamlandı.'}
                                </p>
                              </div>
                              {attempt.executed_at && (
                                <span className="text-xs text-[#9fff88] font-mono font-bold whitespace-nowrap ml-4">
                                  {formatDateTime(attempt.executed_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={attempt.id} className="relative pl-10">
                        <div className="absolute left-0 top-1">
                          <AttemptDot type={attempt.type} status={attempt.status} />
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-bold ${isFailed ? 'text-[#ff7351]' : 'text-white'}`}>
                              {attempt.type === 'email'
                                ? `E-posta ${attempt.step_number}: ${attempt.message_templates?.name ?? 'Gönderildi'}`
                                : attempt.type === 'sms'
                                ? `SMS ${attempt.step_number}`
                                : isFailed
                                ? `Deneme ${attempt.step_number}: Başarısız`
                                : `Deneme ${attempt.step_number}: ${isSuccess ? 'Başarılı' : 'Beklemede'}`}
                            </h4>
                            <p className="text-sm text-zinc-500 mt-1">
                              {isFailed
                                ? `Hata: ${event.failure_code ?? 'Bilinmeyen'}`
                                : attempt.status === 'scheduled'
                                ? `Planlı: ${formatDateTime(attempt.scheduled_at)}`
                                : isSuccess
                                ? 'İşlem tamamlandı.'
                                : 'Bekleniyor...'}
                            </p>
                          </div>
                          {(attempt.executed_at || attempt.scheduled_at) && (
                            <span className="text-xs text-zinc-600 font-mono whitespace-nowrap ml-4">
                              {formatDateTime(attempt.executed_at ?? attempt.scheduled_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-[#201f1f] p-6 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
            Kurtarma Süresi
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            {recoveryHours ? `${recoveryHours} Saat` : '—'}
          </p>
        </div>
        <div className="bg-[#201f1f] p-6 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
            Toplam Deneme
          </span>
          <p className="text-2xl font-bold text-[#9fff88] mt-1">{attempts.length}</p>
        </div>
        <div className="bg-[#201f1f] p-6 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
            {isRecovered ? 'Kurtarılan Gelir' : 'İşlem Tutarı'}
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(event.amount, event.currency)}
          </p>
        </div>
        <div className="bg-[#201f1f] p-6 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
            Durum
          </span>
          <p className={`text-2xl font-bold mt-1 ${statusMeta.color}`}>
            {statusMeta.label}
          </p>
        </div>
      </div>
    </div>
  )
}
