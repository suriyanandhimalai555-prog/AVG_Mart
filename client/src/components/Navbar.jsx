// import React, { useState, useEffect } from 'react'
// import { Menu, X, ShoppingBag, Search, ChevronDown, ArrowRight, Layers, LogIn, LogOut, ShoppingCart, User, HelpCircle } from 'lucide-react'
// import Logo from "../assets/logo.png"
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import { toast } from 'react-hot-toast'

// const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false)
//     const [isScrolled, setIsScrolled] = useState(false)
//     const [activeDropdown, setActiveDropdown] = useState(null)
//     const [cartCount, setCartCount] = useState(0)
//     const [categories, setCategories] = useState([])
//     const [isSearchOpen, setIsSearchOpen] = useState(false)
    
//     // Navbar Search Form State
//     const [navSearchQuery, setNavSearchQuery] = useState('')
//     const [selectedNavCategory, setSelectedNavCategory] = useState('')

//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();

//     const isLoggedIn = !!localStorage.getItem("token");

//     // Sync search input if URL already has a search query
//     useEffect(() => {
//         const queryParam = searchParams.get('search');
//         if (queryParam) {
//             setNavSearchQuery(queryParam);
//         }
//     }, [searchParams]);

//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 50)
//         }
//         window.addEventListener('scroll', handleScroll)
//         return () => window.removeEventListener('scroll', handleScroll)
//     }, [])

//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden'
//         } else {
//             document.body.style.overflow = 'unset'
//         }
//         return () => { document.body.style.overflow = 'unset' }
//     }, [isOpen])

//     // Load layout categories dynamically
//     useEffect(() => {
//         const loadActiveCategories = async () => {
//             try {
//                 const res = await fetch(API_CAT_URL)
//                 if (res.ok) {
//                     const data = await res.json()
//                     setCategories(data)
//                 }
//             } catch (err) {
//                 console.error("Navbar dynamic category failure:", err)
//             }
//         }
//         loadActiveCategories()
//     }, [])

//     useEffect(() => {
//         if (!isLoggedIn) {
//             setCartCount(0);
//             return;
//         }

//         const fetchNavbarCartCount = async () => {
//             try {
//                 const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/cart`, {
//                     headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
//                 });
//                 if (res.ok) {
//                     const data = await res.json();
//                     const totalItems = data.reduce((acc, item) => acc + (item.quantity || 0), 0);
//                     setCartCount(totalItems);
//                 }
//             } catch (err) {
//                 console.error("Failed synchronizing navbar cart badge count:", err);
//             }
//         };

//         fetchNavbarCartCount();
//         const intervalId = setInterval(fetchNavbarCartCount, 4000);
//         return () => clearInterval(intervalId);
//     }, [isLoggedIn]);

//     const handleLogout = () => {
//         const userName = localStorage.getItem("userName") || "Operator";
//         localStorage.removeItem("token");
//         localStorage.removeItem("userRole");
//         localStorage.removeItem("userName");
//         setIsOpen(false);
//         toast.success(`Goodbye, ${userName}. Session terminated.`);
//         navigate("/");
//     };

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         const params = new URLSearchParams();
//         if (navSearchQuery.trim()) {
//             params.set('search', navSearchQuery.trim());
//         }
//         if (selectedNavCategory) {
//             params.set('category', selectedNavCategory);
//         }
        
//         setIsSearchOpen(false);
//         navigate(`/allproducts?${params.toString()}`);
//     };

//     const midPoint = Math.ceil(categories.length / 2)
//     const columnOneItems = categories.slice(0, midPoint)
//     const columnTwoItems = categories.slice(midPoint)

//     const navLinks = [
//         {
//             name: 'Products',
//             path: '/allproducts', 
//             icon: <Layers className="w-4 h-4 text-lime-accent" />,
//             isMegaMenu: true,
//             sections: [
//                 { title: 'Apparel & Kicks', items: columnOneItems },
//                 { title: 'Gear & Accents', items: columnTwoItems }
//             ],
//             featured: { title: 'S26 Drops', tag: 'Limited Run', desc: 'Complete ecosystem tactical capsule.', image: '⚡' }
//         },
//         { name: 'About', path: '/about', icon: <HelpCircle className="w-4 h-4 text-lime-accent" />, isMegaMenu: false },
//         { name: 'My Orders', path: '/orders', icon: <ShoppingCart className="w-4 h-4 text-lime-accent" />, isMegaMenu: false },
//         { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4 text-lime-accent" />, isMegaMenu: false }
//     ]

