// import React, { useState, useEffect, useRef } from 'react'
// import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import { ArrowLeft, ShoppingBag, Star, Cpu, MessageSquare, Calendar, User, Plus, Minus, Share2 } from 'lucide-react'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import { toast } from 'react-hot-toast'

// const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

// const ProductDetailView = () => {
//     const { id } = useParams()
//     const navigate = useNavigate()
//     const location = useLocation()
//     const imageContainerRef = useRef(null)

//     const fromCartItemId = location.state?.fromCartItemId || null
//     const existingSize = location.state?.existingSize || ''
//     const existingQty = location.state?.existingQty || 1

//     const [product, setProduct] = useState(null)
//     const [reviews, setReviews] = useState([]) 
//     const [averageRating, setAverageRating] = useState(0)
//     const [activeImg, setActiveImg] = useState('')
//     const [isLoading, setIsLoading] = useState(true)
    
//     // Selectable variations and quantities
//     const [selectedSize, setSelectedSize] = useState('')
//     const [selectedColor, setSelectedColor] = useState('')
//     const [quantity, setQuantity] = useState(1)

//     // Share functionality
//     const handleShare = async () => {
//         const shareData = {
//             title: product?.name || 'Product Details',
//             text: product?.description || 'Check out this product!',
//             url: window.location.href,
//         }

//         if (navigator.share) {
//             try {
//                 await navigator.share(shareData)
//             } catch (err) {
//                 if (err.name !== 'AbortError') {
//                     console.error('Error sharing content:', err)
//                 }
//             }
//         } else {
//             try {
//                 await navigator.clipboard.writeText(window.location.href)
//                 toast.success('Product link copied to clipboard!')
//             } catch (err) {
//                 toast.error('Failed to copy link.')
//             }
//         }
//     }

//     // --- ACCURATE SEPARATION LOGIC PATTERNS ---
//     const isColorOption = (str) => {
//         if (!str) return false
//         const lower = str.toLowerCase()
//         if (lower.startsWith('color:') || lower.includes('__imgidx:')) return true
//         const colorKeywords = ['blue', 'red', 'white', 'black', 'green', 'gold', 'silver', 'grey', 'yellow', 'pink']
//         return colorKeywords.some(color => lower.includes(color)) && !lower.includes('brand') && !lower.includes('battery')
//     }

//     const isSizeOption = (str) => {
//         if (!str) return false
//         if (isColorOption(str)) return false
//         if (str.includes(':')) return false 
        
//         const lower = str.toLowerCase().trim()
//         const standardSizes = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl']
//         if (standardSizes.includes(lower)) return true
//         if (lower.includes('ml') || lower.includes('litre') || lower.includes('kg') || lower.includes('g')) return true
//         if (/^(uk\s?\d+|\d+)$/.test(lower)) return true // Amazon/Flipkart footwear standard
//         return false
//     }

//     const isStaticSpecification = (str) => {
//         return !isColorOption(str) && !isSizeOption(str)
//     }

//     // Helper to get clean color string without structural tags
//     const getCleanColorName = (colorRawString) => {
//         if (!colorRawString) return '';
//         return colorRawString.split(/__imgidx:/i)[0].replace(/^color:\s*/i, '').toLowerCase().trim();
//     }

//     // Handles dynamic color image viewport switching interaction
//     const handleColorSelectionChange = (colorRawString, productImagesArray, currentProduct = null) => {
//         setSelectedColor(colorRawString)
//         const targetImages = productImagesArray || (product && product.images) || []
//         if (targetImages.length === 0) return

//         const lowerRaw = colorRawString.toLowerCase()

//         // 1. Check for embedded image index tags safely
//         if (lowerRaw.includes('__imgidx:')) {
//             const parts = lowerRaw.split('__imgidx:')
//             const indexPointer = parseInt(parts[1]) || 0
//             if (targetImages[indexPointer]) {
//                 setActiveImg(targetImages[indexPointer])
//                 return
//             }
//         }

//         // 2. Smart Fallback: Search image URLs for the color name keyword using boundary strictness
//         const cleanColor = getCleanColorName(colorRawString)
//         const strictBoundaryRegex = new RegExp(`(?:[\\/_\\.-]|^)${cleanColor}(?:[\\/_\\.-]|\\.|$)`, 'i')
//         const matchedImageByKeyword = targetImages.find(imgUrl => strictBoundaryRegex.test(imgUrl))
        
//         if (matchedImageByKeyword) {
//             setActiveImg(matchedImageByKeyword)
//             return
//         }

//         // 3. Sequential Fallback: Match color selection array order index
//         const activeProductInstance = currentProduct || product
//         const rawSizesArray = activeProductInstance?.sizes || []
//         const currentColorOptions = rawSizesArray.filter(sz => isColorOption(sz))
//         const colorIdx = currentColorOptions.indexOf(colorRawString)
        
