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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #1f1f1f 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div style={{
        position: 'absolute', top: '33%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(159,255,136,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 28, height: 28, background: '#9fff88', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={15} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: 18 }}>Recoverly</span>
        </div>

        <div style={{ background: '#131313', border: '1px solid #242424', borderRadius: 20, padding: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: 22, marginBottom: 4 }}>Create account</h1>
          <p style={{ color: '#6b6b6b', fontSize: 13, marginBottom: 24 }}>Start recovering failed payments in minutes</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Full name', type: 'text', placeholder: 'Jane Smith', value: fullName, onChange: setFullName },
              { label: 'Company / Product name', type: 'text', placeholder: 'Acme Inc.', value: orgName, onChange: setOrgName },
              { label: 'Email', type: 'email', placeholder: 'you@example.com', value: email, onChange: setEmail },
              { label: 'Password', type: 'password', placeholder: 'At least 8 characters', value: password, onChange: setPassword },
            ].map(({ label, type, placeholder, value, onChange }) => (
              <div key={label}>
                <label style={{ color: '#8a8a8a', fontSize: 11, fontWeight: 500, display: 'block', marginBottom: 6, letterSpacing: '0.02em' }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  required
                  minLength={type === 'password' ? 8 : undefined}
                  style={{
                    width: '100%', padding: '10px 14px', boxSizing: 'border-box',
                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: 12, color: '#fff', fontSize: 13,
                    outline: 'none', transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(159,255,136,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
              </div>
            ))}

            {error && <p style={{ color: '#ff7351', fontSize: 12 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px 0', marginTop: 4,
                background: loading ? '#6abf5a' : '#9fff88',
                border: 'none', borderRadius: 12,
                color: '#000', fontWeight: 700, fontSize: 13,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#b8ffaa' }}
              onMouseLeave={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#9fff88' }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ color: '#4a4a4a', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#8a8a8a', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#fff'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#8a8a8a'}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
