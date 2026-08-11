// import React, { useState, useEffect, useMemo } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { Search, SlidersHorizontal, ShoppingBag, Eye, Sparkles, Sliders, Star, Share2 } from 'lucide-react'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import { toast } from 'react-hot-toast'

// const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

// const CategoryViewPage = () => {
//   const { categoryName } = useParams()
//   const navigate = useNavigate()

//   // Live Server State Modules
//   const [products, setProducts] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   // Filter Engine Controls
//   const [searchQuery, setSearchQuery] = useState('')
//   const [maxPrice, setMaxPrice] = useState(15000)
//   const [sortBy, setSortBy] = useState('featured')

//   useEffect(() => {
//     const fetchCategoryInventory = async () => {
//       setIsLoading(true)
//       try {
//         const response = await fetch(API_BASE_URL)
//         if (response.ok) {
//           const data = await response.json()

//           const categoryFiltered = data.filter(
//             (product) => product.category && product.category.toLowerCase() === categoryName.toLowerCase()
//           )
//           setProducts(categoryFiltered)

//           if (categoryFiltered.length > 0) {
//             const peakPrice = Math.max(...categoryFiltered.map(p => Number(p.offerPrice || p.offer_price || p.originalPrice || p.original_price || 0)))
//             setMaxPrice(peakPrice > 0 ? peakPrice : 15000)
//           }
//         }
//       } catch (err) {
//         console.error("Failed synchronization pipeline connection to API endpoints:", err)
//         toast.error("Failed to load category inventory node link.")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchCategoryInventory()
//   }, [categoryName])

//   const filteredProducts = useMemo(() => {
//     return products.filter(product => {
//       const activePrice = Number(product.offerPrice || product.offer_price || product.originalPrice || product.original_price || 0)

//       const matchesSearch =
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

//       const matchesPrice = activePrice <= maxPrice

//       return matchesSearch && matchesPrice
//     }).sort((a, b) => {
//       const priceA = Number(a.offerPrice || a.offer_price || a.originalPrice || a.original_price || 0)
//       const priceB = Number(b.offerPrice || b.offer_price || b.originalPrice || b.original_price || 0)

//       if (sortBy === 'low-to-high') return priceA - priceB
//       if (sortBy === 'high-to-low') return priceB - priceA
//       return b.id - a.id
//     })
//   }, [products, searchQuery, maxPrice, sortBy])

//   // Mouse move handler for 3D tilt effect on product cards
//   const handleMouseMove = (e) => {
//     const card = e.currentTarget
//     const box = card.getBoundingClientRect()
//     const x = e.clientX - box.left - box.width / 2
//     const y = e.clientY - box.top - box.height / 2

//     const rotateX = -(y / box.height) * 12
//     const rotateY = (x / box.width) * 12

//     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
//   }

//   const handleMouseLeave = (e) => {
//     const card = e.currentTarget
//     card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
//   }

//   // Universal Share Handler
//   const handleShareProduct = async (e, product) => {
//     e.stopPropagation()
//     const shareUrl = `${window.location.origin}/product/${product.id}`
//     const shareData = {
//       title: product.name,
//       text: `Check out ${product.name} on our store!`,
//       url: shareUrl
//     }

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData)
//       } catch (err) {
//         if (err.name !== 'AbortError') {
//           console.error('Error sharing product:', err)
//         }
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(shareUrl)
//         toast.success("Product link copied to clipboard!")
//       } catch (err) {
//         toast.error("Failed to copy link.")
//       }
//     }
//   }

//   const handleAddToCart = async (product, token, navigate) => {
//     if (Number(product.count || 0) <= 0) {
//       toast.error("This item is currently out of stock!");
//       return;
//     }

//     if (!token) {
//       toast.error("Access terminal restricted. Redirecting to login sequence...", {
//         duration: 3000
//       });
//       setTimeout(() => navigate("/login"), 1500);
//       return;
//     }

//     const syncToastId = toast.loading("Syncing asset to user profile database...");

