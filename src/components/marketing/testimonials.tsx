'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'

const testimonialsEn = [
  {
    text: "We were losing around $3,200 every month to failed payments. Recoverly recovered 28% of that in the first week alone. Absolute no-brainer.",
    name: "Marcus Chen",
    role: "Founder, InvoiceFlow",
    avatar: "MC",
  },
  {
    text: "Set it up in under 10 minutes. Now it just runs silently in the background and brings money back. I forgot it existed until I saw the monthly report.",
    name: "Sarah Lindqvist",
    role: "CEO, Planify",
    avatar: "SL",
  },
  {
    text: "The AI email personalization is what sold me. Our recovery emails used to feel robotic. Now customers actually reply thanking us for the reminder.",
    name: "Emre Yıldız",
    role: "CTO, Taskr",
    avatar: "EY",
  },
  {
    text: "Recovered $11k in the first month. That covered our entire server costs for the year. If you're running a SaaS and not using this, you're leaving money on the table.",
    name: "Priya Nair",
    role: "Founder, Calendo",
    avatar: "PN",
  },
  {
    text: "What I love is the risk scoring. We now know which churned customers to prioritize and our team focuses energy where it actually matters.",
    name: "Tom Bergström",
    role: "Growth, Formly",
    avatar: "TB",
  },
  {
    text: "We tried building this in-house. It took 3 months and still didn't work as well as Recoverly on day one. Wish we'd found this sooner.",
    name: "Layla Hassan",
    role: "Co-founder, Loopdesk",
    avatar: "LH",
  },
  {
    text: "26% recovery rate consistently, every single month. Our MRR used to dip after billing cycles. Now it barely moves.",
    name: "Daniel Park",
    role: "CEO, Shiptrack",
    avatar: "DP",
  },
  {
    text: "The setup guide walked me through everything in minutes. No developer needed. I'm a solo founder and I got it live before my morning coffee.",
    name: "Ananya Sharma",
    role: "Founder, Writr",
    avatar: "AS",
  },
  {
    text: "Customer support is genuinely great. Had a question at 11pm, got a real answer within 20 minutes. That kind of responsiveness is rare.",
    name: "Riku Mäkinen",
    role: "CTO, Boardly",
    avatar: "RM",
  },
]

const testimonialsTr = [
  {
    text: "Her ay yaklaşık 9.800 TL'yi başarısız ödemeler yüzünden kaybediyorduk. Recoverly bunu ilk haftada %28 oranında geri getirdi. Kesinlikle vazgeçilmez.",
    name: "Berk Aydın",
    role: "Kurucu, FaturaX",
    avatar: "BA",
  },
  {
    text: "10 dakikadan kısa sürede kurdum. Şimdi sessiz sedasız arka planda çalışıyor ve para getiriyor. Aylık raporu görene kadar var olduğunu unutuyorum.",
    name: "Selin Korkmaz",
    role: "CEO, Planio",
    avatar: "SK",
  },
  {
    text: "AI e-posta kişiselleştirme beni ikna eden şey oldu. Kurtarma e-postalarımız eskiden robotik gelirdi. Şimdi müşteriler hatırlatma için bize teşekkür ediyor.",
    name: "Emre Yıldız",
    role: "CTO, Taskr",
    avatar: "EY",
  },
  {
    text: "İlk ayda 32.000 TL kurtardık. Bu, yıllık sunucu maliyetlerimizin tamamını karşıladı. SaaS çalıştırıyorsan ve bunu kullanmıyorsan para kaybediyorsun.",
    name: "Defne Arslan",
    role: "Kurucu, Calendo",
    avatar: "DA",
  },
  {
    text: "Risk puanlamasını çok seviyorum. Artık hangi müşterileri önceliklendireceğimizi biliyoruz ve ekibimiz enerjisini gerçekten önemli yere harcıyor.",
    name: "Kerem Şahin",
    role: "Büyüme, Formly",
    avatar: "KŞ",
  },
  {
    text: "Bunu şirket içinde yapmayı denedik. 3 ay sürdü ve hâlâ Recoverly'nin ilk günü kadar iyi çalışmıyordu. Keşke daha önce bulsaydık.",
    name: "Leyla Hassan",
    role: "Ortak Kurucu, Loopdesk",
    avatar: "LH",
  },
  {
    text: "Her ay, her fatura döneminde tutarlı %26 kurtarma oranı. MRR'ımız eskiden fatura dönemlerinde düşerdi. Artık neredeyse hiç kımıldamıyor.",
    name: "Arda Çelik",
    role: "CEO, Shiptrack",
    avatar: "AÇ",
  },
  {
    text: "Kurulum rehberi her şeyi dakikalar içinde anlattı. Geliştirici gerekmedi. Yalnız bir kurucuyum ve sabah kahvemden önce yayına aldım.",
    name: "Ananya Sharma",
    role: "Kurucu, Writr",
    avatar: "AS",
  },
  {
    text: "Müşteri desteği gerçekten harika. Gece 23'te sorum oldu, 20 dakika içinde gerçek bir cevap aldım. Bu tür yanıt verme hızı nadir.",
    name: "Riku Mäkinen",
    role: "CTO, Boardly",
    avatar: "RM",
  },
]

const colors = [
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
]

function TestimonialCard({ text, name, role, avatar, colorIdx }: {
  text: string
  name: string
  role: string
  avatar: string
  colorIdx: number
}) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm mb-4 max-w-xs w-full">
      <p className="text-zinc-300 text-sm leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${colors[colorIdx % colors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {avatar.slice(0, 2)}
        </div>
        <div>
          <p className="text-white text-xs font-semibold">{name}</p>
          <p className="text-zinc-500 text-[11px]">{role}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialsColumn({
  testimonials,
  duration = 15,
  className = '',
}: {
  testimonials: typeof testimonialsEn
  duration?: number
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center overflow-hidden ${className}`}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col items-center"
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <TestimonialCard key={i} {...t} colorIdx={i % testimonials.length} />
        ))}
      </motion.div>
    </div>
  )
}

export function Testimonials() {
  const { lang } = useLanguage()
  const list = lang === 'tr' ? testimonialsTr : testimonialsEn

  const col1 = list.slice(0, 3)
  const col2 = list.slice(3, 6)
  const col3 = list.slice(6, 9)

  return (
    <section className="border-t border-zinc-800 py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-14 text-center">
          <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-3">
            {lang === 'tr' ? 'Müşteri Yorumları' : 'Testimonials'}
          </p>
          <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-[1.05]">
            {lang === 'tr' ? 'Kullanıcılarımız ne diyor' : 'What our users say'}
          </h2>
        </div>

        <div
          className="flex gap-4 justify-center"
          style={{
            height: 600,
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <TestimonialsColumn testimonials={col1} duration={18} />
          <TestimonialsColumn testimonials={col2} duration={22} className="hidden md:flex" />
          <TestimonialsColumn testimonials={col3} duration={16} className="hidden lg:flex" />
        </div>
      </div>
    </section>
  )
}
