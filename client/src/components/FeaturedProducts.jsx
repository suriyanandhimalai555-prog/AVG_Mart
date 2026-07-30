import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Star, Heart, Sparkles, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['All Assets'])
  const [activeTab, setActiveTab] = useState('All Assets')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(API_BASE_URL)
        if (response.ok) {
          const data = await response.json()
          
          const featuredOnly = data.filter(product => product.isFeatured === true)
          setProducts(featuredOnly)

          const distinctCategories = ['All Assets', ...new Set(featuredOnly.map(p => p.category))]
          setCategories(distinctCategories)
        }
      } catch (err) {
        console.error("Failed synchronization pipeline connection to API endpoints:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const filteredProducts = activeTab === 'All Assets'
    ? products
    : products.filter(product => product.category.toLowerCase() === activeTab.toLowerCase())

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
      toast.error("Authentication required. Redirecting to login...", {
        duration: 3000
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const loadId = toast.loading("Adding item to cart...");

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
          originalPrice: originalPrice,
          offerPrice: offerPrice,
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
    <section className="bg-royal-dark text-white py-16 md:py-10 px-4 md:px-12 relative overflow-hidden min-h-screen">
      {/* Background Glow & Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_5px),linear-gradient(to_bottom,#ffffff03_1px,transparent_5px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
            <Sparkles className="w-3 h-3 text-lime-accent" /> Premium Hardware Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
            Featured <span className="text-lime-accent font-light">Drops</span> Catalog
          </h2>
          <div className="w-16 h-[2px] bg-lime-accent rounded-full mt-2" />
        </div>

        {/* Responsive Tab Bar (Horizontal Touch Scroll on Mobile, Centered Wrap on Desktop) */}
        <div className="w-full mb-12 md:mb-16">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 md:justify-center -mx-4 md:mx-0 px-4 md:px-0">
            {categories.map((tab) => {
              const count = tab === 'All Assets' ? products.length : products.filter(p => p.category === tab).length
              const isActive = activeTab === tab

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`group shrink-0 relative px-4 md:px-5 py-2.5 rounded-full text-[11px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 ${
                    isActive
                      ? 'bg-lime-accent text-royal-dark border-transparent shadow-[0_8px_20px_rgba(165,206,0,0.3)] scale-[1.02]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="whitespace-nowrap">{tab}</span>
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    isActive 
                      ? 'bg-royal-dark/20 text-royal-dark' 
                      : 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-20">
            Querying active spotlight inventory arrays...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-white/40 text-xs uppercase tracking-widest py-20 font-bold">
            No featured items active inside this sector layer category at present.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const original = Number(product.originalPrice || 0);
              const offer = Number(product.offerPrice || original);
              const savings = original > offer ? original - offer : 0;
              const isOutOfStock = Number(product.count || 0) <= 0;

              return (
                <div
                  key={product.id}
                  className="relative group transition-all duration-300"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full bg-white/[0.04] border border-white/10 hover:border-lime-accent/40 rounded-[2.5rem] p-4 flex flex-col justify-between transition-all duration-150 ease-out shadow-2xl backdrop-blur-md relative overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Image Container */}
                    <div 
                      className="w-full h-64 rounded-[2rem] overflow-hidden relative bg-black/40 flex items-center justify-center cursor-pointer group/img"
                      style={{ transform: 'translateZ(30px)' }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isOutOfStock ? 'opacity-40 grayscale' : 'group-hover/img:scale-105'
                        }`}
                      />

                      {/* Stock Badge & Wishlist Button */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border backdrop-blur-md ${
                          isOutOfStock 
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

                    {/* Content Section */}
                    <div className="p-3 space-y-3 z-10 text-left" style={{ transform: 'translateZ(20px)' }}>
                      
                      {/* Product Name */}
                      <h3 className="text-xl font-bold text-white group-hover:text-lime-accent transition-colors truncate pt-1">
                        {product.name}
                      </h3>

                      {/* Pill Tags Row (Category, Rating, Savings Badge) */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/70">
                          {product.category}
                        </span>
                        
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white/80">
                          <Star className="w-3 h-3 text-lime-accent fill-lime-accent" />
                          <span>4.8</span>
                        </div>

                        {savings > 0 && (
                          <span className="text-[11px] font-bold bg-lime-accent/10 border border-lime-accent/20 px-3 py-1 rounded-full text-lime-accent">
                            Save ₹{savings}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed min-h-[2rem]">
                        {product.description || "High-performance gear engineered for ultimate output and long-term durability."}
                      </p>

                      {/* Bottom Bar: Price Display + Add to Cart Button */}
                      <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/5" style={{ transform: 'translateZ(25px)' }}>
                        
                        {/* Price Block featuring originalPrice and offerPrice */}
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-lime-accent">₹{offer}</span>
                            {original > offer && (
                              <span className="text-xs line-through text-white/40 font-medium">₹{original}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-white/40 font-medium">Incl. all taxes</span>
                        </div>

                        {/* Add to Cart Pill Button */}
                        <button 
                          disabled={isOutOfStock}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const token = localStorage.getItem("token");
                            handleAddToCart(product, token, navigate);
                          }}
                          className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-200 shadow-lg ${
                            isOutOfStock 
                              ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5' 
                              : 'bg-lime-accent text-royal-dark hover:bg-lime-accent/90 hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(165,206,0,0.3)]'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
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
    </section>
  )
}

export default FeaturedProducts