//     const handleItemNavigation = (categoryName) => {
//         setIsOpen(false);
//         setActiveDropdown(null);
//         navigate(`/products/${categoryName.toLowerCase()}`);
//     }

//     return (
//         <>
//             <nav className={`fixed top-0 left-0 w-full z-40 px-4 md:px-12 transition-all duration-500 ${isScrolled || isSearchOpen ? 'bg-royal-main/95 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3 text-white' : 'bg-transparent border-b border-white/10 py-4 md:py-5 text-white'}`}>
//                 <div className="max-w-7xl mx-auto flex items-center justify-between relative">

//                     <div className={`flex md:hidden z-50 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
//                         <button onClick={() => setIsOpen(true)} className="focus:outline-none p-1 text-white hover:text-lime-accent cursor-pointer">
//                             <Menu className="w-6 h-6" />
//                         </button>
//                     </div>

//                     {/* DESKTOP LINKS */}
//                     <div className="hidden md:flex items-center space-x-7">
//                         {navLinks.map((link, idx) => {
//                             return (
//                                 <div key={link.name} className="static group" onMouseEnter={() => link.isMegaMenu && setActiveDropdown(idx)} onMouseLeave={() => setActiveDropdown(null)}>
//                                     <button onClick={() => !link.isMegaMenu && navigate(link.path)} className="text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-1 py-3 border-b-2 border-transparent hover:text-lime-accent transition-all duration-300 cursor-pointer">
//                                         {link.name}
//                                         {link.isMegaMenu && <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 text-white/40" />}
//                                     </button>

//                                     {link.isMegaMenu && (
//                                         <div className="absolute top-full left-0 w-full bg-royal-main/95 backdrop-blur-2xl border-x border-b border-white/10 rounded-b-2xl p-8 grid grid-cols-12 gap-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none scale-[0.98] transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 z-50">
//                                             <div className="col-span-8 flex flex-col space-y-6 text-left">
//                                                 <div className="border-b border-white/5 pb-4">
//                                                     <button onClick={() => { setActiveDropdown(null); navigate('/allproducts'); }} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-lime-accent hover:text-white transition-colors cursor-pointer group/all">
//                                                         <span>View All Products</span>
//                                                         <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
//                                                     </button>
//                                                 </div>
//                                                 <div className="grid grid-cols-2 gap-6">
//                                                     {link.sections.map((section, sIdx) => (
//                                                         <div key={sIdx} className="space-y-4">
//                                                             <h4 className="text-xl tracking-[0.3em] font-black uppercase text-white flex items-center gap-2">
//                                                                 {link.icon}
//                                                                 {section.title}
//                                                             </h4>
//                                                             <ul className="space-y-2.5">
//                                                                 {section.items.map((catItem) => (
//                                                                     <li key={catItem.id}>
//                                                                         <button onClick={() => handleItemNavigation(catItem.name)} className="text-lg text-white/60 hover:text-white font-medium flex items-center gap-1 group/item transition-colors w-full text-left cursor-pointer capitalize">
//                                                                             <span className="w-1.5 h-1.5 bg-white/10 rounded-full transition-all group-hover/item:w-3 group-hover/item:bg-lime-accent" />
//                                                                             {catItem.name}
//                                                                         </button>
//                                                                     </li>
//                                                                 ))}
//                                                             </ul>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                             {link.featured && (
//                                                 <div className="col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden text-left group/card hover:border-lime-accent/30 transition-colors">
//                                                     <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover/card:scale-110 transition-transform duration-500">{link.featured.image}</div>
//                                                     <div className="space-y-2">
//                                                         <span className="inline-block text-[9px] font-black bg-lime-accent text-royal-dark px-2 py-0.5 rounded uppercase tracking-wider">{link.featured.tag}</span>
//                                                         <h5 className="text-sm font-black uppercase tracking-wider text-white">{link.featured.title}</h5>
//                                                         <p className="text-[11px] text-white/50 leading-relaxed font-medium">{link.featured.desc}</p>
//                                                     </div>
//                                                     <button onClick={() => { setActiveDropdown(null); navigate('/allproducts'); }} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-lime-accent pt-4 hover:text-white transition-colors text-left cursor-pointer">
//                                                         Acquire Now <ArrowRight className="w-3 h-3" />
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             )
//                         })}
//                     </div>

