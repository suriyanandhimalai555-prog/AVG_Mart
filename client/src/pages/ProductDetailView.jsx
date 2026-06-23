import React, { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Star, Heart, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react'
import { productsData } from '../data/productsData' // Centralized dataset
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ProductDetailView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const imageContainerRef = useRef(null)

    // Look up item based on active router parameter hook ID
    const product = productsData.find(p => p.id === parseInt(id))

    // State for dynamic thumbnail viewing selection switch
    const [activeImg, setActiveImg] = useState(product ? product.image : '')

    // Fallback safe rendering block checks
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

    const percentSaved = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    // Stand-in backup layout angle captures
    const alternativeAngles = [
        product.image,
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=600&auto=format&fit=crop'
    ];

    // High-fidelity 3D structural tilt effect calculations on mouse interaction
    const handleMouseMove = (e) => {
        const card = imageContainerRef.current
        if (!card) return
        const box = card.getBoundingClientRect()
        const x = e.clientX - box.left - box.width / 2
        const y = e.clientY - box.top - box.height / 2
        
        // Configured constraint variables to allow elegant perspective distortion
        const rotateX = -(y / box.height) * 12
        const rotateY = (x / box.width) * 12

        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    }

    const handleMouseLeave = () => {
        const card = imageContainerRef.current
        if (!card) return
        card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    return (
        <>
            <Navbar />
            <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
                
                {/* Immersive Cyber-Grid Background Arrays */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-lime-accent/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Router Go-Back Actions trigger layout */}
                    <div className="flex justify-start mb-8 mt-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="group inline-flex items-center gap-2 text-white/50 hover:text-lime-accent text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 hover:border-lime-accent/30 px-5 py-3 rounded-xl transition-all duration-300 backdrop-blur-md"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" /> 
                            Return to Terminal Inventory
                        </button>
                    </div>

                    {/* Core Split Screen Layout Grid View */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

                        {/* MEDIA VIEWER BLOCK (Featuring 3D Spatial Frame Matrix) */}
                        <div className="lg:col-span-7 space-y-6" style={{ perspective: '1200px' }}>
                            <div 
                                ref={imageContainerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="w-full h-[450px] md:h-[580px] rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/5 to-black/40 relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group transition-all duration-200 ease-out cursor-crosshair"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Inner Micro-Glow Layer */}
                                <div className="absolute -inset-px bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-100 group-hover:from-lime-accent/20 transition-all duration-500 pointer-events-none rounded-2xl" />
                                
                                <img
                                    src={activeImg}
                                    alt={product.name}
                                    className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                                    style={{ transform: 'translateZ(20px)' }}
                                />
                                
                                {/* Ambient Dark Mask Layer */}
                                <div className="absolute inset-0 bg-gradient-to-t from-royal-dark via-transparent to-transparent opacity-60" />

                                <div 
                                    className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase bg-royal-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-lime-accent shadow-md"
                                    style={{ transform: 'translateZ(40px)' }}
                                >
                                    <Cpu className="w-3 h-3 text-lime-accent animate-pulse" /> {product.badge || 'Premium Asset'}
                                </div>
                            </div>

                            {/* Thumbnail Selector Tray */}
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
                                            <img src={imgUrl} alt="Ecosystem system view configuration map" className={`w-full h-full object-cover transition-all duration-300 ${!isSelected && 'grayscale contrast-125 group-hover:grayscale-0'}`} />
                                            {isSelected && <div className="absolute inset-0 bg-lime-accent/5" />}
                                        </button>
                                    )
                                })}
                            </div>
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

                                {/* Star Ratings Blueprint Panel */}
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-xl shadow-inner">
                                        <Star className="w-4 h-4 text-lime-accent fill-lime-accent" />
                                        <span className="text-sm font-black text-white">{product.rating}</span>
                                    </div>
                                    <span className="text-xs text-white/40 font-medium tracking-wide border-l border-white/10 pl-4">
                                        Ecosystem Nodes Checked: <strong className="text-white/70 font-bold">({product.reviewsCount} logs)</strong>
                                    </span>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            {/* Diagnostics System Component */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Description</h4>
                                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                                    {product.description || "High-efficiency ecosystem unit engineered for maximum operational durability, real-time sync telemetry options, and flawless execution metrics."}
                                </p>
                            </div>

                            {/* Core Modifications Specifications Arrays */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Hardware Modifications Matrix</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {(product.specs || ['Cryo Stability Mesh', 'Neural Interface Sync', 'Extended Cell Capacitor', 'Biometric Lock Core']).map((spec, i) => (
                                        <div 
                                            key={i} 
                                            className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-white/10 p-3.5 rounded-xl text-xs text-white/90 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.07]"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-lime-accent flex-shrink-0 drop-shadow-[0_0_5px_rgba(165,206,0,0.4)]" />
                                            <span className="font-medium tracking-wide truncate">{spec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            {/* Procurement Checkout Dashboard (Interactive Glass Frame) */}
                            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-accent/5 rounded-full blur-xl pointer-events-none" />
                                
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">Price</span>
                                        <div className="flex items-baseline gap-3 mt-1">
                                            <span className="text-3xl md:text-4xl font-black text-white tracking-tight">${product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-sm line-through text-white/30 font-bold">${product.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    {percentSaved > 0 && (
                                        <div className="bg-lime-accent text-royal-dark text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-[0_4px_15px_rgba(165,206,0,0.25)]">
                                            -{percentSaved}% Drop
                                        </div>
                                    )}
                                </div>

                                {/* Procurement Trigger Row */}
                                <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                                    <button
                                        onClick={() => alert(`Procurement line secure for item: ${product.name}`)}
                                        className="flex-1 inline-flex items-center justify-center gap-2.5 bg-white hover:bg-lime-accent text-royal-dark px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl shadow-[0_4px_25px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_30px_rgba(165,206,0,0.3)] transition-all duration-300 transform active:scale-[0.98]"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Place Order
                                    </button>
                                    {/* <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-pink-500 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 group">
                                        <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button> */}
                                </div>

                                {/* Security Signature Footer */}
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