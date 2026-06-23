import React, { useState } from 'react'
import { User, Mail, Lock, MapPin, Plus, Trash2, ShieldCheck, Save } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Comprehensive Data Matrix for Indian States and their respective Districts
const INDIA_LOCATION_DATA = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Upper Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
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
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
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
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Amroha", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "RaeBareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
}

const Profile = () => {
  // Saved data from user signup
  const [userData, setUserData] = useState({
    name: "Alex Vance",
    email: "alex.vance@avgnetwork.io"
  })

  // State managing change password fields
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Address dynamic state array
  const [addresses, setAddresses] = useState([
    { id: 1, tag: "Home", text: "Flat 404, Green Meadows Apartments, Landmark: Near Tech Park, Bengaluru, Urban Bengaluru, Karnataka - 560001" },
    { id: 2, tag: "Office", text: "Building 7, Sector 12, Landmark: Opposite Metro Station, Chennai, Chennai, Tamil Nadu - 600001" }
  ])

  // Form input states for adding a new address
  const [addressTag, setAddressTag] = useState("")
  const [streetName, setStreetName] = useState("")
  const [landmark, setLandmark] = useState("")
  const [city, setCity] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [pincode, setPincode] = useState("")

  // Handle password updates
  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      alert("New password and confirm password do not match!")
      return
    }
    alert("Password updated successfully.")
    setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  // Handle adding an address entry
  const handleAddAddress = (e) => {
    e.preventDefault()
    if (!addressTag || !streetName || !city || !selectedState || !selectedDistrict || !pincode) {
      alert("Please fill in all mandatory fields.")
      return
    }

    const fullAddressText = `${streetName}, Landmark: ${landmark || 'N/A'}, ${city}, ${selectedDistrict}, ${selectedState} - ${pincode}`
    
    const newAddressEntry = {
      id: Date.now(),
      tag: addressTag,
      text: fullAddressText
    }

    setAddresses([...addresses, newAddressEntry])

    // Reset fields after adding
    setAddressTag("")
    setStreetName("")
    setLandmark("")
    setCity("")
    setSelectedState("")
    setSelectedDistrict("")
    setPincode("")
  }

  // Handle deleting an address entry
  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(address => address.id !== id))
  }

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden">
        {/* Simple Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-5xl mx-auto relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* --- LEFT PROFILE SIDE PANEL --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-6 text-center shadow-2xl">
              
              {/* Profile Avatar Image Placeholder */}
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center text-lime-accent shadow-inner relative">
                <User className="w-10 h-10" />
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-lime-accent" />
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-bold tracking-wide text-white">{userData.name}</h2>
                <span className="text-[10px] font-mono text-lime-accent uppercase tracking-widest bg-lime-accent/10 border border-lime-accent/20 px-2.5 py-0.5 rounded">Verified Account</span>
              </div>

              {/* Display Information */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3 text-left font-mono text-xs text-white/60">
                <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <Mail className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <span className="truncate">{userData.email}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <ShieldCheck className="w-5 h-5 text-lime-accent/40" /> Secure 256-Bit SSL Connection Active
            </div>
          </div>

          {/* --- RIGHT MANAGEMENT MAIN PANEL --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ADDRESS SECTION */}
            <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <MapPin className="w-5 h-5 text-lime-accent" />
                <h3 className="text-lg font-bold tracking-wide uppercase">Saved Shipping Addresses</h3>
              </div>

              {/* List of current addresses */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-xs text-white/30 py-4 text-center">No addresses added yet.</p>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="flex items-start justify-between bg-white/[0.02] border border-white/5 p-4 rounded-xl gap-4 hover:border-white/10 transition-colors">
                      <div className="space-y-1">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-white/5 text-lime-accent border border-white/10 px-2 py-0.5 rounded">
                          {address.tag}
                        </span>
                        <p className="text-xs text-white/70 font-medium leading-relaxed">{address.text}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 cursor-pointer flex-shrink-0"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Address Form Inputs */}
              <form onSubmit={handleAddAddress} className="border-t border-white/5 pt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Add New Address</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Address Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Home, Office"
                      value={addressTag}
                      onChange={(e) => setAddressTag(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Street Name / Flat No.</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat No, Apartment Name, Street Name"
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Landmark</label>
                    <input
                      type="text"
                      placeholder="Near Bus Stop or Tech Park (Optional)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">City</label>
                    <input
                      type="text"
                      required
                      placeholder="City Name"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                  {/* State Picker Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">State</label>
                    <select
                      required
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedDistrict(""); // Reset selected district on state changes
                      }}
                      className="w-full bg-black border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    >
                      <option value="">Select State</option>
                      {Object.keys(INDIA_LOCATION_DATA).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Picker Dropdown (Filters based on State Choice) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">District</label>
                    <select
                      required
                      disabled={!selectedState}
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white disabled:opacity-30 transition-colors"
                    >
                      <option value="">Select District</option>
                      {selectedState && INDIA_LOCATION_DATA[selectedState].map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Pincode</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="6-Digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} // Restrict characters to numeric digits
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-lime-accent hover:text-royal-dark border border-white/10 hover:border-transparent text-white px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Save Address Entry
                </button>
              </form>
            </div>

            {/* PASSWORD EDIT PROTOCOL */}
            <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <Lock className="w-5 h-5 text-lime-accent" />
                <h3 className="text-lg font-bold tracking-wide uppercase">Change Account Password</h3>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordState.currentPassword}
                      onChange={(e) => setPasswordState({...passwordState, currentPassword: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({...passwordState, newPassword: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/40 uppercase">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({...passwordState, confirmPassword: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 focus:border-lime-accent rounded-xl px-4 py-3 text-xs outline-none text-white transition-colors"
                    />
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-lime-accent text-royal-dark px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_10px_30px_rgba(165,206,0,0.3)] cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Password Changes
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Profile