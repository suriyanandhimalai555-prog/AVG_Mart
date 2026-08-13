import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
    ArrowLeft, ShoppingBag, Star, MessageSquare, Calendar, User, Plus, 
    Minus, Share2, ChevronRight, Sparkles, Check, RefreshCw, X, ChevronLeft, PackageX, Search 
} from 'lucide-react'
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
    
    // Suggested products & load-more states
    const [allAvailableProducts, setAllAvailableProducts] = useState([])
    const [visibleCount, setVisibleCount] = useState(4)
    const [addingIds, setAddingIds] = useState([])
    
    // Selectable variations and quantities
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)

    // Image Modal Lightbox States for Reviews
    const [modalImages, setModalImages] = useState([])
    const [currentModalIdx, setCurrentModalIdx] = useState(0)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)

    // Opens Review Image Modal at specific index
    const handleOpenImageModal = (images, index) => {
        setModalImages(images)
        setCurrentModalIdx(index)
        setIsImageModalOpen(true)
    }

    // Modal Image Controls
    const handleNextModalImage = (e) => {
        e.stopPropagation()
        setCurrentModalIdx((prev) => (prev + 1) % modalImages.length)
    }

    const handlePrevModalImage = (e) => {
        e.stopPropagation()
        setCurrentModalIdx((prev) => (prev - 1 + modalImages.length) % modalImages.length)
    }

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

    const getCleanColorName = (colorRawString) => {
        if (!colorRawString) return '';
        return colorRawString.split(/__imgidx:/i)[0].replace(/^color:\s*/i, '').toLowerCase().trim();
    }

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

                        // Store randomized pool of suggested products excluding active product
                        const otherProducts = data.filter(p => String(p.id) !== String(id))
                        const shuffled = [...otherProducts].sort(() => 0.5 - Math.random())
                        setAllAvailableProducts(shuffled)
                        setVisibleCount(4)
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
        
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <>
                <Navbar />
                <div className="bg-gray-50 min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-6">
                    <div className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14 text-center max-w-lg w-full shadow-xs space-y-6">
                        
                        {/* Icon Container */}
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100">
                            <PackageX className="w-12 h-12 text-gray-300" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="space-y-2.5">
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                Product Not Found
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                                The item you're looking for might have been removed, is temporarily out of stock, or the link is incorrect.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-full sm:w-auto cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" /> Go Back
                            </button>
                            <button 
                                onClick={() => navigate('/')} 
                                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-white shadow-md transition-colors w-full sm:w-auto cursor-pointer"
                                style={{ backgroundColor: '#A5CE00' }}
                            >
                                <Search className="w-4 h-4" /> Browse Store
                            </button>
                        </div>

                    </div>
                </div>
                <Footer />
            </>
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

    const handleAddToCart = async (productToCart, token, navigate) => {
        const hasSizes = productToCart.sizes && productToCart.sizes.some(sz => isSizeOption(sz))
        const hasColors = productToCart.sizes && productToCart.sizes.some(sz => isColorOption(sz))

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
                    product_id: productToCart.id,
                    name: productToCart.name,
                    category: productToCart.category,
                    price: offer,
                    image: activeImg,
                    selected_size: finalOptionString || '', 
                    fromCartItemId,
                    isSizeUpdateOnly: !!fromCartItemId,
                    existingQty: quantity
                })
            });

            if (response.ok) {
                toast.success(`${productToCart.name} added to cart!`);
                if (fromCartItemId) setTimeout(() => navigate("/cart"), 1000);
            } else {
                const errData = await response.json();
                toast.error(errData.message || 'Failed adding product');
            }
        } catch (err) {
            toast.error("Network error. Could not sync cart.");
        }
    };

    // Quick Add handler for Suggested Cards
    const handleSuggestedAddToCart = async (e, suggestedItem) => {
        e.stopPropagation()
        const token = localStorage.getItem("token")

        if (Number(suggestedItem.count || 0) <= 0) {
            toast.error("Out of stock!")
            return
        }

        if (!token) {
            toast.error("Please login to add items to cart!")
            setTimeout(() => navigate("/login"), 1000)
            return
        }

        setAddingIds(prev => [...prev, suggestedItem.id])

        try {
            const origPrice = Number(suggestedItem.originalPrice || suggestedItem.original_price || 0)
            const offPrice = Number(suggestedItem.offerPrice || suggestedItem.offer_price || origPrice)

            const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: suggestedItem.id,
                    name: suggestedItem.name,
                    category: suggestedItem.category,
                    originalPrice: origPrice,
                    offerPrice: offPrice,
                    price: offPrice,
                    image: suggestedItem.images && suggestedItem.images[0] ? suggestedItem.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                })
            })

            if (response.ok) {
                toast.success(`${suggestedItem.name} added to cart!`)
            } else {
                const errData = await response.json()
                toast.error(errData.message || 'Failed adding product to cart')
            }
        } catch (err) {
            console.error("Cart error:", err)
            toast.error("Network error. Could not add item.")
        } finally {
            setAddingIds(prev => prev.filter(id => id !== suggestedItem.id))
        }
    }

    const visibleSuggestedProducts = allAvailableProducts.slice(0, visibleCount)

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4)
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 text-gray-900 min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                    
                    {/* BREADCRUMB & TOP CONTROLS */}
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
                            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-xs cursor-pointer">
                                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                                <span className="hidden xs:inline">Back</span>
                            </button>
                            <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-xs cursor-pointer">
                                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                                <span className="hidden xs:inline">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* MAIN PRODUCT DETAIL GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* LEFT COLUMN: IMAGES */}
                        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                            <div className="w-full aspect-square max-h-[380px] sm:max-h-none rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 relative overflow-hidden shadow-xs flex items-center justify-center">
                                <img src={activeImg} alt={product.name} className="w-full h-full object-contain" />
                                {product.isFeatured && (
                                    <div className="absolute top-3 left-3 text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md shadow-xs">
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

                        {/* RIGHT COLUMN: PRODUCT INFO */}
                        <div className="lg:col-span-6 space-y-5 sm:space-y-6 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-xs">
                            <div className="space-y-1.5 sm:space-y-2 border-b border-gray-100 pb-3 sm:pb-4">
                                <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">{product.category}</span>
                                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-snug">{product.name}</h1>
                                
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-700">
                                        <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                                        <span>{averageRating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">({reviews.length} ratings)</span>
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                                <span className="text-xl sm:text-2xl font-black text-white px-2.5 py-0.5 rounded" style={{ backgroundColor: '#A5CE00' }}>
                                    ₹{offer * quantity}
                                </span>
                                {priceDifference > 0 && (
                                    <span className="text-xs sm:text-sm line-through text-gray-400 font-bold">₹{original * quantity}</span>
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

                            {/* VARIANTS */}
                            <div className="space-y-4 border-t border-gray-100 pt-4">
                                {sizeOptions.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Select Size / Pack</label>
                                        <div className="flex flex-wrap gap-2">
                                            {sizeOptions.map((sz, idx) => (
                                                <button key={idx} type="button" onClick={() => setSelectedSize(sz)} className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${selectedSize === sz ? 'bg-gray-900 text-white border-gray-900 shadow-xs' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
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
                                                    <button key={idx} type="button" onClick={() => handleColorSelectionChange(clr, product.images)} className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${selectedColor === clr ? 'bg-gray-900 text-white border-gray-900 shadow-xs' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                                                        {cleanColorDisplay.toUpperCase()}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* QUANTITY */}
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

                            {/* ADD TO CART */}
                            <div className="border-t border-gray-100 pt-4">
                                <button disabled={product.count <= 0} onClick={() => handleAddToCart(product, localStorage.getItem("token"), navigate)} className={`w-full py-3.5 px-6 font-extrabold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${product.count > 0 ? 'bg-[#A5CE00] hover:bg-[#8DA800] text-white active:scale-98' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}>
                                    <ShoppingBag className="w-4 h-4" /> 
                                    {product.count <= 0 ? 'Out of Stock' : fromCartItemId ? 'Update Custom Configuration' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
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

                                        {/* REVIEW IMAGES GRID WITH MODAL POPUP TRIGGER */}
                                        {rev.images && rev.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {rev.images.map((imgUrl, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleOpenImageModal(rev.images, i)}
                                                        className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                                    >
                                                        <img src={imgUrl} alt={`Feedback attachment ${i + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SUGGESTED PRODUCTS SECTION WITH LOAD MORE */}
                    {allAvailableProducts.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" style={{ color: '#A5CE00' }} />
                                    <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-gray-900">You Might Also Like</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {visibleSuggestedProducts.map((suggestedItem) => {
                                    const rawOriginal = suggestedItem.originalPrice ?? suggestedItem.original_price
                                    const rawOffer = suggestedItem.offerPrice ?? suggestedItem.offer_price

                                    const original = Number(rawOriginal || 0)
                                    const offer = Number(rawOffer || original)
                                    const savings = original > offer ? original - offer : 0
                                    const isOutOfStock = Number(suggestedItem.count || 0) <= 0
                                    const isAdding = addingIds.includes(suggestedItem.id)

                                    return (
                                        <div
                                            key={suggestedItem.id}
                                            onClick={() => navigate(`/product/${suggestedItem.id}`)}
                                            className="bg-white rounded-2xl border border-gray-100 p-2.5 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer group/card relative"
                                        >
                                            {/* PRODUCT IMAGE CONTAINER */}
                                            <div className="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                                                
                                                {/* BESTSELLER TAG */}
                                                {suggestedItem.isFeatured && (
                                                    <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md shadow-xs z-10">
                                                        Bestseller
                                                    </span>
                                                )}

                                                <img
                                                    src={suggestedItem.images && suggestedItem.images[0] ? suggestedItem.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
                                                    alt={suggestedItem.name}
                                                    className={`w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300 ${
                                                        isOutOfStock ? 'opacity-40 grayscale' : ''
                                                    }`}
                                                />

                                                {/* ADD BUTTON */}
                                                <button
                                                    disabled={isOutOfStock || isAdding}
                                                    onClick={(e) => handleSuggestedAddToCart(e, suggestedItem)}
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
                                                    {suggestedItem.name}
                                                </h3>

                                                {/* PACK SIZE / UNIT INFO */}
                                                <p className="text-[10px] font-medium text-gray-400">
                                                    {suggestedItem.unit || "1 pack"}
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

                            {/* LOAD MORE BUTTON */}
                            {visibleCount < allAvailableProducts.length && (
                                <div className="flex justify-center pt-2 pb-1">
                                    <button
                                        onClick={handleLoadMore}
                                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Load More Products</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* REVIEW IMAGE POPUP MODAL LIGHTBOX */}
            {isImageModalOpen && modalImages.length > 0 && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    {/* CLOSE BUTTON */}
                    <button
                        onClick={() => setIsImageModalOpen(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 p-2 rounded-full cursor-pointer transition-all z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* MAIN IMAGE CONTAINER */}
                    <div 
                        className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={modalImages[currentModalIdx]} 
                            alt={`Review Attachment ${currentModalIdx + 1}`} 
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                        />

                        {/* PREVIOUS BUTTON */}
                        {modalImages.length > 1 && (
                            <button
                                onClick={handlePrevModalImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-3 rounded-full cursor-pointer transition-all shadow-lg"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* NEXT BUTTON */}
                        {modalImages.length > 1 && (
                            <button
                                onClick={handleNextModalImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-3 rounded-full cursor-pointer transition-all shadow-lg"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}

                        {/* INDEX INDICATOR COUNTER */}
                        {modalImages.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                                {currentModalIdx + 1} / {modalImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    )
}

export default ProductDetailView;