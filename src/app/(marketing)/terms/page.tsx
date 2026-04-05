import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — Recoverly',
  description: 'Terms and conditions for using the Recoverly platform.',
}

export default function TermsPage() {
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
        <h1 className="font-display font-extralight text-white text-5xl mb-3 tracking-tight">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-14">Last updated: April 5, 2026</p>

        <div className="space-y-12 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-base mb-3">1. Acceptance of Terms</h2>
            <p className="text-zinc-400">By accessing or using Recoverly ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all users, including individuals and organizations.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">2. Description of Service</h2>
            <p className="text-zinc-400 mb-3">Recoverly is a payment recovery automation platform that:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>Receives failed payment webhook events from payment providers</li>
              <li>Automatically retries failed payment charges according to your configuration</li>
              <li>Sends recovery communications (email and SMS) to your customers on your behalf</li>
              <li>Provides analytics and reporting on recovery performance</li>
            </ul>
            <p className="text-zinc-400 mt-3">You are solely responsible for the content of communications sent to your customers through the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">3. Account Registration</h2>
            <p className="text-zinc-400 mb-3">To use the Service you must:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly notify us of any unauthorized access to your account</li>
              <li>Be at least 18 years old and authorized to enter into legally binding agreements</li>
            </ul>
            <p className="text-zinc-400 mt-3">You are responsible for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">4. Payment and Billing</h2>
            <p className="text-zinc-400 mb-3">Subscription fees are billed monthly in advance. By subscribing you authorize us to charge your payment method on a recurring basis. You may cancel at any time; cancellations take effect at the end of the current billing period with no partial refunds.</p>
            <p className="text-zinc-400">All fees are exclusive of applicable taxes. We reserve the right to modify pricing with 30 days' notice to existing customers.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">5. Acceptable Use</h2>
            <p className="text-zinc-400 mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1.5 ml-2">
              <li>Send unsolicited commercial communications or spam</li>
              <li>Harass, threaten, or mislead your customers</li>
              <li>Violate any applicable laws or regulations, including GDPR, CAN-SPAM, or TCPA</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code from the Service</li>
              <li>Circumvent usage limits or access controls</li>
              <li>Use the Service for any fraudulent or deceptive purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">6. Data and Privacy</h2>
            <p className="text-zinc-400">Your use of the Service is also governed by our <Link href="/privacy" className="text-green-400 hover:text-green-300 transition-colors">Privacy Policy</Link>. By using the Service, you consent to the collection and use of information as described therein. You retain ownership of all data you provide to the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">7. Intellectual Property</h2>
            <p className="text-zinc-400">The Service and its original content, features, and functionality are owned by Recoverly and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written consent.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">8. Service Availability</h2>
            <p className="text-zinc-400">We strive to maintain high availability but do not guarantee uninterrupted access. We may temporarily suspend the Service for maintenance, upgrades, or emergency repairs. We will make reasonable efforts to provide advance notice of planned downtime.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">9. Limitation of Liability</h2>
            <p className="text-zinc-400">To the fullest extent permitted by law, Recoverly shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits or revenue, arising from your use of the Service. Our total liability to you for any claim shall not exceed the amount paid by you in the three months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">10. Termination</h2>
            <p className="text-zinc-400">We reserve the right to suspend or terminate your account at any time for violation of these Terms. Upon termination, your right to use the Service ceases immediately. We may retain your data for up to 30 days after termination to allow for data export requests.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">11. Changes to Terms</h2>
            <p className="text-zinc-400">We may revise these Terms at any time. We will provide at least 14 days' notice of material changes via email. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-3">12. Contact</h2>
            <p className="text-zinc-400">Questions about these Terms? Contact us at <span className="text-green-400">legal@recoverly.io</span>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center justify-between">
          <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">← Privacy Policy</Link>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