//         if (colorIdx !== -1 && targetImages[colorIdx]) {
//             setActiveImg(targetImages[colorIdx])
//         }
//     }

//     useEffect(() => {
//         if (existingSize) {
//             setSelectedSize(existingSize)
//         }
//         if (existingQty) {
//             setQuantity(existingQty)
//         }
//     }, [existingSize, existingQty])

//     useEffect(() => {
//         const fetchProductAndReviews = async () => {
//             setIsLoading(true)
//             try {
//                 const prodResponse = await fetch(API_BASE_URL)
//                 if (prodResponse.ok) {
//                     const data = await prodResponse.json()
//                     const foundProduct = data.find(p => String(p.id) === String(id))
//                     if (foundProduct) {
//                         setProduct(foundProduct)
                        
//                         const defaultImage = foundProduct.images && foundProduct.images[0] 
//                             ? foundProduct.images[0] 
//                             : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
//                         setActiveImg(defaultImage)
                        
//                         if (foundProduct.sizes && foundProduct.sizes.length > 0) {
//                             const colors = foundProduct.sizes.filter(sz => isColorOption(sz))
//                             const sizes = foundProduct.sizes.filter(sz => isSizeOption(sz))

//                             if (!existingSize && sizes.length > 0) setSelectedSize(sizes[0])
//                             if (colors.length > 0) {
//                                 handleColorSelectionChange(colors[0], foundProduct.images, foundProduct)
//                             }
//                         }
//                     }
//                 }

//                 const revResponse = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/products/${id}/reviews`)
//                 if (revResponse.ok) {
//                     const revData = await revResponse.json()
//                     if (revData.success) {
//                         setReviews(revData.reviews)
//                         if (revData.reviews.length > 0) {
//                             const aggregateSum = revData.reviews.reduce((sum, item) => sum + item.rating, 0)
//                             setAverageRating((aggregateSum / revData.reviews.length).toFixed(1))
//                         } else {
//                             setAverageRating(5.0) 
//                         }
//                     }
//                 }
//             } catch (err) {
//                 console.error("Pipeline communication breakdown:", err)
//                 toast.error("Failed to sync structural asset records.")
//             } finally {
//                 setIsLoading(false)
//             }
//         }
//         fetchProductAndReviews()
//     }, [id, existingSize])

//     if (isLoading) {
//         return (
//             <div className="bg-royal-dark text-white min-h-screen flex items-center justify-center text-xs font-mono tracking-widest uppercase animate-pulse">
//                 Accessing live system node metrics...
//             </div>
//         )
//     }

//     if (!product) {
//         return (
//             <div className="bg-royal-dark text-white min-h-screen flex flex-col items-center justify-center space-y-4">
//                 <h2 className="text-xl font-black uppercase tracking-widest text-red-400">Asset Record Not Found</h2>
//                 <button onClick={() => navigate('/')} className="bg-white/10 px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-wider">
//                     Return to Terminal Home
//                 </button>
//             </div>
//         )
//     }

//     // --- FIXED MULTIPLIER LOGIC ---
//     const getPriceMultiplier = (sizeString) => {
//         if (!sizeString) return 1
//         const cleanStr = sizeString.toLowerCase().replace(/\s+/g, '')
        
//         // Weight/Volume presets
//         if (cleanStr.includes('1/2kg') || cleanStr.includes('0.5kg') || cleanStr.includes('500g') || cleanStr.includes('1/2litre') || cleanStr.includes('500ml')) return 0.5
//         if (cleanStr.includes('250g') || cleanStr.includes('250ml')) return 0.25
//         if (cleanStr.includes('100g') || cleanStr.includes('100ml')) return 0.1
//         if (cleanStr.includes('200g') || cleanStr.includes('200ml')) return 0.2
        
//         // Only scale pricing if an explicit weight or liquid metric is provided (e.g. 2kg, 1.5l)
//         const unitMatch = cleanStr.match(/^(\d+(\.\d+)?)(kg|l|litre|liter|g|gm|ml)$/)
//         if (unitMatch) return parseFloat(unitMatch[1])

//         // Apparel, footwear (UK 7, 7, 8, etc.), and standard sizes keep full base price
//         return 1
//     }

//     const baseOriginalPrice = Number(product.originalPrice || product.original_price || 0)
//     const baseOfferPrice = Number(product.offerPrice || product.offer_price || baseOriginalPrice)
//     const currentMultiplier = getPriceMultiplier(selectedSize)
    
//     const offer = Math.round(baseOfferPrice * currentMultiplier)
//     const original = Math.round(baseOriginalPrice * currentMultiplier)
//     const priceDifference = original - offer
//     const percentSaved = original > 0 ? Math.round((priceDifference / original) * 100) : 0

