import React, { useState, useEffect, useRef } from 'react'
import { 
    Search, ShoppingBag, User, LogOut, ChevronDown, Zap, 
    Sparkles, Home, Smartphone, Headphones, Shirt, Utensils, Package, MapPin, X, Navigation, Check, AlertCircle, RefreshCw, ChevronRight, ChevronLeft, LayoutGrid, ArrowRight
} from 'lucide-react'
import Logo from "../assets/logo.png"
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const POPULAR_CITIES = [
    "Bengaluru", "Mumbai", "Delhi NCR", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"
];

const getCategoryIcon = (catName) => {
    const lower = catName.toLowerCase();
    if (lower.includes('home')) return <Home className="w-3.5 h-3.5" />;
    if (lower.includes('toy') || lower.includes('fresh')) return <Sparkles className="w-3.5 h-3.5" />;
    if (lower.includes('electronic')) return <Headphones className="w-3.5 h-3.5" />;
    if (lower.includes('mobile')) return <Smartphone className="w-3.5 h-3.5" />;
    if (lower.includes('beauty') || lower.includes('apparel') || lower.includes('fashion') || lower.includes('clothing')) return <Shirt className="w-3.5 h-3.5" />;
    if (lower.includes('gear')) return <Utensils className="w-3.5 h-3.5" />;
    return <Package className="w-3.5 h-3.5" />;
};

