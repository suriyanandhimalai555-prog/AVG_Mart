import React, { useState, useEffect } from 'react'
import { User, Mail, Lock, MapPin, Plus, Trash2, Save, Edit2, Phone, X, ShoppingBag, LogOut, ChevronRight, ShieldCheck, ArrowLeft, Navigation, AlertTriangle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { EcommerceLoader } from '../components/EcommerceLoader'

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
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "RaeBareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
}

const Profile = () => {
  const [userData, setUserData] = useState({ name: "", email: "" })
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  
  // Mobile Tab State Management
  const [activeTab, setActiveTab] = useState(null)

  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editAddressId, setEditAddressId] = useState(null)

  const [passwordState, setPasswordState] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })

  const [addressTag, setAddressTag] = useState("")
  const [phone, setPhone] = useState("")
  const [streetName, setStreetName] = useState("")
  const [landmark, setLandmark] = useState("")
  const [city, setCity] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [pincode, setPincode] = useState("")

  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const API_BASE = `${import.meta.env.VITE_APP_BASE_URL}/api/auth`;

  useEffect(() => {
    fetchProfileData();
    if (window.innerWidth >= 1024) {
      setActiveTab('profile');
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        toast.error(`Server error (${res.status})`);
        return;
      }

      const data = await res.json();
      setUserData(data.user);
      setAddresses(data.addresses);

    } catch (err) {
      console.error("Network Error:", err);
      toast.error("Failed to load profile details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchLiveLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    const toastId = toast.loading("Detecting your live GPS location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};

            const detectedStreet = addr.road || addr.pedestrian || addr.street || addr.suburb || addr.neighbourhood || addr.residential || "";
            const detectedLandmark = addr.suburb || addr.neighbourhood || addr.amenity || "";
            const detectedCity = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
            const detectedState = addr.state || "";
            const detectedPincode = addr.postcode || "";

            if (detectedStreet) setStreetName(detectedStreet);
            if (detectedLandmark) setLandmark(detectedLandmark);
            if (detectedCity) setCity(detectedCity);
            if (detectedPincode) setPincode(detectedPincode);

            const matchedState = Object.keys(INDIA_LOCATION_DATA).find(
              (s) => s.toLowerCase() === detectedState.toLowerCase()
            );

            if (matchedState) {
              setSelectedState(matchedState);

              const districts = INDIA_LOCATION_DATA[matchedState] || [];
              const matchedDistrict = districts.find(
                (d) =>
                  d.toLowerCase() === detectedCity.toLowerCase() ||
                  d.toLowerCase() === (addr.state_district || "").toLowerCase()
              );

              if (matchedDistrict) {
                setSelectedDistrict(matchedDistrict);
              }
            }

            toast.success("Address fields populated with your live location!", { id: toastId });
          } else {
            toast.error("Failed to fetch address details from location server.", { id: toastId });
          }
        } catch (err) {
          console.error("Geocoding error:", err);
          toast.error("Network error fetching location details.", { id: toastId });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        setIsFetchingLocation(false);
        toast.error("Location permission denied.", { id: toastId });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-2 text-left">
        <p className="font-bold text-xs uppercase tracking-wider text-red-600 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" /> Permanently Delete Account?
        </p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          This action cannot be undone. All your saved addresses, cart data, and profile information will be wiped.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setIsDeletingAccount(true);
              try {
                const res = await fetch(`${API_BASE}/profile/delete`, {
                  method: "DELETE",
                  headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                  toast.success("Account deleted successfully.");
                  localStorage.clear();
                  navigate("/signup");
                } else {
                  const data = await res.json();
                  toast.error(data.message || "Failed to delete account.");
                }
              } catch (err) {
                console.error(err);
                toast.error("Network error deleting account.");
              } finally {
                setIsDeletingAccount(false);
              }
            }}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] uppercase font-black tracking-wider shadow-sm"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      style: {
        background: '#fff',
        border: '1px solid #fecdd3',
        maxWidth: '380px'
      }
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch(`${API_BASE}/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordState.currentPassword,
          newPassword: passwordState.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed changing password.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Password change request failed.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressTag || !phone || !streetName || !city || !selectedState || !selectedDistrict || !pincode) {
      toast.error("Please fill all mandatory fields.");
      return;
    }

    setIsSavingAddress(true);

    const addressPayload = {
      tag: addressTag,
      phone,
      streetName,
      landmark,
      city,
      state: selectedState,
      district: selectedDistrict,
      pincode
    };

    try {
      const url = isEditingAddress ? `${API_BASE}/profile/address/${editAddressId}` : `${API_BASE}/profile/address`;
      const method = isEditingAddress ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(addressPayload)
      });

      if (res.ok) {
        toast.success(isEditingAddress ? "Address updated!" : "New address saved!");
        clearAddressForm();
        fetchProfileData();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed saving address.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Address save error.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const startEditAddress = (addr) => {
    setIsEditingAddress(true);
    setEditAddressId(addr.id);
    setAddressTag(addr.tag);
    setPhone(addr.phone);
    setStreetName(addr.street_name);
    setLandmark(addr.landmark || "");
    setCity(addr.city);
    setSelectedState(addr.state);
    setTimeout(() => setSelectedDistrict(addr.district), 50);
  };

  const handleDeleteAddress = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1 text-left">
        <p className="font-bold text-xs uppercase tracking-wider text-gray-900">Delete Address?</p>
        <p className="text-[11px] text-gray-500">Are you sure you want to remove this saved address?</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1 text-[10px] uppercase font-black text-gray-400 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`${API_BASE}/profile/address/${id}`, {
                  method: "DELETE",
                  headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                  toast.success("Address removed.");
                  fetchProfileData();
                } else {
                  toast.error("Failed deleting address.");
                }
              } catch (err) {
                console.error(err);
                toast.error("Server error.");
              }
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] uppercase font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: '#fff',
        border: '1px solid #f3f4f6'
      }
    });
  };

  const clearAddressForm = () => {
    setIsEditingAddress(false);
    setEditAddressId(null);
    setAddressTag("");
    setPhone("");
    setStreetName("");
    setLandmark("");
    setCity("");
    setSelectedState("");
    setSelectedDistrict("");
    setPincode("");
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {isLoading ? (
            <div className="relative min-h-[500px] border border-gray-100 rounded-2xl overflow-hidden bg-white">
              <EcommerceLoader message="Loading Profile Data..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT ACCOUNT SIDEBAR */}
              <div className={`lg:col-span-4 space-y-4 lg:block ${activeTab !== null ? 'hidden lg:block' : 'block'}`}>
                
                {/* USER PROFILE BRIEF CARD */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#A5CE00] text-white flex items-center justify-center font-black text-xl shrink-0">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                  </div>
                  <div className="truncate">
                    <h2 className="text-base font-extrabold text-gray-900 truncate">{userData.name || "Customer Account"}</h2>
                    <p className="text-xs text-gray-400 truncate">{userData.email || "---"}</p>
                  </div>
                </div>

                {/* NAVIGATION MENU LIST */}
                <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Details</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'addresses'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Saved Addresses</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'password'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span>Change Password</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('delete')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'delete'
                        ? 'bg-red-50 text-red-600'
                        : 'text-red-500 hover:bg-red-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Delete Account</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-300" />
                  </button>

                  <hr className="my-1 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* RIGHT CONTENT PANEL */}
              <div className={`lg:col-span-8 space-y-6 ${activeTab === null ? 'hidden lg:block' : 'block'}`}>
                
                {/* MOBILE BACK BUTTON */}
                {activeTab !== null && (
                  <div className="lg:hidden">
                    <button
                      onClick={() => setActiveTab(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-gray-50 shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Account Menu
                    </button>
                  </div>
                )}

                {/* 1. MY DETAILS PANEL */}
                {activeTab === 'profile' && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                      <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Account Details</h3>
                      <span className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded" style={{ backgroundColor: '#A5CE00' }}>
                        Active Customer
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Full Name</label>
                        <p className="text-xs font-bold text-gray-900">{userData.name || "---"}</p>
                      </div>

                      <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email Address</label>
                        <p className="text-xs font-bold text-gray-900">{userData.email || "---"}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        Your account credentials and saved parameters are protected using end-to-end 256-bit encryption.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. SAVED ADDRESSES PANEL */}
                {activeTab === 'addresses' && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Saved Addresses</h3>
                      <span className="text-xs font-bold text-gray-400">{addresses.length} saved</span>
                    </div>

                    <div className="space-y-3">
                      {addresses.length === 0 ? (
                        <p className="text-xs font-medium text-gray-400 py-4 text-center">No delivery addresses saved yet.</p>
                      ) : (
                        addresses.map((address) => (
                          <div key={address.id} className="flex items-start justify-between bg-gray-50 border border-gray-200/80 p-4 rounded-xl gap-4 hover:border-gray-300 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-block text-[9px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded" style={{ backgroundColor: '#A5CE00' }}>
                                  {address.tag}
                                </span>
                                <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-gray-400" /> {address.phone}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 font-medium leading-relaxed pt-1">
                                {address.street_name}, {address.landmark && `Landmark: ${address.landmark}, `} {address.city}, {address.district}, {address.state} - {address.pincode}
                              </p>
                            </div>

                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => startEditAddress(address)}
                                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 rounded-lg bg-white border border-gray-200 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* ADDRESS CRUD FORM */}
                    <form onSubmit={handleSaveAddress} className="border-t border-gray-100 pt-6 space-y-4">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                          {isEditingAddress ? "Modify Address" : "Add New Address"}
                        </h4>
                        
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleFetchLiveLocation}
                            disabled={isFetchingLocation}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                            style={{ backgroundColor: '#A5CE00' }}
                          >
                            <Navigation className={`w-3.5 h-3.5 ${isFetchingLocation ? 'animate-spin' : ''}`} />
                            <span>{isFetchingLocation ? "Locating..." : "Use Live Location"}</span>
                          </button>

                          {isEditingAddress && (
                            <button type="button" onClick={clearAddressForm} className="text-xs text-rose-600 flex items-center gap-1 hover:underline">
                              <X className="w-3 h-3"/> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Tag (e.g. Home, Work)</label>
                          <input
                            type="text" required placeholder="Home / Work"
                            value={addressTag} onChange={(e) => setAddressTag(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                          <input
                            type="tel" required placeholder="10-Digit Mobile" maxLength="12"
                            value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Street Name / House No.</label>
                          <input
                            type="text" required placeholder="Flat, House No., Building, Street"
                            value={streetName} onChange={(e) => setStreetName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Landmark</label>
                          <input
                            type="text" placeholder="Near landmark (optional)"
                            value={landmark} onChange={(e) => setLandmark(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                          <input
                            type="text" required placeholder="City"
                            value={city} onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">State</label>
                          <select
                            required value={selectedState}
                            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); }}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium cursor-pointer"
                          >
                            <option value="">Select State</option>
                            {Object.keys(INDIA_LOCATION_DATA).map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                          <select
                            required disabled={!selectedState} value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium disabled:opacity-50 cursor-pointer"
                          >
                            <option value="">Select District</option>
                            {selectedState && INDIA_LOCATION_DATA[selectedState].map((district) => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Pincode</label>
                          <input
                            type="text" required maxLength="6" placeholder="6-Digit Pincode"
                            value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingAddress}
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-md"
                      >
                        {isEditingAddress ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                        {isSavingAddress ? "Saving..." : isEditingAddress ? "Update Address" : "Save Address"}
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. CHANGE PASSWORD PANEL */}
                {activeTab === 'password' && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Change Password</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Current Password</label>
                        <input
                          type="password" required placeholder="••••••••"
                          value={passwordState.currentPassword}
                          onChange={(e) => setPasswordState({...passwordState, currentPassword: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">New Password</label>
                        <input
                          type="password" required placeholder="••••••••"
                          value={passwordState.newPassword}
                          onChange={(e) => setPasswordState({...passwordState, newPassword: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm New Password</label>
                        <input
                          type="password" required placeholder="••••••••"
                          value={passwordState.confirmPassword}
                          onChange={(e) => setPasswordState({...passwordState, confirmPassword: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3.5 py-2.5 text-xs outline-none text-gray-900 font-medium"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isUpdatingPassword}
                          className="inline-flex items-center gap-2 bg-[#A5CE00] hover:bg-[#8BA800] text-white px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {isUpdatingPassword ? "Updating..." : "Save Password Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 4. DELETE ACCOUNT PANEL */}
                {activeTab === 'delete' && (
                  <div className="bg-white border border-red-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
                    <div className="border-b border-red-100 pb-3 flex items-center justify-between">
                      <h3 className="text-base font-black text-red-600 uppercase tracking-tight flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" /> Delete Account
                      </h3>
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-2.5 py-0.5 rounded uppercase">
                        Danger Zone
                      </span>
                    </div>

                    <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-bold text-red-900">Are you sure you want to delete your account?</p>
                      <p className="text-xs text-red-700 leading-relaxed">
                        Deleting your account will permanently remove all your saved profile information, addresses, and shopping cart. This action cannot be reversed.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeletingAccount ? "Deleting Account..." : "Delete My Account"}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Profile