import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Sparkles, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      toast.error("Your session has expired. Redirecting to login...", {
        duration: 3000
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const fetchCartItemsFromDB = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/auth/cart", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data);
        } else {
          toast.error("Failed to load your shopping cart.");
        }
      } catch (err) {
        console.error("Failed fetching live cart registry payload matrix:", err);
        toast.error("Network error. Could not retrieve cart items.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItemsFromDB();
  }, [token, navigate]);

  const updateQuantity = async (id, currentQty, adjustment) => {
    const targetQty = currentQty + adjustment;
    const toastId = toast.loading("Updating item quantity...");

    try {
      const res = await fetch(`http://localhost:5000/api/auth/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: targetQty })
      });

      if (res.ok) {
        if (targetQty <= 0) {
          setCartItems(prev => prev.filter(item => item.id !== id));
          toast.success("Item removed from cart.", { id: toastId });
        } else {
          setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: targetQty } : item));
          toast.success("Cart updated successfully.", { id: toastId });
        }
      } else {
        toast.error("Could not update item quantity.", { id: toastId });
      }
    } catch (err) {
      console.error("Quantity sync manipulation anomaly:", err);
      toast.error("Network problem. Cart update failed.", { id: toastId });
    }
  };

  const removeItem = async (id) => {
    const toastId = toast.loading("Removing item from cart...");

    try {
      const res = await fetch(`http://localhost:5000/api/auth/cart/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast.success("Item successfully deleted.", { id: toastId });
      } else {
        toast.error("Could not remove the item.", { id: toastId });
      }
    } catch (err) {
      console.error("Purging element route fault:", err);
      toast.error("Network problem. Item removal failed.", { id: toastId });
    }
  };

  const calculateDefaultEstimatedArrival = () => {
    try {
      const parsedDate = new Date();
      parsedDate.setDate(parsedDate.getDate() + 6);
      const targetDay = String(parsedDate.getDate()).padStart(2, '0');
      const targetMonth = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const targetYear = parsedDate.getFullYear();
      return `${targetDay}/${targetMonth}/${targetYear}`;
    } catch (e) {
      return 'Within 6 Days';
    }
  };

  const handleProceedToCheckout = () => {
    // PAKKA CONFIGURATION RULE: Size verification constraints strictly enforced ONLY for clothing or shoe items
    const invalidItem = cartItems.find(item => {
      const itemCategory = (item.category || "").toLowerCase().trim();
      const isSizeRequiredCategory = itemCategory === 't-shirt' || itemCategory === 'shoe';
      const isSizeMissing = !item.selected_size || item.selected_size.trim() === '';
      
      return isSizeRequiredCategory && isSizeMissing;
    });
    
    if (invalidItem) {
      toast.error(`Cannot place order! Please click on "${invalidItem.name}" to assign its configuration size matrix.`, {
        duration: 4000,
        style: {
          background: '#1c1c1e',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.3)',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });
      return;
    }

    navigate('/checkout', { state: { subtotal } });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 mt-6">
          <div className="flex flex-col items-start space-y-2 mb-12 border-b border-white/5 pb-6">
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
              <Sparkles className="w-3 h-3 text-lime-accent" /> Secure Allocation Ledger
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
              Configuration <span className="text-lime-accent font-light">Cart</span> Loadout
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-20">
              Querying localized db payload structures...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-20 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Cart Ledger Empty</h3>
                <p className="text-xs text-white/40 max-w-xs mx-auto leading-relaxed">
                  No active resource components provisioned inside this session profile yet.
                </p>
              </div>
              <Link to="/products" className="inline-flex bg-lime-accent text-royal-dark text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-transform hover:scale-105">
                Browse Asset Drops
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item) => {
                  const currentCategory = (item.category || "").toLowerCase().trim();
                  const requiresSizing = currentCategory === 't-shirt' || currentCategory === 'shoe';

                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md hover:border-white/10 transition-colors text-left">
                      
                      <div 
                        onClick={() => navigate(`/product/${item.product_id}`, { 
                          state: { fromCartItemId: item.id, existingSize: item.selected_size, existingQty: item.quantity } 
                        })}
                        className="flex items-center gap-4 w-full sm:w-auto cursor-pointer group flex-1"
                      >
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0 group-hover:border-lime-accent/40 transition-colors">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-lime-accent group-hover:underline">
                            {item.category} {requiresSizing && '(Click to re-configure)'}
                          </span>
                          <h3 className="text-base font-black uppercase tracking-wide text-white line-clamp-1 group-hover:text-lime-accent transition-colors">{item.name}</h3>
                          
                          {/* DYNAMIC METRIC LABELLING TRAY */}
                          <div className="pt-0.5 pb-1">
                            {requiresSizing ? (
                              item.selected_size && item.selected_size.trim() !== '' ? (
                                <span className="inline-block text-[10px] bg-lime-accent/10 text-lime-accent border border-lime-accent/20 font-mono font-bold px-2 py-0.5 rounded">
                                  SIZE: {item.selected_size}
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 font-mono font-bold px-2 py-0.5 rounded animate-pulse">
                                  MISSING SIZE CONFIGURATION
                                </span>
                              )
                            ) : (
                              <span className="inline-block text-[10px] bg-white/5 text-gray-400 border border-white/5 font-mono px-2 py-0.5 rounded">
                                STANDARD COMPONENT N/A
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-mono text-white/60">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-8 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity, -1)} className="p-2 hover:text-lime-accent transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-3 text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity, 1)} className="p-2 hover:text-lime-accent transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-mono font-black text-white">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                        </div>

                        <button onClick={() => removeItem(item.id)} className="p-2.5 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-white/40 hover:text-red-400 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-6 backdrop-blur-md space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-3">Order Summary</h3>
                
                <div className="space-y-3 font-medium text-xs text-white/60 border-b border-white/5 pb-4">
                  <div className="flex justify-between"><span>Total Amount</span><span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Ecosystem Transport (Delivery)</span><span className="text-lime-accent uppercase text-[10px] font-black">Free Secure Node</span></div>
                </div>
                
                <div className="flex justify-between items-center border-white/5 text-[11px]">
                  <span className="flex items-center gap-1 text-white/40"><Calendar className="w-3.5 h-3.5 text-lime-accent/70" /> Estimated Arrival:</span>
                  <span className="font-mono font-bold text-lime-accent">{calculateDefaultEstimatedArrival()}</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-wider">Total Charge Matrix</span>
                  <span className="text-2xl font-mono font-black text-lime-accent">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl shadow-lg transition-transform transform active:scale-95 group"
                >
                  Proceed to Secure Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-2.5 text-[10px] text-white/40 pt-2 font-medium tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-lime-accent" /> End-to-End Encrypted Settlement Active.
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