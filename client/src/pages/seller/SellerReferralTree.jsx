import React, { useState, useEffect, useMemo } from "react";
import {
  FaUsers,
  FaCopy,
  FaCheck,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCalendarAlt,
  FaSitemap,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const SellerReferralTree = () => {
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    totalDirect: 0,
    totalDownline: 0,
    referrals: [],
  });
  const [copied, setCopied] = useState(false);
  const [sellerCode, setSellerCode] = useState("");

  // Search, Level & Date filters
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    level: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDirectReferrals();
    fetchProfileCode();
  }, []);

  const fetchProfileCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.seller) {
        setSellerCode(data.seller.referral_code);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDirectReferrals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/referral-tree`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setReferralData({
          totalDirect: data.totalDirect ?? 0,
          totalDownline: data.totalDownline ?? (data.referrals?.length || 0),
          referrals: Array.isArray(data.referrals) ? data.referrals : [],
        });
      }
    } catch (err) {
      toast.error("Failed to load referral tree");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}/seller/signup?referral_code=${sellerCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral registration link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedLevel, dateRange, filters.startDate, filters.endDate, filters.level, rowsPerPage]);

  const getDateRange = (label) => {
    const today = new Date();
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    if (label === "All Time") {
      return { startDate: "", endDate: "" };
    }

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    if (label === "Last 7 Days") {
      start.setDate(today.getDate() - 6);
    } else if (label === "1 Month") {
      start.setMonth(today.getMonth() - 1);
    } else if (label === "3 Months") {
      start.setMonth(today.getMonth() - 3);
    }

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const handleDateRangeChange = (item) => {
    setDateRange(item);
    const { startDate, endDate } = getDateRange(item);
    setFilters((prev) => ({ ...prev, startDate, endDate }));
    setDropdownOpen(false);
  };

  const availableLevels = useMemo(() => {
    const levels = Array.from(
      new Set(referralData.referrals.map((r) => Number(r.level) || 1))
    ).sort((a, b) => a - b);
    return levels;
  }, [referralData.referrals]);

  const filteredData = useMemo(() => {
    return referralData.referrals.filter((item) => {
      const q = search.trim().toLowerCase();
      const storeName = (item.store_name || "").toLowerCase();
      const ownerName = (item.owner_name || "").toLowerCase();
      const phone = (item.phone || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const code = (item.referral_code || "").toLowerCase();
      const parentStore = (item.referred_by_store || "").toLowerCase();
      const parentCode = (item.referred_by_code || "").toLowerCase();

      const matchSearch =
        !q ||
        storeName.includes(q) ||
        ownerName.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        code.includes(q) ||
        parentStore.includes(q) ||
        parentCode.includes(q);

      const itemLevel = Number(item.level) || 1;
      const matchQuickLevel = selectedLevel === "All" || itemLevel === Number(selectedLevel);
      const matchModalLevel = !filters.level || itemLevel === Number(filters.level);

      const createdAt = item.created_at ? new Date(item.created_at) : null;
      const startObj = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
      const endObj = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null;

      const matchStart = !startObj || (createdAt && createdAt >= startObj);
      const matchEnd = !endObj || (createdAt && createdAt <= endObj);

      return matchSearch && matchQuickLevel && matchModalLevel && matchStart && matchEnd;
    });
  }, [referralData.referrals, search, selectedLevel, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages;
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <FaSpinner className="animate-spin text-2xl text-lime-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#071640] min-h-screen text-white rounded-2xl space-y-6">
      {/* HEADER & SHARE LINK CARD */}
      <div className="relative z-30 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400 text-2xl shrink-0">
            <FaSitemap />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              Seller Referral Tree
            </h1>
            <p className="text-xs text-white/50 mt-1">
              View direct merchants and multi-level downline sellers referred by your network.
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full lg:w-auto space-y-2">
          <p className="text-[10px] font-black uppercase text-lime-400 tracking-widest">
            Your Direct Share Link
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white/80 font-mono w-full sm:w-72 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 text-lg font-bold">
            <FaUsers />
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/40 font-bold">
              Direct Referrals (Level 1)
            </p>
            <p className="text-2xl font-black text-white mt-0.5">{referralData.totalDirect}</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 text-lg font-bold">
            <FaSitemap />
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/40 font-bold">
              Total Downline Network
            </p>
            <p className="text-2xl font-black text-lime-400 mt-0.5">
              {referralData.totalDownline}
            </p>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER & CONTROLS */}
      <div className="relative z-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {/* Top Bar: Title, Level Tabs, Date Range & Filter */}
        <div className="p-5 md:p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-black/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400">
                <FaUsers className="text-base" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">Downline Merchants Table</h2>
                <p className="text-[11px] text-white/50">
                  Showing direct and sub-referred sellers across levels
                </p>
              </div>
            </div>

            {/* Quick Level Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedLevel("All");
                  setFilters((prev) => ({ ...prev, level: "" }));
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedLevel === "All"
                    ? "bg-lime-400 text-slate-950"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                All Levels
              </button>
              {availableLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(String(lvl));
                    setFilters((prev) => ({ ...prev, level: String(lvl) }));
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedLevel === String(lvl)
                      ? "bg-lime-400 text-slate-950"
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  Level {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                <FaSearch className="text-xs" />
              </span>
              <input
                type="text"
                placeholder="Search store, owner, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition"
              />
            </div>

            {/* Date Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <FaCalendarAlt className="text-lime-400 text-xs" />
                {dateRange}
                <span className="text-[10px]">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-44 bg-[#0b1f57] border border-white/15 rounded-xl shadow-2xl py-1 overflow-hidden">
                  {["All Time", "Last 7 Days", "1 Month", "3 Months"].map((item) => (
                    <div
                      key={item}
                      onClick={() => handleDateRangeChange(item)}
                      className={`px-4 py-2 text-xs font-semibold cursor-pointer transition ${
                        dateRange === item
                          ? "bg-lime-400/15 text-lime-400 font-bold"
                          : "text-white/80 hover:bg-white/5"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Modal Button */}
            <button
              onClick={() => setShowFilter(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/80 hover:bg-white/10 transition cursor-pointer"
            >
              <FaFilter className="text-lime-400 text-xs" /> Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/30 text-[11px] font-bold uppercase tracking-wider text-white/50">
                <th className="py-3.5 px-4 sm:px-6">S.No</th>
                <th className="py-3.5 px-4">Store & Code</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Referred By</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 sm:px-6">Joined At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-white/40 text-xs">
                    No matching referred merchants found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((seller, index) => {
                  const level = Number(seller.level) || 1;
                  return (
                    <tr
                      key={`${seller.id}-${level}`}
                      className="hover:bg-white/[0.03] transition"
                    >
                      <td className="py-4 px-4 sm:px-6 font-semibold text-white/50">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaStore className="text-lime-400 text-xs shrink-0" />
                          <span className="font-bold text-white">{seller.store_name}</span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-lime-400/10 text-lime-400 font-mono font-bold rounded text-[10px] border border-lime-400/20">
                          {seller.referral_code}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-white/80">
                        {seller.owner_name || "-"}
                      </td>

                      <td className="py-4 px-4 text-xs text-white/70 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <FaPhone className="text-lime-400 text-[10px]" />
                          <span>{seller.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaEnvelope className="text-lime-400 text-[10px]" />
                          <span>{seller.email || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs">
                        {level === 1 ? (
                          <span className="text-lime-400 font-semibold">You (Direct)</span>
                        ) : (
                          <div>
                            <p className="font-semibold text-white/85">
                              {seller.referred_by_store || "Merchant"}
                            </p>
                            {seller.referred_by_code && (
                              <span className="text-[10px] font-mono text-white/45">
                                {seller.referred_by_code}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            level === 1
                              ? "bg-lime-400/15 text-lime-400 border border-lime-400/30"
                              : "bg-sky-400/15 text-sky-300 border border-sky-400/30"
                          }`}
                        >
                          Level {level}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-white/50 font-medium text-xs whitespace-nowrap">
                        {formatDate(seller.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-white/40 ml-2">Total: {filteredData.length} records</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition cursor-pointer"
            >
              {"< Prev"}
            </button>

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 min-w-[32px] px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === page
                    ? "bg-lime-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition cursor-pointer"
            >
              {"Next >"}
            </button>
          </div>
        </div>
      </div>

      {/* FILTER MODAL */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#0b1f57] border border-white/15 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400">
                  <FaFilter className="text-sm" />
                </div>
                <h3 className="text-base font-bold text-white">Filter Downline</h3>
              </div>

              <button
                onClick={() => setShowFilter(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition cursor-pointer"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Level
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 1, 2, 3"
                  value={filters.level}
                  onChange={(e) => {
                    setFilters({ ...filters, level: e.target.value });
                    setSelectedLevel(e.target.value ? e.target.value : "All");
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-lime-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4 bg-black/20">
              <button
                onClick={() => {
                  setFilters({ startDate: "", endDate: "", level: "" });
                  setSelectedLevel("All");
                  setDateRange("All Time");
                  setShowFilter(false);
                }}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 text-xs font-bold transition cursor-pointer"
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerReferralTree;