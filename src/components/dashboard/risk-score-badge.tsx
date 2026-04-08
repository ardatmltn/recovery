type Props = {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function getRiskConfig(score: number): {
  label: string
  color: string
  bg: string
  ring: string
  bar: string
} {
  if (score >= 70) return {
    label: 'Yüksek Risk',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/30',
    bar: 'bg-red-500',
  }
  if (score >= 40) return {
    label: 'Orta Risk',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/30',
    bar: 'bg-amber-500',
  }
  return {
    label: 'Düşük Risk',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/30',
    bar: 'bg-emerald-500',
  }
}

export function RiskScoreBadge({ score, showLabel = false, size = 'md' }: Props) {
  const config = getRiskConfig(score)

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2',
    lg: 'text-base px-3 py-1.5 gap-2.5',
  }

  const barHeights = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  }

  const barWidths = {
    sm: 'w-10',
    md: 'w-14',
    lg: 'w-20',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full ring-1 font-medium ${config.bg} ${config.ring} ${config.color} ${sizeClasses[size]}`}
    >
      <span className={`${barWidths[size]} ${barHeights[size]} rounded-full bg-zinc-700 overflow-hidden`}>
        <span
          className={`block h-full rounded-full transition-all ${config.bar}`}
          style={{ width: `${score}%` }}
        />
      </span>
      <span>{score}</span>
      {showLabel && <span className="opacity-70">{config.label}</span>}
    </span>
  )
}
