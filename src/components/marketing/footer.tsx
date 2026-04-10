'use client'

import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="bg-neutral-950 w-full py-12">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-6">
        <div className="text-lg font-bold text-neutral-100">Recoverly</div>

        <div className="flex gap-8">
          <Link href="/privacy" className="text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
            Terms of Service
          </Link>
          <a href="#" className="text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
            API Docs
          </a>
          <a href="#" className="text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
            Status
          </a>
        </div>

        <p className="text-xs uppercase tracking-widest text-neutral-500 text-center md:text-right">
          © 2026 Recoverly Systems. All rights reserved.<br className="md:hidden" /> Built for the Pulse of Precision.
        </p>
      </div>
    </footer>
  )
}
