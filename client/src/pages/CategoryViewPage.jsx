import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Check, Sliders, ChevronRight, X, RotateCcw, ChevronLeft } from 'lucide-react'
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

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Mobile Filter Drawer Toggle State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Filter Engine Controls
  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(15000)
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(15000)
  const [sortBy, setSortBy] = useState('featured')

  // Fetch max available price bounds for this category on mount
  useEffect(() => {
    const fetchCategoryBounds = async () => {
      try {
        const response = await fetch(API_BASE_URL)
        if (response.ok) {
          const data = await response.json()
          const categoryFiltered = data.filter(
            (product) => product.category && product.category.toLowerCase() === categoryName?.toLowerCase()
          )

          if (categoryFiltered.length > 0) {
            const peakPrice = Math.max(...categoryFiltered.map(p => Number(p.offerPrice || p.offer_price || p.originalPrice || p.original_price || 0)))
            const topBoundary = peakPrice > 0 ? peakPrice : 15000
            setMaxAvailablePrice(topBoundary)
            setMaxPrice(topBoundary)
          }
        }
      } catch (err) {
        console.error("Failed synchronization bounds:", err)
      }
    }

    if (categoryName) {
      fetchCategoryBounds()
    }
  }, [categoryName])

  // Fetch paginated & filtered inventory for this specific category from API
  useEffect(() => {
    const fetchCategoryInventory = async () => {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: pageSize,
          sortBy: sortBy,
          category: categoryName
        })

        if (searchQuery.trim() !== '') {
          queryParams.append('search', searchQuery.trim())
        }
        if (maxPrice > 0) {
          queryParams.append('maxPrice', maxPrice)
        }

        const response = await fetch(`${API_BASE_URL}/filter?${queryParams.toString()}`)
        if (response.ok) {
          const result = await response.json()
          setProducts(result.products || [])
          setTotalPages(result.totalPages || 1)
          setTotalProducts(result.totalProducts || 0)
        } else {
          toast.error("Failed to load category inventory.")
        }
      } catch (err) {
        console.error("Failed fetching category inventory:", err)
        toast.error("Network error while loading inventory.")
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryName) {
      fetchCategoryInventory()
    }
  }, [categoryName, currentPage, pageSize, maxPrice, sortBy, searchQuery])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSortBy('featured')
    setMaxPrice(maxAvailablePrice)
    setCurrentPage(1)
    setPageSize(25)
    setIsMobileFilterOpen(false)
  }

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

            <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
              <span className="text-xs font-bold text-gray-500">
                Showing <span className="text-gray-900 font-extrabold">{totalProducts}</span> items total
              </span>

              {/* PAGE SIZE SELECTOR */}
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 shadow-xs">
                <span>Per Page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="bg-transparent font-black outline-none cursor-pointer text-gray-900"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>

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
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
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
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="w-full bg-gray-200 h-1.5 rounded-lg cursor-pointer"
                  style={{ accentColor: '#A5CE00' }}
                />
              </div>

              {/* SORT SELECTOR */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setCurrentPage(1)
                  }}
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
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
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
                    onChange={(e) => {
                      setMaxPrice(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    style={{ accentColor: '#A5CE00' }}
                  />
                </div>

                {/* SORT */}
                <div className="space-y-1.5 border-t border-gray-100 pt-4">
                  <label className="text-[10px] font-black uppercase text-gray-400">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setCurrentPage(1)
                    }}
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

            {/* PRODUCT GRID CONTAINER & PAGINATION */}
            <div className="lg:col-span-9 space-y-6">
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
              ) : products.length === 0 ? (
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
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {products.map((product) => {
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
                              className={`w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-40 grayscale' : ''
                                }`}
                            />

                            {/* ADD BUTTON */}
                            <button
                              disabled={isOutOfStock || isAdding}
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`absolute bottom-2 right-2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm flex items-center gap-1 transition-all duration-200 cursor-pointer ${isOutOfStock
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

                  {/* PAGINATION CONTROLS BAR */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-xs">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === 1
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>

                      <span className="text-xs font-bold text-gray-600">
                        Page <span className="text-black font-extrabold">{currentPage}</span> of <span className="text-black font-extrabold">{totalPages}</span>
                      </span>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === totalPages
                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
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