//     // --- DECLARATIONS ---
//     const sizeOptions = product.sizes ? product.sizes.filter(sz => isSizeOption(sz)) : []
//     const colorOptions = product.sizes ? product.sizes.filter(sz => isColorOption(sz)) : []
//     const specificationLabels = product.sizes ? product.sizes.filter(sz => isStaticSpecification(sz)) : []

//     const getFilteredThumbnails = () => {
//         const allImages = product.images && product.images.length > 0 ? product.images : [activeImg]
//         if (!selectedColor) return allImages

//         const cleanColor = getCleanColorName(selectedColor)
//         const strictBoundaryRegex = new RegExp(`(?:[\\/_\\.-]|^)${cleanColor}(?:[\\/_\\.-]|\\.|$)`, 'i')
        
//         const matchedThumbnails = allImages.filter(imgUrl => strictBoundaryRegex.test(imgUrl))
//         if (matchedThumbnails.length > 0) return matchedThumbnails

//         if (colorOptions.length > 0) {
//             const currentColorIdx = colorOptions.findIndex(clr => getCleanColorName(clr) === cleanColor)
            
//             if (currentColorIdx !== -1) {
//                 const imagesPerColor = Math.ceil(allImages.length / colorOptions.length)
//                 const startIdx = currentColorIdx * imagesPerColor
//                 const endIdx = Math.min(startIdx + imagesPerColor, allImages.length)
                
//                 const chunkedImages = allImages.slice(startIdx, endIdx)
//                 if (chunkedImages.length > 0) return chunkedImages
//             }
//         }
        
//         return allImages
//     }

//     const alternativeAngles = getFilteredThumbnails()

//     const handleMouseMove = (e) => {
//         const card = imageContainerRef.current
//         if (!card) return
//         const box = card.getBoundingClientRect()
//         const x = e.clientX - box.left - box.width / 2
//         const y = e.clientY - box.top - box.height / 2
//         card.style.transform = `perspective(1200px) rotateX(${-(y / box.height) * 12}deg) rotateY(${(x / box.width) * 12}deg) scale3d(1.01, 1.01, 1.01)`
//     }

//     const handleMouseLeave = () => {
//         if (imageContainerRef.current) imageContainerRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
//     }

//     const handleAddToCart = async (product, token, navigate) => {
//         const hasSizes = product.sizes && product.sizes.some(sz => isSizeOption(sz))
//         const hasColors = product.sizes && product.sizes.some(sz => isColorOption(sz))

//         if (hasSizes && !selectedSize) {
//             toast.error("Size/Volume selection choice is required.");
//             return;
//         }

//         if (hasColors && !selectedColor) {
//             toast.error("Color option variation configuration is required.");
//             return;
//         }

//         if (!token) {
//             toast.error("Authentication required. Redirecting...");
//             setTimeout(() => navigate("/login"), 1500);
//             return;
//         }

//         const loadId = toast.loading("Syncing asset loadout...");
        
//         const cleanSize = selectedSize
//         const cleanColor = getCleanColorName(selectedColor)
        
//         let finalOptionString = cleanSize
//         if (cleanColor) {
//             finalOptionString = finalOptionString ? `${cleanSize} (${cleanColor})` : cleanColor
//         }

//         try {
//             const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
//                 body: JSON.stringify({
//                     product_id: product.id,
//                     name: product.name,
//                     category: product.category,
//                     price: offer,
//                     image: activeImg,
//                     selected_size: finalOptionString || '', 
//                     fromCartItemId,
//                     isSizeUpdateOnly: !!fromCartItemId,
//                     existingQty: quantity
//                 })
//             });

//             if (response.ok) {
//                 toast.success("Cart asset layout successfully committed!", { id: loadId });
//                 if (fromCartItemId) setTimeout(() => navigate("/cart"), 1000);
//             } else {
//                 const errData = await response.json();
//                 toast.error(`Sync failure: ${errData.message}`, { id: loadId });
//             }
//         } catch (err) {
//             toast.error("Network synchronization error.", { id: loadId });
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
//                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
                
//                 <div className="max-w-7xl mx-auto relative z-10">
//                     <div className="flex justify-between items-center mb-8 mt-5">
//                         <button onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 text-white/50 hover:text-lime-accent text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-xl transition-all">
//                             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" /> BACK
//                         </button>

