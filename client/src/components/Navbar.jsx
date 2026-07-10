import React, { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Search, ChevronDown, ArrowRight, Layers, LogIn, LogOut, ShoppingCart, User, HelpCircle } from 'lucide-react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [cartCount, setCartCount] = useState(0)
    const [categories, setCategories] = useState([]) // <-- Dynamic state bucket
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    // Load layout categories dynamically from S3/DB tables instantly
    useEffect(() => {
        const loadActiveCategories = async () => {
            try {
                const res = await fetch(API_CAT_URL)
                if (res.ok) {
                    const data = await res.json()
                    setCategories(data)
                }
            } catch (err) {
                console.error("Navbar dynamic category failure:", err)
            }
        }
        loadActiveCategories()
    }, [])

    useEffect(() => {
        if (!isLoggedIn) {
            setCartCount(0);
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
                console.error("Failed synchronizing navbar cart badge count:", err);
            }
        };

        fetchNavbarCartCount();
        const intervalId = setInterval(fetchNavbarCartCount, 4000);
        return () => clearInterval(intervalId);
    }, [isLoggedIn]);

    const handleLogout = () => {
        const userName = localStorage.getItem("userName") || "Operator";
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        setIsOpen(false);
        toast.success(`Goodbye, ${userName}. Session terminated.`);
        navigate("/");
    };

    // Splitting the dynamic categories equally between two display column lists
    const midPoint = Math.ceil(categories.length / 2)
    const columnOneItems = categories.slice(0, midPoint)
    const columnTwoItems = categories.slice(midPoint)

    const navLinks = [
        {
            name: 'Products',
            path: '/allproducts', 
            icon: <Layers className="w-4 h-4 text-lime-accent" />,
            isMegaMenu: true,
            sections: [
                { title: 'Apparel & Kicks', items: columnOneItems },
                { title: 'Gear & Accents', items: columnTwoItems }
            ],
            featured: { title: 'S26 Drops', tag: 'Limited Run', desc: 'Complete ecosystem tactical capsule.', image: '⚡' }
        },
        { name: 'About', path: '/about', icon: <HelpCircle className="w-4 h-4 text-lime-accent" />, isMegaMenu: false },
        { name: 'My Orders', path: '/orders', icon: <ShoppingCart className="w-4 h-4 text-lime-accent" />, isMegaMenu: false },
        { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4 text-lime-accent" />, isMegaMenu: false }
    ]

    const handleItemNavigation = (categoryName) => {
        setIsOpen(false);
        setActiveDropdown(null);
        // Direct route redirect pointing straight into our dynamic catch handler matching route configurations
        navigate(`/products/${categoryName.toLowerCase()}`);
    }

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-40 px-6 py-4 md:px-12 transition-all duration-500 ${isScrolled ? 'bg-royal-main/95 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3 text-white' : 'bg-transparent border-b border-white/10 py-5 text-white'}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                    <div className={`flex md:hidden z-50 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <button onClick={() => setIsOpen(true)} className="focus:outline-none p-1 text-white hover:text-lime-accent cursor-pointer">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* DESKTOP LINKS */}
                    <div className="hidden md:flex items-center space-x-7">
                        {navLinks.map((link, idx) => {
                            return (
                                <div key={link.name} className="static group" onMouseEnter={() => link.isMegaMenu && setActiveDropdown(idx)} onMouseLeave={() => setActiveDropdown(null)}>
                                    <button onClick={() => !link.isMegaMenu && navigate(link.path)} className="text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-1 py-3 border-b-2 border-transparent hover:text-lime-accent transition-all duration-300 cursor-pointer">
                                        {link.name}
                                        {link.isMegaMenu && <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 text-white/40" />}
                                    </button>

                                    {link.isMegaMenu && (
                                        <div className="absolute top-full left-0 w-full bg-royal-main/95 backdrop-blur-2xl border-x border-b border-white/10 rounded-b-2xl p-8 grid grid-cols-12 gap-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none scale-[0.98] transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 z-50">
                                            <div className="col-span-8 flex flex-col space-y-6 text-left">
                                                <div className="border-b border-white/5 pb-4">
                                                    <button onClick={() => { setActiveDropdown(null); navigate('/allproducts'); }} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-lime-accent hover:text-white transition-colors cursor-pointer group/all">
                                                        <span>View All Products</span>
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    {link.sections.map((section, sIdx) => (
                                                        <div key={sIdx} className="space-y-4">
                                                            <h4 className="text-xl tracking-[0.3em] font-black uppercase text-white flex items-center gap-2">
                                                                {link.icon}
                                                                {section.title}
                                                            </h4>
                                                            <ul className="space-y-2.5">
                                                                {section.items.map((catItem) => (
                                                                    <li key={catItem.id}>
                                                                        <button onClick={() => handleItemNavigation(catItem.name)} className="text-lg text-white/60 hover:text-white font-medium flex items-center gap-1 group/item transition-colors w-full text-left cursor-pointer capitalize">
                                                                            <span className="w-1.5 h-1.5 bg-white/10 rounded-full transition-all group-hover/item:w-3 group-hover/item:bg-lime-accent" />
                                                                            {catItem.name}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {link.featured && (
                                                <div className="col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden text-left group/card hover:border-lime-accent/30 transition-colors">
                                                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover/card:scale-110 transition-transform duration-500">{link.featured.image}</div>
                                                    <div className="space-y-2">
                                                        <span className="inline-block text-[9px] font-black bg-lime-accent text-royal-dark px-2 py-0.5 rounded uppercase tracking-wider">{link.featured.tag}</span>
                                                        <h5 className="text-sm font-black uppercase tracking-wider text-white">{link.featured.title}</h5>
                                                        <p className="text-[11px] text-white/50 leading-relaxed font-medium">{link.featured.desc}</p>
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

                    <div onClick={() => { if (!isOpen) navigate("/"); }} className="flex items-center gap-2.5 cursor-pointer select-none absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-50">
                        <img src={Logo} alt="Logo" className="w-7 h-7 object-contain" />
                        <h1 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">AVG <span className="text-lime-accent font-light">MART</span></h1>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4 z-50">
                        <button onClick={() => navigate("/cart")} className="p-2.5 rounded-full hover:bg-white/5 transition-all relative group text-white cursor-pointer">
                            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-lime-accent text-royal-dark text-[9px] font-black tracking-tighter flex items-center justify-center animate-fadeIn shadow-[0_0_10px_rgba(165,206,0,0.6)] border border-royal-main/80">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        
                        <div className="hidden md:block">
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white transition-all duration-300 cursor-pointer">Logout <LogOut className="w-4 h-4" /></button>
                            ) : (
                                <button onClick={() => navigate("/login")} className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white transition-all duration-300 cursor-pointer">Login <LogIn className="w-4 h-4" /></button>
                            )}
                        </div>
                    </div>

                </div>
            </nav>

            {/* --- MOBILE TAKEOVER PORTAL --- */}
            <div className={`fixed inset-0 bg-royal-main text-white z-50 md:hidden flex flex-col justify-between transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <div className="w-full flex items-center justify-between px-6 py-5 border-b border-white/5 bg-royal-dark/20">
                    <button onClick={() => setIsOpen(false)} className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
                    <div className="flex items-center gap-2.5 select-none">
                        <img src={Logo} alt="Logo" className="w-6 h-6 object-contain" />
                        <h1 className="text-base font-black tracking-widest uppercase text-white">AVG <span className="text-lime-accent font-light">MART</span></h1>
                    </div>
                    <button onClick={() => { setIsOpen(false); navigate("/cart"); }} className="p-2 rounded-full hover:bg-white/5 relative text-white/70 hover:text-white">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-accent shadow-[0_0_8px_rgba(165,206,0,0.8)]" />}
                    </button>
                </div>

                <div className="flex-1 px-8 py-6 space-y-1.5 overflow-y-auto">
                    {navLinks.map((link, index) => {
                        return (
                            <div key={link.name} className="border-b border-white/5 pb-3 pt-2">
                                <button
                                    onClick={() => {
                                        if (link.isMegaMenu) {
                                            setActiveDropdown(activeDropdown === index ? null : index)
                                        } else {
                                            setIsOpen(false)
                                            navigate(link.path)
                                        }
                                    }}
                                    className="w-full flex items-center justify-between text-base font-black tracking-[0.15em] uppercase py-2 text-left hover:text-lime-accent transition-colors cursor-pointer"
                                >
                                    <span>{link.name}</span>
                                    {link.isMegaMenu && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-lime-accent' : 'text-white/30'}`} />}
                                </button>

                                {link.isMegaMenu && (
                                    <div className={`space-y-4 pt-3 pl-2 overflow-hidden transition-all duration-300 ${activeDropdown === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                        <div className="py-0.5">
                                            <button onClick={() => { setIsOpen(false); navigate('/allproducts'); }} className="text-[11px] font-black tracking-wider text-lime-accent uppercase inline-flex items-center gap-1 cursor-pointer">All Products <ArrowRight className="w-3 h-3" /></button>
                                        </div>
                                        {link.sections.map((section, sIdx) => (
                                            <div key={sIdx} className="space-y-2">
                                                <h5 className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40">{section.title}</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {section.items.map((catItem) => (
                                                        <button key={catItem.id} onClick={() => handleItemNavigation(catItem.name)} className="text-xs text-white/60 hover:text-white py-1 font-medium text-left w-full cursor-pointer capitalize">
                                                            {catItem.name}
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

                <div className="p-8 bg-royal-dark/40 border-t border-white/5 space-y-4">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer">Logout <LogOut className="w-4 h-4" /></button>
                    ) : (
                        <button onClick={() => { setIsOpen(false); navigate("/login"); }} className="w-full flex items-center justify-center gap-2 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white transition-all duration-300 shadow-[0_4px_25px_rgba(165,206,0,0.3)] cursor-pointer">Login <LogIn className="w-4 h-4" /></button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar