import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — Recoverly',
  description: 'How Recoverly collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-[#09090B] text-zinc-300">
      {/* Simple nav */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-display font-semibold text-white text-sm">Recoverly</span>
          </Link>
          <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors">← Back to home</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-4">Legal</p>
        <h1 className="font-display font-extralight text-white text-5xl mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-14">Last updated: April 5, 2026</p>

        <div className="space-y-12 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-base mb-3">1. Information We Collect</h2>
            <p className="text-zinc-400 mb-3">We collect information you provide directly to us when you create an account, configure integrations, or contact us for support. This includes:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>Account information: name, email address, company name</li>
              <li>Payment provider credentials (encrypted at rest with AES-256)</li>
              <li>Payment event data forwarded from your payment provider webhooks</li>
              <li>Usage data: pages visited, features used, actions taken within the dashboard</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">2. How We Use Your Information</h2>
            <p className="text-zinc-400 mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>Provide, maintain, and improve the Recoverly service</li>
              <li>Process failed payment events and trigger recovery workflows on your behalf</li>
              <li>Send you transactional notifications about your account and recovery activity</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities to improve the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">3. Data Security</h2>
            <p className="text-zinc-400 mb-3">We take the security of your data seriously:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>All payment provider API keys are encrypted at rest using AES-256</li>
              <li>Data is transmitted over encrypted TLS connections</li>
              <li>We never store raw card numbers or full payment instrument data</li>
              <li>Access to customer data is restricted to authorized personnel only</li>
              <li>We undergo regular security reviews and vulnerability assessments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">4. Data Sharing</h2>
            <p className="text-zinc-400 mb-3">We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li><strong className="text-zinc-300">Service providers:</strong> We use Supabase for database hosting, Resend for email delivery, and Vercel for application hosting. These providers process data only as necessary to deliver the service.</li>
              <li><strong className="text-zinc-300">Legal requirements:</strong> We may disclose your information if required by law or in response to valid legal process.</li>
              <li><strong className="text-zinc-300">Business transfers:</strong> In the event of a merger or acquisition, your data may be transferred as part of that transaction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">5. Data Retention</h2>
            <p className="text-zinc-400">We retain your account data for as long as your account is active or as needed to provide the service. Payment event data is retained for 24 months to support analytics and dispute resolution. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">6. Your Rights</h2>
            <p className="text-zinc-400 mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability — receive your data in a structured format</li>
            </ul>
            <p className="text-zinc-400 mt-3">To exercise any of these rights, contact us at <span className="text-green-400">privacy@recoverly.io</span>.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">7. Cookies</h2>
            <p className="text-zinc-400">We use essential cookies to maintain your session and preferences. We do not use advertising or cross-site tracking cookies. You can control cookie settings through your browser preferences.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">8. Changes to This Policy</h2>
            <p className="text-zinc-400">We may update this Privacy Policy from time to time. We will notify you of any material changes by email or by posting a prominent notice in the dashboard. Your continued use of the service after changes take effect constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">9. Contact Us</h2>
            <p className="text-zinc-400">If you have questions about this Privacy Policy or our data practices, contact us at <span className="text-green-400">privacy@recoverly.io</span>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center justify-between">
          <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Terms of Service →</Link>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
