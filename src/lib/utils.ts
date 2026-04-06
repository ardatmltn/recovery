import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

export function formatRelativeTime(date: string | Date, lang: 'en' | 'tr' = 'en'): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: lang === 'tr' ? tr : enUS })
}

const riskLabels = {
  en: { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' },
  tr: { high: 'Yüksek Risk', medium: 'Orta Risk', low: 'Düşük Risk' },
}

export function getRiskLabel(score: number, lang: 'en' | 'tr' = 'en'): {
  label: string
  variant: 'destructive' | 'warning' | 'secondary'
} {
  const labels = riskLabels[lang]
  if (score >= 70) return { label: labels.high, variant: 'destructive' }
  if (score >= 40) return { label: labels.medium, variant: 'warning' }
  return { label: labels.low, variant: 'secondary' }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateOrgSlug(name: string): string {
  return slugify(name) + '-' + Math.random().toString(36).slice(2, 6)
}