//                         <button onClick={handleShare} className="group inline-flex items-center gap-2 text-white/50 hover:text-lime-accent text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-xl transition-all">
//                             <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> SHARE
//                         </button>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
//                         {/* LEFT COLUMN: IMAGES */}
//                         <div className="lg:col-span-7 space-y-6">
//                             <div 
//                                 ref={imageContainerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
//                                 className="w-full h-[450px] md:h-[580px] rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/5 to-black/40 relative shadow-2xl cursor-crosshair transition-transform duration-200"
//                             >
//                                 <img src={activeImg} alt={product.name} className="w-full h-full object-cover filter contrast-110" />
//                                 <div className="absolute top-4 left-4 text-[9px] font-black tracking-widest uppercase bg-royal-dark/80 px-3 py-1.5 rounded-lg border border-white/10 text-lime-accent">
//                                     <Cpu className="w-3 h-3 text-lime-accent animate-pulse inline mr-1" /> {product.isFeatured ? 'Spotlight Drop' : 'Standard Node'}
//                                 </div>
//                             </div>

//                             {alternativeAngles.length > 1 && (
//                                 <div className="grid grid-cols-4 gap-4">
//                                     {alternativeAngles.map((imgUrl, idx) => (
//                                         <button key={idx} onClick={() => setActiveImg(imgUrl)} className={`h-20 md:h-24 rounded-xl overflow-hidden border bg-white/5 transition-all ${activeImg === imgUrl ? 'border-lime-accent scale-95' : 'border-white/10'}`}>
//                                           <img src={imgUrl} alt="Alternative Angle view" className="w-full h-full object-cover" />
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* RIGHT COLUMN: ACTIONS */}
//                         <div className="lg:col-span-5 space-y-8 text-left">
//                             <div className="space-y-3">
//                                 <span className="inline-block text-xs font-black text-lime-accent uppercase tracking-[0.25em] bg-lime-accent/10 px-3 py-1 rounded-md border border-lime-accent/20">{product.category}</span>
//                                 <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white leading-tight">{product.name}</h1>
                                
//                                 <div className="flex items-center gap-4 pt-1">
//                                     <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
//                                         <Star className="w-4 h-4 text-lime-accent fill-lime-accent" />
//                                         <span className="text-sm font-black text-white">{averageRating}</span>
//                                     </div>
//                                     <span className="text-xs text-white/40 font-medium tracking-wide border-l border-white/10 pl-4">
//                                         Reviews: <strong className="text-white/70">({reviews.length} total votes)</strong>
//                                     </span>
//                                 </div>
//                             </div>

//                             <hr className="border-white/5" />
//                             <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">{product.description || "High efficiency catalog asset."}</p>

//                             <div className="space-y-5">
//                                 {sizeOptions.length > 0 && (
//                                     <div className="space-y-3">
//                                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Variant Options Matrix</h4>
//                                         <div className="flex flex-wrap gap-2">
//                                             {sizeOptions.map((sz, idx) => (
//                                                 <button key={idx} type="button" onClick={() => setSelectedSize(sz)} className={`font-mono text-xs font-black px-4 py-2.5 rounded-xl border transition-all ${selectedSize === sz ? 'bg-lime-accent text-royal-dark border-lime-accent shadow-md' : 'bg-white/5 border-white/10 text-white/70'}`}>
//                                                     {sz}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {colorOptions.length > 0 && (
//                                     <div className="space-y-3">
//                                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Color Matrix</h4>
//                                         <div className="flex flex-wrap gap-2">
//                                             {colorOptions.map((clr, idx) => {
//                                                 const cleanColorDisplay = getCleanColorName(clr)
//                                                 return (
//                                                     <button key={idx} type="button" onClick={() => handleColorSelectionChange(clr, product.images)} className={`font-mono text-xs font-black px-4 py-2.5 rounded-xl border transition-all ${selectedColor === clr ? 'bg-lime-accent text-royal-dark border-lime-accent shadow-md' : 'bg-white/5 border-white/10 text-white/70'}`}>
//                                                         {cleanColorDisplay.toUpperCase()}
//                                                     </button>
//                                                 )
//                                             })}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="space-y-3">
//                                     <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Quantity</h4>
//                                     <div className="flex items-center gap-1 bg-white/5 border border-white/10 w-fit p-1 rounded-xl">
//                                         <button type="button" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
//                                             <Minus className="w-4 h-4" />
//                                         </button>
//                                         <span className="font-mono font-black text-sm text-center px-4 min-w-[40px]">{quantity}</span>
//                                         <button type="button" onClick={() => setQuantity(prev => prev + 1)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
//                                             <Plus className="w-4 h-4" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {specificationLabels.length > 0 && (
//                                     <div className="space-y-3 pt-2">
//                                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Product Specifications & Features</h4>
//                                         <div className="flex flex-wrap gap-2">
//                                             {specificationLabels.map((spec, idx) => (
//                                                 <span key={idx} className="bg-white/[0.02] border border-white/5 font-sans text-xs text-white/50 px-4 py-2.5 rounded-xl cursor-default select-none">
//                                                     {spec}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/10 p-6 rounded-2xl space-y-6">
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex flex-col">
//                                         <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">
//                                             Total Acquisition Value ({selectedSize || getCleanColorName(selectedColor) || 'Base'})
//                                         </span>
//                                         <div className="flex items-baseline gap-3 mt-1">
//                                             <span className="text-3xl md:text-4xl font-black text-white">₹{offer * quantity}</span>
//                                             {priceDifference > 0 && <span className="text-sm line-through text-white/30 font-bold">₹{original * quantity}</span>}
//                                         </div>
//                                     </div>
//                                     {percentSaved > 0 && <div className="bg-lime-accent text-royal-dark text-[10px] font-black px-3 py-1.5 rounded-lg">-{percentSaved}% Drop</div>}
//                                 </div>

