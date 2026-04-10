'use client'

import Link from 'next/link'

export function MarketingNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_40px_rgba(159,255,136,0.04)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <div className="text-2xl font-extrabold tracking-tighter text-[#9fff88]">Recoverly</div>

        <div className="hidden md:flex gap-8 items-center">
          <a href="#" className="text-[#9fff88] font-bold border-b-2 border-[#9fff88] pb-1 text-sm tracking-tight transition-colors duration-300">
            Solutions
          </a>
          <a href="#" className="text-[#adaaaa] font-medium text-sm tracking-tight hover:text-[#9fff88] transition-colors duration-300">
            Security
          </a>
          <Link href="/pricing" className="text-[#adaaaa] font-medium text-sm tracking-tight hover:text-[#9fff88] transition-colors duration-300">
            Pricing
          </Link>
          <a href="#" className="text-[#adaaaa] font-medium text-sm tracking-tight hover:text-[#9fff88] transition-colors duration-300">
            Company
          </a>
        </div>

        <Link
          href="/register"
          className="bg-[#9fff88] text-black font-bold text-sm px-6 py-2.5 rounded-lg active:scale-95 transition-transform hover:bg-[#8aee72]"
        >
          Launch Terminal
        </Link>
      </div>
    </nav>
  )
}
