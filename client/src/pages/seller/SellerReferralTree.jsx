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
  FaSitemap,
  FaSearchPlus,
  FaSearchMinus,
  FaUndo,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const TreeNode = ({
  node,
  searchTerm,
  selectedSeller,
  onSelect,
  isRoot = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  const children = node.children || [];
  const hasChildren = children.length > 0;

  const q = searchTerm.trim().toLowerCase();
  const isMatch =
    q &&
    ((node.store_name || "").toLowerCase().includes(q) ||
      (node.owner_name || "").toLowerCase().includes(q) ||
      (node.referral_code || "").toLowerCase().includes(q) ||
      (node.phone || "").toLowerCase().includes(q));

  const isSelected = selectedSeller?.id === node.id;

  return (
    <div className="flex flex-col items-center">
      {/* Connector line from parent above */}
      {!isRoot && <div className="w-px h-6 bg-white/25" />}

      {/* Node Card */}
      <div
        onClick={() => onSelect(node)}
        className={`relative w-52 sm:w-56 rounded-2xl p-3.5 transition cursor-pointer select-none border ${
          isRoot
            ? "bg-lime-400/15 border-lime-400 shadow-lg shadow-lime-400/10"
            : isMatch
            ? "bg-amber-400/15 border-amber-400 ring-2 ring-amber-400/40"
            : isSelected
            ? "bg-sky-400/15 border-sky-400"
            : "bg-[#0b1f57]/95 border-white/15 hover:border-lime-400/60"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
              isRoot
                ? "bg-lime-400 text-slate-950"
                : node.level === 1
                ? "bg-lime-400/15 text-lime-400 border border-lime-400/30"
                : "bg-sky-400/15 text-sky-300 border border-sky-400/30"
            }`}
          >
            {isRoot ? "You (Root)" : `Level ${node.level}`}
          </span>

          <span className="text-[10px] font-mono font-bold text-white/60">
            {node.referral_code || "-"}
          </span>
        </div>

        <p className="text-xs font-extrabold text-white truncate flex items-center gap-1.5">
          <FaStore className="text-lime-400 text-[11px] shrink-0" />
          <span className="truncate">{node.store_name || "Merchant"}</span>
        </p>

        <p className="text-[11px] text-white/60 truncate mt-0.5">
          {node.owner_name || "-"}
        </p>

        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
          <span>Downline: {children.length}</span>
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
              className="inline-flex items-center gap-1 text-lime-400 font-bold hover:underline cursor-pointer"
            >
              {expanded ? <FaChevronDown /> : <FaChevronRight />}
              {expanded ? "Hide" : "Expand"}
            </button>
          )}
        </div>
      </div>

      {/* Children Branches */}
      {hasChildren && expanded && (
        <div className="flex flex-col items-center">
          {/* Vertical stem down from card */}
          <div className="w-px h-6 bg-white/25" />

          {/* Horizontal + Per-child branches */}
          <div className="flex items-start justify-center">
            {children.map((child, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === children.length - 1;
              const isOnly = children.length === 1;

              return (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Top horizontal bar segments */}
                  <div className="w-full h-px flex">
                    <div
                      className={`flex-1 ${
                        !isOnly && !isFirst ? "bg-white/25" : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`flex-1 ${
                        !isOnly && !isLast ? "bg-white/25" : "bg-transparent"
                      }`}
                    />
                  </div>

                  <div className="px-3 sm:px-4">
                    <TreeNode
                      node={child}
                      searchTerm={searchTerm}
                      selectedSeller={selectedSeller}
                      onSelect={onSelect}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SellerReferralTree = () => {
  const [loading, setLoading] = useState(true);
  const [treePayload, setTreePayload] = useState({
    rootSeller: null,
    totalDirect: 0,
    totalDownline: 0,
    referrals: [],
  });
  const [copied, setCopied] = useState(false);
  const [sellerCode, setSellerCode] = useState("");
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchReferralTree();
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

  const fetchReferralTree = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/referral-tree`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTreePayload({
          rootSeller: data.rootSeller || null,
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

  // Convert flat referrals list into a nested parent -> children tree
  const hierarchicalRoot = useMemo(() => {
    const map = new Map();

    const root = {
      id: treePayload.rootSeller?.id ?? "root",
      store_name: treePayload.rootSeller?.store_name || "My Store",
      owner_name: treePayload.rootSeller?.owner_name || "Account Owner",
      email: treePayload.rootSeller?.email || "",
      phone: treePayload.rootSeller?.phone || "",
      referral_code: treePayload.rootSeller?.referral_code || sellerCode || "ROOT",
      level: 0,
      children: [],
    };

    map.set(String(root.id), root);

    treePayload.referrals.forEach((item) => {
      map.set(String(item.id), {
        ...item,
        level: Number(item.level) || 1,
        children: [],
      });
    });

    treePayload.referrals.forEach((item) => {
      const currentNode = map.get(String(item.id));
      const parentId =
        item.level === 1 || !item.referrer_id
          ? String(root.id)
          : String(item.referrer_id);
      const parentNode = map.get(parentId) || root;
      parentNode.children.push(currentNode);
    });

    return root;
  }, [treePayload, sellerCode]);

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
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400 text-2xl shrink-0">
            <FaSitemap />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                My Network Tree
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-lime-400/10 text-lime-400 border border-lime-400/25">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                Lineage Live
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Visual tree representation of merchants you referred and their downline referrals.
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
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 text-lg font-bold">
            <FaUsers />
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/40 font-bold">
              Direct Referrals (Level 1)
            </p>
            <p className="text-2xl font-black text-white mt-0.5">{treePayload.totalDirect}</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 text-lg font-bold">
            <FaSitemap />
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/40 font-bold">
              Total Downline Network
            </p>
            <p className="text-2xl font-black text-lime-400 mt-0.5">
              {treePayload.totalDownline}
            </p>
          </div>
        </div>
      </div>

      {/* TREE CANVAS CARD */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
              <FaSearch className="text-xs" />
            </span>
            <input
              type="text"
              placeholder="Highlight store, owner, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(1))))}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Zoom Out"
            >
              <FaSearchMinus />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-white/70">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Zoom In"
            >
              <FaSearchPlus />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setSearch("");
                setSelectedSeller(null);
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Reset View"
            >
              <FaUndo /> Reset
            </button>
          </div>
        </div>

        {/* Selected Node Details Bar */}
        {selectedSeller && (
          <div className="px-5 py-3 bg-lime-400/10 border-b border-lime-400/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-black text-lime-400">{selectedSeller.store_name}</span>
              <span className="text-white/70">Owner: {selectedSeller.owner_name || "-"}</span>
              {selectedSeller.phone && (
                <span className="flex items-center gap-1 text-white/70">
                  <FaPhone className="text-[10px] text-lime-400" /> {selectedSeller.phone}
                </span>
              )}
              {selectedSeller.email && (
                <span className="flex items-center gap-1 text-white/70">
                  <FaEnvelope className="text-[10px] text-lime-400" /> {selectedSeller.email}
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedSeller(null)}
              className="text-[11px] font-bold text-white/60 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {/* Scrollable Hierarchy Tree */}
        <div className="p-6 md:p-10 overflow-x-auto min-h-[420px] flex justify-center items-start">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
            className="transition-transform duration-150 inline-block"
          >
            {hierarchicalRoot.children.length === 0 ? (
              <div className="flex flex-col items-center">
                <TreeNode
                  node={hierarchicalRoot}
                  searchTerm={search}
                  selectedSeller={selectedSeller}
                  onSelect={setSelectedSeller}
                  isRoot
                />
                <p className="mt-8 text-xs text-white/40">
                  No downline merchants yet. Share your referral link to grow your tree.
                </p>
              </div>
            ) : (
              <TreeNode
                node={hierarchicalRoot}
                searchTerm={search}
                selectedSeller={selectedSeller}
                onSelect={setSelectedSeller}
                isRoot
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerReferralTree;