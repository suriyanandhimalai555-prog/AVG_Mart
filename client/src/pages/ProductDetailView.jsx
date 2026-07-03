import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Star, ShieldCheck, Cpu } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const ProductDetailView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const imageContainerRef = useRef(null)

    // Extract dynamic transition state matrix if redirected explicitly from Cart.jsx
    const fromCartItemId = location.state?.fromCartItemId || null
    const existingSize = location.state?.existingSize || ''
    const existingQty = location.state?.existingQty || 1

    const [product, setProduct] = useState(null)
    const [activeImg, setActiveImg] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState('') // Tracks chosen size variation

    // Automatically set size variant if navigating from an already populated cart row
    useEffect(() => {
        if (existingSize) {
            setSelectedSize(existingSize)
        }
    }, [existingSize])

    useEffect(() => {
        const fetchProductData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(API_BASE_URL)
                if (response.ok) {
                    const data = await response.json()
                    const foundProduct = data.find(p => String(p.id) === String(id))
                    
                    if (foundProduct) {
                        setProduct(foundProduct)
                        setActiveImg(foundProduct.images && foundProduct.images[0] ? foundProduct.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500")
                    }
                }
            } catch (err) {
                console.error("Pipeline communication breakdown routing product details:", err)
                toast.error("Failed to fetch product tracking records.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProductData()
    }, [id])

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

    const original = Number(product.originalPrice || 0)
    const offer = Number(product.offerPrice || original)
    const priceDifference = original - offer; 
    const percentSaved = original > 0 ? Math.round((priceDifference / original) * 100) : 0;

    const alternativeAngles = product.images && product.images.length > 0 
        ? product.images 
        : [product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"];

    const handleMouseMove = (e) => {
        const card = imageContainerRef.current
        if (!card) return
        const box = card.getBoundingClientRect()
        const x = e.clientX - box.left - box.width / 2
        const y = e.clientY - box.top - box.height / 2
        
        const rotateX = -(y / box.height) * 12
        const rotateY = (x / box.width) * 12

        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    }

    const handleMouseLeave = () => {
        const card = imageContainerRef.current
        if (!card) return
        card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    const handleAddToCart = async (product, token, navigate) => {
        // PAKKA VALIDATION LAYER: Checks if configurations exist and stops user if selection is empty
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error("Size selection required! Please select a size option variant matrix before adding to cart.", {
                style: { 
                    background: '#1c1c1e', 
                    color: '#f87171', 
                    border: '1px solid rgba(248,113,113,0.2)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            });
            return;
        }

        if (!token) {
            toast.error("Authentication required. Redirecting to access terminal...", {
                duration: 3000
            });
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        const toastMsg = fromCartItemId ? "Modifying cart size configuration..." : "Syncing asset loadout configuration...";
        const loadId = toast.loading(toastMsg);

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
                    image: product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                    selected_size: selectedSize || '', 
                    
                    // Passing tracking keys parameters to safely bypass count compounding flow
                    fromCartItemId: fromCartItemId,
                    isSizeUpdateOnly: !!fromCartItemId,
                    existingQty: existingQty
                })
            });

            if (response.ok) {
                const successMsg = fromCartItemId 
                    ? `Size safely calibrated to ${selectedSize}!` 
                    : `${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''} configured to cart!`;
                
                toast.success(successMsg, { id: loadId });
                
                // If updated from cart interface explicitly, kick user directly back to checkout workspace
                if (fromCartItemId) {
                    setTimeout(() => navigate("/cart"), 1000);
                }
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
                
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-lime-accent/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="flex justify-start mb-8 mt-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="group inline-flex items-center gap-2 text-white/50 hover:text-lime-accent text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 hover:border-lime-accent/30 px-5 py-3 rounded-xl transition-all duration-300 backdrop-blur-md"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" /> 
                            BACK
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

                        {/* MEDIA VIEWER BLOCK */}
                        <div className="lg:col-span-7 space-y-6" style={{ perspective: '1200px' }}>
                            <div 
                                ref={imageContainerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="w-full h-[450px] md:h-[580px] rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/5 to-black/40 relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group transition-all duration-200 ease-out cursor-crosshair"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute -inset-px bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-100 group-hover:from-lime-accent/20 transition-all duration-500 pointer-events-none rounded-2xl" />
                                
                                <img
                                    src={activeImg}
                                    alt={product.name}
                                    className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                                    style={{ transform: 'translateZ(20px)' }}
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-royal-dark via-transparent to-transparent opacity-60" />

                                <div 
                                    className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase bg-royal-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-lime-accent shadow-md"
                                    style={{ transform: 'translateZ(40px)' }}
                                >
                                    <Cpu className="w-3 h-3 text-lime-accent animate-pulse" /> {product.isFeatured ? 'Spotlight Drop' : 'Standard Node'}
                                </div>
                            </div>

                            {/* Thumbnail Selector Tray */}
                            {alternativeAngles.length > 1 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {alternativeAngles.map((imgUrl, idx) => {
                                        const isSelected = activeImg === imgUrl;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImg(imgUrl)}
                                                className={`h-20 md:h-28 rounded-xl overflow-hidden border bg-white/5 transition-all duration-300 relative group ${
                                                    isSelected 
                                                        ? 'border-lime-accent shadow-[0_0_15px_rgba(165,206,0,0.2)] scale-95' 
                                                        : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'
                                                }`}
                                            >
                                                <img src={imgUrl} alt="Ecosystem map layout" className={`w-full h-full object-cover transition-all duration-300 ${!isSelected && 'grayscale contrast-125 group-hover:grayscale-0'}`} />
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ITEM DATA CONTENT BLOCK */}
                        <div className="lg:col-span-5 space-y-8 text-left">
                            <div className="space-y-3">
                                <span className="inline-block text-xs font-black text-lime-accent uppercase tracking-[0.25em] bg-lime-accent/10 px-3 py-1 rounded-md border border-lime-accent/20">
                                    {product.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 pt-1">
                                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-xl shadow-inner">
                                        <Star className="w-4 h-4 text-lime-accent fill-lime-accent" />
                                        <span className="text-sm font-black text-white">4.8</span>
                                    </div>
                                    <span className="text-xs text-white/40 font-medium tracking-wide border-l border-white/10 pl-4">
                                        Stock Matrix Levels: <strong className="text-white/70 font-bold">({product.count} units remaining)</strong>
                                    </span>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Description</h4>
                                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                                    {product.description || "High-efficiency ecosystem unit engineered for maximum operational durability."}
                                </p>
                            </div>

                            {/* SIZING INPUT TAG SELECTORS */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                        Available Configuration Matrix Size <span className="text-red-400 font-bold">*</span>
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((sz, idx) => {
                                            const isSelected = selectedSize === sz;
                                            return (
                                                <button 
                                                    key={idx} 
                                                    type="button"
                                                    onClick={() => setSelectedSize(sz)}
                                                    className={`font-mono text-xs font-black px-4 py-2.5 rounded-xl border transition-all duration-300 transform active:scale-95 ${
                                                        isSelected 
                                                            ? 'bg-lime-accent text-royal-dark border-lime-accent shadow-[0_0_15px_rgba(165,206,0,0.35)] font-bold' 
                                                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                                                    }`}
                                                >
                                                    {sz}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <hr className="border-white/5" />

                            {/* Procurement Checkout Dashboard */}
                            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent/5 rounded-full blur-xl pointer-events-none" />
                                
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">Acquisition Value</span>
                                        <div className="flex items-baseline gap-3 mt-1">
                                            <span className="text-3xl md:text-4xl font-black text-white tracking-tight">₹{offer}</span>
                                            {priceDifference > 0 && (
                                                <span className="text-sm line-through text-white/30 font-bold">₹{original}</span>
                                            )}
                                        </div>
                                    </div>
                                    {percentSaved > 0 && (
                                        <div className="bg-lime-accent text-royal-dark text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-[0_4px_15px_rgba(165,206,0,0.25)]">
                                            -{percentSaved}% Drop
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                                    <button
                                        disabled={product.count <= 0}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            const token = localStorage.getItem("token");
                                            handleAddToCart(product, token, navigate);
                                        }}
                                        className={`flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl transform active:scale-[0.98] transition-all duration-300 ${
                                            product.count > 0 
                                                ? 'bg-white hover:bg-lime-accent text-royal-dark shadow-md hover:shadow-[0_10px_30px_rgba(165,206,0,0.3)]' 
                                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingBag className="w-4 h-4" /> 
                                        {product.count <= 0 
                                            ? 'Out of Stock' 
                                            : fromCartItemId 
                                                ? 'Update Cart Size Matrix' 
                                                : 'Add to Cart'
                                        }
                                    </button>
                                </div>

                                <div className="flex items-center gap-2.5 text-[10px] text-white/40 pt-4 border-t border-white/5 relative z-10 font-medium tracking-wide">
                                    <ShieldCheck className="w-4 h-4 text-lime-accent drop-shadow-[0_0_4px_rgba(165,206,0,0.3)] flex-shrink-0" /> 
                                    Encrypted Data Transits. Guaranteed Authentic Ecosystem Delivery.
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetailView