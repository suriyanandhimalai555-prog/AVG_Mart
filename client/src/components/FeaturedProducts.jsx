import React, { useState } from 'react'
import { ShoppingBag, Star, ArrowRight, Heart, Sparkles } from 'lucide-react'

// Premium Product Dataset engineered for your layout
const productsData = [
  {
    id: 1,
    name: 'Matrix Phone Matte 24',
    category: 'Core Devices',
    price: '$1,249',
    rating: 4.9,
    reviews: 142,
    badge: 'Flagship',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop',
    accentColor: 'from-lime-accent/20 to-transparent'
  },
  {
    id: 2,
    name: 'Chrono Watch Tactical V2',
    category: 'Wearables',
    price: '$450',
    rating: 4.8,
    reviews: 98,
    badge: 'Limited Drop',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
    accentColor: 'from-blue-500/20 to-transparent'
  },
  {
    id: 3,
    name: 'Phantom Lens Gen-3 X',
    category: 'Optics Pro',
    price: '$899',
    rating: 5.0,
    reviews: 64,
    badge: 'Pro Tier',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=600&auto=format&fit=crop',
    accentColor: 'from-purple-500/20 to-transparent'
  },
  {
    id: 4,
    name: 'Volt Runner Sneakers Ultra',
    category: 'Wearables',
    price: '$210',
    rating: 4.7,
    reviews: 112,
    badge: 'Hot Sale',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
    accentColor: 'from-lime-accent/20 to-transparent'
  },
  {
    id: 5,
    name: 'Modular Hardware Sling Pack',
    category: 'Techpacks',
    price: '$185',
    rating: 4.9,
    reviews: 43,
    badge: 'New Era',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop',
    accentColor: 'from-orange-500/20 to-transparent'
  },
  {
    id: 6,
    name: 'Audio Pods Spatial Max',
    category: 'Core Devices',
    price: '$320',
    rating: 4.8,
    reviews: 156,
    badge: 'Restocked',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    accentColor: 'from-cyan-500/20 to-transparent'
  }
]

const categories = ['All Assets', 'Core Devices', 'Wearables', 'Optics Pro', 'Techpacks']

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('All Assets')
  const [hoveredCard, setHoveredCard] = useState(null)

  // Filter strategy logic
  const filteredProducts = activeTab === 'All Assets'
    ? productsData
    : productsData.filter(product => product.category === activeTab)

  // Advanced inline 3D tilt calculations based on mouse coordinates relative to the card dimensions
  const handleMouseMove = (e, id) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    
    // Limits degrees of movement to avoid jarring broken layout breaks
    const rotateX = -(y / box.height) * 20 
    const rotateY = (x / box.width) * 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
  }

  const handleMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    setHoveredCard(null)
  }

  return (
    <section className="bg-royal-dark text-white py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Grid Matrices & Ambient Spotlighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_5px),linear-gradient(to_bottom,#ffffff03_1px,transparent_5px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SECTION CAPTION HEADER BLOCK */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
            <Sparkles className="w-3 h-3 text-lime-accent" /> Premium Hardware Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
            Featured <span className="text-lime-accent font-light">Drops</span> Catalog
          </h2>
          <div className="w-16 h-[2px] bg-lime-accent rounded-full mt-2" />
        </div>

        {/* INTERACTIVE CATEGORY TABS CONTAINER */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-16 max-w-4xl mx-auto">
          {categories.map((tab) => {
            const count = tab === 'All Assets' ? productsData.length : productsData.filter(p => p.category === tab).length
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 ${
                  isActive
                    ? 'bg-lime-accent text-royal-dark border-transparent shadow-[0_10px_25px_rgba(165,206,0,0.3)]'
                    : 'bg-white/5 text-white/60 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab}
                <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                  isActive ? 'bg-royal-dark/10 text-royal-dark' : 'bg-white/10 text-white/40 group-hover:text-white'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* DYNAMIC PRODUCTS 3D CARD GRID INTERFACE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative rounded-2xl group transition-all duration-300"
              style={{ perspective: '1000px' }}
            >
              {/* Outer Shadow Mesh Frame Layer */}
              <div
                onMouseMove={(e) => handleMouseMove(e, product.id)}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setHoveredCard(product.id)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden select-none transition-all duration-150 ease-out cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:border-lime-accent/40"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Internal Backdrop Highlight */}
                <div className={`absolute -inset-2 bg-gradient-to-br ${product.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none`} />

                {/* Card Top Utility Header Block */}
                <div className="flex items-center justify-between relative z-10 mb-4" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[9px] font-black tracking-widest uppercase bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 group-hover:bg-lime-accent group-hover:text-royal-dark group-hover:border-transparent transition-colors">
                    {product.badge}
                  </span>
                  <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-pink-500 hover:bg-white/10 transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Card Viewport Display Frame (The Core 3D Layer) */}
                <div 
                  className="w-full h-64 rounded-xl overflow-hidden relative mb-6 bg-black/20 flex items-center justify-center transition-all duration-500"
                  style={{ transform: 'translateZ(45px)' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  {/* Image Overlapping Micro Gradient Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/40 to-transparent" />
                </div>

                {/* Core Descriptive Text Details Section */}
                <div className="space-y-3 relative z-10 text-left" style={{ transform: 'translateZ(25px)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{product.category}</span>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 text-lime-accent fill-lime-accent" />
                      <span className="text-[10px] font-black text-white">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-wide text-white group-hover:text-lime-accent transition-colors truncate">
                    {product.name}
                  </h3>

                  <hr className="border-white/5 my-2 group-hover:border-white/10 transition-colors" />

                  {/* Pricing and Action Activation Interface Panel */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">Acquisition</span>
                      <span className="text-xl font-black text-white tracking-wide">{product.price}</span>
                    </div>

                    <button 
                      className="inline-flex items-center gap-2 bg-white text-royal-dark px-4 py-2.5 font-black uppercase tracking-wider text-[11px] rounded-xl group-hover:bg-lime-accent group-hover:shadow-[0_4px_20px_rgba(165,206,0,0.4)] active:scale-95 transition-all duration-300"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Buy
                    </button>
                  </div>
                </div>

                {/* Underbelly Accent Neon Line */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-lime-accent to-transparent opacity-0 transform scale-x-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-x-100" />
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER LINK COMPONENT ACTION */}
        <div className="mt-16 flex justify-center">
          <button className="group inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 font-black tracking-widest uppercase rounded-xl text-xs transition-all duration-300">
            Access Full Inventory Vault
            <ArrowRight className="w-4 h-4 text-lime-accent group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  )
}

export default FeaturedProducts