//                                 <button disabled={product.count <= 0} onClick={() => handleAddToCart(product, localStorage.getItem("token"), navigate)} className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl transition-all ${product.count > 0 ? 'bg-white hover:bg-lime-accent text-royal-dark shadow-md' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
//                                     <ShoppingBag className="w-4 h-4" /> {product.count <= 0 ? 'Out of Stock' : fromCartItemId ? 'Update Custom Configuration' : 'Add to Cart'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* REVIEWS SECTION */}
//                     <div className="mt-20 border-t border-white/10 pt-12 text-left space-y-8">
//                         <div className="flex items-center gap-2">
//                             <MessageSquare className="w-5 h-5 text-lime-accent" />
//                             <h3 className="text-lg font-black uppercase tracking-wider text-white">Customer Reviews Matrix ({reviews.length})</h3>
//                         </div>

//                         {reviews.length === 0 ? (
//                             <div className="p-10 border border-dashed border-white/5 bg-white/[0.01] rounded-2xl text-center">
//                                 <p className="text-xs font-mono uppercase text-white/30">No customer reviews yet. Be the first user to submit a checkout overview review.</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {reviews.map((rev) => (
//                                     <div key={rev.id} className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
//                                         <div className="space-y-2">
//                                             <div className="flex items-center justify-between text-xs">
//                                                 <div className="flex items-center gap-2 text-white/80 font-bold">
//                                                     <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><User className="w-3 h-3 text-lime-accent" /></div>
//                                                     <span>{rev.user_name}</span>
//                                                 </div>
//                                                 <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
//                                                     <Calendar className="w-3 h-3" /> {new Date(rev.created_at).toLocaleDateString('en-IN')}
//                                                 </span>
//                                             </div>

//                                             <div className="flex gap-0.5">
//                                                 {[1, 2, 3, 4, 5].map((starIdx) => (
//                                                     <Star key={starIdx} className={`w-3.5 h-3.5 ${starIdx <= rev.rating ? 'text-lime-accent fill-lime-accent' : 'text-white/10'}`} />
//                                                 ))}
//                                             </div>

//                                             <p className="text-xs font-normal text-white/70 leading-relaxed tracking-wide font-sans">{rev.comment}</p>
//                                         </div>

//                                         {rev.images && rev.images.length > 0 && (
//                                             <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.03]">
//                                                 {rev.images.map((imgUrl, i) => (
//                                                     <a key={i} href={imgUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black hover:scale-105 transition-transform">
//                                                         <img src={imgUrl} alt="Customer feedback attach asset" className="w-full h-full object-cover" />
//                                                     </a>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                 </div>
//             </div>
//             <Footer />
//         </>
//     )
// }

// export default ProductDetailView;


