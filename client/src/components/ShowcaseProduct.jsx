import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ChevronRight, ChevronLeft, Plus, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`
const API_CATEGORIES_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const ShowcaseProduct = () => {
    const [categoriesWithProducts, setCategoriesWithProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [addingIds, setAddingIds] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchShowcaseData = async () => {
            setIsLoading(true)
            try {
                // Fetch all products and active categories concurrently
                const [prodRes, catRes] = await Promise.all([
                    fetch(API_BASE_URL),
                    fetch(API_CATEGORIES_URL)
                ])

                if (prodRes.ok) {
                    const products = await prodRes.json()
                    let categoriesList = []

                    if (catRes.ok) {
                        categoriesList = await catRes.json()
                    }

                    // Group products by category
                    const groupedMap = {}

                    products.forEach(product => {
                        const catName = product.category || 'General'
                        if (!groupedMap[catName]) {
                            groupedMap[catName] = []
                        }
                        groupedMap[catName].push(product)
                    })

                    // Build structured array matching categories with their products
                    const result = Object.keys(groupedMap).map(catName => ({
                        categoryName: catName,
                        items: groupedMap[catName]
                    }))

                    setCategoriesWithProducts(result)
                }
            } catch (err) {
                console.error("Failed fetching showcase category data:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchShowcaseData()
    }, [])

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

        // Add to loading list
        setAddingIds(prev => [...prev, product.id])

        try {
            const originalPrice = Number(product.originalPrice || 0)
            const offerPrice = Number(product.offerPrice || originalPrice)

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

    const scrollRail = (railId, direction) => {
        const container = document.getElementById(railId)
        if (container) {
            const scrollAmount = direction === 'left' ? -320 : 320
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
                {[1, 2].map((group) => (
                    <div key={group} className="space-y-4">
                        <div className="h-6 w-44 bg-gray-200 rounded-md animate-pulse" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="w-44 md:w-48 h-72 bg-gray-100 rounded-2xl animate-pulse shrink-0" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (categoriesWithProducts.length === 0) {
        return null
    }

    return (
        <section className="bg-white py-6 md:py-10 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
                {categoriesWithProducts.map((catGroup, idx) => {
                    const railId = `category-rail-${idx}`

                    return (
                        <div key={catGroup.categoryName} className="space-y-3.5 relative group/rail">

                            {/* SECTION HEADER ROW */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight capitalize">
                                    {catGroup.categoryName}
                                </h2>

                                <button
                                    onClick={() => navigate(`/products/${catGroup.categoryName.toLowerCase()}`)}
                                    className="flex items-center gap-1 text-xs md:text-sm font-bold transition-colors cursor-pointer"
                                    style={{ color: '#A5CE00' }}
                                >
                                    <span>See All</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* LEFT NAVIGATION ARROW */}
                            <button
                                onClick={() => scrollRail(railId, 'left')}
                                className="hidden md:flex absolute -left-4 top-[55%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-black hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/rail:opacity-100 cursor-pointer"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5 -ml-0.5" />
                            </button>

                            {/* RIGHT NAVIGATION ARROW */}
                            <button
                                onClick={() => scrollRail(railId, 'right')}
                                className="hidden md:flex absolute -right-4 top-[55%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-black hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/rail:opacity-100 cursor-pointer"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5 -mr-0.5" />
                            </button>

                            {/* HORIZONTAL SWIPEABLE PRODUCTS RAIL */}
                            <div
                                id={railId}
                                className="flex items-stretch gap-3 md:gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 scroll-smooth"
                            >
                                {catGroup.items.map((product) => {
                                    const original = Number(product.originalPrice || 0)
                                    const offer = Number(product.offerPrice || original)
                                    const savings = original > offer ? original - offer : 0
                                    const isOutOfStock = Number(product.count || 0) <= 0
                                    const isAdding = addingIds.includes(product.id)

                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="w-[155px] sm:w-[175px] md:w-[190px] shrink-0 bg-white rounded-2xl border border-gray-100 p-2.5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group/card relative"
                                        >
                                            {/* PRODUCT IMAGE CONTAINER */}
                                            <div className="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-2">

                                                {/* TOP BESTSELLER OR DISCOUNT TAG */}
                                                {product.isFeatured && (
                                                    <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md shadow-2xl z-10">
                                                        Bestseller
                                                    </span>
                                                )}

                                                <img
                                                    src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                                                    alt={product.name}
                                                    className={`w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-40 grayscale' : ''
                                                        }`}
                                                />

                                                {/* ZEPTO-STYLE "ADD" PILL BUTTON */}
                                                <button
                                                    disabled={isOutOfStock || isAdding}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className={`absolute bottom-2 right-2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-md flex items-center gap-1 transition-all duration-200 cursor-pointer ${isOutOfStock
                                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                            : 'bg-white text-rose-600 border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95'
                                                        }`}
                                                >
                                                    {isAdding ? (
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    ) : (
                                                        <>
                                                            <span>ADD</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* CONTENT BLOCK */}
                                            <div className="pt-2.5 flex-1 flex flex-col justify-between space-y-1.5">

                                                {/* PRICE & SAVINGS ROW */}
                                                <div>
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        <span
                                                            className="inline-flex items-center justify-center text-white font-black px-1.5 py-0.5 text-md tracking-tight rounded-xl border-2 border-[#123815]"
                                                            style={{
                                                                backgroundColor: '#A5CE00',
                                                                boxShadow: '3px 3px 0px 0px #123815',
                                                            }}
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
                                                        <span className="text-[10px] font-bold text-emerald-600 block mt-2">
                                                            ₹{savings} OFF
                                                        </span>
                                                    )}
                                                </div>

                                                {/* PRODUCT TITLE */}
                                                <h3 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight group-hover/card:text-black">
                                                    {product.name}
                                                </h3>

                                                {/* PACK SIZE / WEIGHT INFO */}
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

                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default ShowcaseProduct