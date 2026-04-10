'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { MoreVertical, Download, Calendar, TrendingUp, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const MAX_ATTEMPTS = 5

type Failure = {
  id: string
  amount: number
  currency: string
  failure_code: string | null
  status: string
  created_at: string
  customers: { name?: string; email?: string } | null
  attempt_count: number
}

type FilterStatus = 'all' | 'new' | 'recovered' | 'failed'

const PAGE_SIZE = 10

function getInitials(name?: string): string {
  if (!name) return '??'
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'recovered':
      return (
        <span className="bg-green-500/10 px-3 py-1 rounded-full text-[10px] font-black text-green-400 uppercase tracking-wider border border-green-500/30">
          Kurtarıldı
        </span>
      )
    case 'failed':
    case 'ignored':
      return (
        <span className="bg-red-500/10 px-3 py-1 rounded-full text-[10px] font-black text-red-400 uppercase tracking-wider border border-red-500/30">
          Başarısız
        </span>
      )
    case 'processing':
      return (
        <span className="bg-yellow-500/10 px-3 py-1 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-wider border border-yellow-500/30">
          İşleniyor
        </span>
      )
    default:
      return (
        <span className="bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-black text-green-400 uppercase tracking-wider border border-green-500/10">
          Beklemede
        </span>
      )
  }
}

function FailureReasonDot({ status, code }: { status: string; code: string | null }) {
  const color =
    status === 'recovered'
      ? 'bg-green-400 shadow-[0_0_8px_#4ade80]'
      : status === 'failed' || status === 'ignored'
      ? 'bg-red-400'
      : 'bg-zinc-500'

  const label = code ?? 'Bilinmeyen Hata'

  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />
      <span className="text-xs text-zinc-200 truncate max-w-[160px]">{label}</span>
    </div>
  )
}

export function FailuresView({ failures }: { failures: Failure[] }) {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [page, setPage] = useState(1)

  const filtered = failures.filter((f) => {
    if (filter === 'all') return true
    if (filter === 'new') return f.status === 'new' || f.status === 'processing'
    if (filter === 'recovered') return f.status === 'recovered'
    if (filter === 'failed') return f.status === 'failed' || f.status === 'ignored'
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount = failures.filter((f) => f.status === 'new' || f.status === 'processing').length
  const recoveredCount = failures.filter((f) => f.status === 'recovered').length
  const recoveryRate = failures.length > 0 ? Math.round((recoveredCount / failures.length) * 100) : 0
  const criticalCount = failures.filter((f) => f.status === 'failed' || f.status === 'ignored').length
  const recoveredTotal = failures
    .filter((f) => f.status === 'recovered')
    .reduce((sum, f) => sum + f.amount, 0)

  function handleFilterChange(next: FilterStatus) {
    setFilter(next)
    setPage(1)
  }

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'Tümü' },
    { key: 'new', label: 'Beklemede' },
    { key: 'recovered', label: 'Kurtarıldı' },
    { key: 'failed', label: 'Başarısız' },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Başarısız Ödemeler
          </h1>
          <p className="text-zinc-500 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {activeCount > 0
              ? `Şu anda ${activeCount} aktif kurtarma sekansı çalışıyor.`
              : 'Şu an aktif kurtarma sekansı yok.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Filter tabs */}
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            {filterTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  filter === key
                    ? 'bg-zinc-800 text-green-400'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 bg-zinc-800 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-zinc-700 transition-all border border-zinc-700">
            <Calendar className="w-3.5 h-3.5" />
            Son 30 Gün
          </button>

          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/10">
            <Download className="w-3.5 h-3.5" />
            DIŞA AKTAR
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Müşteri</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Miktar</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Hata Nedeni</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Deneme</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Durum</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Zaman</th>
                <th className="px-8 py-5 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-zinc-500 text-sm">
                    Bu kategoride henüz başarısız ödeme yok.
                  </td>
                </tr>
              ) : (
                paginated.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-zinc-800/30 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="px-8 py-5">
                      <Link href={`/dashboard/failures/${event.id}`} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-green-400 text-sm font-bold border border-zinc-700 shrink-0">
                          {getInitials(event.customers?.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">
                            {event.customers?.name ?? '—'}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {event.customers?.email ?? '—'}
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white">
                        {formatCurrency(event.amount, event.currency)}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Abonelik</p>
                    </td>

                    {/* Failure reason */}
                    <td className="px-6 py-5">
                      <FailureReasonDot status={event.status} code={event.failure_code} />
                    </td>

                    {/* Attempt count */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-zinc-300">
                          {event.attempt_count}/{MAX_ATTEMPTS}
                        </span>
                        <div className="w-20 h-1 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              event.status === 'failed' || event.status === 'ignored'
                                ? 'bg-red-500'
                                : event.status === 'recovered'
                                ? 'bg-green-400'
                                : 'bg-green-400'
                            }`}
                            style={{ width: `${Math.min((event.attempt_count / MAX_ATTEMPTS) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <StatusBadge status={event.status} />
                    </td>

                    {/* Time */}
                    <td className="px-6 py-5 text-xs text-zinc-400">
                      {formatRelativeTime(event.created_at, 'tr')}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-700 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-8 py-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Görüntülenen: {Math.min(paginated.length + (page - 1) * PAGE_SIZE, filtered.length)} / {filtered.length} İşlem
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      page === pageNum
                        ? 'bg-green-500 text-black'
                        : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recovery performance card */}
        <div className="md:col-span-2 bg-zinc-900 rounded-2xl p-8 border border-zinc-800 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] mb-4">
              Kurtarma Performansı
            </p>
            <h3 className="text-2xl font-bold text-white mb-2">
              {recoveryRate > 0
                ? `Başarısız ödemelerin %${recoveryRate}'i kurtarıldı.`
                : 'Henüz kurtarma verisi yok.'}
            </h3>
            <p className="text-zinc-500 text-sm max-w-md">
              {recoveredTotal > 0
                ? `Akıllı sekanslar sayesinde ${formatCurrency(recoveredTotal, 'TRY')} tutarında gelir kaybı önlendi.`
                : 'Kurtarma sekanslarınızı yapılandırarak gelir kaybını önleyin.'}
            </p>
          </div>
          {/* Decorative */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-500/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <TrendingUp className="absolute top-1/2 right-8 -translate-y-1/2 w-28 h-28 text-green-500/5 pointer-events-none" />
        </div>

        {/* Critical warning card */}
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 border-l-2 border-l-red-500/50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4">
              Kritik Uyarı
            </p>
            <h3 className="text-xl font-bold text-white mb-2">
              {criticalCount > 0 ? `${criticalCount} Müşteri Kaybı Riski` : 'Kritik Durum Yok'}
            </h3>
            <p className="text-zinc-500 text-xs">
              {criticalCount > 0
                ? 'Son denemeleri başarısız olan ve manuel müdahale bekleyen müşteriler.'
                : 'Tüm ödemeler takip altında, kritik bir durum tespit edilmedi.'}
            </p>
          </div>
          {criticalCount > 0 && (
            <button
              onClick={() => handleFilterChange('failed')}
              className="mt-6 text-xs font-bold text-red-400 flex items-center gap-2 hover:underline"
            >
              LİSTEYİ GÖRÜNTÜLE
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {criticalCount === 0 && (
            <div className="mt-6 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-xs text-zinc-600">Takip devam ediyor</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
