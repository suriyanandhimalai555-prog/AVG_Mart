import React from 'react'
import { ArrowUpRight, Smartphone, Watch, Camera, ShoppingBag, Layers, Flame } from 'lucide-react'

// Mocking high-quality visual categories that sync with your custom e-commerce database
const categories = [
  {
    id: 1,
    title: 'Core Devices',
    subtitle: 'Smartphones Pro & Ecosystems',
    count: '14 Assets',
    icon: <Smartphone className="w-5 h-5 text-lime-accent" />,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop', // Replace with your internal local drops assets
    className: 'md:col-span-8 md:row-span-2 min-h-[380px]',
    tag: 'Flagship'
  },
  {
    id: 2,
    title: 'Wearables X',
    subtitle: 'Chrono & Tactical Gear',
    count: '09 Assets',
    icon: <Watch className="w-5 h-5 text-lime-accent" />,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop',
    className: 'md:col-span-4 md:row-span-1 min-h-[240px]',
    tag: 'Hot Drop'
  },
  {
    id: 3,
    title: 'Stealth Kits',
    subtitle: 'Cyber Jackets & Vests',
    count: '22 Assets',
    icon: <Layers className="w-5 h-5 text-lime-accent" />,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop',
    className: 'md:col-span-4 md:row-span-2 min-h-[320px]',
    tag: 'Limited Run'
  },
  {
    id: 4,
    title: 'Optics Pro',
    subtitle: 'Mirrorless & Phantom Lenses',
    count: '06 Assets',
    icon: <Camera className="w-5 h-5 text-lime-accent" />,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    className: 'md:col-span-4 md:row-span-1 min-h-[240px]',
    tag: 'Pro Tier'
  },
  {
    id: 5,
    title: 'Techpack Slings',
    subtitle: 'Modular Hardware Carrying',
    count: '11 Assets',
    icon: <ShoppingBag className="w-5 h-5 text-lime-accent" />,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop',
    className: 'md:col-span-4 md:row-span-1 min-h-[240px]',
    tag: 'New'
  }
]

const Category = () => {
  return (
    <section className="bg-royal-dark text-white py-24 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Grid Matrices & Ambient Spotlighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_5px),linear-gradient(to_bottom,#ffffff03_1px,transparent_5px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Structural Background Ambient Glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-lime-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-royal-main/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-lime-accent">
              <Flame className="w-3 h-3 animate-pulse" /> Curated Ecosystem
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider leading-none">
              Browse <span className="text-lime-accent font-light">By Core</span> Hubs
            </h2>
            <p className="text-sm text-white/50 font-medium max-w-md leading-relaxed">
              Unlock premium multi-layered aesthetics engineered perfectly for high-performance creative setups.
            </p>
          </div>
          
          <button className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-lime-accent transition-colors duration-300 pb-2 border-b-2 border-white/10 hover:border-lime-accent group self-start md:self-auto">
            View Structural Directory <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>

        {/* COMPREHENSIVE INDUSTRIAL BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 auto-rows-fr">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-end p-6 md:p-8 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-lime-accent/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${cat.className}`}
            >
              {/* Asset Background Image with Micro-Zoom System */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-royal-dark via-royal-dark/60 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-80" />
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105 filter grayscale brightness-75 contrast-125"
                />
              </div>

              {/* Dynamic Badge Tag Upper Interface */}
              <div className="absolute top-5 left-5 z-20">
                <span className="text-[9px] font-black bg-white/10 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10 group-hover:bg-lime-accent group-hover:text-royal-dark group-hover:border-transparent transition-colors duration-300">
                  {cat.tag}
                </span>
              </div>

              {/* Action Floating Pointer Icon */}
              <div className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 transform translate-y-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-lime-accent group-hover:text-royal-dark shadow-lg">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Core Context Banner Panel */}
              <div className="relative z-20 text-left space-y-2 mt-auto">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-royal-dark/80 backdrop-blur-md border border-white/5 group-hover:border-lime-accent/30 transition-colors duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/40 group-hover:text-lime-accent/80 transition-colors">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white group-hover:text-lime-accent transition-colors duration-300">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-white/50 font-medium tracking-wide line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              {/* Subtle Bottom Glow Line Indicator */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-accent to-transparent opacity-0 transform scale-x-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-x-100" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Category