//                     {/* LOGO */}
//                     <div onClick={() => { if (!isOpen) navigate("/"); }} className="flex items-center gap-2.5 cursor-pointer select-none absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-50">
//                         <img src={Logo} alt="Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
//                         <h1 className="text-base md:text-xl font-black tracking-widest uppercase text-white">AVG <span className="text-lime-accent font-light">MART</span></h1>
//                     </div>

//                     {/* ACTIONS: SEARCH, CART, LOGIN/LOGOUT */}
//                     <div className="flex items-center space-x-1 md:space-x-3 z-50">
//                         {/* SEARCH TRIGGER BUTTON */}
//                         <button 
//                             onClick={() => setIsSearchOpen(!isSearchOpen)} 
//                             className={`p-2 rounded-full transition-all hover:bg-white/10 cursor-pointer ${isSearchOpen ? 'bg-lime-accent text-royal-dark hover:text-royal-dark' : 'text-white'}`}
//                         >
//                             <Search className="w-4 h-4" />
//                         </button>

//                         <button onClick={() => navigate("/cart")} className="p-2 md:p-2.5 rounded-full hover:bg-white/5 transition-all relative group text-white cursor-pointer">
//                             <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
//                             {cartCount > 0 && (
//                                 <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-lime-accent text-royal-dark text-[9px] font-black tracking-tighter flex items-center justify-center animate-fadeIn shadow-[0_0_10px_rgba(165,206,0,0.6)] border border-royal-main/80">
//                                     {cartCount}
//                                 </span>
//                             )}
//                         </button>
                        
//                         <div className="hidden md:block">
//                             {isLoggedIn ? (
//                                 <button onClick={handleLogout} className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white transition-all duration-300 cursor-pointer">Logout <LogOut className="w-4 h-4" /></button>
//                             ) : (
//                                 <button onClick={() => navigate("/login")} className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white transition-all duration-300 cursor-pointer">Login <LogIn className="w-4 h-4" /></button>
//                             )}
//                         </div>
//                     </div>

//                 </div>

//                 {/* --- RESPONSIVE SEARCH FLOATING BAR OVERLAY --- */}
//                 {isSearchOpen && (
//                     <div className="mt-3 max-w-5xl mx-auto animate-fadeIn duration-300 px-2 md:px-0">
//                         <form 
//                             onSubmit={handleSearchSubmit} 
//                             className="bg-royal-dark/95 border border-lime-accent/30 rounded-2xl md:rounded-full p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-stretch md:items-center backdrop-blur-xl gap-2 md:gap-0"
//                         >
//                             {/* Search Keyword Input */}
//                             <div className="flex items-center flex-1 px-3 md:px-5 py-1.5 md:py-2 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
//                                 <Search className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
//                                 <input 
//                                     type="text" 
//                                     value={navSearchQuery}
//                                     onChange={(e) => setNavSearchQuery(e.target.value)}
//                                     placeholder="Search products..."
//                                     className="bg-transparent text-xs md:text-sm text-white placeholder-white/40 outline-none w-full font-medium"
//                                     autoFocus
//                                 />
//                             </div>

//                             <div className="hidden md:block w-[1px] h-8 bg-white/10" />