import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Star, MessageSquare, Calendar, User, Plus, Minus, Share2, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const ProductDetailView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const fromCartItemId = location.state?.fromCartItemId || null
    const existingSize = location.state?.existingSize || ''
    const existingQty = location.state?.existingQty || 1

    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([]) 
    const [averageRating, setAverageRating] = useState(0)
    const [activeImg, setActiveImg] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    
    // Selectable variations and quantities
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)

    // Share functionality
    const handleShare = async () => {
        const shareData = {
            title: product?.name || 'Product Details',
            text: product?.description || 'Check out this product on AVG MART!',
            url: window.location.href,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing content:', err)
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Product link copied to clipboard!')
            } catch (err) {
                toast.error('Failed to copy link.')
            }
        }
    }

    // --- ACCURATE SEPARATION LOGIC PATTERNS ---
    const isColorOption = (str) => {
        if (!str) return false
        const lower = str.toLowerCase()
        if (lower.startsWith('color:') || lower.includes('__imgidx:')) return true
        const colorKeywords = ['blue', 'red', 'white', 'black', 'green', 'gold', 'silver', 'grey', 'yellow', 'pink']
        return colorKeywords.some(color => lower.includes(color)) && !lower.includes('brand') && !lower.includes('battery')
    }

    const isSizeOption = (str) => {
        if (!str) return false
        if (isColorOption(str)) return false
        if (str.includes(':')) return false 
        
        const lower = str.toLowerCase().trim()
        const standardSizes = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl']
        if (standardSizes.includes(lower)) return true
        if (lower.includes('ml') || lower.includes('litre') || lower.includes('kg') || lower.includes('g')) return true
        if (/^(uk\s?\d+|\d+)$/.test(lower)) return true
        return false
    }

    const isStaticSpecification = (str) => {
        return !isColorOption(str) && !isSizeOption(str)
    }

    // Helper to get clean color string without structural tags
    const getCleanColorName = (colorRawString) => {
        if (!colorRawString) return '';
        return colorRawString.split(/__imgidx:/i)[0].replace(/^color:\s*/i, '').toLowerCase().trim();
    }

    // Handles color change and thumbnail updating
    const handleColorSelectionChange = (colorRawString, productImagesArray, currentProduct = null) => {
        setSelectedColor(colorRawString)
        const targetImages = productImagesArray || (product && product.images) || []
        if (targetImages.length === 0) return

        const lowerRaw = colorRawString.toLowerCase()

        if (lowerRaw.includes('__imgidx:')) {
            const parts = lowerRaw.split('__imgidx:')
            const indexPointer = parseInt(parts[1]) || 0
            if (targetImages[indexPointer]) {
                setActiveImg(targetImages[indexPointer])
                return
            }
        }

        const cleanColor = getCleanColorName(colorRawString)
        const strictBoundaryRegex = new RegExp(`(?:[\\/_\\.-]|^)${cleanColor}(?:[\\/_\\.-]|\\.|$)`, 'i')
        const matchedImageByKeyword = targetImages.find(imgUrl => strictBoundaryRegex.test(imgUrl))
        
        if (matchedImageByKeyword) {
            setActiveImg(matchedImageByKeyword)
            return
        }

        const activeProductInstance = currentProduct || product
        const rawSizesArray = activeProductInstance?.sizes || []
        const currentColorOptions = rawSizesArray.filter(sz => isColorOption(sz))
        const colorIdx = currentColorOptions.indexOf(colorRawString)
        
        if (colorIdx !== -1 && targetImages[colorIdx]) {
            setActiveImg(targetImages[colorIdx])
        }
    }

    useEffect(() => {
        if (existingSize) {
            setSelectedSize(existingSize)
        }
        if (existingQty) {
            setQuantity(existingQty)
        }
    }, [existingSize, existingQty])

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            setIsLoading(true)
            try {
                const prodResponse = await fetch(API_BASE_URL)
                if (prodResponse.ok) {
                    const data = await prodResponse.json()
                    const foundProduct = data.find(p => String(p.id) === String(id))
                    if (foundProduct) {
                        setProduct(foundProduct)
                        
                        const defaultImage = foundProduct.images && foundProduct.images[0] 
                            ? foundProduct.images[0] 
                            : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                        setActiveImg(defaultImage)
                        
                        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
                            const colors = foundProduct.sizes.filter(sz => isColorOption(sz))
                            const sizes = foundProduct.sizes.filter(sz => isSizeOption(sz))

                            if (!existingSize && sizes.length > 0) setSelectedSize(sizes[0])
                            if (colors.length > 0) {
                                handleColorSelectionChange(colors[0], foundProduct.images, foundProduct)
                            }
                        }
                    }
                }

                const revResponse = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/products/${id}/reviews`)
                if (revResponse.ok) {
                    const revData = await revResponse.json()
                    if (revData.success) {
                        setReviews(revData.reviews)
                        if (revData.reviews.length > 0) {
                            const aggregateSum = revData.reviews.reduce((sum, item) => sum + item.rating, 0)
                            setAverageRating((aggregateSum / revData.reviews.length).toFixed(1))
                        } else {
                            setAverageRating(4.8) 
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching product details:", err)
                toast.error("Failed to load product details.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProductAndReviews()
    }, [id, existingSize])

    if (isLoading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center text-xs font-bold uppercase tracking-wider text-gray-500 animate-pulse">
                Loading product details...
            </div>
        )
    }

    if (!product) {
        return (
            <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center">
                <h2 className="text-xl font-bold uppercase tracking-wider text-red-500">Product Not Found</h2>
                <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-black transition-colors">
                    Return to Home
                </button>
            </div>
        )
    }

    const getPriceMultiplier = (sizeString) => {
        if (!sizeString) return 1
        const cleanStr = sizeString.toLowerCase().replace(/\s+/g, '')
        
        if (cleanStr.includes('1/2kg') || cleanStr.includes('0.5kg') || cleanStr.includes('500g') || cleanStr.includes('1/2litre') || cleanStr.includes('500ml')) return 0.5
        if (cleanStr.includes('250g') || cleanStr.includes('250ml')) return 0.25
        if (cleanStr.includes('100g') || cleanStr.includes('100ml')) return 0.1
        if (cleanStr.includes('200g') || cleanStr.includes('200ml')) return 0.2
        
        const unitMatch = cleanStr.match(/^(\d+(\.\d+)?)(kg|l|litre|liter|g|gm|ml)$/)
        if (unitMatch) return parseFloat(unitMatch[1])

        return 1
    }

    const baseOriginalPrice = Number(product.originalPrice || product.original_price || 0)
    const baseOfferPrice = Number(product.offerPrice || product.offer_price || baseOriginalPrice)
    const currentMultiplier = getPriceMultiplier(selectedSize)
    
    const offer = Math.round(baseOfferPrice * currentMultiplier)
    const original = Math.round(baseOriginalPrice * currentMultiplier)
    const priceDifference = original - offer
    const percentSaved = original > 0 ? Math.round((priceDifference / original) * 100) : 0

    const sizeOptions = product.sizes ? product.sizes.filter(sz => isSizeOption(sz)) : []
    const colorOptions = product.sizes ? product.sizes.filter(sz => isColorOption(sz)) : []
    const specificationLabels = product.sizes ? product.sizes.filter(sz => isStaticSpecification(sz)) : []

    const getFilteredThumbnails = () => {
        const allImages = product.images && product.images.length > 0 ? product.images : [activeImg]
        if (!selectedColor) return allImages

        const cleanColor = getCleanColorName(selectedColor)
        const strictBoundaryRegex = new RegExp(`(?:[\\/_\\.-]|^)${cleanColor}(?:[\\/_\\.-]|\\.|$)`, 'i')
        
        const matchedThumbnails = allImages.filter(imgUrl => strictBoundaryRegex.test(imgUrl))
        if (matchedThumbnails.length > 0) return matchedThumbnails

        if (colorOptions.length > 0) {
            const currentColorIdx = colorOptions.findIndex(clr => getCleanColorName(clr) === cleanColor)
            
            if (currentColorIdx !== -1) {
                const imagesPerColor = Math.ceil(allImages.length / colorOptions.length)
                const startIdx = currentColorIdx * imagesPerColor
                const endIdx = Math.min(startIdx + imagesPerColor, allImages.length)
                
                const chunkedImages = allImages.slice(startIdx, endIdx)
                if (chunkedImages.length > 0) return chunkedImages
            }
        }
        
        return allImages
    }

    const alternativeAngles = getFilteredThumbnails()

    const handleAddToCart = async (product, token, navigate) => {
        const hasSizes = product.sizes && product.sizes.some(sz => isSizeOption(sz))
        const hasColors = product.sizes && product.sizes.some(sz => isColorOption(sz))

        if (hasSizes && !selectedSize) {
            toast.error("Size selection is required.");
            return;
        }

        if (hasColors && !selectedColor) {
            toast.error("Color option is required.");
            return;
        }

        if (!token) {
            toast.error("Please login to add items to cart!");
            setTimeout(() => navigate("/login"), 1000);
            return;
        }

        const cleanSize = selectedSize
        const cleanColor = getCleanColorName(selectedColor)
        
        let finalOptionString = cleanSize
        if (cleanColor) {
            finalOptionString = finalOptionString ? `${cleanSize} (${cleanColor})` : cleanColor
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    product_id: product.id,
                    name: product.name,
                    category: product.category,
                    price: offer,
                    image: activeImg,
                    selected_size: finalOptionString || '', 
                    fromCartItemId,
                    isSizeUpdateOnly: !!fromCartItemId,
                    existingQty: quantity
                })
            });

            if (response.ok) {
                toast.success(`${product.name} added to cart!`);
                if (fromCartItemId) setTimeout(() => navigate("/cart"), 1000);
            } else {
                const errData = await response.json();
                toast.error(errData.message || 'Failed adding product');
            }
        } catch (err) {
            toast.error("Network error. Could not sync cart.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 text-gray-900 min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
                    
                    {/* RESPONSIVE BREADCRUMB & TOP CONTROLS */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 sm:pb-4">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                            <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer shrink-0">Home</span>
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            <span onClick={() => navigate(`/products/${product.category?.toLowerCase()}`)} className="hover:text-black cursor-pointer capitalize shrink-0 max-w-[100px] sm:max-w-none truncate">
                                {product.category}
                            </span>
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            <span className="text-gray-800 truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
                        </div>

                        <div className="flex items-center justify-end gap-2 self-end sm:self-auto shrink-0">
                            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
                                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                                <span className="hidden xs:inline">Back</span>
                            </button>
                            <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
                                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                                <span className="hidden xs:inline">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* MAIN PRODUCT DETAIL GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        
                        {/* LEFT COLUMN: IMAGES */}
                        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                            <div className="w-full aspect-square max-h-[380px] sm:max-h-none rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 relative overflow-hidden shadow-sm flex items-center justify-center">
                                <img src={activeImg} alt={product.name} className="w-full h-full object-contain" />
                                
                                {product.isFeatured && (
                                    <div className="absolute top-3 left-3 text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md shadow-sm">
                                        Bestseller
                                    </div>
                                )}
                            </div>

                            {alternativeAngles.length > 1 && (
                                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {alternativeAngles.map((imgUrl, idx) => (
                                        <button key={idx} onClick={() => setActiveImg(imgUrl)} className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl border bg-white p-1 transition-all cursor-pointer ${activeImg === imgUrl ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <img src={imgUrl} alt="Product angle" className="w-full h-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: PRODUCT INFO & PURCHASE CARD */}
                        <div className="lg:col-span-6 space-y-5 sm:space-y-6 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                            <div className="space-y-1.5 sm:space-y-2 border-b border-gray-100 pb-3 sm:pb-4">
                                <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">{product.category}</span>
                                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-snug">{product.name}</h1>
                                
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-700">
                                        <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                                        <span>{averageRating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        ({reviews.length} ratings)
                                    </span>
                                </div>
                            </div>

                            {/* PRICE & SAVINGS */}
                            <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                                <span className="text-xl sm:text-2xl font-black text-white px-2.5 py-0.5 rounded" style={{ backgroundColor: '#A5CE00' }}>
                                    ₹{offer * quantity}
                                </span>
                                {priceDifference > 0 && (
                                    <span className="text-xs sm:text-sm line-through text-gray-400 font-bold">
                                        ₹{original * quantity}
                                    </span>
                                )}
                                {percentSaved > 0 && (
                                    <span className="text-[11px] sm:text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        {percentSaved}% OFF
                                    </span>
                                )}
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-xs sm:text-xs text-gray-600 leading-relaxed font-medium">
                                {product.description || "High quality item delivered right to your location."}
                            </p>

                            {/* VARIANTS AND OPTIONS */}
                            <div className="space-y-4 border-t border-gray-100 pt-4">
                                {sizeOptions.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Select Size / Pack</label>
                                        <div className="flex flex-wrap gap-2">
                                            {sizeOptions.map((sz, idx) => (
                                                <button key={idx} type="button" onClick={() => setSelectedSize(sz)} className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${selectedSize === sz ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                                                    {sz}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {colorOptions.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Select Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {colorOptions.map((clr, idx) => {
                                                const cleanColorDisplay = getCleanColorName(clr)
                                                return (
                                                    <button key={idx} type="button" onClick={() => handleColorSelectionChange(clr, product.images)} className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${selectedColor === clr ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                                                        {cleanColorDisplay.toUpperCase()}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* QUANTITY SELECTOR */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Quantity</label>
                                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 w-fit p-1 rounded-xl">
                                        <button type="button" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors cursor-pointer">
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="font-bold text-xs px-3 min-w-[32px] text-center">{quantity}</span>
                                        <button type="button" onClick={() => setQuantity(prev => prev + 1)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors cursor-pointer">
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {specificationLabels.length > 0 && (
                                    <div className="space-y-2 pt-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Key Features</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {specificationLabels.map((spec, idx) => (
                                                <span key={idx} className="bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-600 px-3 py-1 rounded-lg">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ADD TO CART ACTION BUTTON */}
                            <div className="border-t border-gray-100 pt-4">
                                <button disabled={product.count <= 0} onClick={() => handleAddToCart(product, localStorage.getItem("token"), navigate)} className={`w-full py-3.5 px-6 font-extrabold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${product.count > 0 ? 'bg-[#A5CE00] hover:bg-[#8DA800] text-white active:scale-98' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}>
                                    <ShoppingBag className="w-4 h-4" /> 
                                    {product.count <= 0 ? 'Out of Stock' : fromCartItemId ? 'Update Custom Configuration' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <MessageSquare className="w-4 h-4" style={{ color: '#A5CE00' }} />
                            <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900">Customer Reviews ({reviews.length})</h3>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="p-6 sm:p-8 border border-dashed border-gray-200 bg-gray-50 rounded-xl text-center">
                                <p className="text-xs font-semibold text-gray-400">No customer reviews yet. Be the first to leave a review!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 sm:p-4 space-y-2.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 text-gray-800 font-bold">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-3 h-3 text-gray-600" /></div>
                                                <span className="truncate max-w-[120px] sm:max-w-none">{rev.user_name}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium shrink-0">
                                                <Calendar className="w-3 h-3" /> {new Date(rev.created_at).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>

                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((starIdx) => (
                                                <Star key={starIdx} className={`w-3 h-3 ${starIdx <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>

                                        <p className="text-xs text-gray-600 font-medium leading-relaxed">{rev.comment}</p>

                                        {rev.images && rev.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {rev.images.map((imgUrl, i) => (
                                                    <a key={i} href={imgUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white">
                                                        <img src={imgUrl} alt="Feedback attachment" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetailView;