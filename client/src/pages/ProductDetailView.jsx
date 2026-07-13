import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Star, Cpu, MessageSquare, Calendar, User, Plus, Minus } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const ProductDetailView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const imageContainerRef = useRef(null)

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
                        setActiveImg(foundProduct.images && foundProduct.images[0] ? foundProduct.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500")
                        
                        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
                            const colors = foundProduct.sizes.filter(sz => isColorOption(sz))
                            const sizes = foundProduct.sizes.filter(sz => isSizeOption(sz))

                            if (!existingSize && sizes.length > 0) setSelectedSize(sizes[0])
                            if (colors.length > 0) setSelectedColor(colors[0])
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
                            setAverageRating(5.0) 
                        }
                    }
                }
            } catch (err) {
                console.error("Pipeline communication breakdown:", err)
                toast.error("Failed to sync structural asset records.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProductAndReviews()
    }, [id, existingSize])

    // --- ACCURATE SEPARATION LOGIC PATTERNS ---
    const isColorOption = (str) => {
        const lower = str.toLowerCase()
        if (lower.startsWith('color:')) return true
        const colorKeywords = ['blue', 'red', 'white', 'black', 'green', 'gold', 'silver', 'grey', 'yellow', 'pink']
        return colorKeywords.some(color => lower.includes(color)) && !lower.includes('brand') && !lower.includes('battery')
    }

    const isSizeOption = (str) => {
        if (isColorOption(str)) return false
        if (str.includes(':')) return false // Filters out metadata specifications like Brand: x or Battery: y
        
        const lower = str.toLowerCase()
        // Standard clothing sizes or volumetric measurements
        const standardSizes = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl']
        if (standardSizes.includes(lower)) return true
        if (lower.includes('ml') || lower.includes('litre') || lower.includes('kg') || lower.includes('g')) return true
        return false
    }

    const isStaticSpecification = (str) => {
        return !isColorOption(str) && !isSizeOption(str)
    }

    if (isLoading) {
        return (
            <div className="bg-royal-dark text-white min-h-screen flex items-center justify-center text-xs font-mono tracking-widest uppercase animate-pulse">
                Accessing live system node metrics...
            </div>
        )
    }

    if (!product) {
        return (
            <div className="bg-royal-dark text-white min-h-screen flex flex-col items-center justify-center space-y-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-red-400">Asset Record Not Found</h2>
                <button onClick={() => navigate('/')} className="bg-white/10 px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-wider">
                    Return to Terminal Home
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
        const numericMatch = cleanStr.match(/^(\d+(\.\d+)?)/)
        if (numericMatch) return parseFloat(numericMatch[1])
        return 1
    }

    const baseOriginalPrice = Number(product.originalPrice || 0)
    const baseOfferPrice = Number(product.offerPrice || baseOriginalPrice)
    const currentMultiplier = getPriceMultiplier(selectedSize)
    
    const offer = Math.round(baseOfferPrice * currentMultiplier)
    const original = Math.round(baseOriginalPrice * currentMultiplier)
    const priceDifference = original - offer
    const percentSaved = original > 0 ? Math.round((priceDifference / original) * 100) : 0

    const alternativeAngles = product.images && product.images.length > 0 ? product.images : [activeImg]

    const handleMouseMove = (e) => {
        const card = imageContainerRef.current
        if (!card) return
        const box = card.getBoundingClientRect()
        const x = e.clientX - box.left - box.width / 2
        const y = e.clientY - box.top - box.height / 2
        card.style.transform = `perspective(1200px) rotateX(${-(y / box.height) * 12}deg) rotateY(${(x / box.width) * 12}deg) scale3d(1.01, 1.01, 1.01)`
    }

    const handleMouseLeave = () => {
        if (imageContainerRef.current) imageContainerRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    const handleAddToCart = async (product, token, navigate) => {
        const hasSizes = product.sizes && product.sizes.some(sz => isSizeOption(sz))
        const hasColors = product.sizes && product.sizes.some(sz => isColorOption(sz))

        if (hasSizes && !selectedSize) {
            toast.error("Size/Volume selection choice is required.");
            return;
        }

        if (hasColors && !selectedColor) {
            toast.error("Color option variation configuration is required.");
            return;
        }

        if (!token) {
            toast.error("Authentication required. Redirecting...");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        const loadId = toast.loading("Syncing asset loadout...");
        
        // Clean up text format sent to backend database pipeline
        const cleanSize = selectedSize
        const cleanColor = selectedColor.replace(/^color:\s*/i, '')
        
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
                toast.success("Cart asset layout successfully committed!", { id: loadId });
                if (fromCartItemId) setTimeout(() => navigate("/cart"), 1000);
            } else {
                const errData = await response.json();
                toast.error(`Sync failure: ${errData.message}`, { id: loadId });
            }
        } catch (err) {
            toast.error("Network synchronization error.", { id: loadId });
        }
    };

    // Filter matrices categories dynamically
    const sizeOptions = product.sizes ? product.sizes.filter(sz => isSizeOption(sz)) : []
    const colorOptions = product.sizes ? product.sizes.filter(sz => isColorOption(sz)) : []
    const specificationLabels = product.sizes ? product.sizes.filter(sz => isStaticSpecification(sz)) : []

    return (
        <>
            <Navbar />
            <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex justify-start mb-8 mt-5">
                        <button onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 text-white/50 hover:text-lime-accent text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-xl transition-all">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" /> BACK
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
                        
                        {/* LEFT COLUMN: IMAGES */}
                        <div className="lg:col-span-7 space-y-6">
                            <div 
                                ref={imageContainerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
                                className="w-full h-[450px] md:h-[580px] rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/5 to-black/40 relative shadow-2xl cursor-crosshair transition-transform duration-200"
                            >
                                <img src={activeImg} alt={product.name} className="w-full h-full object-cover filter contrast-110" />
                                <div className="absolute top-4 left-4 text-[9px] font-black tracking-widest uppercase bg-royal-dark/80 px-3 py-1.5 rounded-lg border border-white/10 text-lime-accent">
                                    <Cpu className="w-3 h-3 text-lime-accent animate-pulse inline mr-1" /> {product.isFeatured ? 'Spotlight Drop' : 'Standard Node'}
                                </div>
                            </div>

                            {alternativeAngles.length > 1 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {alternativeAngles.map((imgUrl, idx) => (
                                        <button key={idx} onClick={() => setActiveImg(imgUrl)} className={`h-20 md:h-28 rounded-xl overflow-hidden border bg-white/5 transition-all ${activeImg === imgUrl ? 'border-lime-accent scale-95' : 'border-white/10'}`}>
                                          <img src={imgUrl} alt="Alternative Angle view" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: CORE PRODUCT ACTIONS */}
                        <div className="lg:col-span-5 space-y-8 text-left">
                            <div className="space-y-3">
                                <span className="inline-block text-xs font-black text-lime-accent uppercase tracking-[0.25em] bg-lime-accent/10 px-3 py-1 rounded-md border border-lime-accent/20">{product.category}</span>
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white leading-tight">{product.name}</h1>
                                
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
                                        <Star className="w-4 h-4 text-lime-accent fill-lime-accent" />
                                        <span className="text-sm font-black text-white">{averageRating}</span>
                                    </div>
                                    <span className="text-xs text-white/40 font-medium tracking-wide border-l border-white/10 pl-4">
                                        Reviews: <strong className="text-white/70">({reviews.length} total votes)</strong>
                                    </span>
                                </div>
                            </div>

                            <hr className="border-white/5" />
                            <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">{product.description || "High efficiency catalog asset."}</p>

                            {/* SELECTION INTERACTIVE SYSTEM MATRIX */}
                            <div className="space-y-5">
                                {/* 1. Size / Volume Options selection matrix */}
                                {sizeOptions.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Variant Options Matrix</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {sizeOptions.map((sz, idx) => (
                                                <button key={idx} type="button" onClick={() => setSelectedSize(sz)} className={`font-mono text-xs font-black px-4 py-2.5 rounded-xl border transition-all ${selectedSize === sz ? 'bg-lime-accent text-royal-dark border-lime-accent shadow-md' : 'bg-white/5 border-white/10 text-white/70'}`}>
                                                    {sz}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Color Selection Engine Matrix */}
                                {colorOptions.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Color Matrix</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {colorOptions.map((clr, idx) => (
                                                <button key={idx} type="button" onClick={() => setSelectedColor(clr)} className={`font-mono text-xs font-black px-4 py-2.5 rounded-xl border transition-all ${selectedColor === clr ? 'bg-lime-accent text-royal-dark border-lime-accent shadow-md' : 'bg-white/5 border-white/10 text-white/70'}`}>
                                                    {clr.replace(/^color:\s*/i, '')} {/* Renders only "Blue", "Red", "White" visually */}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Quantitative Selector Counter */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Quantity</h4>
                                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 w-fit p-1 rounded-xl">
                                        <button type="button" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-mono font-black text-sm text-center px-4 min-w-[40px]">{quantity}</span>
                                        <button type="button" onClick={() => setQuantity(prev => prev + 1)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* 4. STATIC METADATA LABELS (SHOWCASE DISPLAY ONLY) */}
                                {specificationLabels.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Product Specifications & Features</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {specificationLabels.map((spec, idx) => (
                                                <span key={idx} className="bg-white/[0.02] border border-white/5 font-sans text-xs text-white/50 px-4 py-2.5 rounded-xl cursor-default select-none">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ACQUISITION VALUE SECTION CONTAINER */}
                            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/10 p-6 rounded-2xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">
                                            Total Acquisition Value ({selectedSize || selectedColor.replace(/^color:\s*/i, '') || 'Base'})
                                        </span>
                                        <div className="flex items-baseline gap-3 mt-1">
                                            <span className="text-3xl md:text-4xl font-black text-white">₹{offer * quantity}</span>
                                            {priceDifference > 0 && <span className="text-sm line-through text-white/30 font-bold">₹{original * quantity}</span>}
                                        </div>
                                    </div>
                                    {percentSaved > 0 && <div className="bg-lime-accent text-royal-dark text-[10px] font-black px-3 py-1.5 rounded-lg">-{percentSaved}% Drop</div>}
                                </div>

                                <button disabled={product.count <= 0} onClick={() => handleAddToCart(product, localStorage.getItem("token"), navigate)} className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl transition-all ${product.count > 0 ? 'bg-white hover:bg-lime-accent text-royal-dark shadow-md' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                                    <ShoppingBag className="w-4 h-4" /> {product.count <= 0 ? 'Out of Stock' : fromCartItemId ? 'Update Custom Configuration' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- REVIEWS LAYOUT MATRICES SECTION --- */}
                    <div className="mt-20 border-t border-white/10 pt-12 text-left space-y-8">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-lime-accent" />
                            <h3 className="text-lg font-black uppercase tracking-wider text-white">Customer Reviews Matrix ({reviews.length})</h3>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="p-10 border border-dashed border-white/5 bg-white/[0.01] rounded-2xl text-center">
                                <p className="text-xs font-mono uppercase text-white/30">No customer reviews yet. Be the first user to submit a checkout overview review.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2 text-white/80 font-bold">
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><User className="w-3 h-3 text-lime-accent" /></div>
                                                    <span>{rev.user_name}</span>
                                                </div>
                                                <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {new Date(rev.created_at).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>

                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((starIdx) => (
                                                    <Star key={starIdx} className={`w-3.5 h-3.5 ${starIdx <= rev.rating ? 'text-lime-accent fill-lime-accent' : 'text-white/10'}`} />
                                                ))}
                                            </div>

                                            <p className="text-xs font-normal text-white/70 leading-relaxed tracking-wide font-sans">{rev.comment}</p>
                                        </div>

                                        {rev.images && rev.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.03]">
                                                {rev.images.map((imgUrl, i) => (
                                                    <a key={i} href={imgUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black hover:scale-105 transition-transform">
                                                        <img src={imgUrl} alt="Customer feedback attach asset" className="w-full h-full object-cover" />
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