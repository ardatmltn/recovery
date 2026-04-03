'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { generateOrgSlug } from '@/lib/utils'
import { Zap, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          org_name: orgName,
          org_slug: generateOrgSlug(orgName),
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.3,
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-green-500/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-white text-lg">Recoverly</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Create account</h1>
          <p className="text-zinc-500 text-sm mb-6">Start recovering failed payments in minutes</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium block mb-1.5">Full name</label>
              <input
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium block mb-1.5">Company / Product name</label>
              <input
                placeholder="Acme Inc."
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 rounded-xl text-white text-sm placeholder:text-zinc-600 outline-none transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-zinc-600 text-sm text-center mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
