import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowUpRight, ShoppingBag, Eye, Sparkles, Sliders, Layers, HelpCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Comprehensive Premium Mock Database Matrix
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Alpha Matrix Over-Tee',
    category: 'T-Shirts',
    price: 85,
    tag: 'Limited Drop',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    specs: '360GSM Heavyweight Cotton'
  },
  {
    id: 2,
    name: 'Phantom Tech Runner-01',
    category: 'Shoes',
    price: 240,
    tag: 'Selling Fast',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    specs: 'Nitrogen Infused Cell Sole'
  },
  {
    id: 3,
    name: 'Chrono Chronograph V2',
    category: 'Watches',
    price: 1150,
    tag: 'Premium Tier',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    specs: 'Titanium Shell / Sapphire Glass'
  },
  {
    id: 4,
    name: 'Tactical Modular Belt X',
    category: 'Belts',
    price: 110,
    tag: 'New Era',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ef986d?q=80&w=600&auto=format&fit=crop',
    specs: 'Fidlock Magnetic Buckle'
  },
  {
    id: 5,
    name: 'Cyber-Mesh Breathable Top',
    category: 'T-Shirts',
    price: 95,
    tag: 'S26 Core',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
    specs: 'Aero-Weave Ventilation Mesh'
  },
  {
    id: 6,
    name: 'Apex Stealth Boot V4',
    category: 'Shoes',
    price: 310,
    tag: 'Volt Edition',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
    specs: 'Waterproof Kevlar Shelling'
  }
]