//                             {/* Category Dropdown */}
//                             <div className="flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
//                                 <select 
//                                     value={selectedNavCategory}
//                                     onChange={(e) => setSelectedNavCategory(e.target.value)}
//                                     className="bg-transparent text-xs text-white/80 font-bold outline-none cursor-pointer w-full capitalize"
//                                 >
//                                     <option value="" className="bg-royal-dark text-white">Select Category</option>
//                                     {categories.map((cat) => (
//                                         <option key={cat.id} value={cat.name} className="bg-royal-dark text-white capitalize">
//                                             {cat.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Submit Search Button */}
//                             <button 
//                                 type="submit" 
//                                 className="w-full md:w-auto bg-lime-accent hover:bg-white text-royal-dark font-black px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-full text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0"
//                             >
//                                 <Search className="w-3.5 h-3.5" />
//                                 <span>Search</span>
//                             </button>
//                         </form>
//                     </div>
//                 )}
//             </nav>

//             {/* --- MOBILE TAKEOVER PORTAL --- */}
//             <div className={`fixed inset-0 bg-royal-main text-white z-50 md:hidden flex flex-col justify-between transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
//                 <div className="w-full flex items-center justify-between px-6 py-5 border-b border-white/5 bg-royal-dark/20">
//                     <button onClick={() => setIsOpen(false)} className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
//                     <div className="flex items-center gap-2.5 select-none">
//                         <img src={Logo} alt="Logo" className="w-6 h-6 object-contain" />
//                         <h1 className="text-base font-black tracking-widest uppercase text-white">AVG <span className="text-lime-accent font-light">MART</span></h1>
//                     </div>
//                     <button onClick={() => { setIsOpen(false); navigate("/cart"); }} className="p-2 rounded-full hover:bg-white/5 relative text-white/70 hover:text-white">
//                         <ShoppingBag className="w-5 h-5" />
//                         {cartCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-accent shadow-[0_0_8px_rgba(165,206,0,0.8)]" />}
//                     </button>
//                 </div>

//                 <div className="flex-1 px-8 py-6 space-y-1.5 overflow-y-auto">
//                     {navLinks.map((link, index) => {
//                         return (
//                             <div key={link.name} className="border-b border-white/5 pb-3 pt-2">
//                                 <button
//                                     onClick={() => {
//                                         if (link.isMegaMenu) {
//                                             setActiveDropdown(activeDropdown === index ? null : index)
//                                         } else {
//                                             setIsOpen(false)
//                                             navigate(link.path)
//                                         }
//                                     }}
//                                     className="w-full flex items-center justify-between text-base font-black tracking-[0.15em] uppercase py-2 text-left hover:text-lime-accent transition-colors cursor-pointer"
//                                 >
//                                     <span>{link.name}</span>
//                                     {link.isMegaMenu && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-lime-accent' : 'text-white/30'}`} />}
//                                 </button>

//                                 {link.isMegaMenu && (
//                                     <div className={`space-y-4 pt-3 pl-2 overflow-hidden transition-all duration-300 ${activeDropdown === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
//                                         <div className="py-0.5">
//                                             <button onClick={() => { setIsOpen(false); navigate('/allproducts'); }} className="text-[11px] font-black tracking-wider text-lime-accent uppercase inline-flex items-center gap-1 cursor-pointer">All Products <ArrowRight className="w-3 h-3" /></button>
//                                         </div>
//                                         {link.sections.map((section, sIdx) => (
//                                             <div key={sIdx} className="space-y-2">
//                                                 <h5 className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40">{section.title}</h5>
//                                                 <div className="grid grid-cols-2 gap-2">
//                                                     {section.items.map((catItem) => (
//                                                         <button key={catItem.id} onClick={() => handleItemNavigation(catItem.name)} className="text-xs text-white/60 hover:text-white py-1 font-medium text-left w-full cursor-pointer capitalize">
//                                                             {catItem.name}
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         )
//                     })}
//                 </div>

//                 <div className="p-8 bg-royal-dark/40 border-t border-white/5 space-y-4">
//                     {isLoggedIn ? (
//                         <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer">Logout <LogOut className="w-4 h-4" /></button>
//                     ) : (
//                         <button onClick={() => { setIsOpen(false); navigate("/login"); }} className="w-full flex items-center justify-center gap-2 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white transition-all duration-300 shadow-[0_4px_25px_rgba(165,206,0,0.3)] cursor-pointer">Login <LogIn className="w-4 h-4" /></button>
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Navbar


