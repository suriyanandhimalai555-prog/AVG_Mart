// import React, { useState, useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { 
//   MapPin, 
//   Plus, 
//   ShieldCheck, 
//   CreditCard, 
//   Sparkles, 
//   User, 
//   Mail, 
//   ArrowLeft, 
//   Calendar,
//   CheckCircle2,
//   Lock
// } from 'lucide-react'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import { toast } from 'react-hot-toast'
// import EcommerceLoader from '../components/EcommerceLoader'

// const Checkout = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const token = localStorage.getItem("token")
//   const orderAmount = location.state?.subtotal || 0

//   const [userProfile, setUserProfile] = useState({ name: '', email: '' })
//   const [addresses, setAddresses] = useState([])
//   const [selectedAddressId, setSelectedAddressId] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isProcessingRedirect, setIsProcessingRedirect] = useState(false)

//   const [showAddForm, setShowAddForm] = useState(false)
//   const [addressForm, setAddressForm] = useState({
//     tag: 'Home', phone: '', streetName: '', landmark: '', city: '', state: '', district: '', pincode: ''
//   })

//   useEffect(() => {
//     if (!token) {
//       toast.error("Please log in to continue to checkout.")
//       navigate('/login')
//       return
//     }

//     const loadCheckoutCoreData = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, {
//           headers: { "Authorization": `Bearer ${token}` }
//         })
//         if (response.ok) {
//           const data = await response.json()
//           setUserProfile(data.user || { name: '', email: '' })
//           setAddresses(data.addresses || [])
//           if (data.addresses && data.addresses.length > 0) {
//             setSelectedAddressId(data.addresses[0].id)
//           }
//         } else {
//           toast.error("Failed to load checkout settings.")
//         }
//       } catch (err) {
//         console.error("Failed parsing authentication registry matrix structures:", err)
//         toast.error("Network problem loading user profile information.")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadCheckoutCoreData()
//   }, [token, navigate])

//   const handleAddNewAddress = async (e) => {
//     e.preventDefault()
//     const addressToastId = toast.loading("Saving new address details...")

//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile/address`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(addressForm)
//       })
//       if (response.ok) {
//         const addedAddress = await response.json()
//         setAddresses(prev => [...prev, addedAddress])
//         setSelectedAddressId(addedAddress.id)
//         setShowAddForm(false)
//         setAddressForm({ tag: 'Home', phone: '', streetName: '', landmark: '', city: '', state: '', district: '', pincode: '' })
//         toast.success("Address successfully saved to your profile!", { id: addressToastId })
//       } else {
//         toast.error("Could not save the address. Please check your data.", { id: addressToastId })
//       }
//     } catch (err) {
//       console.error("Error creating address model deployment:", err)
//       toast.error("Network error. Address addition failed.", { id: addressToastId })
//     }
//   }

//   const handleExecutionProcessPayment = async () => {
//     if (!selectedAddressId) {
//       toast.error("Please select or add a delivery address to proceed.")
//       return;
//     }

//     const gatewayToastId = toast.loading("Initializing secure payment session...")

//     try {
//       const responseOrder = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/payment/order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({ amount: orderAmount })
//       });

//       if (!responseOrder.ok) throw new Error("Could not instantiate transaction order.");
//       const orderData = await responseOrder.json();

//       toast.dismiss(gatewayToastId);

//       const options = {
//         key: "rzp_test_T5NEmNwILnfzHd",
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: "AVG Mart",
//         description: `Order #${orderData.id ? orderData.id.slice(-8).toUpperCase() : 'CHECKOUT'}`,
//         image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", // Brand Logo URL
//         order_id: orderData.id,
//         handler: async function (response) {
//           const verificationToastId = toast.loading("Verifying transaction...")

//           try {
//             const verifyRes = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/payment/verify`, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//               },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 address_id: selectedAddressId,
//                 amount: orderAmount
//               })
//             });

