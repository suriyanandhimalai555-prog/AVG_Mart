import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ArrowUpRight, ShoppingBag, Eye, Sparkles, Sliders } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast' // <-- 1. Import toast engine

const API_BASE_URL = 'http://localhost:5000/api/products'

const AllProducts = () => {
  const navigate = useNavigate()

  // Live Database Core States
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState(['All'])
  const [isLoading, setIsLoading] = useState(true)

  // Filtering System Management Panels
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState(15000) // Adjusted ceiling bounds for INR metrics
  const [sortBy, setSortBy] = useState('featured')

  // Synchronize live inventory data array from backend database on render lifecycle mount
  useEffect(() => {
    const fetchAllInventoryProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(API_BASE_URL)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)

          // Dynamically gather distinct operational categories found in database loadouts
          const distinctCategories = ['All', ...new Set(data.map(p => p.category))]
          setCategoriesList(distinctCategories)

          // Dynamically locate peak price bounds to align default slider positions comfortably
          if (data.length > 0) {
            const peakPrice = Math.max(...data.map(p => Number(p.offerPrice || p.originalPrice || 0)))
            setMaxPrice(peakPrice > 0 ? peakPrice : 15000)
          }
        }
      } catch (err) {
        console.error("Failed synchronization pipeline communication with central data asset registries:", err)
        toast.error("Failed to load inventory network ledger.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllInventoryProducts()
  }, [])

  // Live Responsive Compute Filter Logic Layout Map Matrix
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const targetPrice = Number(product.offerPrice || product.originalPrice || 0)
      
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
        
      const matchesCategory = selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesPrice = targetPrice <= maxPrice

      return matchesSearch && matchesCategory && matchesPrice
    }).sort((a, b) => {
      const priceA = Number(a.offerPrice || a.originalPrice || 0)
      const priceB = Number(b.offerPrice || b.originalPrice || 0)

      if (sortBy === 'low-to-high') return priceA - priceB
      if (sortBy === 'high-to-low') return priceB - priceA
      return b.id - a.id // Core sorting logic sequence layout
    })
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy])

  const handleAddToCart = async (product, token, navigate) => {
    if (!token) {
      toast.error("Authentication required. Redirecting to access terminal...", {
        duration: 3000
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    // Initialize loading toast while waiting for database response
    const loadId = toast.loading("Syncing asset loadout configuration...");

    try {
      const originalPrice = Number(product.originalPrice || 0);
      const offerPrice = Number(product.offerPrice || originalPrice);
      
      const response = await fetch("http://localhost:5000/api/auth/cart", {
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
        toast.success(`${product.name} added to the cart!`, { id: loadId });
      } else {
        const errData = await response.json();
        toast.error(`Sync failure: ${errData.message || 'Pipeline rejected target data.'}`, { id: loadId });
      }
    } catch (err) {
      console.error("Cart synchronization error pipeline:", err);
      toast.error("Network payload loss. Cart sync dropped.", { id: loadId });
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
        
        {/* Ambient Cyber Light Matrix Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-[5%] right-[-10%] w-[500px] h-[500px] bg-lime-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 mt-6">
          
          {/* HEADER HERO BANNER TRACK */}
          <div className="space-y-4 mb-16 text-left border-b border-white/5 pb-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
                <Sparkles className="w-3 h-3 text-lime-accent" /> All Products
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
            
            {/* LEFT FILTER BAR MODULE SHEETS */}
            <div className="lg:col-span-3 space-y-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md sticky top-28">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                  <SlidersHorizontal className="w-4 h-4 text-lime-accent" /> Filter Console
                </div>
                <button 
                  onClick={() => { 
                    setSearchQuery(''); 
                    setSelectedCategory('All'); 
                    setSortBy('featured');
                    if (products.length > 0) {
                      const peakPrice = Math.max(...products.map(p => Number(p.offerPrice || p.originalPrice || 0)))
                      setMaxPrice(peakPrice);
                    }
                  }}
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
                      <span className="tracking-wide capitalize">{cat}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                        selectedCategory === cat ? 'bg-lime-accent/10 border-lime-accent/20' : 'bg-white/5 border-white/5'
                      }`}>
                        {cat === 'All' ? products.length : products.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE INDEX SLIDER CONTROLLER */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                  <span>Price Filter</span>
                  <span className="text-lime-accent font-mono text-xs font-black">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-lime-accent bg-white/10 h-1 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-white/30">
                  <span>₹0</span>
                  <span>₹50,000</span>
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
                  <option value="featured">All Latest Drops</option>
                  <option value="low-to-high">Price Low to High</option>
                  <option value="high-to-low">Price High to Low</option>
                </select>
              </div>

            </div>

            {/* RIGHT PRODUCT GRID CONTAINER LAYOUT */}
            <div className="lg:col-span-9 space-y-6">
              
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-white/40 px-2">
                <span>All Products</span>
                <span>[{filteredProducts.length}] Items Showing</span>
              </div>

              {isLoading ? (
                /* LOADING PLACEHOLDER LAYOUT */
                <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-32">
                  Accessing active inventory system matrix files...
                </div>
              ) : filteredProducts.length === 0 ? (
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
                /* HIGHLY RESPONSIVE PREMIUM LIVE S3 ENGINE CARD MATRIX GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const original = Number(product.originalPrice || 0)
                    const offer = Number(product.offerPrice || original)
                    const reduction = original - offer

                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-500 hover:bg-white/[0.05] relative overflow-hidden flex flex-col justify-between h-full cursor-pointer text-left shadow-lg"
                      >
                        {/* Image Frame Node Area Container */}
                        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/5 bg-black/40 relative flex-shrink-0">
                          <img 
                            src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
                            alt={product.name} 
                            className="w-full h-full object-cover filter contrast-110 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                          />
                          
                          {/* Conditional Tags Status Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            <span className="inline-flex items-center text-[8px] font-black tracking-widest uppercase bg-royal-dark/90 backdrop-blur-md border border-white/10 text-lime-accent px-2.5 py-1 rounded-md">
                              {product.count > 0 ? 'AVAILABLE NODE' : 'SOLD OUT OUTPOST'}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex items-center text-[8px] font-black tracking-widest uppercase bg-lime-accent text-royal-dark font-black px-2.5 py-1 rounded-md shadow-md">
                                SPOTLIGHT DROP
                              </span>
                            )}
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
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                const token = localStorage.getItem("token");
                                handleAddToCart(product, token, navigate);
                              }}
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
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 capitalize">
                                {product.category}
                              </span>
                              <span className="text-[10px] font-mono font-medium text-white/30">
                                MATRIX//0{product.id}
                              </span>
                            </div>
                            
                            <h3 className="text-base font-black uppercase tracking-wide text-white group-hover:text-lime-accent transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-[11px] text-white/40 font-medium line-clamp-2 border-t border-white/5 pt-1.5 mt-1 leading-relaxed">
                              {product.description || 'High-efficiency technical utility standard apparatus.'}
                            </p>
                          </div>

                          {/* Valuation Footer Line Meta */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold tracking-wider uppercase text-white/30">Acquisition</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black tracking-wide text-white font-mono">₹{offer}</span>
                                {reduction > 0 && (
                                  <span className="text-xs line-through text-white/30 font-bold">₹{original}</span>
                                )}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-lime-accent group-hover:border-lime-accent text-white/40 group-hover:text-royal-dark transition-all duration-500">
                              <ArrowUpRight className="w-4 h-4 transform group-hover:rotate-45 transition-transform duration-300" />
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
      <Footer />
    </>
  )
}

export default AllProducts