//     try {
//       const origPrice = Number(product.originalPrice || product.original_price || 0);
//       const offPrice = Number(product.offerPrice || product.offer_price || origPrice);

//       const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           product_id: product.id,
//           name: product.name,
//           category: product.category,
//           originalPrice: origPrice,
//           offerPrice: offPrice,
//           price: offPrice,
//           image: product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
//         })
//       });

//       if (response.ok) {
//         toast.success(`${product.name} added to the cart!`, { id: syncToastId });
//       } else {
//         const errData = await response.json();
//         toast.error(`Sync rejected: ${errData.message || 'Data baseline mismatch'}`, { id: syncToastId });
//       }
//     } catch (err) {
//       console.error("Cart synchronization error pipeline:", err);
//       toast.error("Critical connection failure. Drop packet loss detected.", { id: syncToastId });
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">

//         {/* Ambient Cyber Light Matrix Grids */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:50px_50px]" />
//         <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-lime-accent/5 rounded-full blur-[130px] pointer-events-none" />
//         <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative z-10 mt-6">

//           {/* HEADER HERO BANNER TRACK */}
//           <div className="space-y-4 mb-16 text-left border-b border-white/5 pb-8">
//             <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
//               <Sparkles className="w-3 h-3 text-lime-accent" /> Premium Collection
//             </div>
//             <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider">
//               {categoryName.replace('-', ' ')} <span className="text-lime-accent font-light">Registry</span>
//             </h1>
//             <p className="text-xs md:text-sm text-white/40 font-medium tracking-wide max-w-xl leading-relaxed">
//               Explore specialized modular designs and high-performance items tuned specifically for the {categoryName.replace('-', ' ')} collection.
//             </p>
//           </div>

//           {/* DYNAMIC PIPELINE CONTROL LAYER */}
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

//             {/* LEFT FILTER BAR MODULE SHEETS */}
//             <div className="lg:col-span-3 space-y-8 bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md sticky top-28 text-left">
//               <div className="flex items-center justify-between border-b border-white/5 pb-4">
//                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
//                   <SlidersHorizontal className="w-4 h-4 text-lime-accent" /> Filters
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSearchQuery('');
//                     setSortBy('featured');
//                     if (products.length > 0) {
//                       const peakPrice = Math.max(...products.map(p => Number(p.offerPrice || p.offer_price || p.originalPrice || p.original_price || 0)))
//                       setMaxPrice(peakPrice);
//                     }
//                   }}
//                   className="text-[10px] font-bold text-white/40 hover:text-lime-accent transition-colors uppercase tracking-wider cursor-pointer"
//                 >
//                   Clear Adjustments
//                 </button>
//               </div>

//               {/* SEARCH ENGINE COMPONENT */}
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Search Profile</label>
//                 <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-lime-accent transition-colors group">
//                   <Search className="w-4 h-4 text-white/30 group-focus-within:text-lime-accent transition-colors" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search apparel..."
//                     className="bg-transparent text-xs pl-2.5 outline-none w-full text-white placeholder-white/20 font-medium"
//                   />
//                 </div>
//               </div>

//               {/* PRICE INDEX SLIDER CONTROLLER */}
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
//                   <span>Price Filter</span>
//                   <span className="text-lime-accent font-mono text-xs font-black">₹{maxPrice}</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="50000"
//                   step="100"
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(Number(e.target.value))}
//                   className="w-full accent-lime-accent bg-white/10 h-1 rounded-lg cursor-pointer"
//                 />
//                 <div className="flex justify-between text-[9px] font-mono text-white/30">
//                   <span>₹0</span>
//                   <span>₹50,000</span>
//                 </div>
//               </div>

//               {/* SORT MATRIX INDEX */}
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Sort Order</label>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white/70 outline-none focus:border-lime-accent cursor-pointer font-bold transition-colors"
//                 >
//                   <option value="featured">Latest Drops</option>
//                   <option value="low-to-high">Price: Low to High</option>
//                   <option value="high-to-low">Price: High to Low</option>
//                 </select>
//               </div>
//             </div>