//             if (verifyRes.ok) {
//               toast.success("Payment successful! Redirecting to orders...", { id: verificationToastId, duration: 3000 });
//               setIsProcessingRedirect(true);
//               setTimeout(() => {
//                 navigate("/orders");
//               }, 1200);
//             } else {
//               toast.error("Payment validation signature check failed.", { id: verificationToastId });
//             }
//           } catch (verifyErr) {
//             console.error("Verification processing endpoint failure:", verifyErr);
//             toast.error("Network error checking payment signature state.", { id: verificationToastId })
//           }
//         },
//         prefill: {
//           name: userProfile.name,
//           email: userProfile.email,
//         },
//         notes: {
//           address_id: selectedAddressId
//         },
//         theme: {
//           color: "#a5ce00", // Custom Lime Accent
//           backdrop_color: "#0d0f12",
//           hide_topbar: false
//         },
//         modal: {
//           confirm_close: true,
//           ondismiss: function () {
//             toast.error("Payment process cancelled.");
//           }
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       console.error("Payment pipeline routing error:", error);
//       toast.error("Could not initialize the checkout gateway.", { id: gatewayToastId });
//     }
//   };

//   const calculateDefaultEstimatedArrival = () => {
//     try {
//       const parsedDate = new Date();
//       parsedDate.setDate(parsedDate.getDate() + 6);
//       const targetDay = String(parsedDate.getDate()).padStart(2, '0');
//       const targetMonth = String(parsedDate.getMonth() + 1).padStart(2, '0');
//       const targetYear = parsedDate.getFullYear();
//       return `${targetDay}/${targetMonth}/${targetYear}`;
//     } catch (e) {
//       return 'Within 6 Days';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="relative min-h-screen bg-royal-dark">
//         <EcommerceLoader message="Initializing Checkout Protocol..." />
//       </div>
//     )
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="bg-royal-dark text-white min-h-screen py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">

//         {/* Fullscreen Post-Payment Redirection Loader */}
//         {isProcessingRedirect && (
//           <div className="fixed inset-0 z-50">
//             <EcommerceLoader message="Payment Confirmed! Preparing Your Order..." />
//           </div>
//         )}

//         {/* Ambient Grid Background Glow */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-accent/5 rounded-full blur-[160px] pointer-events-none" />

//         <div className="max-w-6xl mx-auto relative z-10 mt-4">

//           {/* Header Bar */}
//           <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
//             <button 
//               onClick={() => navigate(-1)} 
//               className="group inline-flex items-center gap-2 text-white/70 hover:text-lime-accent text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
//             >
//               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//               <span>Back to Cart</span>
//             </button>

//             {/* <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-accent bg-lime-accent/10 border border-lime-accent/20 px-3.5 py-1.5 rounded-full">
//               <ShieldCheck className="w-3.5 h-3.5" />
//               <span>256-Bit Encrypted Checkout</span>
//             </div> */}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">

//             {/* Left Column: User Profile & Delivery Addresses */}
//             <div className="lg:col-span-7 space-y-6">

//               {/* Profile Card */}
//               <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
//                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-lime-accent">
//                   <Sparkles className="w-4 h-4" /> Account Details
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
//                   <div className="flex items-center gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5">
//                     <User className="w-4 h-4 text-white/40 shrink-0" />
//                     <div className="min-w-0">
//                       <p className="text-[9px] uppercase tracking-wider text-white/40">Full Name</p>
//                       <p className="text-white font-bold truncate">{userProfile.name || 'N/A'}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 bg-black/40 p-3.5 rounded-xl border border-white/5">
//                     <Mail className="w-4 h-4 text-white/40 shrink-0" />
//                     <div className="min-w-0">
//                       <p className="text-[9px] uppercase tracking-wider text-white/40">Email Address</p>
//                       <p className="text-white font-bold truncate">{userProfile.email || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Address Selection Card */}
//               <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-5">
//                 <div className="flex items-center justify-between border-b border-white/10 pb-4">
//                   <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
//                     <MapPin className="w-4 h-4 text-lime-accent" /> Select Delivery Address
//                   </div>
//                   <button
//                     onClick={() => setShowAddForm(!showAddForm)}
//                     className="inline-flex items-center gap-1.5 text-[10px] font-black bg-lime-accent text-royal-dark hover:bg-lime-400 px-3.5 py-1.5 rounded-lg transition-all uppercase tracking-wider shadow-md active:scale-95 cursor-pointer"
//                   >
//                     <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Cancel' : 'New Address'}
//                   </button>
//                 </div>

