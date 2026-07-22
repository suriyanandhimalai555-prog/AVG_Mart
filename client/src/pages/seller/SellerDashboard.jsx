import React, { useEffect, useState } from 'react';
import { FaRupeeSign, FaBox, FaShoppingBag, FaShippingFast } from 'react-icons/fa';

const SellerDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/dashboard-stats`)
      .then(res => res.json())
      .then(resData => setData(resData))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black uppercase text-white">Merchant Dashboard</h1>
        <p className="text-xs text-white/40">Real-time marketplace metric tracker</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/40">Total Sales</p>
            <h3 className="text-xl font-black text-lime-400 mt-1">{data?.stats?.totalSales || "₹0"}</h3>
          </div>
          <div className="w-10 h-10 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 text-lg"><FaRupeeSign /></div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/40">Total Orders</p>
            <h3 className="text-xl font-black text-white mt-1">{data?.stats?.totalOrders || "0"}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 text-lg"><FaShoppingBag /></div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/40">Live Products</p>
            <h3 className="text-xl font-black text-white mt-1">{data?.stats?.activeProducts || "0"}</h3>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 text-lg"><FaBox /></div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-white/40">Pending Shipments</p>
            <h3 className="text-xl font-black text-amber-400 mt-1">{data?.stats?.pendingShipments || "0"}</h3>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 text-lg"><FaShippingFast /></div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-bold uppercase text-white mb-4">Recent Fulfillment Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/70">
            <thead className="border-b border-white/10 text-white/40 uppercase text-[10px]">
              <tr>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Buyer</th>
                <th className="pb-3">Item</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.01]">
                  <td className="py-3 font-mono font-bold text-lime-400">{order.id}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3">{order.product}</td>
                  <td className="py-3 font-bold">{order.amount}</td>
                  <td className="py-3"><span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px]">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;