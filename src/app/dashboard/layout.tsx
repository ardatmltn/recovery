export const dynamic = 'force-dynamic'

import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { DottedSurface } from '@/components/ui/dotted-surface'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark relative flex h-screen overflow-hidden bg-[#09090B]">
      <DottedSurface />
      <div className="relative z-10 flex h-full w-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