import React, { useState, useEffect, useRef } from 'react'
import { 
    Search, ShoppingBag, User, LogOut, ChevronDown, Zap, 
    Sparkles, Home, Smartphone, Headphones, Shirt, Utensils, Package, MapPin, X, Navigation, Check, AlertCircle, RefreshCw, ChevronRight, LayoutGrid, ArrowRight
} from 'lucide-react'
import Logo from "../assets/logo.png"
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const POPULAR_CITIES = [
    "Bengaluru", "Mumbai", "Delhi NCR", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"
];

// Dynamic Lucide Icon Mapper
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

    // Mobile Search Overlay Toggle State
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    // Location States & Modal Control
    const [userLocationText, setUserLocationText] = useState('Select Location')
    const [isLocationLoading, setIsLocationLoading] = useState(false)
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const [manualCityInput, setManualCityInput] = useState('')
    const [isPermissionBlocked, setIsPermissionBlocked] = useState(false)

    // Reference for Horizontal Category Scroll Container
    const scrollContainerRef = useRef(null);
    const searchInputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isLoggedIn = !!localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "User";

    // Auto focus search input when mobile overlay opens
    useEffect(() => {
        if (isMobileSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);

    // Dynamic Route Syncing
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

    // Check localStorage or verify Permission Status on mount
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

    // Reverse Geocoding
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

    // Load active categories
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

    // Synchronize cart count
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

                    {/* LOCATION PILL SELECTOR (DESKTOP) */}
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

                                {/* ACTION SUBMIT BUTTON FOR MOBILE SEARCH */}
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

                    {/* USER ACTIONS: SEARCH TRIGGER, PROFILE & CART */}
                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        
                        {/* MOBILE SEARCH ICON BUTTON */}
                        <button
                            type="button"
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="sm:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label="Open Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* PROFILE MENU */}
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

                            {/* ELEGANT PROFILE DROPDOWN */}
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

                        {/* SHOPPING CART BUTTON WITH HIGHLIGHT BADGE */}
                        <button 
                            onClick={() => navigate("/cart")} 
                            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 relative"
                        >
                            <ShoppingBag className="w-4 h-4 text-[#A5CE00]" />
                            <span className="hidden sm:inline">Cart</span>
                            {isCartLoading ? (
                                <span className="w-4 h-4 rounded-full bg-gray-700 animate-pulse" />
                            ) : cartCount > 0 ? (
                                <span 
                                    className="bg-[#A5CE00] text-black text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center"
                                >
                                    {cartCount}
                                </span>
                            ) : null}
                        </button>

                    </div>
                </div>

                {/* HORIZONTAL CATEGORY NAVIGATION BAR WITH FADE MASKS */}
                <div className="border-t border-gray-100/80 bg-white/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center relative">
                        
                        {/* CATEGORY SCROLLER */}
                        <div 
                            ref={scrollContainerRef}
                            className="flex items-center gap-2 sm:gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 text-xs font-bold text-gray-600 whitespace-nowrap flex-1 scroll-smooth pr-10"
                        >
                            {/* ALL CATEGORIES BUTTON - ALWAYS VISIBLE */}
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

                            {/* DYNAMIC CATEGORY PILLS */}
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

                        {/* RIGHT CHEVRON NAVIGATION ACTION */}
                        <div className="absolute right-2 top-0 bottom-0 flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-6 pointer-events-none">
                            <button
                                onClick={handleNextCategoryScroll}
                                className="pointer-events-auto p-1.5 rounded-xl bg-gray-900 hover:bg-black text-white transition-all cursor-pointer shadow-xs active:scale-90"
                                title="Next Categories"
                            >
                                <ChevronRight className="w-3.5 h-3.5 text-[#A5CE00]" />
                            </button>
                        </div>

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

                        {/* PERMISSION BLOCKED INSTRUCTIONAL BOX */}
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
                            /* USE CURRENT GPS LOCATION BUTTON */
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

                        {/* MANUAL INPUT */}
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

                        {/* POPULAR CITIES */}
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