const AllProducts = () => {
  const navigate = useNavigate()

  // State Management Systems
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState(1500)
  const [sortBy, setSortBy] = useState('featured')

  // Categories extraction array
  const categoriesList = ['All', 'T-Shirts', 'Shoes', 'Watches', 'Belts']

  // Core Reactive Filter Engine Mapping
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.specs.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesPrice = product.price <= maxPrice

      return matchesSearch && matchesCategory && matchesPrice
    }).sort((a, b) => {
      if (sortBy === 'low-to-high') return a.price - b.price
      if (sortBy === 'high-to-low') return b.price - a.price
      return b.id - a.id // Featured fallback default
    })
  }, [searchQuery, selectedCategory, maxPrice, sortBy])

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
        
        {/* Ambient Cyber Light Matrix Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-[5%] right-[-10%] w-[500px] h-[500px] bg-lime-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 mt-6">
          
          {/* HEADER HERO BANNER TRACK */}
          <div className="space-y-4 mb-16 text-left border-b border-white/5 pb-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
                <Sparkles className="w-3 h-3 text-lime-accent" /> Asset Registry Operational
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider">
                System <span className="text-lime-accent font-light">Products</span> Catalog
              </h1>
              <p className="text-xs md:text-sm text-white/40 font-medium tracking-wide max-w-xl leading-relaxed">
                Filter and provision next-gen modular apparel, high-performance kicks, and tactical utility systems engineered for premium architectural environments.
              </p>
          </div>

          {/* DYNAMIC PIPELINE CONTROL LAYER (Search, Filter Panels) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT FILTER BAR MODULE SHEETS (Desktop Anchor, Mobile Collapsible Grid) */}
            <div className="lg:col-span-3 space-y-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md sticky top-28">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                  <SlidersHorizontal className="w-4 h-4 text-lime-accent" /> Filter Console
                </div>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(1500); setSortBy('featured'); }}
                  className="text-[10px] font-bold text-white/40 hover:text-lime-accent transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Reset Ledger
                </button>
              </div>

              {/* SEARCH ENGINE COMPONENT */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Search Products</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-lime-accent transition-colors group">
                  <Search className="w-4 h-4 text-white/30 group-focus-within:text-lime-accent transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keywords, specs, items..."
                    className="bg-transparent text-xs pl-2.5 outline-none w-full text-white placeholder-white/20 font-medium"
                  />
                </div>
              </div>

              {/* CATEGORY MATRIX ASSIGNMENTS */}
              <div className="space-y-2.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Classification</label>
                <div className="flex flex-col space-y-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                        selectedCategory === cat
                          ? 'bg-lime-accent/10 border-lime-accent/20 text-lime-accent'
                          : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="tracking-wide">{cat}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                        selectedCategory === cat ? 'bg-lime-accent/10 border-lime-accent/20' : 'bg-white/5 border-white/5'
                      }`}>
                        {cat === 'All' ? MOCK_PRODUCTS.length : MOCK_PRODUCTS.filter(p => p.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE INDEX SLIDER CONTROLLER */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                  <span>Price Filter</span>
                  <span className="text-lime-accent font-mono text-xs font-black">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-lime-accent bg-white/10 h-1 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-white/30">
                  <span>$50</span>
                  <span>$1,500</span>
                </div>
              </div>

              {/* SORT MATRIX INDEX */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Sort Ordering</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white/70 outline-none focus:border-lime-accent transition-colors cursor-pointer"
                >
                  <option value="featured">All Products</option>
                  <option value="low-to-high">Price Low to High</option>
                  <option value="high-to-low">Price High to Low</option>
                </select>
              </div>

            </div>

            {/* RIGHT PRODUCT GRID CONTAINER LAYOUT */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Micro Meta Grid Data Monitor Counter */}
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-white/40 px-2">
                <span>All Products</span>
                <span>[{filteredProducts.length}] Items Showing</span>
              </div>

              {filteredProducts.length === 0 ? (
                /* EMPTY FILTER ERROR PANEL BOX */
                <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-20 text-center space-y-4 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/20">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Zero Vector Match</h3>
                    <p className="text-xs text-white/40 max-w-xs mx-auto leading-relaxed">
                      No hardware profile fits your current parameters. Reset adjustments to recalculate values.
                    </p>
                  </div>
                </div>
              ) : (
                /* HIGHLY RESPONSIVE PREMIUM CARD MATRIX GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-500 hover:bg-white/[0.05] relative overflow-hidden flex flex-col justify-between h-full cursor-pointer text-left shadow-lg"
                    >
                      {/* Image Frame Node Area Container */}
                      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/5 bg-black/40 relative flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover filter contrast-110 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                        />
                        
                        {/* Status Float Badge Tag */}
                        <div className="absolute top-3 left-3 inline-flex items-center text-[8px] font-black tracking-widest uppercase bg-royal-dark/90 backdrop-blur-md border border-white/10 text-lime-accent px-2.5 py-1 rounded-md">
                          {product.tag}
                        </div>

                        {/* Interactive Cyber Action Hover Utilities */}
                        <div className="absolute inset-0 bg-royal-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                            className="p-3 bg-white text-royal-dark rounded-xl hover:bg-lime-accent hover:scale-110 transition-all shadow-xl"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert('Node added to configuration layout.'); }}
                            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-lime-accent hover:text-royal-dark hover:scale-110 transition-all shadow-xl"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Descriptor Metrics Frame Footer */}
                      <div className="pt-4 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                              {product.category}
                            </span>
                            <span className="text-[10px] font-mono font-medium text-white/30">
                              REF//00{product.id}
                            </span>
                          </div>
                          
                          <h3 className="text-base font-black uppercase tracking-wide text-white group-hover:text-lime-accent transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-white/40 font-medium line-clamp-1 border-t border-white/5 pt-1.5 mt-1">
                            {product.specs}
                          </p>
                        </div>

                        {/* Valuation Footer Line Meta */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-bold tracking-wider uppercase text-white/30">Acquisition</span>
                            <span className="text-lg font-black tracking-wide text-white font-mono">${product.price}</span>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-lime-accent group-hover:border-lime-accent text-white/40 group-hover:text-royal-dark transition-all duration-500">
                            <ArrowUpRight className="w-4 h-4 transform group-hover:rotate-45 transition-transform duration-300" />
                          </div>
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
      <Footer />
    </>
  )
}

export default AllProducts