//             {/* RIGHT PRODUCT GRID CONTAINER LAYOUT */}
//             <div className="lg:col-span-9 space-y-6">

//               <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-white/40 px-2">
//                 <span>{categoryName.replace('-', ' ')} Catalog</span>
//                 <span>[{isLoading ? '...' : filteredProducts.length}] Items Showing</span>
//               </div>

//               {isLoading ? (
//                 /* LOADING SKELETON GRID */
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
//                   {Array.from({ length: 6 }).map((_, index) => (
//                     <div
//                       key={index}
//                       className="w-full h-[460px] bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-4 flex flex-col justify-between backdrop-blur-md animate-pulse"
//                     >
//                       {/* Image Placeholder */}
//                       <div className="w-full h-56 rounded-[2rem] bg-white/5 border border-white/5" />

//                       {/* Content Placeholder */}
//                       <div className="p-3 pt-3 flex flex-col justify-between flex-1 space-y-4">
//                         <div className="space-y-3">
//                           <div className="h-5 bg-white/10 rounded-md w-3/4" />
//                           <div className="flex gap-2">
//                             <div className="h-4 bg-white/5 rounded-full w-16" />
//                             <div className="h-4 bg-white/5 rounded-full w-12" />
//                           </div>
//                         </div>

//                         {/* Bottom Bar Placeholder */}
//                         <div className="pt-3 flex items-center justify-between border-t border-white/5">
//                           <div className="space-y-1">
//                             <div className="h-6 bg-white/10 rounded-md w-16" />
//                             <div className="h-2 bg-white/5 rounded-md w-12" />
//                           </div>
//                           <div className="h-9 bg-white/10 rounded-full w-28" />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-20 text-center space-y-4 backdrop-blur-md">
//                   <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/20">
//                     <Sliders className="w-5 h-5" />
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-black uppercase tracking-widest text-white">No Assets Matching</h3>
//                     <p className="text-xs text-white/40 max-w-xs mx-auto leading-relaxed">
//                       No items match within this sector layer parameters profile layout.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
//                   {filteredProducts.map((product) => {
//                     const rawOriginal = product.originalPrice ?? product.original_price;
//                     const rawOffer = product.offerPrice ?? product.offer_price;

//                     const original = Number(rawOriginal || 0);
//                     const offer = Number(rawOffer || original);

//                     const showOriginalPrice = original > 0 && original !== offer;
//                     const savings = original > offer ? original - offer : 0;
//                     const isOutOfStock = Number(product.count || 0) <= 0;

//                     return (
//                       <div
//                         key={product.id}
//                         className="relative group transition-all duration-300 h-[460px]"
//                         style={{ perspective: '1000px' }}
//                       >
//                         <div
//                           onMouseMove={handleMouseMove}
//                           onMouseLeave={handleMouseLeave}
//                           className="w-full h-full bg-white/[0.04] border border-white/10 hover:border-lime-accent/40 rounded-[2.5rem] p-4 flex flex-col justify-between transition-all duration-150 ease-out shadow-2xl backdrop-blur-md relative overflow-hidden"
//                           style={{ transformStyle: 'preserve-3d' }}
//                         >
//                           {/* Image Container */}
//                           <div
//                             className="w-full h-56 rounded-[2rem] overflow-hidden relative bg-black/40 flex items-center justify-center cursor-pointer group/img shrink-0"
//                             style={{ transform: 'translateZ(30px)' }}
//                             onClick={() => navigate(`/product/${product.id}`)}
//                           >
//                             <img
//                               src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
//                               alt={product.name}
//                               className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'opacity-40 grayscale' : 'group-hover/img:scale-105'
//                                 }`}
//                             />

//                             {/* Stock Badge & Share Button */}
//                             <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
//                               <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border backdrop-blur-md ${isOutOfStock
//                                   ? 'bg-red-500/20 text-red-400 border-red-500/30'
//                                   : 'bg-black/40 text-emerald-400 border-emerald-500/30'
//                                 }`}>
//                                 {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
//                               </span>

