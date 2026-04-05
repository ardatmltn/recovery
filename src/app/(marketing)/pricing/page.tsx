'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { MarketingFooter } from '@/components/marketing/footer'
import { useRef, useEffect, useState } from 'react'
import { MarketingNav } from '@/components/marketing/nav'
import { RippleButton } from '@/components/ui/multi-type-ripple-buttons'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/components/marketing/translations'

const PLAN_NAMES = ['Starter', 'Growth', 'Pro']
const PLAN_PRICES = ['59', '99', '149']

function ShaderCanvas({ targetX }: { targetX: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const targetXRef = useRef(targetX)
  const currentXRef = useRef(targetX)
  const uCenterLocRef = useRef<WebGLUniformLocation | null>(null)
  const glRef = useRef<WebGLProgram | null>(null)
  const glCtxRef = useRef<WebGLRenderingContext | null>(null)

  useEffect(() => {
    targetXRef.current = targetX
  }, [targetX])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return
    glCtxRef.current = gl

    const vertSrc = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`
    const fragSrc = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec2 uCenter;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff=center-uv;
        float len=length(diff);
        len+=variation(diff,vec2(0.,1.),5.,2.);
        len-=variation(diff,vec2(1.,0.),5.,2.);
        float circle=smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        uv.x*=1.5; uv.x-=0.25;
        float mask=0.0;
        float radius=.23;
        vec2 center=uCenter;
        mask+=paintCircle(uv,center,radius,.035).r;
        mask+=paintCircle(uv,center,radius-.018,.01).r;
        mask+=paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        vec3 fg=vec3(v.x*0.2+0.1, v.y*0.4+0.3, 0.15);
        vec3 bg=vec3(0.035,0.035,0.043);
        vec3 color=mix(bg,fg,mask);
        color=mix(color,vec3(0.2,0.8,0.4),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertSrc))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragSrc))
    gl.linkProgram(program)
    gl.useProgram(program)
    glRef.current = program

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const iTimeLoc = gl.getUniformLocation(program, 'iTime')
    const iResLoc = gl.getUniformLocation(program, 'iResolution')
    uCenterLocRef.current = gl.getUniformLocation(program, 'uCenter')

    let raf = 0
    const render = (t: number) => {
      // Smooth lerp toward target
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.04
      gl.uniform1f(iTimeLoc, t * 0.001)
      gl.uniform2f(iResLoc, canvas.width, canvas.height)
      gl.uniform2f(uCenterLocRef.current!, currentXRef.current, 0.5)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(render)
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
      style={{ zIndex: 0 }}
    />
  )
}

export default function PricingPage() {
  const { lang } = useLanguage()
  const tx = translations[lang].pricingPage

  const [selectedPlan, setSelectedPlan] = useState(1)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [planCenterX, setPlanCenterX] = useState([0.155, 0.5, 0.845])

  useEffect(() => {
    const updateCenters = () => {
      const centers = cardRefs.current.map((el) => {
        if (!el) return 0.5
        const rect = el.getBoundingClientRect()
        const screenRatio = (rect.left + rect.width / 2) / window.innerWidth
        // Shader UV: uv.x = uv.x * 1.5 - 0.25 → invert to get uCenter.x
        return screenRatio * 1.5 - 0.25
      })
      if (centers.some((c) => c !== 0.5)) setPlanCenterX(centers)
    }
    updateCenters()
    window.addEventListener('resize', updateCenters)
    return () => window.removeEventListener('resize', updateCenters)
  }, [])

  return (
    <div className="relative min-h-[100dvh] bg-[#09090B]">
      <ShaderCanvas targetX={planCenterX[selectedPlan]} />

      <div className="relative" style={{ zIndex: 2 }}>
        <MarketingNav />

        {/* Hero */}
        <div className="pt-36 pb-16 text-center px-6">
          <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-4">
            {tx.sectionLabel}
          </p>
          <h1 className="font-display font-extralight text-white text-5xl md:text-7xl leading-[1.0] mb-5 tracking-tight">
            {tx.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto mb-2">{tx.subtitle}</p>
          <p className="text-zinc-400 text-sm">{tx.sub2}</p>
        </div>

        {/* Plans */}
        <div className="max-w-5xl mx-auto px-6 pb-28">
          <div role="radiogroup" aria-label="Select pricing plan" className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
            {tx.plans.map((plan, i) => {
              const isSelected = selectedPlan === i
              const highlighted = i === 1
              return (
                <button
                  key={PLAN_NAMES[i]}
                  ref={(el) => { cardRefs.current[i] = el }}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedPlan(i)}
                  className={[
                    'relative flex-1 max-w-xs flex flex-col rounded-2xl px-7 py-8 text-left',
                    'backdrop-blur-[14px] bg-gradient-to-br transition-all duration-300',
                    isSelected
                      ? 'from-white/20 to-white/10 border border-green-400/40 shadow-2xl ring-2 ring-green-400/30 scale-105'
                      : 'from-white/10 to-white/5 border border-white/10 hover:border-white/20 hover:from-white/15',
                  ].join(' ')}
                  style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
                >
                  {highlighted && (
                    <div className="absolute -top-4 right-4 px-3 py-1 text-[12px] font-semibold rounded-full bg-green-500 text-black">
                      {tx.popular}
                    </div>
                  )}

                  <div className="mb-3">
                    <h2 className="text-5xl font-extralight tracking-tight text-white font-display">
                      {PLAN_NAMES[i]}
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1">{plan.desc}</p>
                  </div>

                  <div className="my-6 flex items-baseline gap-2">
                    <span className="text-5xl font-extralight text-white font-display">${PLAN_PRICES[i]}</span>
                    <span className="text-zinc-400 text-sm">/mo</span>
                  </div>

                  <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <ul className="flex flex-col gap-2.5 text-sm text-zinc-300 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/register" className="block mt-auto" onClick={(e) => e.stopPropagation()}>
                    <RippleButton
                      rippleColor={isSelected ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}
                      className={[
                        'w-full py-3 rounded-xl font-semibold text-sm',
                        isSelected
                          ? 'bg-green-500 hover:bg-green-400 text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
                      ].join(' ')}
                    >
                      {tx.cta}
                    </RippleButton>
                  </Link>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="border-t border-zinc-800 py-24">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-display font-black text-white text-3xl mb-12 text-center">
              {tx.faq.title}
            </h2>
            <div className="space-y-3">
              {tx.faq.items.map(({ q, a }) => (
                <div
                  key={q}
                  className="border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 transition-colors backdrop-blur-sm"
                >
                  <p className="font-semibold text-white text-sm mb-2">{q}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <MarketingFooter />
    </div>
  )
}
