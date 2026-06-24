import React, { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Search, ChevronDown, ArrowRight, Layers, LogIn, LogOut, ShoppingCart, User, HelpCircle } from 'lucide-react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const navigate = useNavigate();

    // Check if the user is authenticated by looking for a token
    const isLoggedIn = !!localStorage.getItem("token");

    // Track scrolling behavior to trigger the background morph
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Logout engine handler
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        setIsOpen(false);
        navigate("/"); // Redirect to home page
    };

    // Restructured Premium Navlinks Configuration Matrix
    const navLinks = [
        {
            name: 'Products',
            path: '/allproducts', // Maps cleanly to your overview catalog
            icon: <Layers className="w-4 h-4 text-lime-accent" />,
            categories: [
                { title: 'Apparel & Kicks', items: ['T-Shirts', 'Shoes'] },
                { title: 'Gear & Accents', items: ['Watches', 'Belts'] }
            ],
            featured: { title: 'S26 Drops', tag: 'Limited Run', desc: 'Complete ecosystem tactical capsule.', image: '⚡' }
        },
        {
            name: 'About',
            path: '/about',
            icon: <HelpCircle className="w-4 h-4 text-lime-accent" />,
            categories: [], // No dropdown layout
            featured: null
        },
        {
            name: 'My Orders',
            path: '/orders',
            icon: <ShoppingCart className="w-4 h-4 text-lime-accent" />,
            categories: [], // No dropdown layout
            featured: null
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: <User className="w-4 h-4 text-lime-accent" />,
            categories: [], // No dropdown layout
            featured: null
        }
    ]

    // Shared navigation routing logic for desktop and mobile submenus
    const handleItemNavigation = (item) => {
        setIsOpen(false);
        setActiveDropdown(null);
        
        if (item === 'T-Shirts') navigate('/products/t-shirts');
        else if (item === 'Shoes') navigate('/products/shoes');
        else if (item === 'Watches') navigate('/products/watches');
        else if (item === 'Belts') navigate('/products/belts');
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 transition-all duration-500 ${isScrolled
                    ? 'bg-royal-main/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3 text-white'
                    : 'bg-transparent border-b border-white/10 py-5 text-white'
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                {/* MOBILE TRIGGER */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="focus:outline-none p-1 transition-colors relative z-50"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                    </button>
                </div>

                {/* DESKTOP NAV LINKS WITH MEGAMENU HOVER STATES */}
                <div className="hidden md:flex items-center space-x-7">
                    {navLinks.map((link, idx) => {
                        const hasDropdown = link.categories.length > 0;
                        
                        return (
                            <div
                                key={link.name}
                                className="static group"
                                onMouseEnter={() => hasDropdown && setActiveDropdown(idx)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    onClick={() => !hasDropdown && navigate(link.path)}
                                    className="text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-1 py-3 border-b-2 border-transparent hover:text-lime-accent transition-all duration-300 cursor-pointer"
                                >
                                    {link.name}
                                    {hasDropdown && (
                                        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 text-white/40" />
                                    )}
                                </button>

                                {/* --- DROPDOWN MEGAMENU CONTAINER PANEL --- */}
                                {hasDropdown && (
                                    <div
                                        className="absolute top-full left-0 w-full bg-royal-main/95 backdrop-blur-2xl border-x border-b border-white/10 rounded-b-2xl p-8 grid grid-cols-12 gap-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none scale-[0.98] transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 z-50"
                                    >
                                        {/* Categorized Menu Columns */}
                                        <div className="col-span-8 flex flex-col space-y-6 text-left">
                                            
                                            {/* Primary "All Products" Access Vector */}
                                            <div className="border-b border-white/5 pb-4">
                                                <button 
                                                    onClick={() => { setActiveDropdown(null); navigate('/allproducts'); }}
                                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-lime-accent hover:text-white transition-colors cursor-pointer group/all"
                                                >
                                                    <span>View All Products</span>
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                {link.categories.map((cat, cIdx) => (
                                                    <div key={cIdx} className="space-y-4">
                                                        <h4 className="text-2xl tracking-[0.3em] font-black uppercase text-white flex items-center gap-2">
                                                            {link.icon}
                                                            {cat.title}
                                                        </h4>
                                                        <ul className="space-y-2.5">
                                                            {cat.items.map((item) => (
                                                                <li key={item}>
                                                                    <button
                                                                        onClick={() => handleItemNavigation(item)}
                                                                        className="text-2xl text-white/60 hover:text-white font-medium flex items-center gap-1 group/item transition-colors w-full text-left cursor-pointer"
                                                                    >
                                                                        <span className="w-1.5 h-1.5 bg-white/10 rounded-full transition-all group-hover/item:w-3 group-hover/item:bg-lime-accent" />
                                                                        {item}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Interactive Right-Side Feature Banner Card */}
                                        {link.featured && (
                                            <div className="col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden text-left group/card hover:border-lime-accent/30 transition-colors">
                                                <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover/card:scale-110 transition-transform duration-500">
                                                    {link.featured.image}
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="inline-block text-[9px] font-black bg-lime-accent text-royal-dark px-2 py-0.5 rounded uppercase tracking-wider">
                                                        {link.featured.tag}
                                                    </span>
                                                    <h5 className="text-sm font-black uppercase tracking-wider text-white">
                                                        {link.featured.title}
                                                    </h5>
                                                    <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                                                        {link.featured.desc}
                                                    </p>
                                                </div>
                                                <button onClick={() => { setActiveDropdown(null); navigate('/allproducts'); }} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-lime-accent pt-4 hover:text-white transition-colors text-left cursor-pointer">
                                                    Acquire Now <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* LOGO BOX BRAND IDENTITY */}
                <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer select-none absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                    <img src={Logo} alt="AVG MART Logo" className="w-7 h-7 object-contain" />
                    <h1 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">
                        AVG <span className="text-lime-accent font-light">MART</span>
                    </h1>
                </div>

                {/* RIGHT SYSTEM ACTIONS UTILITIES */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="hidden lg:flex items-center rounded-full px-3 py-1.5 border bg-white/5 border-white/10 focus-within:border-lime-accent transition-colors">
                        <Search className="w-3.5 h-3.5 text-white/60" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="bg-transparent text-xs pl-2 outline-none w-28 focus:w-40 transition-all duration-300 font-medium text-white placeholder-white/30"
                        />
                    </div>

                    {/* Bag Actions Box Button */}
                    <button onClick={() => navigate("/cart")} className="p-2 rounded-full hover:bg-white/5 transition-all relative group text-white cursor-pointer">
                        <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-lime-accent"></span>
                    </button>
                    
                    {/* DESKTOP DYNAMIC ACTION SWITCH TRIGGER */}
                    <div className="hidden md:block pointer-events-auto">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.45)] cursor-pointer"
                            >
                                Logout
                                <LogOut className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.45)] cursor-pointer"
                            >
                                Login
                                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* --- RESPONSIVE MOBILE ACCORDION DRAWER OVERLAY --- */}
            <div
                className={`fixed inset-0 top-0 left-0 bg-royal-main/98 backdrop-blur-2xl text-white z-40 transition-all duration-500 ease-in-out md:hidden flex flex-col justify-between p-6 pt-24 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                    }`}
            >
                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                    {navLinks.map((link, index) => {
                        const hasDropdown = link.categories.length > 0;

                        return (
                            <div key={link.name} className="border-b border-white/5 pb-2">
                                <button
                                    onClick={() => {
                                        if (hasDropdown) {
                                            setActiveDropdown(activeDropdown === index ? null : index)
                                        } else {
                                            setIsOpen(false)
                                            navigate(link.path)
                                        }
                                    }}
                                    className="w-full flex items-center justify-between text-lg font-black tracking-widest uppercase py-2 text-left hover:text-lime-accent transition-colors cursor-pointer"
                                >
                                    {link.name}
                                    {hasDropdown && (
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-lime-accent' : 'text-white/30'}`} />
                                    )}
                                </button>

                                {/* Mobile Submenu Accordion Expansion Layout */}
                                {hasDropdown && (
                                    <div
                                        className={`space-y-4 pt-2 pl-2 overflow-hidden transition-all duration-300 ${activeDropdown === index ? 'max-h-[450px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                                            }`}
                                    >
                                        <div className="py-1">
                                            <button 
                                                onClick={() => { setIsOpen(false); navigate('/allproducts'); }}
                                                className="text-xs font-black tracking-wider text-lime-accent uppercase inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                All Products Matrix <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {link.categories.map((cat, cIdx) => (
                                            <div key={cIdx} className="space-y-2">
                                                <h5 className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40">{cat.title}</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {cat.items.map((item) => (
                                                        <button 
                                                            key={item} 
                                                            onClick={() => handleItemNavigation(item)} 
                                                            className="text-xs text-white/50 hover:text-white py-1 font-medium text-left w-full cursor-pointer"
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Mobile Bottom Interface Bar */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <Search className="w-4 h-4 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent text-xs pl-3 outline-none w-full text-white placeholder-white/30 font-medium"
                        />
                    </div>
                    
                    {/* MOBILE DYNAMIC ACTION TRIGGER */}
                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout}
                            className="w-full group flex items-center justify-center gap-3 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white active:scale-[0.99] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.3)] cursor-pointer"
                        >
                            Logout <LogOut className="w-4 h-4" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setIsOpen(false); navigate("/login"); }}
                            className="w-full group flex items-center justify-center gap-3 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white active:scale-[0.99] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.3)] cursor-pointer"
                        >
                            Login <LogIn className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar