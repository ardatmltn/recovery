'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, ArrowUpRight } from 'lucide-react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-[#09090B] overflow-hidden flex items-center">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
        }}
      />
      {/* Glow — off-center */}
      <div className="absolute top-1/3 left-1/3 w-[640px] h-[640px] rounded-full bg-green-500/[0.05] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 items-center">

          {/* ── Left content ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/[0.06] text-green-400 text-xs font-semibold tracking-widest uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Payment Recovery Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
              className="font-display font-black text-white leading-[0.88] tracking-tight mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
            >
              Get back the
              <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(135deg, #4ade80 0%, #22c55e 55%, #16a34a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                revenue
              </span>
              <br />
              <span className="text-zinc-500 font-light" style={{ fontSize: '0.8em' }}>
                you already earned.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.35 }}
              className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-md"
            >
              Recoverly automatically retries failed payments, sends AI-personalized
              recovery emails, and follows up at exactly the right moment.{' '}
              <span className="text-zinc-200">Stop losing revenue.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full text-sm transition-all duration-200 shadow-[0_0_28px_rgba(34,197,94,0.22)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Start free trial
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium rounded-full text-sm transition-all duration-200 hover:-translate-y-0.5 bg-zinc-900/50 hover:bg-zinc-800/60"
              >
                View pricing
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex items-center gap-5 text-zinc-600 text-xs"
            >
              {['No credit card required', '14-day free trial', 'Setup in 5 minutes'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-green-600" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Floating metric card ── */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ ...spring, delay: 0.45 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/60">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                      Recovered this month
                    </p>
                    <p className="font-display font-black text-white text-4xl tracking-tight">
                      $24,180
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-semibold">+28%</span>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-14 mb-5">
                  {[38, 60, 42, 75, 52, 88, 66, 92, 58, 100, 72, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.6 + i * 0.045, type: 'spring', stiffness: 120, damping: 20 }}
                      style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                      className={`flex-1 rounded-[2px] ${i === 11 ? 'bg-green-400' : i >= 9 ? 'bg-green-600/60' : 'bg-zinc-700'}`}
                    />
                  ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Auto retry', value: '$11,240', pct: 46 },
                    { label: 'Email recovery', value: '$8,890', pct: 37 },
                    { label: 'SMS follow-up', value: '$4,050', pct: 17 },
                  ].map(({ label, value, pct }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <span className="text-zinc-500 text-[11px] w-24 shrink-0">{label}</span>
                      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-green-500/50 rounded-full"
                        />
                      </div>
                      <span className="text-zinc-300 text-[11px] font-medium w-14 text-right shrink-0">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating mini stat */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, ...spring }}
                className="absolute -bottom-4 -left-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl shadow-black/50"
              >
                <p className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1">Recovery rate</p>
                <p className="font-display font-black text-white text-2xl leading-none">26.4%</p>
                <p className="text-zinc-600 text-[9px] mt-1">vs 8% industry avg</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
