import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Star, ArrowRight, Heart, Sparkles, Eye } from 'lucide-react'
import { productsData } from '../data/productsData' // Centralized dataset

const categories = ['All Assets', 'Core Devices', 'Wearables', 'Optics Pro', 'Techpacks']

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('All Assets')
  const navigate = useNavigate()

  const filteredProducts = activeTab === 'All Assets'
    ? productsData
    : productsData.filter(product => product.category === activeTab)

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    
    const rotateX = -(y / box.height) * 15 
    const rotateY = (x / box.width) * 15

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  return (
    <section className="bg-royal-dark text-white py-24 px-6 md:px-12 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_5px),linear-gradient(to_bottom,#ffffff03_1px,transparent_5px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
            <Sparkles className="w-3 h-3 text-lime-accent" /> Premium Hardware Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
            Featured <span className="text-lime-accent font-light">Drops</span> Catalog
          </h2>
          <div className="w-16 h-[2px] bg-lime-accent rounded-full mt-2" />
        </div>

        {/* Tab Selection */}
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

        {/* Products 3D Layout Array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const savings = product.originalPrice - product.price;
            
            return (
              <div
                key={product.id}
                className="relative rounded-2xl group transition-all duration-300"
                style={{ perspective: '1000px' }}
              >
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden select-none transition-all duration-150 ease-out cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:border-lime-accent/40"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className={`absolute -inset-2 bg-gradient-to-br ${product.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none`} />

                  {/* Top Badges Meta */}
                  <div className="flex items-center justify-between relative z-10 mb-4" style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black tracking-widest uppercase bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 group-hover:bg-lime-accent group-hover:text-royal-dark group-hover:border-transparent transition-colors">
                        {product.badge}
                      </span>
                      {savings > 0 && (
                        <span className="text-[9px] font-bold tracking-wider uppercase bg-red-500/20 text-red-400 px-2.5 py-1 rounded-md border border-red-500/20">
                          Save ${savings}
                        </span>
                      )}
                    </div>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-pink-500 hover:bg-white/10 transition-all">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Core Viewport Screen Clickable Layer */}
                  <div 
                    className="w-full h-64 rounded-xl overflow-hidden relative mb-6 bg-black/20 flex items-center justify-center transition-all duration-500"
                    style={{ transform: 'translateZ(45px)' }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/40 to-transparent" />
                    
                    {/* Explicit View Link Hover Trigger */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <div className="bg-lime-accent text-royal-dark px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2 tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-4 h-4" /> Inspect Asset Data
                      </div>
                    </div>
                  </div>

                  {/* Text Spec Elements */}
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

                    <hr className="border-white/5 my-2" />

                    {/* Dual Pricing Array */}
                    <div className="flex items-end justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">Acquisition value</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white tracking-wide">${product.price}</span>
                          <span className="text-xs line-through text-white/40 font-medium">${product.originalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Execution Hub */}
                    <div className="grid grid-cols-2 gap-2 mt-4" style={{ transform: 'translateZ(40px)' }}>
                      <button 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-lime-accent" /> Details
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); alert(`${product.name} added to security configuration loadout!`) }}
                        className="inline-flex items-center justify-center gap-1.5 bg-white text-royal-dark hover:bg-lime-accent px-3 py-2.5 font-black uppercase tracking-wider text-[10px] rounded-xl hover:shadow-[0_4px_20px_rgba(165,206,0,0.4)] active:scale-95 transition-all duration-300"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add To Cart
                      </button>
                    </div>

                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-lime-accent to-transparent opacity-0 transform scale-x-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-x-100" />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FeaturedProducts