'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { RiskScoreBadge } from '@/components/dashboard/risk-score-badge'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'

type Customer = {
  id: string
  name: string | null
  email: string | null
  risk_score: number
  total_failed_payments: number
  total_recovered_amount: number
  last_payment_failed_at: string | null
}

const PAGE_SIZE = 10

function getInitials(name?: string | null, email?: string | null): string {
  const src = name || email || '?'
  return src.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export function CustomersView({ customers }: { customers: Customer[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].customers
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE))
  const paginated = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const highRiskCount = customers.filter((c) => c.risk_score >= 70).length
  const totalRecovered = customers.reduce((s, c) => s + c.total_recovered_amount, 0)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">{t.title}</h1>
          <p className="text-zinc-500 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {customers.length} müşteri takip ediliyor
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88] shadow-[0_0_12px_rgba(159,255,136,0.4)]" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Toplam Müşteri</p>
          <p className="text-4xl font-extrabold text-white">{customers.length}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500/60" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Yüksek Risk</p>
          <p className="text-4xl font-extrabold text-white">{highRiskCount}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88]/40" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Kurtarılan Toplam</p>
          <p className="text-4xl font-extrabold text-white">{formatCurrency(totalRecovered)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Müşteri</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Risk Skoru</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Başarısız Ödeme</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Kurtarılan</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Son Hata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">{t.noCustomers}</p>
                  </td>
                </tr>
              ) : (
                paginated.map((customer) => (
                  <tr key={customer.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <Link href={`/dashboard/customers/${customer.id}`} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-green-400 text-sm font-bold border border-zinc-700 shrink-0">
                          {getInitials(customer.name, customer.email)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{customer.name ?? '—'}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{customer.email ?? '—'}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <RiskScoreBadge score={customer.risk_score} showLabel size="sm" />
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white">{customer.total_failed_payments}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Ödeme</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white">{formatCurrency(customer.total_recovered_amount)}</p>
                    </td>
                    <td className="px-6 py-5 text-xs text-zinc-400">
                      {customer.last_payment_failed_at
                        ? formatRelativeTime(customer.last_payment_failed_at, lang)
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            {paginated.length + (page - 1) * PAGE_SIZE} / {customers.length} Müşteri
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  page === i + 1 ? 'bg-green-500 text-black' : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
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
    </div>
  )
}
