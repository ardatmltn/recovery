'use client'

import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Zap,
  Sparkles,
  ScanLine,
  Workflow,
  CheckCircle,
} from 'lucide-react'

function AnimatedBackground() {
  const dataLines = [
    { left: '10%', duration: '8s', delay: '1s' },
    { left: '25%', duration: '12s', delay: '5s' },
    { left: '45%', duration: '7s', delay: '2s' },
    { left: '65%', duration: '15s', delay: '0s' },
    { left: '85%', duration: '10s', delay: '3s' },
    { left: '92%', duration: '9s', delay: '7s' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      <div
        className="absolute inset-0 animate-grid-move"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,255,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,0,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-20%) scale(2)',
          transformOrigin: 'top',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-0.5 animate-scan-line z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,0,0.2), transparent)' }}
      />
      {dataLines.map((line, i) => (
        <div
          key={i}
          className="absolute w-px h-24 animate-data-flow"
          style={{
            left: line.left,
            animationDuration: line.duration,
            animationDelay: line.delay,
            background: 'linear-gradient(to bottom, transparent, #00FF00, transparent)',
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <AnimatedBackground />
          <div
            className="absolute inset-0 z-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(159,255,136,0.05) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-400/5 rounded-full blur-[120px] z-0" />

          <div className="relative z-10 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 bg-zinc-900 px-4 py-1.5 rounded-full w-fit border border-green-400/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-400">
                  Pulse of Precision Enabled
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-[1.1] tracking-tighter text-white">
                Zaten Kazandığınız <br />
                <span className="text-green-400" style={{ textShadow: '0 0 15px rgba(159,255,136,0.4)' }}>
                  Geliri Geri Alın
                </span>
              </h1>

              <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
                Recoverly, AI destekli akıllı denemeler ve kişiselleştirilmiş kurtarma e-postaları ile
                başarısız ödemelerinizi otomatik olarak gelire dönüştürür.
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <Link
                  href="/register"
                  className="bg-green-400 text-black font-display font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-green-300 transition-all shadow-[0_0_20px_rgba(159,255,136,0.2)]"
                >
                  Ücretsiz Başla
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="bg-zinc-800 text-white font-display font-bold px-8 py-4 rounded-xl border border-zinc-700/20 hover:bg-zinc-700 transition-all"
                >
                  Demoyu Gör
                </Link>
              </div>
            </div>

            {/* Live stats card */}
            <div className="hidden lg:block relative">
              <div
                className="p-8 rounded-2xl border border-white/5 relative overflow-hidden"
                style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(20px)' }}
              >
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-1">
                      Live Recovery Stream
                    </p>
                    <p className="text-2xl font-bold font-display">
                      $42,904.00 <span className="text-green-400 text-sm">+12%</span>
                    </p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-green-400" />
                </div>

                <div className="space-y-6">
                  <div className="h-24 w-full bg-black rounded-lg flex items-end gap-1 p-2">
                    {[30, 50, 80, 40, 90, 60].map((h, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-sm ${i === 2 || i === 4 ? 'animate-pulse' : ''}`}
                        style={{ height: `${h}%`, background: `rgba(159,255,136,${0.2 + i * 0.12})` }}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900 p-4 rounded-xl">
                      <p className="text-xs text-zinc-400 mb-1">Success Rate</p>
                      <p className="text-lg font-bold text-green-400">94.2%</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl">
                      <p className="text-xs text-zinc-400 mb-1">Saved Revenue</p>
                      <p className="text-lg font-bold text-white">$12.4k</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-400/10 blur-3xl rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: TrendingUp, value: '%25+', label: 'Ortalama Geri Kazanım Oranı', border: 'border-green-400' },
                { icon: Zap, value: 'Saniyeler', label: 'İçinde Hızlı Kurulum', border: 'border-green-400/40' },
                { icon: Sparkles, value: 'AI Destekli', label: 'Sektör Lideri Teknoloji', border: 'border-green-400/20' },
              ].map(({ icon: Icon, value, label, border }) => (
                <div key={value} className={`bg-zinc-900 p-10 rounded-2xl border-l-2 ${border}`}>
                  <div className="mb-6 bg-green-400/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-4xl font-extrabold font-display mb-2 text-white">{value}</h3>
                  <p className="text-zinc-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold font-display mb-6">Nasıl Çalışır?</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Sistemimiz sessizce arka planda çalışır, her bir başarısız işlemi milyarlarca veri noktasıyla analiz eder.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  icon: ScanLine,
                  num: '01',
                  title: 'Detect',
                  desc: 'Başarısız ödeme anında tespit edilir ve sistemimiz hata kodunu analiz ederek en iyi kurtarma yolunu belirler.',
                },
                {
                  icon: Workflow,
                  num: '02',
                  title: 'Recover',
                  desc: 'AI odaklı denemeler ve kişiselleştirilmiş e-postalar devreye girer. Müşteri deneyimini bozmadan süreci yönetir.',
                },
                {
                  icon: CheckCircle,
                  num: '03',
                  title: 'Success',
                  desc: 'Gelir kurtarıldı. Panelinizde gerçek zamanlı başarı istatistiklerini ve kurtarılan tutarı görün.',
                },
              ].map(({ icon: Icon, num, title, desc }) => (
                <div key={num} className="relative">
                  <div className="text-green-400 font-display font-extrabold text-7xl opacity-10 absolute -top-10 -left-4 select-none">
                    {num}
                  </div>
                  <div className="bg-zinc-900 p-8 rounded-2xl h-full border border-white/5">
                    <Icon className="w-8 h-8 text-green-400 mb-6" />
                    <h4 className="text-xl font-bold font-display mb-4">{title}</h4>
                    <p className="text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-24 border-t border-zinc-800/30">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500 mb-12">
              Global Entegrasyon Desteği
            </p>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 hover:opacity-100 transition-all duration-500">
              {['iyzico', 'PayPal', 'Paddle'].map((name) => (
                <span key={name} className="text-2xl font-bold tracking-tighter text-white font-display">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-8">
          <div
            className="max-w-5xl mx-auto rounded-[2rem] p-px"
            style={{ background: 'linear-gradient(135deg, rgba(159,255,136,0.2), transparent)' }}
          >
            <div className="bg-black rounded-[1.9rem] p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-6xl font-extrabold font-display mb-8">
                Gelir kaybına son verin.
              </h2>
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                Dakikalar içinde entegre olun, sonuçları hemen görmeye başlayın. Kredi kartı gerekmez.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <input
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 text-white w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  placeholder="E-posta adresiniz"
                  type="email"
                />
                <Link
                  href="/register"
                  className="bg-green-400 text-black font-display font-bold px-10 py-4 rounded-xl hover:bg-green-300 transition-all text-center"
                >
                  Hemen Başlayın
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