//                 {/* Add Address Form Drawer */}
//                 {showAddForm && (
//                   <form onSubmit={handleAddNewAddress} className="bg-black/50 border border-white/10 p-5 rounded-xl space-y-4 animate-fadeIn">
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">Tag</label>
//                         <input type="text" required value={addressForm.tag} onChange={(e) => setAddressForm({ ...addressForm, tag: e.target.value })} placeholder="Home / Work" className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">Phone</label>
//                         <input type="text" required value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="10-digit number" className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">City</label>
//                         <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">Pincode</label>
//                         <input type="text" required value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">Street / Flat No.</label>
//                         <input type="text" required value={addressForm.streetName} onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">District</label>
//                         <input type="text" required value={addressForm.district} onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-[9px] font-bold text-white/50 uppercase">State</label>
//                         <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full bg-royal-dark border border-white/10 focus:border-lime-accent p-2.5 text-xs rounded-lg text-white outline-none" />
//                       </div>
//                     </div>
//                     <button type="submit" className="w-full py-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md">
//                       Save Address
//                     </button>
//                   </form>
//                 )}

//                 {/* Existing Address Cards Grid */}
//                 {addresses.length === 0 ? (
//                   <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10 space-y-2">
//                     <p className="text-xs text-white/50">No delivery addresses found in your profile.</p>
//                     <p className="text-[10px] text-lime-accent uppercase font-bold">Please add an address to complete checkout.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-3">
//                     {addresses.map((addr) => {
//                       const isSelected = selectedAddressId === addr.id
//                       return (
//                         <div
//                           key={addr.id}
//                           onClick={() => setSelectedAddressId(addr.id)}
//                           className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 relative ${
//                             isSelected
//                               ? 'bg-lime-accent/[0.06] border-lime-accent shadow-[0_0_20px_rgba(165,206,0,0.1)]'
//                               : 'bg-black/30 border-white/5 hover:border-white/20'
//                           }`}
//                         >
//                           <div className="mt-0.5 shrink-0">
//                             {isSelected ? (
//                               <CheckCircle2 className="w-5 h-5 text-lime-accent" />
//                             ) : (
//                               <div className="w-5 h-5 rounded-full border border-white/20" />
//                             )}
//                           </div>
//                           <div className="space-y-1 min-w-0 flex-1">
//                             <div className="flex items-center gap-2">
//                               <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-white tracking-wider">
//                                 {addr.tag}
//                               </span>
//                               <span className="text-[11px] font-mono text-white/50">{addr.phone}</span>
//                             </div>
//                             <p className="text-xs font-medium text-white/80 leading-relaxed">
//                               {addr.street_name || addr.streetName}, {addr.landmark && `${addr.landmark}, `}
//                               {addr.city}, {addr.district}, {addr.state} - <span className="font-mono font-bold text-lime-accent">{addr.pincode}</span>
//                             </p>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>

//             </div>

//             {/* Right Column: Order Summary & Payment Gateway CTA */}
//             <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6 sticky top-28">
//               <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/10 pb-4 text-white">
//                 Order Summary
//               </h3>

//               <div className="space-y-3.5 text-xs font-medium text-white/60 border-b border-white/10 pb-5">
//                 <div className="flex justify-between items-center">
//                   <span>Subtotal Amount</span>
//                   <span className="font-mono font-bold text-white text-sm">₹{orderAmount.toLocaleString('en-IN')}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>Delivery Charge</span>
//                   <span className="text-lime-accent font-black text-[10px] uppercase bg-lime-accent/10 px-2 py-0.5 rounded border border-lime-accent/20">
//                     Free Transit
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="flex items-center gap-1.5 text-white/50">
//                     <Calendar className="w-3.5 h-3.5 text-lime-accent" /> Estimated Arrival
//                   </span>
//                   <span className="font-mono font-bold text-lime-accent">{calculateDefaultEstimatedArrival()}</span>
//                 </div>
//               </div>

//               {/* Total Price Display */}
//               <div className="flex justify-between items-baseline pt-1">
//                 <div>
//                   <span className="text-xs font-black uppercase tracking-wider block text-white">Grand Total</span>
//                   <span className="text-[10px] text-white/40">Includes all applicable taxes</span>
//                 </div>
//                 <span className="text-3xl font-mono font-black text-lime-accent">
//                   ₹{orderAmount.toLocaleString('en-IN')}
//                 </span>
//               </div>

//               {/* Action Button */}
//               <button
//                 onClick={handleExecutionProcessPayment}
//                 className="w-full inline-flex items-center justify-center gap-2.5 bg-lime-accent hover:bg-lime-400 text-royal-dark px-6 py-4 font-black uppercase tracking-[0.15em] text-xs rounded-xl shadow-[0_4px_25px_rgba(165,206,0,0.25)] transition-all transform active:scale-95 cursor-pointer"
//               >
//                 <CreditCard className="w-4 h-4" /> Pay & Place Order
//               </button>

//               {/* Whitelabel / Security Badges */}
//               <div className="pt-2 border-t border-white/5 space-y-2">
//                 <div className="flex items-center justify-center gap-2 text-[10px] text-white/50 font-medium">
//                   <Lock className="w-3.5 h-3.5 text-lime-accent" />
//                   <span>Secured by Razorpay Gateway</span>
//                 </div>
//                 <p className="text-[9px] text-white/30 text-center leading-tight">
//                   By placing this order, you agree to our Terms of Service and Privacy Policy.
//                 </p>
//               </div>

//             </div>

//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default Checkout

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Plus,
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Lock,
  ChevronRight,
  X
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'
import EcommerceLoader from '../components/EcommerceLoader'

