import React, { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Search, Heart, ChevronDown, ArrowRight, Sparkles, Tag, Layers, Flame, LogIn } from 'lucide-react'
import Logo from "../assets/logo.png"
import { Navigate, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const navigate = useNavigate();

    // Track scrolling behavior to trigger the background morph
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Immersive E-Commerce Content Mapping Structure
    const navLinks = [
        {
            name: 'Shop All',
            icon: <Layers className="w-4 h-4 text-lime-accent" />,
            categories: [
                { title: 'Core Devices', items: ['Smartphones Pro', 'Smartwatches X', 'Mirrorless Cameras', 'Audio Pods'] },
                { title: 'Wearables', items: ['Tactical Kicks', 'Cyber Jackets', 'Utility Vests', 'Techpack Belts'] }
            ],
            featured: { title: 'Vault Bundle', tag: 'Save 20%', desc: 'Complete ecosystem drop.', image: '⌚' }
        },
        {
            name: 'New Arrivals',
            icon: <Flame className="w-4 h-4 text-lime-accent" />,
            categories: [
                { title: 'S26 Drops', items: ['Matrix Phone Matte', 'Phantom Lens Gen-3', 'Chrono Watch V2'] },
                { title: 'Limited Run', items: ['Volt Runner Sneakers', 'Modular Cargo Slings'] }
            ],
            featured: { title: 'Hyper Kick', tag: 'Selling Fast', desc: 'Limited quantities remaining.', image: '👟' }
        },
        {
            name: 'Collections',
            icon: <Tag className="w-4 h-4 text-lime-accent" />,
            categories: [
                { title: 'By Aesthetics', items: ['Cyberpunk Neon Line', 'Minimal Titanium Series', 'Tactical Stealth Kit'] },
                { title: 'Collaborations', items: ['AVG x Neo- Tokyo', 'Hardware Syndicate'] }
            ],
            featured: { title: 'Stealth Pack', tag: 'New Era', desc: 'Curated for premium creators.', image: '📷' }
        },
        {
            name: 'Our Story',
            icon: <Sparkles className="w-4 h-4 text-lime-accent" />,
            categories: [], // Removed dropdown items
            featured: null
        }
    ]

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
                    {navLinks.map((link, idx) => (
                        <div
                            key={link.name}
                            className="static group"
                            onMouseEnter={() => link.categories.length > 0 && setActiveDropdown(idx)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button
                                className={`text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-1 py-3 border-b-2 border-transparent hover:text-lime-accent transition-all duration-300`}
                            >
                                {link.name}
                                {link.categories.length > 0 && (
                                    <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 text-white/40" />
                                )}
                            </button>

                            {/* --- DROPDOWN MEGAMENU CONTAINER PANEL --- */}
                            {link.categories.length > 0 && (
                                <div
                                    className={`absolute top-full left-0 w-full bg-royal-main/95 backdrop-blur-2xl border-x border-b border-white/10 rounded-b-2xl p-8 grid grid-cols-12 gap-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none scale-[0.98] transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 z-50`}
                                >
                                    {/* Categorized Menu Columns */}
                                    <div className="col-span-8 grid grid-cols-2 gap-6 text-left">
                                        {link.categories.map((cat, cIdx) => (
                                            <div key={cIdx} className="space-y-4">
                                                <h4 className="text-3xl tracking-[0.3em] font-black uppercase text-lime-accent flex items-center gap-2">
                                                    {link.icon}
                                                    {cat.title}
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {cat.items.map((item) => (
                                                        <li key={item}>
                                                            <a
                                                                href="#"
                                                                className="text-2xl text-white/60 hover:text-white font-medium flex items-center gap-1 group/item transition-colors"
                                                            >
                                                                <span className="w-1.5 h-1.5 bg-white/10 rounded-full transition-all group-hover/item:w-3 group-hover/item:bg-lime-accent" />
                                                                {item}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
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
                                            <a href="#" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-lime-accent pt-4 hover:text-white transition-colors">
                                                Acquire Now <ArrowRight className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* LOGO BOX BRAND IDENTITY */}
                <div className="flex items-center gap-2.5 cursor-pointer select-none absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
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

                    {/* Heart Container Button */}
                    <button className="p-2 rounded-full hover:bg-white/5 transition-all relative group text-white">
                        <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span className="absolute -top-0.5 -right-0.5 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black bg-lime-accent text-royal-dark">
                            2
                        </span>
                    </button>

                    {/* Bag Actions Box Button */}
                    <button className="p-2 rounded-full hover:bg-white/5 transition-all relative group text-white">
                        <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-lime-accent"></span>
                    </button>
                    
                    {/* DESKTOP ONLY LOGIN BUTTON */}
                    <div className="hidden md:block pointer-events-auto">
                        <button
                            onClick={() => navigate("/login")}
                            className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.45)]"
                        >
                            Login
                            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

            </div>

            {/* --- RESPONSIVE MOBILE ACCORDION DRAWER OVERLAY --- */}
            <div
                className={`fixed inset-0 top-0 left-0 bg-royal-main/98 backdrop-blur-2xl text-white z-40 transition-all duration-500 ease-in-out md:hidden flex flex-col justify-between p-6 pt-24 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                    }`}
            >
                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                    {navLinks.map((link, index) => (
                        <div key={link.name} className="border-b border-white/5 pb-2">
                            <button
                                onClick={() => link.categories.length > 0 && setActiveDropdown(activeDropdown === index ? null : index)}
                                className="w-full flex items-center justify-between text-lg font-black tracking-widest uppercase py-2 text-left hover:text-lime-accent transition-colors"
                            >
                                {link.name}
                                {link.categories.length > 0 && (
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-lime-accent' : 'text-white/30'}`} />
                                )}
                            </button>

                            {/* Mobile Submenu Accordion Expansion Layout */}
                            {link.categories.length > 0 && (
                                <div
                                    className={`space-y-4 pt-2 pl-2 overflow-hidden transition-all duration-300 ${activeDropdown === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                                        }`}
                                >
                                    {link.categories.map((cat, cIdx) => (
                                        <div key={cIdx} className="space-y-2">
                                            <h5 className="text-[9px] font-black tracking-[0.2em] uppercase text-lime-accent/80">{cat.title}</h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                {cat.items.map((item) => (
                                                    <a key={item} href="#" className="text-xs text-white/50 hover:text-white py-1 font-medium">
                                                        {item}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Bottom Interface Bar (Search & Login Footer Section) */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <Search className="w-4 h-4 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent text-xs pl-3 outline-none w-full text-white placeholder-white/30 font-medium"
                        />
                    </div>
                    
                    {/* MOBILE LOGIN TRIGGER */}
                    {/* <button
                        onClick={() => Navigate("/login")}
                        className="w-full group flex items-center justify-center gap-3 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white active:scale-[0.99] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.3)]"
                    >
                        Login
                        <LogIn className="w-4 h-4" />
                    </button> */}
                    <a href="/login" 
                        className="w-full group flex items-center justify-center gap-3 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white active:scale-[0.99] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.3)]"
                    >Login <LogIn className="w-4 h-4" /></a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

// import React, { useState, useEffect } from 'react'
// import { Menu, X, ShoppingBag, Search, Heart, ChevronDown, ArrowRight, Sparkles, Tag, Layers, Flame, LogIn } from 'lucide-react'
// import Logo from "../assets/logo.png"

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false)
//     const [isScrolled, setIsScrolled] = useState(false)
//     const [activeDropdown, setActiveDropdown] = useState(null)

//     // Track scrolling behavior to trigger the background morph
//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 50)
//         }
//         window.addEventListener('scroll', handleScroll)
//         return () => window.removeEventListener('scroll', handleScroll)
//     }, [])

//     // Immersive E-Commerce Content Mapping Structure
//     const navLinks = [
//         {
//             name: 'Shop All',
//             icon: <Layers className="w-4 h-4 text-lime-accent" />,
//             categories: [
//                 { title: 'Core Devices', items: ['Smartphones Pro', 'Smartwatches X', 'Mirrorless Cameras', 'Audio Pods'] },
//                 { title: 'Wearables', items: ['Tactical Kicks', 'Cyber Jackets', 'Utility Vests', 'Techpack Belts'] }
//             ],
//             featured: { title: 'Vault Bundle', tag: 'Save 20%', desc: 'Complete ecosystem drop.', image: '⌚' }
//         },
//         {
//             name: 'New Arrivals',
//             icon: <Flame className="w-4 h-4 text-lime-accent" />,
//             categories: [
//                 { title: 'S26 Drops', items: ['Matrix Phone Matte', 'Phantom Lens Gen-3', 'Chrono Watch V2'] },
//                 { title: 'Limited Run', items: ['Volt Runner Sneakers', 'Modular Cargo Slings'] }
//             ],
//             featured: { title: 'Hyper Kick', tag: 'Selling Fast', desc: 'Limited quantities remaining.', image: '👟' }
//         },
//         {
//             name: 'Collections',
//             icon: <Tag className="w-4 h-4 text-lime-accent" />,
//             categories: [
//                 { title: 'By Aesthetics', items: ['Cyberpunk Neon Line', 'Minimal Titanium Series', 'Tactical Stealth Kit'] },
//                 { title: 'Collaborations', items: ['AVG x Neo- Tokyo', 'Hardware Syndicate'] }
//             ],
//             featured: { title: 'Stealth Pack', tag: 'New Era', desc: 'Curated for premium creators.', image: '📷' }
//         },
//         {
//             name: 'Our Story',
//             icon: <Sparkles className="w-4 h-4 text-lime-accent" />,
//             categories: [], 
//             featured: null
//         }
//     ]

//     return (
//         <nav
//             className={`fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-12 transition-all duration-500 ${
//                 isScrolled
//                     ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-md py-3 text-royal-dark'
//                     : 'bg-transparent border-b border-white/10 py-5 text-white'
//             }`}
//         >
//             <div className="max-w-7xl mx-auto flex items-center justify-between relative">

//                 {/* MOBILE TRIGGER */}
//                 <div className="flex md:hidden">
//                     <button
//                         onClick={() => setIsOpen(!isOpen)}
//                         className="focus:outline-none p-1 transition-colors relative z-50"
//                         aria-label="Toggle Menu"
//                     >
//                         {isOpen ? (
//                             <X className={`w-6 h-6 ${isScrolled ? 'text-royal-dark' : 'text-white'}`} />
//                         ) : (
//                             <Menu className={`w-6 h-6 ${isScrolled ? 'text-royal-dark' : 'text-white'}`} />
//                         )}
//                     </button>
//                 </div>

//                 {/* DESKTOP NAV LINKS WITH MEGAMENU HOVER STATES */}
//                 <div className="hidden md:flex items-center space-x-7">
//                     {navLinks.map((link, idx) => (
//                         <div
//                             key={link.name}
//                             className="static group"
//                             onMouseEnter={() => link.categories.length > 0 && setActiveDropdown(idx)}
//                             onMouseLeave={() => setActiveDropdown(null)}
//                         >
//                             <button
//                                 className={`text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-1 py-3 border-b-2 border-transparent transition-all duration-300 ${
//                                     isScrolled 
//                                         ? 'text-royal-dark hover:text-lime-accent' 
//                                         : 'text-white hover:text-lime-accent'
//                                 }`}
//                             >
//                                 {link.name}
//                                 {link.categories.length > 0 && (
//                                     <ChevronDown className={`w-3 h-3 transition-transform duration-300 group-hover:rotate-180 ${isScrolled ? 'text-royal-dark/40' : 'text-white/40'}`} />
//                                 )}
//                             </button>

//                             {/* --- DROPDOWN MEGAMENU CONTAINER PANEL --- */}
//                             {link.categories.length > 0 && (
//                                 <div
//                                     className={`absolute top-full left-0 w-full rounded-b-2xl p-8 grid grid-cols-12 gap-8 shadow-[0_30px_70px_rgba(0,0,0,0.15)] opacity-0 pointer-events-none scale-[0.98] transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 z-50 ${
//                                         isScrolled 
//                                             ? 'bg-white border-x border-b border-black/5' 
//                                             : 'bg-royal-main/95 backdrop-blur-2xl border-x border-b border-white/10'
//                                     }`}
//                                 >
//                                     {/* Categorized Menu Columns */}
//                                     <div className="col-span-8 grid grid-cols-2 gap-6 text-left">
//                                         {link.categories.map((cat, cIdx) => (
//                                             <div key={cIdx} className="space-y-4">
//                                                 <h4 className="text-3xl tracking-[0.3em] font-black uppercase text-lime-accent flex items-center gap-2">
//                                                     {link.icon}
//                                                     {cat.title}
//                                                 </h4>
//                                                 <ul className="space-y-2.5">
//                                                     {cat.items.map((item) => (
//                                                         <li key={item}>
//                                                             <a
//                                                                 href="#"
//                                                                 className={`text-xs font-medium flex items-center gap-1 group/item transition-colors ${
//                                                                     isScrolled ? 'text-royal-dark/60 hover:text-royal-dark' : 'text-white/60 hover:text-white'
//                                                                 }`}
//                                                             >
//                                                                 <span className={`w-1.5 h-1.5 rounded-full transition-all group-hover/item:w-3 group-hover/item:bg-lime-accent ${isScrolled ? 'bg-royal-dark/10' : 'bg-white/10'}`} />
//                                                                 {item}
//                                                             </a>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Interactive Right-Side Feature Banner Card */}
//                                     {link.featured && (
//                                         <div className={`col-span-4 border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden text-left group/card hover:border-lime-accent/30 transition-colors ${
//                                             isScrolled ? 'bg-black/[0.02] border-black/5' : 'bg-white/5 border-white/10'
//                                         }`}>
//                                             <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover/card:scale-110 transition-transform duration-500">
//                                                 {link.featured.image}
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <span className="inline-block text-[9px] font-black bg-lime-accent text-royal-dark px-2 py-0.5 rounded uppercase tracking-wider">
//                                                     {link.featured.tag}
//                                                 </span>
//                                                 <h5 className={`text-sm font-black uppercase tracking-wider ${isScrolled ? 'text-royal-dark' : 'text-white'}`}>
//                                                     {link.featured.title}
//                                                 </h5>
//                                                 <p className={`text-[11px] leading-relaxed font-medium ${isScrolled ? 'text-royal-dark/60' : 'text-white/50'}`}>
//                                                     {link.featured.desc}
//                                                 </p>
//                                             </div>
//                                             <a href="#" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-lime-accent pt-4 hover:text-royal-dark dark:hover:text-white transition-colors">
//                                                 Acquire Now <ArrowRight className="w-3 h-3" />
//                                             </a>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* LOGO BOX BRAND IDENTITY */}
//                 <div className="flex items-center gap-2.5 cursor-pointer select-none absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
//                     <img src={Logo} alt="AVG MART Logo" className="w-7 h-7 object-contain" />
//                     <h1 className={`text-lg md:text-xl font-black tracking-widest uppercase transition-colors duration-300 ${isScrolled ? 'text-royal-dark' : 'text-white'}`}>
//                         AVG <span className="text-lime-accent font-light">MART</span>
//                     </h1>
//                 </div>

//                 {/* RIGHT SYSTEM ACTIONS UTILITIES */}
//                 <div className="flex items-center space-x-2 md:space-x-4">
//                     <div className={`hidden lg:flex items-center rounded-full px-3 py-1.5 border transition-colors ${
//                         isScrolled 
//                             ? 'bg-black/[0.03] border-black/5 focus-within:border-lime-accent' 
//                             : 'bg-white/5 border-white/10 focus-within:border-lime-accent'
//                     }`}>
//                         <Search className={`w-3.5 h-3.5 ${isScrolled ? 'text-royal-dark/40' : 'text-white/60'}`} />
//                         <input
//                             type="text"
//                             placeholder="Search assets..."
//                             className={`bg-transparent text-xs pl-2 outline-none w-28 focus:w-40 transition-all duration-300 font-medium ${
//                                 isScrolled ? 'text-royal-dark placeholder-royal-dark/30' : 'text-white placeholder-white/30'
//                             }`}
//                         />
//                     </div>

//                     {/* Heart Container Button */}
//                     <button className={`p-2 rounded-full transition-all relative group ${isScrolled ? 'hover:bg-black/[0.04] text-royal-dark' : 'hover:bg-white/5 text-white'}`}>
//                         <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
//                         <span className="absolute -top-0.5 -right-0.5 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black bg-lime-accent text-royal-dark">
//                             2
//                         </span>
//                     </button>

//                     {/* Bag Actions Box Button */}
//                     <button className={`p-2 rounded-full transition-all relative group ${isScrolled ? 'hover:bg-black/[0.04] text-royal-dark' : 'hover:bg-white/5 text-white'}`}>
//                         <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
//                         <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-lime-accent"></span>
//                     </button>
                    
//                     {/* DESKTOP ONLY LOGIN BUTTON */}
//                     <div className="hidden md:block pointer-events-auto">
//                         <button
//                             className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-6 py-3 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-royal-dark hover:text-white hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.35)]"
//                         >
//                             Login
//                             <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//                         </button>
//                     </div>
//                 </div>

//             </div>

//             {/* --- RESPONSIVE MOBILE ACCORDION DRAWER OVERLAY --- */}
//             {/* Kept dark themed for deep visual consistency on mobile takeovers */}
//             <div
//                 className={`fixed inset-0 top-0 left-0 bg-royal-main/98 backdrop-blur-2xl text-white z-40 transition-all duration-500 ease-in-out md:hidden flex flex-col justify-between p-6 pt-24 ${
//                     isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
//                 }`}
//             >
//                 <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
//                     {navLinks.map((link, index) => (
//                         <div key={link.name} className="border-b border-white/5 pb-2">
//                             <button
//                                 onClick={() => link.categories.length > 0 && setActiveDropdown(activeDropdown === index ? null : index)}
//                                 className="w-full flex items-center justify-between text-lg font-black tracking-widest uppercase py-2 text-left hover:text-lime-accent transition-colors"
//                             >
//                                 {link.name}
//                                 {link.categories.length > 0 && (
//                                     <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-lime-accent' : 'text-white/30'}`} />
//                                 )}
//                             </button>

//                             {/* Mobile Submenu Accordion Expansion Layout */}
//                             {link.categories.length > 0 && (
//                                 <div
//                                     className={`space-y-4 pt-2 pl-2 overflow-hidden transition-all duration-300 ${
//                                         activeDropdown === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
//                                     }`}
//                                 >
//                                     {link.categories.map((cat, cIdx) => (
//                                         <div key={cIdx} className="space-y-2">
//                                             <h5 className="text-[9px] font-black tracking-[0.2em] uppercase text-lime-accent/80">{cat.title}</h5>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 {cat.items.map((item) => (
//                                                     <a key={item} href="#" className="text-xs text-white/50 hover:text-white py-1 font-medium">
//                                                         {item}
//                                                     </a>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Mobile Bottom Interface Bar (Search & Login Footer Section) */}
//                 <div className="border-t border-white/10 pt-4 space-y-3">
//                     <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
//                         <Search className="w-4 h-4 text-white/50" />
//                         <input
//                             type="text"
//                             placeholder="Search products..."
//                             className="bg-transparent text-xs pl-3 outline-none w-full text-white placeholder-white/30 font-medium"
//                         />
//                     </div>
                    
//                     {/* MOBILE LOGIN TRIGGER */}
//                     <button
//                         className="w-full group flex items-center justify-center gap-3 bg-lime-accent text-royal-dark py-3.5 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white active:scale-[0.99] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.3)]"
//                     >
//                         Login
//                         <LogIn className="w-4 h-4" />
//                     </button>
//                 </div>
//             </div>
//         </nav>
//     )
// }

// export default Navbar