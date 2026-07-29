import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, ShoppingBag, Eye, Sparkles, Sliders, Star, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const AllProducts = () => {
  const navigate = useNavigate()

  // Live Database Core States
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState(['All'])
  const [isLoading, setIsLoading] = useState(true)

  // Filtering System Management Panels
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState(15000)
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

          const distinctCategories = ['All', ...new Set(data.map(p => p.category))]
          setCategoriesList(distinctCategories)

          if (data.length > 0) {
            const peakPrice = Math.max(...data.map(p => Number(p.offerPrice || p.offer_price || p.originalPrice || p.original_price || 0)))
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
      const targetPrice = Number(product.offerPrice || product.offer_price || product.originalPrice || product.original_price || 0)

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase())
      const matchesPrice = targetPrice <= maxPrice

      return matchesSearch && matchesCategory && matchesPrice
    }).sort((a, b) => {
      const priceA = Number(a.offerPrice || a.offer_price || a.originalPrice || a.original_price || 0)
      const priceB = Number(b.offerPrice || b.offer_price || b.originalPrice || b.original_price || 0)

      if (sortBy === 'low-to-high') return priceA - priceB
      if (sortBy === 'high-to-low') return priceB - priceA
      return b.id - a.id
    })
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy])

  // Mouse move handler for 3D tilt effect on product cards
  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2

    const rotateX = -(y / box.height) * 12
    const rotateY = (x / box.width) * 12

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  const handleAddToCart = async (product, token, navigate) => {
    if (Number(product.count || 0) <= 0) {
      toast.error("This item is currently out of stock!");
      return;
    }

    if (!token) {
      toast.error("Authentication required. Redirecting to access terminal...", {
        duration: 3000
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const loadId = toast.loading("Syncing asset loadout configuration...");

    try {
      const origPrice = Number(product.originalPrice || product.original_price || 0);
      const offPrice = Number(product.offerPrice || product.offer_price || origPrice);

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
          originalPrice: origPrice,
          offerPrice: offPrice,
          price: offPrice,
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
                      const peakPrice = Math.max(...products.map(p => Number(p.offerPrice || p.offer_price || p.originalPrice || p.original_price || 0)))
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
                      className={`w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${selectedCategory === cat
                          ? 'bg-lime-accent/10 border-lime-accent/20 text-lime-accent'
                          : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span className="tracking-wide capitalize">{cat}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${selectedCategory === cat ? 'bg-lime-accent/10 border-lime-accent/20' : 'bg-white/5 border-white/5'
                        }`}>
                        {cat === 'All' ? products.length : products.filter(p => p.category && p.category.toLowerCase() === cat.toLowerCase()).length}
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
                <span>[{isLoading ? '...' : filteredProducts.length}] Items Showing</span>
              </div>

              {isLoading ? (
                /* LOADING SKELETON GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-[460px] bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-4 flex flex-col justify-between backdrop-blur-md animate-pulse"
                    >
                      {/* Image Placeholder */}
                      <div className="w-full h-56 rounded-[2rem] bg-white/5 border border-white/5" />

                      {/* Content Placeholder */}
                      <div className="p-3 pt-3 flex flex-col justify-between flex-1 space-y-4">
                        <div className="space-y-3">
                          <div className="h-5 bg-white/10 rounded-md w-3/4" />
                          <div className="flex gap-2">
                            <div className="h-4 bg-white/5 rounded-full w-16" />
                            <div className="h-4 bg-white/5 rounded-full w-12" />
                          </div>
                        </div>

                        {/* Bottom Bar Placeholder */}
                        <div className="pt-3 flex items-center justify-between border-t border-white/5">
                          <div className="space-y-1">
                            <div className="h-6 bg-white/10 rounded-md w-16" />
                            <div className="h-2 bg-white/5 rounded-md w-12" />
                          </div>
                          <div className="h-9 bg-white/10 rounded-full w-28" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                  {filteredProducts.map((product) => {
                    const rawOriginal = product.originalPrice ?? product.original_price;
                    const rawOffer = product.offerPrice ?? product.offer_price;

                    const original = Number(rawOriginal || 0);
                    const offer = Number(rawOffer || original);

                    const showOriginalPrice = original > 0 && original !== offer;
                    const savings = original > offer ? original - offer : 0;
                    const isOutOfStock = Number(product.count || 0) <= 0;

                    return (
                      <div
                        key={product.id}
                        className="relative group transition-all duration-300 h-[460px]"
                        style={{ perspective: '1000px' }}
                      >
                        <div
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          className="w-full h-full bg-white/[0.04] border border-white/10 hover:border-lime-accent/40 rounded-[2.5rem] p-4 flex flex-col justify-between transition-all duration-150 ease-out shadow-2xl backdrop-blur-md relative overflow-hidden"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Image Container (Fixed Height) */}
                          <div
                            className="w-full h-56 rounded-[2rem] overflow-hidden relative bg-black/40 flex items-center justify-center cursor-pointer group/img shrink-0"
                            style={{ transform: 'translateZ(30px)' }}
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            <img
                              src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                              alt={product.name}
                              className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'opacity-40 grayscale' : 'group-hover/img:scale-105'
                                }`}
                            />

                            {/* Stock Badge & Wishlist Button */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                              <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border backdrop-blur-md ${isOutOfStock
                                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                  : 'bg-black/40 text-emerald-400 border-emerald-500/30'
                                }`}>
                                {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
                              </span>

                              <button
                                aria-label="Wishlist"
                                onClick={(e) => e.stopPropagation()}
                                className="pointer-events-auto p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-pink-500 hover:bg-black/60 transition-all"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Inspect Overlay */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <span className="bg-lime-accent text-royal-dark px-4 py-2 rounded-full font-black text-xs uppercase flex items-center gap-1.5 shadow-lg tracking-wider">
                                <Eye className="w-4 h-4" /> View Details
                              </span>
                            </div>
                          </div>

                          {/* Fixed Content Section */}
                          <div className="p-3 flex flex-col justify-between flex-1 z-10 text-left" style={{ transform: 'translateZ(20px)' }}>

                            <div className="space-y-2">
                              {/* Product Name Slot */}
                              <h3 className="text-lg font-bold text-white group-hover:text-lime-accent transition-colors truncate h-7 leading-7">
                                {product.name}
                              </h3>

                              {/* Pill Tags Row Slot */}
                              <div className="flex flex-wrap items-center gap-2 overflow-hidden h-7">
                                <span className="text-[10px] font-medium bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-white/70">
                                  {product.category}
                                </span>

                                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/80">
                                  <Star className="w-3 h-3 text-lime-accent fill-lime-accent" />
                                  <span>4.8</span>
                                </div>

                                {savings > 0 && (
                                  <span className="text-[10px] font-bold bg-lime-accent/10 border border-lime-accent/20 px-2.5 py-0.5 rounded-full text-lime-accent">
                                    Save ₹{savings}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bottom Bar (Pinned To Bottom) */}
                            <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/5 mt-auto" style={{ transform: 'translateZ(25px)' }}>

                              {/* Price Block */}
                              <div className="flex flex-col">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-xl font-black text-lime-accent">
                                    ₹{offer}
                                  </span>

                                  {showOriginalPrice && (
                                    <span className="text-xs line-through text-white/40 font-semibold decoration-red-400 decoration-2">
                                      ₹{original}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-white/40 font-medium">Incl. all taxes</span>
                              </div>

                              {/* Add to Cart Button */}
                              <button
                                disabled={isOutOfStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const token = localStorage.getItem("token");
                                  handleAddToCart(product, token, navigate);
                                }}
                                className={`px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 shadow-lg shrink-0 ${isOutOfStock
                                    ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                                    : 'bg-lime-accent text-royal-dark hover:bg-lime-accent/90 hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(165,206,0,0.3)]'
                                  }`}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                              </button>

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