const INDIA_LOCATION_DATA = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Upper Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janogir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Korea", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dangs", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Mahisagar", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Wayanad", "Palakkand", "Pathanamthitta", "Thiruvananthapuram", "Thrissur"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadcliroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ribhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "RaeBareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
}

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
        console.error("Failed loading user profile:", err)
        toast.error("Network problem loading profile information.")
      } finally {
        setIsLoading(false)
      }
    }
    loadCheckoutCoreData()
  }, [token, navigate])

  const handleAddNewAddress = async (e) => {
    e.preventDefault()
    if (!addressForm.tag || !addressForm.phone || !addressForm.streetName || !addressForm.city || !addressForm.state || !addressForm.district || !addressForm.pincode) {
      toast.error("Please fill all mandatory address fields.")
      return
    }

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
        toast.success("Address saved to profile!", { id: addressToastId })
      } else {
        toast.error("Could not save address. Check input fields.", { id: addressToastId })
      }
    } catch (err) {
      console.error("Error creating address:", err)
      toast.error("Network error. Address creation failed.", { id: addressToastId })
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
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
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
              toast.error("Payment verification failed.", { id: verificationToastId });
            }
          } catch (verifyErr) {
            console.error("Verification processing error:", verifyErr);
            toast.error("Network error verifying payment.", { id: verificationToastId })
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
          color: "#a5ce00",
          backdrop_color: "#ffffff",
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
      console.error("Payment routing error:", error);
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
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen py-12 px-4 flex items-center justify-center">
          <div className="bg-white border border-gray-100 rounded-2xl p-12 w-full max-w-md shadow-sm relative overflow-hidden min-h-[300px]">
            <EcommerceLoader message="Initializing Checkout..." />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-8 px-4 md:px-8 font-sans">

        {/* Fullscreen Post-Payment Redirection Loader */}
        {isProcessingRedirect && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center">
            <EcommerceLoader message="Payment Confirmed! Preparing Your Order..." />
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-6">

          {/* BREADCRUMB & BACK HEADER */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Home</span>
              <ChevronRight className="w-3 h-3" />
              <span onClick={() => navigate('/cart')} className="hover:text-black cursor-pointer">Cart</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-800">Checkout</span>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">

            {/* LEFT COLUMN: USER DETAILS & ADDRESS SELECTION */}
            <div className="lg:col-span-7 space-y-5">

              {/* Profile Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 border-b border-gray-100 pb-2">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Full Name</p>
                      <p className="text-gray-900 font-bold truncate">{userProfile.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Email Address</p>
                      <p className="text-gray-900 font-bold truncate">{userProfile.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Selection Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tight text-gray-900">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Select Delivery Address
                  </div>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                  >
                    {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{showAddForm ? 'Cancel' : 'New Address'}</span>
                  </button>
                </div>

                {/* Add Address Form Drawer */}
                {showAddForm && (
                  <form onSubmit={handleAddNewAddress} className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Tag (e.g. Home, Work)</label>
                        <input
                          type="text" required value={addressForm.tag}
                          onChange={(e) => setAddressForm({ ...addressForm, tag: e.target.value })}
                          placeholder="Home / Work"
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                        <input
                          type="tel" required value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                          placeholder="10-digit Mobile" maxLength="12"
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Street Name / House No.</label>
                      <input
                        type="text" required value={addressForm.streetName}
                        onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                        placeholder="Flat, House No., Building, Street"
                        className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Landmark</label>
                        <input
                          type="text" value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="Near landmark (optional)"
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                        <input
                          type="text" required value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="City"
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* STATE DROPDOWN */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">State</label>
                        <select
                          required value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value, district: '' })}
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none cursor-pointer"
                        >
                          <option value="">Select State</option>
                          {Object.keys(INDIA_LOCATION_DATA).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* DISTRICT DROPDOWN */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                        <select
                          required disabled={!addressForm.state} value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Select District</option>
                          {addressForm.state && INDIA_LOCATION_DATA[addressForm.state]?.map((dst) => (
                            <option key={dst} value={dst}>{dst}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Pincode</label>
                        <input
                          type="text" required maxLength="6" value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                          placeholder="6-digit Pincode"
                          className="w-full bg-white border border-gray-200 focus:border-gray-400 p-2.5 text-xs rounded-xl text-gray-900 font-medium outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {/* Existing Address Cards Grid */}
                {addresses.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                    <p className="text-xs text-gray-500 font-medium">No delivery addresses found in your profile.</p>
                    <p className="text-[10px] text-emerald-600 uppercase font-bold">Please add an address to complete checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 relative ${isSelected
                              ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-300" />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[9px] font-black uppercase px-2 py-0.5 rounded text-white tracking-wider"
                                style={{ backgroundColor: '#A5CE00' }}
                              >
                                {addr.tag}
                              </span>
                              <span className="text-[11px] font-bold text-gray-500">{addr.phone}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-700 leading-relaxed">
                              {addr.street_name || addr.streetName}, {addr.landmark && `${addr.landmark}, `}
                              {addr.city}, {addr.district}, {addr.state} - <span className="font-bold text-gray-900">{addr.pincode}</span>
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT CTA */}
            <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-5 sticky top-24">
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs font-medium text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{orderAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery</span>
                  <span className="text-emerald-600 uppercase text-[10px] font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Estimated Arrival
                  </span>
                  <span className="font-bold text-gray-900">{calculateDefaultEstimatedArrival()}</span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black uppercase text-gray-900 block">Grand Total</span>
                  <span className="text-[10px] text-gray-400">Includes all applicable taxes</span>
                </div>
                <span
                  className="inline-flex items-center justify-center text-white font-black px-1.5 py-0.5 text-2xl tracking-tight rounded-xl border-2 border-[#123815]"
                  style={{
                    backgroundColor: '#A5CE00',
                    boxShadow: '3px 3px 0px 0px #123815',
                  }}
                >
                  ₹{orderAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecutionProcessPayment}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#A5CE00] hover:bg-[#8DA800] text-white px-6 py-3.5 font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
              >
                <CreditCard className="w-4 h-4" /> Pay & Place Order
              </button>

              {/* Security Badges */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured by Razorpay Gateway</span>
                </div>
                <p className="text-[9px] text-gray-400 leading-tight">
                  By placing this order, you agree to our Terms of Service & Privacy Policy.
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