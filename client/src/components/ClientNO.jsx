import React, { useState, useEffect, useRef } from 'react'
import { Zap, Globe, MessagesSquare } from 'lucide-react'

// --- HIGH PERFORMANCE REUSABLE COUNT-UP COMPONENT ---
const AnimatedCounter = ({ targetValue, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const hasAnimated = useRef(false)

  // Extract raw numbers and optional suffixes (e.g., "450K+", "99.4%")
  const cleanNumber = parseFloat(targetValue.replace(/[^0-9.]/g, ''))
  const suffix = targetValue.replace(/[0-9.]/g, '')
  const isDecimal = targetValue.includes('.')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger only when element enters the viewport and hasn't animated yet
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let startTime = null

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            
            // Linear progress mapping to state calculation
            const currentValue = progress * cleanNumber
            setCount(currentValue)

            if (progress < 1) {
              window.requestAnimationFrame(step)
            } else {
              setCount(cleanNumber) // Ensure it locks exactly onto the final target
            }
          }

          window.requestAnimationFrame(step)
        }
      },
      { threshold: 0.1 } // Fires when at least 10% of the component block is visible
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [cleanNumber, duration])

  return (
    <span ref={elementRef}>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  )
}

// --- MAIN PORTED METRICS COMPONENT SYSTEM ---
const clientPartners = [
  { id: 1, name: 'SYNTH_LABS' },
  { id: 2, name: 'NEXUS_CORP' },
  { id: 3, name: 'QUANTUM_G' },
  { id: 4, name: 'PHANTOM_FX' },
  { id: 5, name: 'MATRIX_SYS' },
  { id: 6, name: 'HYPER_ATH' },
]

const performanceMetrics = [
  {
    id: 1,
    value: '450K+',
    label: 'Hardware Transacted',
    desc: 'Assets successfully delivered worldwide.',
    icon: <Zap className="w-5 h-5 text-lime-accent" />
  },
  {
    id: 2,
    value: '99.4%',
    label: 'Positive Feedback',
    desc: 'Verified satisfaction index scores.',
    icon: <MessagesSquare className="w-5 h-5 text-lime-accent" />
  },
  {
    id: 3,
    value: '120+',
    label: 'Global Node Drops',
    desc: 'Distribution networks running 24/7.',
    icon: <Globe className="w-5 h-5 text-lime-accent" />
  }
]

const ClientNO = () => {
  return (
    <section className="bg-royal-dark text-white py-24 px-6 md:px-12 relative overflow-hidden border-t border-white/5">
      {/* Background Matrix Effects */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-lime-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* SECTION 1: DYNAMIC METRICS GRID WITH ACCURATE SCROLL COUNTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {performanceMetrics.map((stat) => (
            <div 
              key={stat.id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 text-left transition-all duration-300 hover:border-lime-accent/30 hover:bg-white/[0.07] shadow-xl"
            >
              <div className="absolute top-6 right-6 p-2.5 rounded-xl bg-royal-dark/80 border border-white/5 group-hover:border-lime-accent/30 transition-colors">
                {stat.icon}
              </div>
              
              <div className="space-y-2 mt-4">
                <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white group-hover:text-lime-accent transition-colors duration-300 min-h-[50px] md:min-h-[60px] flex items-center">
                  <AnimatedCounter targetValue={stat.value} duration={2500} />
                </h3>
                <h4 className="text-xs font-black tracking-widest uppercase text-white/80">
                  {stat.label}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-medium">
                  {stat.desc}
                </p>
              </div>

              {/* Bottom line hover glow bar */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-accent to-transparent opacity-0 transform scale-x-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-x-100" />
            </div>
          ))}
        </div>

        {/* SECTION 2: INFINITE LOGO MARQUEE TICKER */}
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-lime-accent/60">Ecosystem Integrations</span>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Trusted By Operational Syndicates Globally</h2>
          </div>

          {/* Marquee Wrapper Container with gradient overlay masks */}
          <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-royal-dark before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-royal-dark after:to-transparent">
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-track {
                display: flex;
                width: max-content;
                animation: marquee 25s linear infinite;
              }
            `}} />

            {/* Scrolling track doubled to provide smooth loop duplication sequence */}
            <div className="animate-marquee-track gap-12 py-4">
              {[...clientPartners, ...clientPartners].map((partner, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-center bg-white/5 border border-white/5 px-10 py-4 rounded-xl min-w-[180px] hover:border-lime-accent/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-xs font-black tracking-[0.3em] text-white/30 group-hover:text-lime-accent transition-colors">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default ClientNO