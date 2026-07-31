import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Plus, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  User, 
  Mail, 
  ArrowLeft, 
  Calendar,
  CheckCircle2,
  Lock
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'
import EcommerceLoader from '../components/EcommerceLoader'

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const orderAmount = location.state?.subtotal || 0

  const [userProfile, setUserProfile] = useState({ name: '', email: '' })
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false)

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
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data.user || { name: '', email: '' })
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
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile/address`, {
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

    const gatewayToastId = toast.loading("Initializing secure payment session...")

    try {
      const responseOrder = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: orderAmount })
      });

      if (!responseOrder.ok) throw new Error("Could not instantiate transaction order.");
      const orderData = await responseOrder.json();

      toast.dismiss(gatewayToastId);

      const options = {
        key: "rzp_test_T5NEmNwILnfzHd",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AVG Mart",
        description: `Order #${orderData.id ? orderData.id.slice(-8).toUpperCase() : 'CHECKOUT'}`,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", // Brand Logo URL
        order_id: orderData.id,
        handler: async function (response) {
          const verificationToastId = toast.loading("Verifying transaction...")

          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/payment/verify`, {
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
              toast.success("Payment successful! Redirecting to orders...", { id: verificationToastId, duration: 3000 });
              setIsProcessingRedirect(true);
              setTimeout(() => {
                navigate("/orders");
              }, 1200);
            } else {
              toast.error("Payment validation signature check failed.", { id: verificationToastId });
            }
          } catch (verifyErr) {
            console.error("Verification processing endpoint failure:", verifyErr);
            toast.error("Network error checking payment signature state.", { id: verificationToastId })
          }
        },
        prefill: {
          name: userProfile.name,
          email: userProfile.email,
        },
        notes: {
          address_id: selectedAddressId
        },
        theme: {
          color: "#a5ce00", // Custom Lime Accent
          backdrop_color: "#0d0f12",
          hide_topbar: false
        },
        modal: {
          confirm_close: true,
          ondismiss: function () {
            toast.error("Payment process cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment pipeline routing error:", error);
      toast.error("Could not initialize the checkout gateway.", { id: gatewayToastId });
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

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-royal-dark">
        <EcommerceLoader message="Initializing Checkout Protocol..." />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        
        {/* Fullscreen Post-Payment Redirection Loader */}
        {isProcessingRedirect && (
          <div className="fixed inset-0 z-50">
            <EcommerceLoader message="Payment Confirmed! Preparing Your Order..." />
          </div>
        )}

        {/* Ambient Grid Background Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-accent/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 mt-4">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="group inline-flex items-center gap-2 text-white/70 hover:text-lime-accent text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Cart</span>
            </button>

            {/* <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-accent bg-lime-accent/10 border border-lime-accent/20 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted Checkout</span>
            </div> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">

            {/* Left Column: User Profile & Delivery Addresses */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-lime-accent">
                  <Sparkles className="w-4 h-4" /> Account Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                  <div className="flex items-center gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <User className="w-4 h-4 text-white/40 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Full Name</p>
                      <p className="text-white font-bold truncate">{userProfile.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <Mail className="w-4 h-4 text-white/40 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Email Address</p>
                      <p className="text-white font-bold truncate">{userProfile.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Selection Card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                    <MapPin className="w-4 h-4 text-lime-accent" /> Select Delivery Address
                  </div>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black bg-lime-accent text-royal-dark hover:bg-lime-400 px-3.5 py-1.5 rounded-lg transition-all uppercase tracking-wider shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Cancel' : 'New Address'}
                  </button>
                </div>

                {/* Add Address Form Drawer */}
                {showAddForm && (
                  <form onSubmit={handleAddNewAddress} className="bg-black/50 border border-white/10 p-5 rounded-xl space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">Tag</label>
                        <input type="text" required value={addressForm.tag} onChange={(e) => setAddressForm({ ...addressForm, tag: e.target.value })} placeholder="Home / Work" className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">Phone</label>
                        <input type="text" required value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="10-digit number" className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">City</label>
                        <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">Pincode</label>
                        <input type="text" required value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">Street / Flat No.</label>
                        <input type="text" required value={addressForm.streetName} onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">District</label>
                        <input type="text" required value={addressForm.district} onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/50 uppercase">State</label>
                        <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md">
                      Save Address
                    </button>
                  </form>
                )}

                {/* Existing Address Cards Grid */}
                {addresses.length === 0 ? (
                  <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10 space-y-2">
                    <p className="text-xs text-white/50">No delivery addresses found in your profile.</p>
                    <p className="text-[10px] text-lime-accent uppercase font-bold">Please add an address to complete checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 relative ${
                            isSelected
                              ? 'bg-lime-accent/[0.06] border-lime-accent shadow-[0_0_20px_rgba(165,206,0,0.1)]'
                              : 'bg-black/30 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-lime-accent" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-white/20" />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-white tracking-wider">
                                {addr.tag}
                              </span>
                              <span className="text-[11px] font-mono text-white/50">{addr.phone}</span>
                            </div>
                            <p className="text-xs font-medium text-white/80 leading-relaxed">
                              {addr.street_name || addr.streetName}, {addr.landmark && `${addr.landmark}, `}
                              {addr.city}, {addr.district}, {addr.state} - <span className="font-mono font-bold text-lime-accent">{addr.pincode}</span>
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Payment Gateway CTA */}
            <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6 sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/10 pb-4 text-white">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-xs font-medium text-white/60 border-b border-white/10 pb-5">
                <div className="flex justify-between items-center">
                  <span>Subtotal Amount</span>
                  <span className="font-mono font-bold text-white text-sm">₹{orderAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  <span className="text-lime-accent font-black text-[10px] uppercase bg-lime-accent/10 px-2 py-0.5 rounded border border-lime-accent/20">
                    Free Transit
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-white/50">
                    <Calendar className="w-3.5 h-3.5 text-lime-accent" /> Estimated Arrival
                  </span>
                  <span className="font-mono font-bold text-lime-accent">{calculateDefaultEstimatedArrival()}</span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block text-white">Grand Total</span>
                  <span className="text-[10px] text-white/40">Includes all applicable taxes</span>
                </div>
                <span className="text-3xl font-mono font-black text-lime-accent">
                  ₹{orderAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecutionProcessPayment}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark px-6 py-4 font-black uppercase tracking-[0.15em] text-xs rounded-xl shadow-[0_4px_25px_rgba(165,206,0,0.25)] transition-all transform active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> Pay & Place Order
              </button>

              {/* Whitelabel / Security Badges */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/50 font-medium">
                  <Lock className="w-3.5 h-3.5 text-lime-accent" />
                  <span>Secured by Razorpay Gateway</span>
                </div>
                <p className="text-[9px] text-white/30 text-center leading-tight">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
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