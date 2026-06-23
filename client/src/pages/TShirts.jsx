import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowUpRight, ShoppingBag, Eye, Sparkles, Sliders } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// isolated dataset - replace this array with an API fetch call later
const MOCK_TSHIRTS = [
  { id: 1, name: 'Alpha Matrix Over-Tee', category: 'T-Shirts', price: 85, tag: 'Limited Drop', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop', specs: '360GSM Heavyweight Cotton' },
  { id: 5, name: 'Cyber-Mesh Breathable Top', category: 'T-Shirts', price: 95, tag: 'S26 Core', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop', specs: 'Aero-Weave Ventilation Mesh' },
]

const TShirts = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(500)
  const [sortBy, setSortBy] = useState('featured')

  const filteredProducts = useMemo(() => {
    return MOCK_TSHIRTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = p.price <= maxPrice
      return matchesSearch && matchesPrice
    }).sort((a, b) => {
      if (sortBy === 'low-to-high') return a.price - b.price
      if (sortBy === 'high-to-low') return b.price - a.price
      return b.id - a.id
    })
  }, [searchQuery, maxPrice, sortBy])

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="max-w-7xl mx-auto relative z-10 mt-6">
          <div className="space-y-4 mb-12 text-left border-b border-white/5 pb-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
                <Sparkles className="w-3 h-3" /> Premium Apparel Pipeline
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider">T-Shirts <span className="text-lime-accent font-light">Registry</span></h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3 lg:sticky lg:top-28 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto space-y-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md custom-scrollbar text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white"><SlidersHorizontal className="w-4 h-4 text-lime-accent" /> Filters</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Search Profile</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-2.5"><Search className="w-4 h-4 text-white/30" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search apparel..." className="bg-transparent text-xs pl-2.5 outline-none w-full text-white" /></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-white/50"><span>Price Filter</span><span className="text-lime-accent font-mono">${maxPrice}</span></div>
                <input type="range" min="50" max="500" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-lime-accent bg-white/10 h-1 rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Sort Order</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"><option value="featured">Featured</option><option value="low-to-high">Price: Low to High</option><option value="high-to-low">Price: High to Low</option></select>
              </div>
            </div>
            <div className="lg:col-span-9 space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-20 text-center"><Sliders className="w-5 h-5 mx-auto text-white/20 mb-2" /><h3 className="text-sm font-black uppercase text-white">No Assets Matching</h3></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-500 relative flex flex-col justify-between h-full cursor-pointer text-left">
                      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/40 relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover filter contrast-110 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute top-3 left-3 text-[8px] font-black tracking-widest uppercase bg-royal-dark/90 border border-white/10 text-lime-accent px-2.5 py-1 rounded-md">{product.tag}</div>
                        <div className="absolute inset-0 bg-royal-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="p-3 bg-white text-royal-dark rounded-xl"><Eye className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); alert('Provisioned to Cart.'); }} className="p-3 bg-white/10 text-white rounded-xl"><ShoppingBag className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="pt-4 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between"><span className="text-[9px] font-black text-white/40">{product.category}</span><span className="text-[10px] font-mono text-white/30">REF//00{product.id}</span></div>
                          <h3 className="text-base font-black uppercase text-white group-hover:text-lime-accent transition-colors line-clamp-1">{product.name}</h3>
                          <p className="text-[11px] text-white/40 line-clamp-1 border-t border-white/5 pt-1.5 mt-1">{product.specs}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <div className="flex flex-col"><span className="text-[8px] text-white/30 uppercase">Acquisition</span><span className="text-lg font-black font-mono">${product.price}</span></div>
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-lime-accent group-hover:text-royal-dark transition-all duration-500"><ArrowUpRight className="w-4 h-4" /></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }`}</style>
      <Footer />
    </>
  )
}

export default TShirts