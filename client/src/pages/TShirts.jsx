import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowUpRight, ShoppingBag, Eye, Sparkles, Sliders } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast' // <-- 1. Import the toast asset engine

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const TShirts = () => {
  const navigate = useNavigate()

  // Live Server State Modules
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter Engine Controls
  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000) // Default higher range boundary for INR calculations
  const [sortBy, setSortBy] = useState('featured')

  // Synchronize category records live from the API setup
  useEffect(() => {
    const fetchTShirtInventory = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(API_BASE_URL)
        if (response.ok) {
          const data = await response.json()
          
          // CRITICAL LAYER: Filter strictly to show only "T-Shirts" from your database records
          const tshirtsOnly = data.filter(product => product.category.toLowerCase() === 't-shirt')
          setProducts(tshirtsOnly)

          // Set the slider's default dynamic ceiling boundary based on the highest-priced shirt
          if (tshirtsOnly.length > 0) {
            const peakPrice = Math.max(...tshirtsOnly.map(p => Number(p.offerPrice || p.originalPrice || 0)))
            setMaxPrice(peakPrice > 0 ? peakPrice : 5000)
          }
        }
      } catch (err) {
        console.error("Failed synchronization pipeline connection to API endpoints:", err)
        toast.error("Failed to load category inventory node link.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTShirtInventory()
  }, [])

  // Reactive Filtration Stack
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const activePrice = Number(product.offerPrice || product.originalPrice || 0)
      
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        
      const matchesPrice = activePrice <= maxPrice

      return matchesSearch && matchesPrice
    }).sort((a, b) => {
      const priceA = Number(a.offerPrice || a.originalPrice || 0)
      const priceB = Number(b.offerPrice || b.originalPrice || 0)

      if (sortBy === 'low-to-high') return priceA - priceB
      if (sortBy === 'high-to-low') return priceB - priceA
      return b.id - a.id // Newest drops fallback algorithm
    })
  }, [products, searchQuery, maxPrice, sortBy])

  const handleAddToCart = async (product, token, navigate) => {
    if (!token) {
      toast.error("Access terminal restricted. Redirecting to login sequence...", {
        duration: 3000
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    // Trigger an inline loading sequence tracker toast instance
    const syncToastId = toast.loading("Syncing asset to user profile database...");

    try {
      const originalPrice = Number(product.originalPrice || 0);
      const offerPrice = Number(product.offerPrice || originalPrice);
      
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          name: product.name,
          category: product.category,
          price: offerPrice,
          image: product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
        })
      });

      if (response.ok) {
        toast.success(`${product.name} added to the cart!`, { id: syncToastId });
      } else {
        const errData = await response.json();
        toast.error(`Sync rejected: ${errData.message || 'Data baseline mismatch'}`, { id: syncToastId });
      }
    } catch (err) {
      console.error("Cart synchronization error pipeline:", err);
      toast.error("Critical connection failure. Drop packet loss detected.", { id: syncToastId });
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-lime-accent/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 mt-6">
          
          {/* HEADER HERO TITLE TRACK */}
          <div className="space-y-4 mb-12 text-left border-b border-white/5 pb-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
                <Sparkles className="w-3 h-3 text-lime-accent" /> Premium T-Shirts
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider">
                T-Shirts <span className="text-lime-accent font-light">Registry</span>
              </h1>
          </div>

          {/* DYNAMIC PIPELINE CONTROL LAYER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* FILTER SIDEBAR FRAME CONTAINER */}
            <div className="lg:col-span-3 lg:sticky lg:top-28 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto space-y-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md custom-scrollbar text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                  <SlidersHorizontal className="w-4 h-4 text-lime-accent" /> Filters
                </div>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('featured');
                    if (products.length > 0) {
                      const peakPrice = Math.max(...products.map(p => Number(p.offerPrice || p.originalPrice || 0)))
                      setMaxPrice(peakPrice);
                    }
                  }}
                  className="text-[10px] font-bold text-white/40 hover:text-lime-accent transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Clear Adjustments
                </button>
              </div>

              {/* TEXT FIELD MATRIX SEARCH BLOCK */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Search Profile</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-lime-accent transition-colors">
                  <Search className="w-4 h-4 text-white/30" />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search apparel..." 
                    className="bg-transparent text-xs pl-2.5 outline-none w-full text-white placeholder-white/20 font-medium" 
                  />
                </div>
              </div>

              {/* RANGING METRICS INDEX TRACK */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                  <span>Price Filter</span>
                  <span className="text-lime-accent font-mono text-xs font-black">₹{maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="15000" 
                  step="100" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))} 
                  className="w-full accent-lime-accent bg-white/10 h-1 rounded-lg cursor-pointer" 
                />
                <div className="flex justify-between text-[9px] font-mono text-white/30">
                  <span>₹0</span>
                  <span>₹15,000</span>
                </div>
              </div>

              {/* ORDER SEQUENCING OPTION COMPONENT */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Sort Order</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white/70 outline-none focus:border-lime-accent cursor-pointer font-bold"
                >
                  <option value="featured">Latest Drops</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* PRODUCT SHOWCASE CARDS MATRIX ARRAYS */}
            <div className="lg:col-span-9 space-y-6">
              
              {isLoading ? (
                <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-32">
                  Accessing specific category node metrics...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-20 text-center backdrop-blur-md">
                  <Sliders className="w-5 h-5 mx-auto text-white/20 mb-2" />
                  <h3 className="text-sm font-black uppercase text-white tracking-widest">No Assets Matching</h3>
                  <p className="text-xs text-white/40 max-w-xs mx-auto mt-1 leading-relaxed">
                    No items match within this sector layer parameters profile layout.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const original = Number(product.originalPrice || 0)
                    const offer = Number(product.offerPrice || original)
                    const discount = original - offer

                    return (
                      <div 
                        key={product.id} 
                        onClick={() => navigate(`/product/${product.id}`)} 
                        className="group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-500 hover:bg-white/[0.05] relative flex flex-col justify-between h-full cursor-pointer text-left shadow-lg"
                      >
                        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/40 relative">
                          <img 
                            src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
                            alt={product.name} 
                            className="w-full h-full object-cover filter contrast-110 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                          />
                          
                          {/* Top Placement Tags Status Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <span className="text-[8px] font-black tracking-widest uppercase bg-royal-dark/90 border border-white/10 text-lime-accent px-2.5 py-1 rounded-md">
                              {product.count > 0 ? 'IN STOCK' : 'SOLD OUT'}
                            </span>
                            {product.isFeatured && (
                              <span className="text-[8px] font-black tracking-widest uppercase bg-lime-accent text-royal-dark px-2.5 py-1 rounded-md font-black shadow-md">
                                EXCLUSIVE
                              </span>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-royal-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="p-3 bg-white text-royal-dark rounded-xl hover:bg-lime-accent transition-colors shadow-lg transform active:scale-95"><Eye className="w-4 h-4" /></button>
                            <button onClick={(e) => { 
                              e.stopPropagation(); 
                              const token = localStorage.getItem("token");
                              handleAddToCart(product, token, navigate);
                            }} className="p-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-lime-accent hover:text-royal-dark transition-all shadow-lg transform active:scale-95"><ShoppingBag className="w-4 h-4" /></button>
                          </div>
                        </div>

                        {/* Description Text Layout Module Fields */}
                        <div className="pt-4 flex flex-col justify-between flex-grow space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">{product.category}</span>
                              <span className="text-[10px] font-mono text-white/30">SYS//00{product.id}</span>
                            </div>
                            <h3 className="text-base font-black uppercase text-white group-hover:text-lime-accent transition-colors line-clamp-1">{product.name}</h3>
                            <p className="text-[11px] text-white/40 line-clamp-2 border-t border-white/5 pt-1.5 mt-1 leading-relaxed">
                              {product.description || 'Premium architecture comfort apparel structure.'}
                            </p>
                          </div>

                          {/* Acquisition Valuation Line Section */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <div className="flex flex-col">
                              <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold">Acquisition</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black font-mono text-white">₹{offer}</span>
                                {discount > 0 && (
                                  <span className="text-xs line-through text-white/30 font-bold">₹{original}</span>
                                )}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-lime-accent group-hover:border-lime-accent text-white/40 group-hover:text-royal-dark transition-all duration-500">
                              <ArrowUpRight className="w-4 h-4 transform group-hover:rotate-45 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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