//                               {/* SHARE BUTTON REPLACING HEART ICON */}
//                               <button
//                                 aria-label="Share Product"
//                                 onClick={(e) => handleShareProduct(e, product)}
//                                 className="pointer-events-auto p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/80 hover:text-lime-accent hover:border-lime-accent/40 hover:bg-black/60 transition-all cursor-pointer"
//                               >
//                                 <Share2 className="w-4 h-4" />
//                               </button>
//                             </div>

//                             {/* Inspect Overlay */}
//                             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
//                               <span className="bg-lime-accent text-royal-dark px-4 py-2 rounded-full font-black text-xs uppercase flex items-center gap-1.5 shadow-lg tracking-wider">
//                                 <Eye className="w-4 h-4" /> View Details
//                               </span>
//                             </div>
//                           </div>

//                           {/* Fixed Content Section */}
//                           <div className="p-3 pt-3 flex flex-col justify-between flex-1 z-10 text-left" style={{ transform: 'translateZ(20px)' }}>

//                             <div className="space-y-2">
//                               {/* Product Name Slot */}
//                               <h3 className="text-lg font-bold text-white group-hover:text-lime-accent transition-colors truncate h-7 leading-7">
//                                 {product.name}
//                               </h3>

//                               {/* Pill Tags Row Slot */}
//                               <div className="flex flex-wrap items-center gap-2 overflow-hidden h-7">
//                                 <span className="text-[10px] font-medium bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-white/70">
//                                   {product.category}
//                                 </span>

//                                 <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/80">
//                                   <Star className="w-3 h-3 text-lime-accent fill-lime-accent" />
//                                   <span>4.8</span>
//                                 </div>

//                                 {savings > 0 && (
//                                   <span className="text-[10px] font-bold bg-lime-accent/10 border border-lime-accent/20 px-2.5 py-0.5 rounded-full text-lime-accent">
//                                     Save ₹{savings}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>

//                             {/* Bottom Bar (Pinned To Bottom) */}
//                             <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/5 mt-auto" style={{ transform: 'translateZ(25px)' }}>

//                               {/* Price Block */}
//                               <div className="flex flex-col">
//                                 <div className="flex items-baseline gap-1.5">
//                                   <span className="text-xl font-black text-lime-accent">
//                                     ₹{offer}
//                                   </span>

//                                   {showOriginalPrice && (
//                                     <span className="text-xs line-through text-white/40 font-semibold decoration-red-400 decoration-2">
//                                       ₹{original}
//                                     </span>
//                                   )}
//                                 </div>
//                                 <span className="text-[9px] text-white/40 font-medium">Incl. all taxes</span>
//                               </div>

//                               {/* Add to Cart Button */}
//                               <button
//                                 disabled={isOutOfStock}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   const token = localStorage.getItem("token");
//                                   handleAddToCart(product, token, navigate);
//                                 }}
//                                 className={`px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 shadow-lg shrink-0 ${isOutOfStock
//                                     ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
//                                     : 'bg-lime-accent text-royal-dark hover:bg-lime-accent/90 hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(165,206,0,0.3)]'
//                                   }`}
//                               >
//                                 <ShoppingBag className="w-3.5 h-3.5" />
//                                 <span>{isOutOfStock ? '' : ''}</span>
//                               </button>

//                             </div>

//                           </div>

//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}

//             </div>

//           </div>

