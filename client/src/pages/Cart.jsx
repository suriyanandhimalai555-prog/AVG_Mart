import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Cpu, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Mock initial data matching your productsData structure
const INITIAL_CART = [
  {
    id: 1,
    name: 'Matrix Phone Matte 24',
    category: 'Core Devices',
    price: 1249,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop',
    quantity: 1,
    specSelected: 'Quantum Tensor SoC'
  },
  {
    id: 3,
    name: 'Phantom Lens Gen-3 X',
    category: 'Optics Pro',
    price: 899,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=600&auto=format&fit=crop',
    quantity: 2,
    specSelected: 'f/0.95 Spectral Aperture'
  }
]

const Cart = () => {
  const [cartItems, setCartItems] = useState(INITIAL_CART)
  const navigate = useNavigate()

  // Handler functions for cart adjustments
  const updateQuantity = (id, amount) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  // Value Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const securityTax = subtotal > 0 ? 45 : 0 // Encrypted routing fee
  const shipping = subtotal > 0 ? 0 : 0 // Free tier node delivery
  const totalWeight = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const estimatedTotal = subtotal + securityTax + shipping

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden selection:bg-lime-accent selection:text-royal-dark">
        
        {/* Ambient Cyber Backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-lime-accent/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Track */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
            <div className="text-left space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
                <Sparkles className="w-3 h-3 text-lime-accent" /> Security Protocol Loadout
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
                System <span className="text-lime-accent font-light">Cart</span> Manifest
              </h1>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs text-white/40 tracking-wider uppercase font-bold">Active Allocation Matrix</span>
              <p className="text-sm font-black text-white mt-1">
                [{totalWeight}] Hardware {totalWeight === 1 ? 'Unit' : 'Units'} Registered
              </p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            /* EMPTY STATE TERMINAL BOX */
            <div className="border border-dashed border-white/10 bg-white/[0.02] rounded-2xl p-16 text-center max-w-2xl mx-auto space-y-6 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-widest text-white">No Assets Provisioned</h3>
                <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
                  Your tracking ledger is currently unallocated. Access the catalog terminal to add premium nodes.
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 bg-lime-accent hover:bg-lime-400 text-royal-dark px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_25px_rgba(165,206,0,0.2)]"
              >
                Open Terminal Catalog
              </button>
            </div>
          ) : (
            /* ACTIVE GRID LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* CART ITEMS MATRIX ARRAY */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-r from-white/[0.04] to-transparent border border-white/5 hover:border-white/10 p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 hover:bg-white/[0.06]"
                  >
                    {/* Left Meta: Visual + Name Descriptor */}
                    <div className="flex items-center gap-5 text-left flex-1">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover filter contrast-110 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/30 to-transparent" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-lime-accent bg-lime-accent/10 px-2 py-0.5 rounded border border-lime-accent/10">
                          {item.category}
                        </span>
                        <h3 className="text-base md:text-xl font-black uppercase tracking-wide text-white truncate group-hover:text-lime-accent transition-colors pt-1">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-white/40 font-medium truncate flex items-center gap-1.5">
                          <Cpu className="w-3 h-3 text-white/30" /> Spec: {item.specSelected}
                        </p>
                      </div>
                    </div>

                    {/* Right Meta: Controls + Value Calculation */}
                    <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                      {/* Quantity Toggles Counter */}
                      <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black tracking-wide text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Multiplied Evaluation */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 block">Acquisition</span>
                        <span className="text-base md:text-lg font-black text-white tracking-wide">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Drop Node Control */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all group/bin"
                      >
                        <Trash2 className="w-4 h-4 group-hover/bin:scale-110 transition-transform" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* SUMMARY LEDGER ACCOUNTING BLOCK (Premium Glass Box) */}
              <div className="lg:col-span-4">
                <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/10 p-6 md:p-8 rounded-2xl text-left space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 pb-4">
                    Manifest Pricing Ledger
                  </h3>

                  {/* Math Breakdown Row Elements */}
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span className="font-medium tracking-wide">Subtotal Net Allocation</span>
                      <span className="font-black text-white">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span className="font-medium tracking-wide">Secure Data-Link Routing</span>
                      <span className="font-black text-white">${securityTax}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span className="font-medium tracking-wide">Node Freight Despatch</span>
                      <span className="font-black text-lime-accent uppercase tracking-wider text-[10px]">
                        {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                      </span>
                    </div>
                    
                    <hr className="border-white/5 my-2" />
                    
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">Total Valuation</span>
                      <span className="text-3xl font-black text-white tracking-tight">
                        ${estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Operational Checkout Trigger Buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => alert('Order pipeline secure. Processing protocol configuration.')}
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl shadow-[0_10px_30px_rgba(165,206,0,0.25)] transition-all transform active:scale-[0.98] group"
                    >
                      Proceed to Secure Node Checkout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <Link
                      to="/"
                      className="w-full inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all text-center"
                    >
                      Aggregate More Assets
                    </Link>
                  </div>

                  {/* Data Verification Badge */}
                  <div className="flex items-center gap-2.5 text-[10px] text-white/40 pt-4 border-t border-white/5 font-medium tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-lime-accent drop-shadow-[0_0_4px_rgba(165,206,0,0.3)] flex-shrink-0" />
                    End-to-End Encrypted Settlement Layer Active.
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Cart