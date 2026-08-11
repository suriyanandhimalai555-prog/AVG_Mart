// import React from "react";
// import { Link } from "react-router-dom"; // Added for internal navigation
// import {
//   FaGithub,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedin,
//   FaPaperPlane,
//   FaLock,
//   FaRedo,
//   FaTruck,
//   FaArrowUp,
// } from "react-icons/fa";

// import Logo from "../assets/logo.png";

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const footerLinks = [
//     {
//       title: "Products",
//       items: [
//         { name: "All Products", path: "/allproducts" },
//         { name: "T-Shirts", path: "/products/t-shirts" },
//         { name: "Shoes", path: "/products/shoes" },
//         { name: "Watches", path: "/products/watches" },
//         { name: "Belts", path: "/products/belts" },
//       ],
//     },
//     {
//       title: "Support",
//       items: [
//         { name: "My Orders", path: "/orders" },
//         { name: "Cart", path: "/cart" },
//         { name: "Profile", path: "/profile" },
//         { name: "Shipping Policy", path: "/shipping-policy" },
//       ],
//     },
//   ];

//   const socialLinks = [
//     { icon: <FaTwitter />, href: "#", label: "Twitter" },
//     { icon: <FaInstagram />, href: "#", label: "Instagram" },
//     { icon: <FaGithub />, href: "#", label: "Github" },
//     { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
//   ];

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <footer className="bg-[#0b246a] text-white pt-24 pb-8 px-6 md:px-12 border-t border-white/10 relative overflow-hidden select-none">
//       <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
//       <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16 border-b border-white/10">
//           <div className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group">
//             <FaTruck className="text-lime-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
//             <div>
//               <h4 className="font-bold text-xs uppercase tracking-widest text-white">Fast Shipping</h4>
//               <p className="text-white/60 text-xs mt-1 font-medium">Secure delivery networks operating worldwide.</p>
//             </div>
//           </div>
//           <div className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group">
//             <FaLock className="text-lime-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
//             <div>
//               <h4 className="font-bold text-xs uppercase tracking-widest text-white">Secure Payments</h4>
//               <p className="text-white/60 text-xs mt-1 font-medium">100% fully encrypted operational transactions.</p>
//             </div>
//           </div>
//           <div className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group">
//             <FaRedo className="text-lime-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
//             <div>
//               <h4 className="font-bold text-xs uppercase tracking-widest text-white">Easy Returns</h4>
//               <p className="text-white/60 text-xs mt-1 font-medium">Hassle-free 14-day safety vault protocol.</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-12 gap-12 py-16 text-left">
//           <div className="lg:col-span-5 space-y-6">
//             <div className="flex items-center gap-3">
//               <img src={Logo} alt="AVG MART Identity Logo" className="w-8 h-8 object-contain" />
//               <h2 className="text-2xl font-black uppercase tracking-wider text-white">
//                 AVG <span className="text-lime-400 font-light">MART</span>
//               </h2>
//             </div>
//             <p className="text-white/60 text-xs font-medium max-w-sm leading-relaxed">
//               Premium setups, hardware gear, core electronics, and streamlined accessories engineered to run without limits.
//             </p>
//             <div className="flex gap-2.5 pt-2">
//               {socialLinks.map((item, index) => (
//                 <a key={index} href={item.href} aria-label={item.label} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-lime-400 hover:text-[#0b246a] hover:border-transparent hover:scale-105 shadow-md transition-all duration-300">
//                   {item.icon}
//                 </a>
//               ))}
//             </div>
//           </div>

//           <div className="lg:col-span-3 grid grid-cols-2 gap-8">
//             {footerLinks.map((group, index) => (
//               <div key={index} className="space-y-4">
//                 <h3 className="text-lime-400 text-[11px] font-black uppercase tracking-[0.2em]">{group.title}</h3>
//                 <ul className="space-y-3">
//                   {group.items.map((item, idx) => (
//                     <li key={idx}>
//                       <Link to={item.path} className="text-white/50 hover:text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 group/link">
//                         <span className="w-1 h-1 bg-white/0 rounded-full transition-all duration-200 group-hover/link:w-1.5 group-hover/link:bg-lime-400" />
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           <div className="lg:col-span-3 space-y-4">
//             <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-white">Newsletter Transmissions</h3>
//             <p className="text-white/60 text-xs font-medium leading-relaxed">
//               Subscribe to unlock early tier notifications on upcoming hardware inventory drops.
//             </p>
//             <div className="relative flex items-center group mt-2">
//               <input type="email" placeholder="Enter operator email..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none font-medium placeholder-white/20 focus:border-lime-400/50 focus:bg-white/[0.08] transition-all pr-12" />
//               <button onClick={(e) => e.preventDefault()} aria-label="Submit transmission" className="absolute right-1.5 p-2 rounded-lg bg-lime-400 text-[#0b246a] active:scale-95 hover:shadow-[0_0_15px_rgba(164,206,0,0.4)] transition-all duration-300">
//                 <FaPaperPlane className="text-xs" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
//           <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//             <button onClick={scrollToTop} className="group flex items-center gap-1.5 bg-[#0b246a] border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white/60 hover:text-lime-400 hover:border-lime-400/40 transition-all duration-300 shadow-xl">
//               Back to Top <FaArrowUp className="text-[9px] transform group-hover:-translate-y-0.5 transition-transform" />
//             </button>
//           </div>
//           <p className="text-white/40 text-[11px] font-bold tracking-wider">© {currentYear} AVG MART. ALL RIGHTS RESERVED.</p>
//           <div className="flex gap-6 text-[11px] font-bold tracking-wider">
//             <Link to="/privacy-policy" className="text-white/40 hover:text-white transition-colors">PRIVACY_POLICY</Link>
//             <Link to="/terms-and-conditions" className="text-white/40 hover:text-white transition-colors">TERMS_AND_CONDITIONS</Link>
//             {/* <Link to="/shipping-policy" className="text-white/40 hover:text-white transition-colors">SHIPPING_POLICY</Link> */}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaLock,
  FaRedo,
  FaTruck,
  FaArrowUp,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";

import Logo from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      items: [
        { name: "About Us", path: "/about" },
        { name: "All Products", path: "/allproducts" },
        { name: "Terms & Conditions", path: "/terms-and-conditions" },
        { name: "Privacy Policy", path: "/privacy-policy" },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "My Orders", path: "/orders" },
        { name: "Cart", path: "/cart" },
        { name: "Profile", path: "/profile" },
        { name: "Shipping Policy", path: "/shipping-policy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaGithub />, href: "#", label: "Github" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-50 text-gray-800 pt-16 pb-8 px-6 md:px-12 border-t border-gray-200 relative overflow-hidden select-none">
      
      {/* BACKGROUND ACCENT GLOWS */}
      <div 
        className="absolute -bottom-10 -right-10 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: '#A5CE00' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* TOP VALUE PROPOSITION BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-200">
          <div className="flex gap-4 p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:border-gray-300 transition-all duration-300 group">
            <FaTruck 
              className="text-2xl group-hover:scale-110 transition-transform duration-300" 
              style={{ color: '#A5CE00' }}
            />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900">Fast Express Delivery</h4>
              <p className="text-gray-500 text-xs mt-1 font-medium">Quick delivery right to your doorstep in minutes.</p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:border-gray-300 transition-all duration-300 group">
            <FaLock 
              className="text-2xl group-hover:scale-110 transition-transform duration-300" 
              style={{ color: '#A5CE00' }}
            />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900">100% Secure Payments</h4>
              <p className="text-gray-500 text-xs mt-1 font-medium">Fully encrypted, safe payment gateways.</p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:border-gray-300 transition-all duration-300 group">
            <FaRedo 
              className="text-2xl group-hover:scale-110 transition-transform duration-300" 
              style={{ color: '#A5CE00' }}
            />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900">Hassle-Free Returns</h4>
              <p className="text-gray-500 text-xs mt-1 font-medium">Easy replacement & return guarantee.</p>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION CONTENT */}
        <div className="grid lg:grid-cols-12 gap-10 py-12 text-left">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <img src={Logo} alt="AVG MART Identity Logo" className="w-8 h-8 object-contain" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
                AVG <span style={{ color: '#A5CE00' }}>MART</span>
              </h2>
            </div>
            <p className="text-gray-500 text-xs font-medium max-w-sm leading-relaxed">
              Your one-stop destination for fresh items, essential groceries, gear, electronics, and daily lifestyle updates delivered in minutes.
            </p>
            <div className="flex gap-2.5 pt-1">
              {socialLinks.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href} 
                  aria-label={item.label} 
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black hover:scale-105 shadow-sm transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* FOOTER NAV LINKS */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerLinks.map((group, index) => (
              <div key={index} className="space-y-4">
                <h3 
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: '#82a300' }}
                >
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={item.path} 
                        className="text-gray-600 hover:text-black text-xs font-semibold transition-colors duration-200 flex items-center gap-1.5 group/link"
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full opacity-0 transition-all duration-200 group-hover/link:opacity-100" 
                          style={{ backgroundColor: '#A5CE00' }}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* DOWNLOAD OUR APP COLUMN */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">Download Our App</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              Get the fastest grocery & essentials delivery experience on your mobile phone.
            </p>
            <div className="space-y-3 pt-1">
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl border border-gray-800 transition-all duration-300 shadow-sm active:scale-95 w-full"
              >
                <FaGooglePlay className="text-xl text-[#A5CE00] shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Get it on</p>
                  <p className="text-xs font-black tracking-tight leading-tight mt-0.5">Google Play</p>
                </div>
              </a>

              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl border border-gray-800 transition-all duration-300 shadow-sm active:scale-95 w-full"
              >
                <FaApple className="text-2xl text-white shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Download on the</p>
                  <p className="text-xs font-black tracking-tight leading-tight mt-0.5">App Store</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          
          {/* BACK TO TOP BUTTON */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <button 
              onClick={scrollToTop} 
              className="group flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-gray-600 hover:text-black hover:border-gray-300 transition-all duration-300 shadow-md cursor-pointer"
            >
              Back to Top <FaArrowUp className="text-[9px] transform group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <p className="text-gray-400 text-[11px] font-bold tracking-wider">
            © {currentYear} AVG MART. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-6 text-[11px] font-bold tracking-wider">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-gray-800 transition-colors">
              PRIVACY POLICY
            </Link>
            <Link to="/terms-and-conditions" className="text-gray-400 hover:text-gray-800 transition-colors">
              TERMS & CONDITIONS
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;