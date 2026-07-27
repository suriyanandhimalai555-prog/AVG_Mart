import React, { useState, useEffect } from "react";
import { 
  FaUserTie, 
  FaSearch, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTag, 
  FaUsers, 
  FaCircleNotch, 
  FaCalendarAlt 
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const MarketersList = () => {
  const [marketers, setMarketers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMarketers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/marketer/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch marketers.");

      setMarketers(data.marketers || []);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketers();
  }, []);

  const filteredMarketers = marketers.filter((marketer) => {
    const search = searchTerm.toLowerCase();
    return (
      marketer.name?.toLowerCase().includes(search) ||
      marketer.email?.toLowerCase().includes(search) ||
      marketer.phone?.includes(search) ||
      marketer.city?.toLowerCase().includes(search) ||
      marketer.referral_code?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-4 md:p-8 bg-royal-dark min-h-screen text-white rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
            Marketers <span className="text-lime-400">Directory</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Overview of all registered marketers and their referrals
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
          <input
            type="text"
            placeholder="Search marketer, code, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-lime-400/50 transition-colors"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-lime-400">
          <FaCircleNotch className="animate-spin text-3xl mb-3" />
          <p className="text-xs text-white/50">Fetching marketers data...</p>
        </div>
      ) : filteredMarketers.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 text-center text-white/40 text-sm">
          No marketers found.
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-white/5 uppercase tracking-wider text-[10px] text-lime-400 font-black border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Marketer Info</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Referral Code</th>
                  <th className="py-4 px-6 text-center">Sellers Referred</th>
                  <th className="py-4 px-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMarketers.map((marketer) => (
                  <tr
                    key={marketer.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Marketer Name & City */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center text-sm font-bold">
                          <FaUserTie />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {marketer.name}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-white/40 mt-0.5">
                            <FaMapMarkerAlt className="text-[10px]" />
                            <span>{marketer.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center gap-2 text-white/80">
                        <FaEnvelope className="text-lime-400/60 text-[10px]" />
                        <span>{marketer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-[11px]">
                        <FaPhone className="text-lime-400/60 text-[10px]" />
                        <span>{marketer.phone}</span>
                      </div>
                    </td>

                    {/* Referral Code */}
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-lime-400/10 border border-lime-400/30 text-lime-400 font-mono font-bold tracking-wider text-xs">
                        <FaTag className="text-[10px]" />
                        <span>{marketer.referral_code}</span>
                      </div>
                    </td>

                    {/* Total Referred Sellers */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs">
                        <FaUsers className="text-lime-400 text-[11px]" />
                        <span>{marketer.total_referred_sellers || 0}</span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-white/50 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-white/30 text-[10px]" />
                        <span>
                          {new Date(marketer.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketersList;