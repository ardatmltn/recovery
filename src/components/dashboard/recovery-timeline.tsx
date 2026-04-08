import { formatDateTime } from '@/lib/utils'

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
  attempts: Attempt[]
  emptyText?: string
}

const TYPE_ICONS: Record<string, string> = {
  auto_retry: '↺',
  email: '✉',
  sms: '💬',
}

const STATUS_CONFIG: Record<string, { dot: string; badge: string; label: string }> = {
  succeeded: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
    label: 'Başarılı',
  },
  failed: {
    dot: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-400 ring-red-500/30',
    label: 'Başarısız',
  },
  pending: {
    dot: 'bg-zinc-500',
    badge: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/30',
    label: 'Bekliyor',
  },
  scheduled: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
    label: 'Planlandı',
  },
}

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? {
    dot: 'bg-zinc-500',
    badge: 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/30',
    label: status,
  }
}

export function RecoveryTimeline({ attempts, emptyText = 'Henüz kurtarma denemesi yok.' }: Props) {
  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="text-3xl">📭</span>
        <p className="text-sm text-zinc-500">{emptyText}</p>
      </div>
    )
  }

  return (
    <ol className="relative space-y-0">
      {attempts.map((attempt, index) => {
        const status = getStatusConfig(attempt.status)
        const isLast = index === attempts.length - 1
        const icon = TYPE_ICONS[attempt.type] ?? '•'

        return (
          <li key={attempt.id} className="flex gap-4">
            {/* Left: connector line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 z-10
                  ring-1 ring-zinc-700 bg-zinc-900 font-medium text-zinc-300`}
              >
                {icon}
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-zinc-800 my-1" />
              )}
            </div>

            {/* Right: content */}
            <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-white capitalize">
                  Adım {attempt.step_number} — {attempt.type.replace(/_/g, ' ')}
                </span>
                {attempt.message_templates && (
                  <span className="text-xs text-zinc-500">
                    ({attempt.message_templates.name})
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ring-1 font-medium ${status.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              <div className="mt-1 space-y-0.5">
                <p className="text-xs text-zinc-500">
                  Planlandı: {formatDateTime(attempt.scheduled_at)}
                </p>
                {attempt.executed_at && (
                  <p className="text-xs text-zinc-400">
                    Çalıştırıldı: {formatDateTime(attempt.executed_at)}
                  </p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
