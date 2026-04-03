'use client'
import dynamic from 'next/dynamic'

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false }
)

export function DottedSurfaceClient() {
  return <DottedSurface />
}