const Navbar = () => {
    const [cartCount, setCartCount] = useState(0)
    const [categories, setCategories] = useState([])
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [isCartLoading, setIsCartLoading] = useState(true)
    const [navSearchQuery, setNavSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    const [userLocationText, setUserLocationText] = useState('Select Location')
    const [isLocationLoading, setIsLocationLoading] = useState(false)
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const [manualCityInput, setManualCityInput] = useState('')
    const [isPermissionBlocked, setIsPermissionBlocked] = useState(false)

    // Dynamic Scroll Visibility States
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollContainerRef = useRef(null);
    const searchInputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isLoggedIn = !!localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "User";

    // Function to calculate if scrolling left or right is possible
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            // Buffer of 2px for browser subpixel rounding discrepancies
            setCanScrollLeft(scrollLeft > 2);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
        return () => window.removeEventListener('resize', checkScrollPosition);
    }, [categories, isCategoriesLoading]);

    useEffect(() => {
        if (isMobileSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);

    useEffect(() => {
        const path = location.pathname;
        const queryParamSearch = searchParams.get('search');
        const queryParamCategory = searchParams.get('category');

        if (queryParamSearch) {
            setNavSearchQuery(queryParamSearch);
        }

        if (path.startsWith('/products/')) {
            const rawCategory = path.replace('/products/', '');
            setSelectedCategory(decodeURIComponent(rawCategory));
        } else if (queryParamCategory) {
            setSelectedCategory(queryParamCategory);
        } else if (path === '/allproducts') {
            setSelectedCategory('All');
        } else {
            setSelectedCategory(null);
        }
    }, [location.pathname, searchParams]);

    useEffect(() => {
        const savedLocation = localStorage.getItem("userDeliveryLocation");
        if (savedLocation) {
            setUserLocationText(savedLocation);
        }

        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                if (permissionStatus.state === 'denied') {
                    setIsPermissionBlocked(true);
                }
                permissionStatus.onchange = () => {
                    if (permissionStatus.state === 'granted') {
                        setIsPermissionBlocked(false);
                        requestLiveLocation(false);
                    } else if (permissionStatus.state === 'denied') {
                        setIsPermissionBlocked(true);
                    }
                };
            }).catch(() => {});
        }
    }, []);

    const requestLiveLocation = (silentMode = false) => {
        setIsLocationLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setIsPermissionBlocked(false);
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                        );
                        if (res.ok) {
                            const data = await res.json();
                            const addr = data.address || {};
                            
                            const street = addr.road || addr.pedestrian || addr.street || addr.suburb || addr.neighbourhood || addr.residential || '';
                            const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
                            const pincode = addr.postcode || '';

                            let formattedAddress = '';
                            if (street && pincode) {
                                formattedAddress = `${street} - ${pincode}`;
                            } else if (street && city) {
                                formattedAddress = `${street}, ${city}`;
                            } else if (city && pincode) {
                                formattedAddress = `${city} - ${pincode}`;
                            } else {
                                formattedAddress = city || 'Nearby Delivery Hub';
                            }

                            setUserLocationText(formattedAddress);
                            localStorage.setItem("userDeliveryLocation", formattedAddress);
                            if (!silentMode) toast.success(`Delivering to ${formattedAddress}`);
                            setIsLocationModalOpen(false);
                        } else {
                            if (!silentMode) toast.error("Could not fetch detailed street address.");
                        }
                    } catch (err) {
                        console.error("Nominatim Reverse Geocoding failure:", err);
                        if (!silentMode) toast.error("Network error resolving location details.");
                    } finally {
                        setIsLocationLoading(false);
                    }
                },
                (error) => {
                    console.warn("Geolocation permission blocked or unavailable:", error.message);
                    setIsLocationLoading(false);
                    if (error.code === error.PERMISSION_DENIED) {
                        setIsPermissionBlocked(true);
                    }
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            setIsLocationLoading(false);
            if (!silentMode) toast.error("Geolocation is not supported by your browser.");
        }
    };

    const handleSelectManualLocation = (cityName) => {
        if (!cityName.trim()) return;
        const formattedCity = cityName.trim();
        setUserLocationText(formattedCity);
        localStorage.setItem("userDeliveryLocation", formattedCity);
        toast.success(`Location set to ${formattedCity}`);
        setManualCityInput('');
        setIsLocationModalOpen(false);
    };

    useEffect(() => {
        const loadActiveCategories = async () => {
            try {
                setIsCategoriesLoading(true);
                const res = await fetch(API_CAT_URL)
                if (res.ok) {
                    const data = await res.json()
                    setCategories(data)
                }
            } catch (err) {
                console.error("Navbar dynamic category failure:", err)
            } finally {
                setIsCategoriesLoading(false);
            }
        }
        loadActiveCategories()
    }, [])

    useEffect(() => {
        if (!isLoggedIn) {
            setCartCount(0);
            setIsCartLoading(false);
            return;
        }

        const fetchNavbarCartCount = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const totalItems = data.reduce((acc, item) => acc + (item.quantity || 0), 0);
                    setCartCount(totalItems);
                }
            } catch (err) {
                console.error("Failed synchronizing cart badge:", err);
            } finally {
                setIsCartLoading(false);
            }
        };

        fetchNavbarCartCount();
        const intervalId = setInterval(fetchNavbarCartCount, 4000);
        return () => clearInterval(intervalId);
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        setIsProfileMenuOpen(false);
        toast.success(`Goodbye. Session ended.`);
        navigate("/");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (navSearchQuery.trim()) {
            params.set('search', navSearchQuery.trim());
        }
        if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
            params.set('category', selectedCategory);
        }
        setIsMobileSearchOpen(false);
        navigate(`/allproducts?${params.toString()}`);
    };

    const handleCategorySelect = (catName) => {
        setSelectedCategory(catName);
        if (catName.toLowerCase() === 'all') {
            navigate('/allproducts');
        } else {
            navigate(`/products/${catName.toLowerCase()}`);
        }
    };

    const handleNextCategoryScroll = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
    };

    const handlePrevCategoryScroll = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-xs transition-all duration-300 font-sans">
                {/* TOP BRAND & NAVIGATION BAR */}
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 md:gap-8 relative">
                    
                    {/* LOGO & BRAND IDENTIFIER */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer select-none group">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-50 p-1 border border-gray-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-300">
                                <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-gray-900 leading-none">
                                    AVG <span style={{ color: '#A5CE00' }}>MART</span>
                                </h1>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hidden xs:block">
                                    Express Store
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP SEARCH BAR */}
                    <form 
                        onSubmit={handleSearchSubmit}
                        className="hidden sm:flex flex-1 max-w-xl relative items-center group"
                    >
                        <div className="absolute left-3.5 pointer-events-none text-gray-400 group-focus-within:text-gray-900 transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={navSearchQuery}
                            onChange={(e) => setNavSearchQuery(e.target.value)}
                            placeholder='Search products, groceries & essentials...'
                            className="w-full bg-gray-50/90 border border-gray-200/80 hover:border-gray-300 focus:bg-white text-xs sm:text-sm text-gray-900 placeholder-gray-400 rounded-2xl py-2 sm:py-2.5 pl-9 sm:pl-10 pr-8 outline-none transition-all duration-200 font-medium shadow-2xs"
                            onFocus={(e) => e.target.style.borderColor = '#A5CE00'}
                            onBlur={(e) => e.target.style.borderColor = ''}
                        />
                        {navSearchQuery && (
                            <button 
                                type="button" 
                                onClick={() => setNavSearchQuery('')}
                                className="absolute right-3 text-gray-400 hover:text-gray-700 p-0.5 rounded-full"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </form>

                    {/* LOCATION PILL SELECTOR */}
                    <div 
                        onClick={() => setIsLocationModalOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/70 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 group shrink-0"
                    >
                        <div className="relative flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 fill-[#A5CE00] text-[#A5CE00]" />
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 leading-none">Delivering to</span>
                            <span className="text-xs font-extrabold text-gray-800 truncate max-w-[120px] lg:max-w-[160px] leading-tight group-hover:text-black">
                                {isLocationLoading ? "Locating..." : userLocationText}
                            </span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-y-0.5" />
                    </div>

                    {/* MOBILE EXPANDABLE SEARCH OVERLAY */}
                    {isMobileSearchOpen && (
                        <div className="absolute inset-0 bg-white z-50 px-3 flex items-center gap-2 animate-fadeIn sm:hidden shadow-md">
                            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center gap-1.5">
                                <div className="relative flex-1 flex items-center">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={navSearchQuery}
                                        onChange={(e) => setNavSearchQuery(e.target.value)}
                                        placeholder='Search items...'
                                        className="w-full bg-gray-100 border-none text-xs text-gray-900 placeholder-gray-400 rounded-xl py-2 pl-9 pr-8 outline-none font-bold"
                                    />
                                    {navSearchQuery && (
                                        <button 
                                            type="button" 
                                            onClick={() => setNavSearchQuery('')}
                                            className="absolute right-2.5 text-gray-400"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!navSearchQuery.trim()}
                                    className="px-3 py-2 bg-[#A5CE00] hover:bg-[#8da800] text-gray-900 font-black text-xs rounded-xl flex items-center gap-1 shadow-xs disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                                >
                                    <span>Search</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>

                            <button 
                                onClick={() => setIsMobileSearchOpen(false)} 
                                className="p-2 text-gray-500 hover:text-black font-bold text-xs shrink-0 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* USER ACTIONS: SEARCH, PROFILE & CART */}
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="sm:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label="Open Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="relative">
                            {isLoggedIn ? (
                                <button 
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-gray-700 hover:bg-gray-100/70 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                                >
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 text-white font-black text-xs flex items-center justify-center uppercase shadow-2xs">
                                        {userName.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-gray-800 hidden md:block max-w-[90px] truncate">{userName}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span className="hidden xs:inline">Login</span>
                                </button>
                            )}

                            {isLoggedIn && isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-[10px] font-black uppercase text-gray-400">Signed in as</p>
                                        <p className="text-xs font-extrabold text-gray-900 truncate">{userName}</p>
                                    </div>

                                    <button 
                                        onClick={() => { setIsProfileMenuOpen(false); navigate("/profile"); }}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <User className="w-4 h-4 text-gray-400" /> Profile Dashboard
                                    </button>

                                    <button 
                                        onClick={() => { setIsProfileMenuOpen(false); navigate("/orders"); }}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <Package className="w-4 h-4 text-gray-400" /> My Orders
                                    </button>

                                    <div className="my-1 border-t border-gray-100" />

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout Session
                                    </button>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => navigate("/cart")} 
                            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 relative"
                        >
                            <ShoppingBag className="w-4 h-4 text-[#A5CE00]" />
                            <span className="hidden sm:inline">Cart</span>
                            {isCartLoading ? (
                                <span className="w-4 h-4 rounded-full bg-gray-700 animate-pulse" />
                            ) : cartCount > 0 ? (
                                <span className="bg-[#A5CE00] text-black text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                                    {cartCount}
                                </span>
                            ) : null}
                        </button>
                    </div>
                </div>

                {/* HORIZONTAL CATEGORY NAVIGATION BAR */}
                <div className="border-t border-gray-100/80 bg-white/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center relative group">
                        
                        {/* LEFT CHEVRON BUTTON (VISIBLE ONLY IF CAN SCROLL LEFT) */}
                        {canScrollLeft && (
                            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-6">
                                <button
                                    onClick={handlePrevCategoryScroll}
                                    className="p-1.5 rounded-xl bg-gray-900 hover:bg-black text-white transition-all cursor-pointer shadow-xs active:scale-90"
                                    title="Previous Categories"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 text-[#A5CE00]" />
                                </button>
                            </div>
                        )}

                        {/* CATEGORY SCROLLER CONTAINER */}
                        <div 
                            ref={scrollContainerRef}
                            onScroll={checkScrollPosition}
                            className="flex items-center gap-2 sm:gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 text-xs font-bold text-gray-600 whitespace-nowrap flex-1 scroll-smooth"
                        >
                            <button
                                onClick={() => handleCategorySelect('All')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                    selectedCategory && selectedCategory.toLowerCase() === 'all' 
                                        ? 'bg-gray-900 text-white font-black shadow-2xs' 
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" style={{ color: selectedCategory && selectedCategory.toLowerCase() === 'all' ? '#A5CE00' : 'currentColor' }} />
                                <span>All Categories</span>
                            </button>

                            {isCategoriesLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="h-7 w-20 bg-gray-100 rounded-xl animate-pulse" />
                                ))
                            ) : (
                                categories.map((cat) => {
                                    const isSelected = selectedCategory && selectedCategory.toLowerCase() === cat.name.toLowerCase();
                                    return (
                                        <button
                                            key={cat.id || cat.name}
                                            onClick={() => handleCategorySelect(cat.name)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                                                isSelected 
                                                    ? 'bg-gray-900 text-white font-black shadow-2xs' 
                                                    : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <span style={{ color: isSelected ? '#A5CE00' : 'inherit' }}>
                                                {getCategoryIcon(cat.name)}
                                            </span>
                                            <span>{cat.name}</span>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* RIGHT CHEVRON BUTTON (VISIBLE ONLY IF CAN SCROLL RIGHT) */}
                        {canScrollRight && (
                            <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-6">
                                <button
                                    onClick={handleNextCategoryScroll}
                                    className="p-1.5 rounded-xl bg-gray-900 hover:bg-black text-white transition-all cursor-pointer shadow-xs active:scale-90"
                                    title="Next Categories"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 text-[#A5CE00]" />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </header>

            {/* LOCATION SELECTOR POPUP MODAL */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
                    <div className="bg-white border border-gray-100 w-full max-w-md rounded-3xl p-6 relative space-y-5 shadow-2xl text-left animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h3 className="text-sm font-black uppercase text-gray-900 tracking-wide">
                                    Select Delivery Location
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsLocationModalOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {isPermissionBlocked ? (
                            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-2 text-left">
                                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
                                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>Location Permission Blocked</span>
                                </div>
                                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                                    Your browser has blocked location access for this site. To unblock:
                                </p>
                                <ol className="text-[11px] text-amber-900 space-y-1 pl-4 list-decimal font-medium">
                                    <li>Click the <strong>Settings icon</strong> next to the URL address bar.</li>
                                    <li>Set <strong>Location</strong> permission to <strong>Allow</strong>.</li>
                                    <li>Click below to refresh.</li>
                                </ol>
                                <button
                                    onClick={() => requestLiveLocation(false)}
                                    className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isLocationLoading ? 'animate-spin' : ''}`} />
                                    <span>Re-check Permission</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => requestLiveLocation(false)}
                                disabled={isLocationLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-gray-900 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                                style={{ backgroundColor: '#A5CE00' }}
                            >
                                <Navigation className={`w-4 h-4 ${isLocationLoading ? 'animate-spin' : ''}`} />
                                <span>{isLocationLoading ? 'Detecting Location...' : 'Use Current GPS Location'}</span>
                            </button>
                        )}

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-[1px] bg-gray-100" />
                            <span className="text-[10px] font-black text-gray-400 uppercase">OR SEARCH CITY</span>
                            <div className="flex-1 h-[1px] bg-gray-100" />
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={manualCityInput}
                                onChange={(e) => setManualCityInput(e.target.value)}
                                placeholder="Enter City or Pincode..."
                                className="flex-1 bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none"
                            />
                            <button
                                onClick={() => handleSelectManualLocation(manualCityInput)}
                                disabled={!manualCityInput.trim()}
                                className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase rounded-2xl disabled:opacity-50 cursor-pointer"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="space-y-2 pt-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Popular Hubs</span>
                            <div className="flex flex-wrap gap-1.5">
                                {POPULAR_CITIES.map((city) => {
                                    const isCurrent = userLocationText.toLowerCase().includes(city.toLowerCase());
                                    return (
                                        <button
                                            key={city}
                                            onClick={() => handleSelectManualLocation(city)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                                                isCurrent 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-extrabold'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/80'
                                            }`}
                                        >
                                            {isCurrent && <Check className="w-3 h-3 text-emerald-600" />}
                                            <span>{city}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}
export default Navbar;