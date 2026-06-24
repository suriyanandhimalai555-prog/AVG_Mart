import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Plus, ShieldCheck, CreditCard, Sparkles, User, Mail, ArrowLeft, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast' // <-- Imported toast engine

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const orderAmount = location.state?.subtotal || 0

  const [userProfile, setUserProfile] = useState({ name: '', email: '' })
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [showAddForm, setShowAddForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    tag: 'Home', phone: '', streetName: '', landmark: '', city: '', state: '', district: '', pincode: ''
  })

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to continue to checkout.")
      navigate('/login')
      return
    }

    const loadCheckoutCoreData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data.user)
          setAddresses(data.addresses || [])
          if (data.addresses && data.addresses.length > 0) {
            setSelectedAddressId(data.addresses[0].id)
          }
        } else {
          toast.error("Failed to load checkout settings.")
        }
      } catch (err) {
        console.error("Failed parsing authentication registry matrix structures:", err)
        toast.error("Network problem loading user profile information.")
      } finally {
        setIsLoading(false)
      }
    }
    loadCheckoutCoreData()
  }, [token, navigate])

  const handleAddNewAddress = async (e) => {
    e.preventDefault()
    const addressToastId = toast.loading("Saving new address details...")

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      })
      if (response.ok) {
        const addedAddress = await response.json()
        setAddresses(prev => [...prev, addedAddress])
        setSelectedAddressId(addedAddress.id)
        setShowAddForm(false)
        setAddressForm({ tag: 'Home', phone: '', streetName: '', landmark: '', city: '', state: '', district: '', pincode: '' })
        toast.success("Address successfully saved to your profile!", { id: addressToastId })
      } else {
        toast.error("Could not save the address. Please check your data.", { id: addressToastId })
      }
    } catch (err) {
      console.error("Error creating address model deployment:", err)
      toast.error("Network error. Address addition failed.", { id: addressToastId })
    }
  }

  const handleExecutionProcessPayment = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address to proceed.")
      return;
    }

    const gatewayToastId = toast.loading("Initializing payment tunnel...")

    try {
      const responseOrder = await fetch("http://localhost:5000/api/auth/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: orderAmount })
      });

      if (!responseOrder.ok) throw new Error("Could not instantiate system layer transactions options.");
      const orderData = await responseOrder.json();
      
      // Dismiss initialization loader before presenting payment overlay window interface
      toast.dismiss(gatewayToastId);

      const options = {
        key: "rzp_test_T5NEmNwILnfzHd", 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Premium Hardware Ecosystem",
        description: "Live Resource Operational Settlement Node",
        order_id: orderData.id,
        handler: async function (response) {
          const verificationToastId = toast.loading("Verifying transaction settlement...")
          
          try {
            const verifyRes = await fetch("http://localhost:5000/api/auth/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address_id: selectedAddressId,
                amount: orderAmount
              })
            });

            if (verifyRes.ok) {
              toast.success("Payment successful! Your order has been placed.", { id: verificationToastId, duration: 4000 });
              navigate("/orders"); 
            } else {
              toast.error("Payment validation signature check failed.", { id: verificationToastId });
            }
          } catch (verifyErr) {
            console.error("Verification processing endpoint failure channel:", verifyErr);
            toast.error("Network error checking payment signature state verification.", { id: verificationToastId })
          }
        },
        prefill: {
          name: userProfile.name,
          email: userProfile.email,
        },
        theme: {
          color: "#a5ce00"
        },
        modal: {
          ondismiss: function() {
            toast.error("Payment checkout process cancelled by user.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment pipeline routing crash tracking diagnostic:", error);
      toast.error("Could not initialize the checkout gateway pipeline.", { id: gatewayToastId });
    }
  };

  // --- PAKKA 6-DAY ARITHMETIC TRACKING LAYER SYSTEM ---
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

  if (isLoading) {
    return (
      <div className="bg-royal-dark text-white min-h-screen flex items-center justify-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse">
        Decompressing transactional sector layers arrays...
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" />

        
        <div className="max-w-6xl mx-auto relative z-10 mt-6">
          <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-3 h-3" /> Back to Cart
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-lime-accent">
                  <Sparkles className="w-4 h-4" /> Customer Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-white/60">
                  <div className="flex items-center gap-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                    <User className="w-4 h-4 text-white/30" />
                    <div><p className="text-[9px] uppercase tracking-wider text-white/30">Name</p><p className="text-white font-bold">{userProfile.name}</p></div>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                    <Mail className="w-4 h-4 text-white/30" />
                    <div><p className="text-[9px] uppercase tracking-wider text-white/30">Mail ID</p><p className="text-white font-bold truncate">{userProfile.email}</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                    <MapPin className="w-4 h-4 text-lime-accent" /> Delivery Address
                  </div>
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-1.5 text-[9px] font-black bg-white/5 hover:bg-lime-accent hover:text-royal-dark border border-white/10 hover:border-transparent px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add Address
                  </button>
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddNewAddress} className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">Tag</label><input type="text" required value={addressForm.tag} onChange={(e) => setAddressForm({...addressForm, tag: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">Phone</label><input type="text" required value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">City</label><input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">Pincode</label><input type="text" required value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">Street Name</label><input type="text" required value={addressForm.streetName} onChange={(e) => setAddressForm({...addressForm, streetName: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">District</label><input type="text" required value={addressForm.district} onChange={(e) => setAddressForm({...addressForm, district: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                      <div className="space-y-1"><label className="text-[8px] font-bold text-white/40 uppercase">State</label><input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-royal-dark border border-white/10 p-2.5 text-xs rounded-lg text-white" /></div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-lime-accent text-royal-dark text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer">Deploy Data Set</button>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="text-xs text-white/30 italic">No spatial routing entries resolved on database links. Map a node coordinates location above to proceed.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 relative overflow-hidden ${
                          selectedAddressId === addr.id 
                            ? 'bg-lime-accent/[0.04] border-lime-accent/40 shadow-md' 
                            : 'bg-black/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? 'border-lime-accent' : 'border-white/20'}`}>
                          {selectedAddressId === addr.id && <div className="w-1.5 h-1.5 bg-lime-accent rounded-full" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/5 text-white">{addr.tag}</span>
                            <span className="text-[10px] font-mono text-white/40">{addr.phone}</span>
                          </div>
                          <p className="text-xs font-medium text-white/80">{addr.street_name || addr.streetName}, {addr.landmark && `${addr.landmark},`} {addr.city}, {addr.district}, {addr.state} - <span className="font-mono font-bold text-lime-accent">{addr.pincode}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-6 backdrop-blur-md space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-3">Order Summary</h3>
              
              <div className="space-y-3 text-xs font-medium text-white/50 border-b border-white/5 pb-4">
                <div className="flex justify-between"><span>Total Amount</span><span className="font-mono text-white">₹{orderAmount.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Ecosystem Delivery Pathing</span><span className="text-lime-accent font-black text-[9px] uppercase">Free Encryption Transit</span></div>
              </div>

              {/* ESTIMATED TIMELINE BLOCK */}
              <div className="flex justify-between items-center border-white/5 text-[11px]">
                <span className="flex items-center gap-1 text-white/40"><Calendar className="w-3.5 h-3.5 text-lime-accent/70" /> Estimated Arrival:</span>
                <span className="font-mono font-bold text-lime-accent">{calculateDefaultEstimatedArrival()}</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black uppercase tracking-wider">Total Amount</span>
                <span className="text-2xl font-mono font-black text-lime-accent">₹{orderAmount.toLocaleString('en-IN')}</span>
              </div>

              <button 
                onClick={handleExecutionProcessPayment}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark px-6 py-4 font-black uppercase tracking-[0.15em] text-[11px] rounded-xl shadow-xl transition-all transform active:scale-95 group cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> Pay & Place Order
              </button>

              <div className="flex items-center gap-2.5 text-[9px] text-white/40 pt-2 font-medium tracking-wide">
                <ShieldCheck className="w-4 h-4 text-lime-accent flex-shrink-0" /> Razorpay Secured Checkout Tunnel Protocol Active.
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout