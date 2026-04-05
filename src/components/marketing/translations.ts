import type { Lang } from '@/lib/language-context'

const translations = {
  en: {
    nav: {
      pricing: 'Pricing',
      signIn: 'Sign in',
      getStarted: 'Get started free',
      getStartedShort: 'Get started',
    },
    hero: {
      badge: 'Payment Recovery Platform',
      line1: 'Get back the',
      line2: 'revenue',
      line3: 'you already earned.',
      desc: 'Recoverly automatically retries failed payments, sends AI-personalized recovery emails, and follows up at exactly the right moment.',
      descHighlight: 'Stop losing revenue.',
      cta1: 'Start free trial',
      cta2: 'View pricing',
      trust: ['No credit card required', '14-day free trial', 'Setup in 5 minutes'] as [string, string, string],
      card: {
        label: 'Recovered this month',
        retry: 'Auto retry',
        email: 'Email recovery',
        sms: 'SMS follow-up',
        rateLabel: 'Recovery rate',
        rateCompare: 'vs 8% industry avg',
      },
    },
    stats: [
      { value: '$2.4M+', label: 'Revenue recovered' },
      { value: '26%', label: 'Avg recovery rate' },
      { value: '1,200+', label: 'SaaS companies' },
      { value: '<5 min', label: 'Setup time' },
    ],
    features: {
      sectionLabel: 'Features',
      title: 'Everything you need to',
      titleAccent: 'recover lost revenue.',
      items: [
        { title: 'Smart Retry Logic', desc: 'Automatically retries failed payments at the optimal time based on failure reason, customer history, and payment provider signals. Never retry blindly again.' },
        { title: 'AI-Personalized Emails', desc: 'Recovery emails that feel human. AI tailors tone, timing, and message to each customer for dramatically higher open rates and conversions.' },
        { title: 'Risk Scoring', desc: 'Every customer gets a score so you can prioritize high-value recovery efforts first.' },
        { title: 'Live Analytics', desc: 'Track recovered revenue, recovery rates, and channel performance in real time.' },
        { title: 'Secure & Compliant', desc: 'Bank-level encryption. Your İyzico keys are encrypted at rest with AES-256.' },
      ],
    },
    howItWorks: {
      sectionLabel: 'How it works',
      title: 'Live in minutes,',
      titleAccent: 'not months.',
      steps: [
        { num: '01', title: 'Connect your provider', desc: 'Add your payment provider API key. Recoverly instantly starts listening for failed payment webhooks.' },
        { num: '02', title: 'Configure sequences', desc: 'Set your recovery logic — retry timing, email templates, SMS fallback. Or use our smart defaults.' },
        { num: '03', title: 'Watch revenue return', desc: 'Sit back as Recoverly automatically recovers failed payments and keeps your MRR intact.' },
      ],
    },
    cta: {
      sectionLabel: 'Start today',
      title: 'Stop losing revenue to failed payments.',
      desc: 'Every day without Recoverly is money left on the table. Join 1,200+ SaaS companies already recovering their revenue automatically.',
      btn1: 'Start free trial →',
      btn2: 'See pricing',
    },
    footer: {
      copyright: '© 2026 Recoverly. All rights reserved.',
      tagline: 'Automated payment recovery for SaaS companies.',
      product: 'Product',
      pricing: 'Pricing',
      signIn: 'Sign in',
      register: 'Get started free',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    pricingPage: {
      sectionLabel: 'Pricing',
      title: 'Simple, predictable pricing.',
      subtitle: 'All plans include a 14-day free trial. No credit card required.',
      sub2: 'Cancel anytime · No setup fees · Instant activation',
      popular: 'Most popular',
      cta: 'Get started →',
      plans: [
        {
          desc: 'For early-stage SaaS products',
          features: ['1 payment provider (İyzico)', 'Email recovery only', 'Up to 3-step sequences', 'Basic analytics dashboard', 'Email support'],
        },
        {
          desc: 'For growing products with more recovery needs',
          features: ['2 payment providers', 'Email + SMS recovery', 'AI personalization', 'Custom sequences (unlimited steps)', 'Advanced analytics & reports', 'Priority email support'],
        },
        {
          desc: 'Maximum recovery for established products',
          features: ['Unlimited payment providers', 'All channels (Email, SMS)', 'AI personalization', 'Custom sequences', 'Full analytics + exports', 'Dedicated support', 'Slack integration'],
        },
      ],
      faq: {
        title: 'Frequently asked questions',
        items: [
          { q: 'How does the free trial work?', a: 'You get 14 days of full access to all features on any plan. No credit card required. Cancel anytime.' },
          { q: 'What payment providers do you support?', a: 'Currently İyzico. More providers including Stripe and PayTR are coming soon.' },
          { q: 'How much can I expect to recover?', a: 'Our customers typically recover 20-35% of failed payments depending on failure reasons and customer base.' },
          { q: 'Is my İyzico data secure?', a: 'Yes. Your İyzico API key is encrypted at rest using AES-256. We never store raw card data.' },
        ],
      },
    },
  },

  tr: {
    nav: {
      pricing: 'Fiyatlandırma',
      signIn: 'Giriş yap',
      getStarted: 'Ücretsiz başla',
      getStartedShort: 'Başla',
    },
    hero: {
      badge: 'Ödeme Kurtarma Platformu',
      line1: 'Zaten kazandığın',
      line2: 'geliri',
      line3: 'geri al.',
      desc: 'Recoverly başarısız ödemeleri otomatik olarak yeniden dener, AI destekli kişiselleştirilmiş kurtarma e-postaları gönderir ve tam doğru zamanda takip eder.',
      descHighlight: 'Gelir kaybetmeyi bırak.',
      cta1: 'Ücretsiz dene',
      cta2: 'Fiyatları gör',
      trust: ['Kredi kartı gerekmez', '14 gün ücretsiz deneme', '5 dakikada kurulum'] as [string, string, string],
      card: {
        label: 'Bu ay kurtarılan',
        retry: 'Otomatik yeniden deneme',
        email: 'E-posta kurtarma',
        sms: 'SMS takip',
        rateLabel: 'Kurtarma oranı',
        rateCompare: 'vs %8 sektör ort.',
      },
    },
    stats: [
      { value: '$2.4M+', label: 'Kurtarılan gelir' },
      { value: '%26', label: 'Ort. kurtarma oranı' },
      { value: '1.200+', label: 'SaaS şirketi' },
      { value: '<5 dk', label: 'Kurulum süresi' },
    ],
    features: {
      sectionLabel: 'Özellikler',
      title: 'Gelirini kurtarmak için',
      titleAccent: 'ihtiyacın olan her şey.',
      items: [
        { title: 'Akıllı Yeniden Deneme', desc: 'Başarısız ödemeleri hata nedenine, müşteri geçmişine ve ödeme sağlayıcısı sinyallerine göre en uygun zamanda otomatik olarak yeniden dener.' },
        { title: 'AI Kişiselleştirilmiş E-posta', desc: 'İnsan gibi hissettiren kurtarma e-postaları. AI her müşteri için tonu, zamanlamayı ve mesajı uyarlar — açılma oranları dramatik biçimde artar.' },
        { title: 'Risk Puanlama', desc: 'Her müşteri puan alır; yüksek değerli kurtarma çabalarını önceliklendirebilirsin.' },
        { title: 'Canlı Analitik', desc: 'Kurtarılan geliri, kurtarma oranlarını ve kanal performansını gerçek zamanlı takip et.' },
        { title: 'Güvenli & Uyumlu', desc: 'Banka seviyesinde şifreleme. İyzico anahtarların AES-256 ile bekleme durumunda şifrelenir.' },
      ],
    },
    howItWorks: {
      sectionLabel: 'Nasıl çalışır',
      title: 'Dakikalar içinde canlıda,',
      titleAccent: 'aylarca değil.',
      steps: [
        { num: '01', title: 'Sağlayıcını bağla', desc: 'Ödeme sağlayıcının API anahtarını ekle. Recoverly anında başarısız ödeme webhook\'larını dinlemeye başlar.' },
        { num: '02', title: 'Sekansları yapılandır', desc: 'Kurtarma mantığını ayarla — yeniden deneme zamanlaması, e-posta şablonları, SMS yedek. Veya akıllı varsayılanlarımızı kullan.' },
        { num: '03', title: 'Gelirinin geri dönüşünü izle', desc: 'Recoverly başarısız ödemeleri otomatik kurtarırken ve MRR\'ını korurken sen rahat et.' },
      ],
    },
    cta: {
      sectionLabel: 'Bugün başla',
      title: 'Başarısız ödemelere gelir kaybetmeyi bırak.',
      desc: "Recoverly'siz geçen her gün masada bırakılan paradır. Gelirlerini otomatik kurtaran 1.200+ SaaS şirketine katıl.",
      btn1: 'Ücretsiz dene →',
      btn2: 'Fiyatları gör',
    },
    footer: {
      copyright: '© 2026 Recoverly. Tüm hakları saklıdır.',
      tagline: 'SaaS şirketleri için otomatik ödeme kurtarma.',
      product: 'Ürün',
      pricing: 'Fiyatlandırma',
      signIn: 'Giriş yap',
      register: 'Ücretsiz başla',
      legal: 'Yasal',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
    },
    pricingPage: {
      sectionLabel: 'Fiyatlandırma',
      title: 'Sade ve tahmin edilebilir fiyatlar.',
      subtitle: 'Tüm planlar 14 günlük ücretsiz deneme içerir. Kredi kartı gerekmez.',
      sub2: 'İstediğin zaman iptal et · Kurulum ücreti yok · Anında aktifleştirme',
      popular: 'En popüler',
      cta: 'Başla →',
      plans: [
        {
          desc: 'Erken aşama SaaS ürünleri için',
          features: ['1 ödeme sağlayıcı (İyzico)', 'Yalnızca e-posta kurtarma', '3 adıma kadar sekans', 'Temel analitik paneli', 'E-posta destek'],
        },
        {
          desc: 'Büyüyen ürünler için',
          features: ['2 ödeme sağlayıcı', 'E-posta + SMS kurtarma', 'AI kişiselleştirme', 'Özel sekanslar (sınırsız adım)', 'Gelişmiş analitik ve raporlar', 'Öncelikli e-posta destek'],
        },
        {
          desc: 'Olgun ürünler için maksimum kurtarma',
          features: ['Sınırsız ödeme sağlayıcı', 'Tüm kanallar (E-posta, SMS)', 'AI kişiselleştirme', 'Özel sekanslar', 'Tam analitik + dışa aktarma', 'Özel destek', 'Slack entegrasyonu'],
        },
      ],
      faq: {
        title: 'Sık sorulan sorular',
        items: [
          { q: 'Ücretsiz deneme nasıl çalışır?', a: '14 gün boyunca herhangi bir planda tüm özelliklere tam erişim elde edersin. Kredi kartı gerekmez. İstediğin zaman iptal edebilirsin.' },
          { q: 'Hangi ödeme sağlayıcıları destekliyorsunuz?', a: 'Şu an için İyzico. Stripe ve PayTR gibi sağlayıcılar yakında eklenecek.' },
          { q: 'Ne kadar kurtarma bekleyebilirim?', a: 'Müşterilerimiz genellikle başarısız ödemelerin %20-35\'ini kurtarıyor. Hata nedenlerine ve müşteri tabanına göre değişir.' },
          { q: 'İyzico verilerim güvende mi?', a: 'Evet. İyzico API anahtarın AES-256 ile bekleme durumunda şifrelenir. Ham kart verisi hiçbir zaman saklanmaz.' },
        ],
      },
    },
  },
} satisfies Record<Lang, unknown>

export type Translations = typeof translations.en
export { translations }