//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default CategoryViewPage

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Check, Sliders, ChevronRight, X, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const CategoryViewPage = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  // Live Server State
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [addingIds, setAddingIds] = useState([])

  // Mobile Filter Drawer Toggle State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Filter Engine Controls
  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(15000)
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(15000)
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    const fetchCategoryInventory = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(API_BASE_URL)
        if (response.ok) {
          const data = await response.json()

          const categoryFiltered = data.filter(
            (product) => product.category && product.category.toLowerCase() === categoryName?.toLowerCase()
          )
          setProducts(categoryFiltered)

          if (categoryFiltered.length > 0) {
            const peakPrice = Math.max(...categoryFiltered.map(p => Number(p.offerPrice || p.offer_price || p.originalPrice || p.original_price || 0)))
            const topBoundary = peakPrice > 0 ? peakPrice : 15000
            setMaxAvailablePrice(topBoundary)
            setMaxPrice(topBoundary)
          }
        }
      } catch (err) {
        console.error("Failed synchronization pipeline connection to API endpoints:", err)
        toast.error("Failed to load category inventory.")
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryName) {
      fetchCategoryInventory()
    }
  }, [categoryName])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSortBy('featured')
    setMaxPrice(maxAvailablePrice)
    setIsMobileFilterOpen(false)
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const activePrice = Number(product.offerPrice || product.offer_price || product.originalPrice || product.original_price || 0)

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesPrice = activePrice <= maxPrice

      return matchesSearch && matchesPrice
    }).sort((a, b) => {
      const priceA = Number(a.offerPrice || a.offer_price || a.originalPrice || a.original_price || 0)
      const priceB = Number(b.offerPrice || b.offer_price || b.originalPrice || b.original_price || 0)

      if (sortBy === 'low-to-high') return priceA - priceB
      if (sortBy === 'high-to-low') return priceB - priceA
      return b.id - a.id
    })
  }, [products, searchQuery, maxPrice, sortBy])

  const handleAddToCart = async (e, product) => {
    e.stopPropagation()
    const token = localStorage.getItem("token")

    if (Number(product.count || 0) <= 0) {
      toast.error("Out of stock!")
      return
    }

    if (!token) {
      toast.error("Please login to add items to cart!")
      setTimeout(() => navigate("/login"), 1000)
      return
    }

    setAddingIds(prev => [...prev, product.id])

    try {
      const origPrice = Number(product.originalPrice || product.original_price || 0)
      const offPrice = Number(product.offerPrice || product.offer_price || origPrice)

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
      })

      if (response.ok) {
        toast.success(`${product.name} added to cart!`)
      } else {
        const errData = await response.json()
        toast.error(errData.message || 'Failed adding product to cart')
      }
    } catch (err) {
      console.error("Cart error:", err)
      toast.error("Network error. Could not add item.")
    } finally {
      setAddingIds(prev => prev.filter(id => id !== product.id))
    }
  }

  const activeFiltersCount = (maxPrice < maxAvailablePrice ? 1 : 0) + (searchQuery.trim() !== '' ? 1 : 0)

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">

          {/* PAGE TITLE BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-1">
                <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Home</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-800 capitalize">{categoryName ? categoryName.replace('-', ' ') : 'Category'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 capitalize tracking-tight">
                {categoryName ? categoryName.replace('-', ' ') : 'Category'}
              </h1>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3">
              <span className="text-xs font-bold text-gray-500">
                Showing <span className="text-gray-900 font-extrabold">{filteredProducts.length}</span> items
              </span>

              {/* MOBILE FILTER TRIGGER BUTTON */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-200 shadow-xs px-3 py-2 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#A5CE00]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#A5CE00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* MAIN GRID LAYOUT WITH SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">

            {/* DESKTOP FILTER SIDEBAR */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-xs sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900">
                  <SlidersHorizontal className="w-4 h-4 text-[#A5CE00]" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* SEARCH ENGINE */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Search</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-gray-400 transition-colors">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in this category..."
                    className="bg-transparent text-xs pl-2 outline-none w-full text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
              </div>

              {/* PRICE SLIDER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <span>Max Price</span>
                  <span className="text-gray-900 font-mono text-xs font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxAvailablePrice > 0 ? maxAvailablePrice : 15000}
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full bg-gray-200 h-1.5 rounded-lg cursor-pointer"
                  style={{ accentColor: '#A5CE00' }}
                />
              </div>

              {/* SORT SELECTOR */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 outline-none focus:border-gray-400 cursor-pointer font-bold transition-colors"
                >
                  <option value="featured">Featured / Latest</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </aside>

            {/* MOBILE FILTER MODAL DRAWER */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white animate-fadeIn overflow-y-auto p-4 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-gray-900">
                    <SlidersHorizontal className="w-4 h-4 text-[#A5CE00]" />
                    <span>Filter Category</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 bg-gray-100 rounded-lg text-gray-500 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* SEARCH */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Search</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search in this category..."
                      className="bg-transparent text-xs pl-2 outline-none w-full font-medium"
                    />
                  </div>
                </div>

                {/* PRICE */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                    <span>Max Price Threshold</span>
                    <span className="text-gray-900 font-bold text-xs">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxAvailablePrice > 0 ? maxAvailablePrice : 15000}
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    style={{ accentColor: '#A5CE00' }}
                  />
                </div>

                {/* SORT */}
                <div className="space-y-1.5 border-t border-gray-100 pt-4">
                  <label className="text-[10px] font-black uppercase text-gray-400">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="featured">Featured / Latest</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-4 flex gap-3 mt-auto">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-3 text-white font-bold text-xs rounded-xl shadow-md"
                    style={{ backgroundColor: '#A5CE00' }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCT GRID CONTAINER */}
            <div className="lg:col-span-9">
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="h-72 bg-white rounded-2xl border border-gray-100 p-3 animate-pulse space-y-3">
                      <div className="w-full aspect-square bg-gray-100 rounded-xl" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-10 sm:p-16 text-center space-y-3 shadow-xs">
                  <Sliders className="w-8 h-8 text-gray-300 mx-auto" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">No items found</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium">
                    Try clearing or adjusting your search filters.
                  </p>
                  <button 
                    onClick={handleResetFilters} 
                    className="text-xs text-white bg-gray-900 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((product) => {
                    const rawOriginal = product.originalPrice ?? product.original_price
                    const rawOffer = product.offerPrice ?? product.offer_price

                    const original = Number(rawOriginal || 0)
                    const offer = Number(rawOffer || original)
                    const savings = original > offer ? original - offer : 0
                    const isOutOfStock = Number(product.count || 0) <= 0
                    const isAdding = addingIds.includes(product.id)

                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-white rounded-2xl border border-gray-100 p-2.5 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer group/card relative"
                      >
                        {/* PRODUCT IMAGE CONTAINER */}
                        <div className="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                          
                          {/* BESTSELLER TAG */}
                          {product.isFeatured && (
                            <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md shadow-xs z-10">
                              Bestseller
                            </span>
                          )}

                          <img
                            src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                            alt={product.name}
                            className={`w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300 ${
                              isOutOfStock ? 'opacity-40 grayscale' : ''
                            }`}
                          />

                          {/* ADD BUTTON */}
                          <button
                            disabled={isOutOfStock || isAdding}
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`absolute bottom-2 right-2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                              isOutOfStock
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-rose-600 border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95'
                            }`}
                          >
                            {isAdding ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <span>ADD</span>
                            )}
                          </button>
                        </div>

                        {/* CONTENT BLOCK */}
                        <div className="pt-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                          
                          {/* PRICE & SAVINGS ROW */}
                          <div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span 
                                className="text-xs font-black text-white px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: '#A5CE00' }}
                              >
                                ₹{offer}
                              </span>
                              {original > offer && (
                                <span className="text-[11px] line-through text-gray-400 font-semibold">
                                  ₹{original}
                                </span>
                              )}
                            </div>

                            {savings > 0 && (
                              <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                                ₹{savings} OFF
                              </span>
                            )}
                          </div>

                          {/* PRODUCT TITLE */}
                          <h3 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight group-hover/card:text-black">
                            {product.name}
                          </h3>

                          {/* PACK SIZE / UNIT INFO */}
                          <p className="text-[10px] font-medium text-gray-400">
                            {product.unit || "1 pack"}
                          </p>

                          {/* RATING BADGE */}
                          <div className="flex items-center gap-1 pt-0.5">
                            <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                              <span>4.8</span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium">(2.4k)</span>
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

export default CategoryViewPage