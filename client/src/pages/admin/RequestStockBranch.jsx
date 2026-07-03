import React, { useState, useEffect } from 'react'
import { Check, X, Package, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_REQUESTS_URL = 'http://localhost:5000/api/stock-requests/stock-requests'

const RequestStockBranch = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchBranchRequests()
  }, [])

  const fetchBranchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_REQUESTS_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        console.error("Pipeline failure server validation error.")
      }
    } catch (err) {
      console.error("Critical communications link interface breakdown error:", err)
      toast.error("Pipeline failure reading transaction data indicators.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecuteDecision = async (id, finalizedVerdict) => {
    const toastLoadId = toast.loading(`Registering structural decision state to '${finalizedVerdict}'...`)
    try {
      const response = await fetch(`${API_REQUESTS_URL}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: finalizedVerdict })
      })

      if (response.ok) {
        toast.success(`Request Order Index Ref ID: #${id} marked as ${finalizedVerdict}!`, { id: toastLoadId })
        fetchBranchRequests() 
      } else {
        toast.error("Server instance rejected configuration state validation schema mapping logs.", { id: toastLoadId })
      }
    } catch (err) {
      toast.error("Network interface connection timeout anomaly caught.", { id: toastLoadId })
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark/20 min-h-screen text-gray-canvas text-left">
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-2">
          <span className='text-lime-400'>Request</span> From the branch
        </h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">Review inbound branch logistical procurement requests, verify item cost parameters, and apply database state updates.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-lime-accent" /> Processing Inbound Invoices Queue Stream
        </h3>

        {isLoading ? (
          <div className="text-center py-24 text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse">
            Fetching active pipeline channel logs matrices...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center bg-royal-main/10 text-xs font-bold uppercase tracking-wider text-gray-canvas/30">
            No pending stock allocation requirements issued from branch nodes.
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-royal-main/20 shadow-xl backdrop-blur-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-royal-dark/60 border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-gray-canvas/50">
                  <th className="p-4">Ref Ticket</th>
                  {/* ADDED: Branch column header */}
                  <th className="p-4">Originating Branch</th>
                  <th className="p-4">Target Product Metadata</th>
                  <th className="p-4">Category Node</th>
                  <th className="p-4">Requested Volume</th>
                  <th className="p-4">Total Multiplied Cost</th>
                  <th className="p-4">Current Status Badge</th>
                  <th className="p-4 text-right">Fulfillment Pipeline Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((reqItem) => (
                  <tr key={reqItem.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-lime-accent/70">#STK-{reqItem.id}</td>
                    
                    {/* ADDED: Branch cell rendering */}
                    <td className="p-4">
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md font-bold text-lime-400 uppercase tracking-wide">
                        {reqItem.branch_name || 'Unknown Branch'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-bold text-white">{reqItem.product_name || `Deleted Product Asset`}</p>
                        <p className="text-[10px] text-gray-canvas/40 font-mono mt-0.5">Admin Rate Unit: ₹{parseFloat(reqItem.branch_admin_price || 0).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="p-4 uppercase font-semibold text-gray-canvas/70">{reqItem.category}</td>
                    <td className="p-4 font-mono font-bold text-gray-canvas">{reqItem.requested_count} units</td>
                    <td className="p-4 font-mono text-lime-accent font-black">₹{parseFloat(reqItem.total_amount).toLocaleString()}</td>
                    <td className="p-4">
                      {reqItem.status === 'Approved' && <span className="flex items-center gap-1 w-fit px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                      {reqItem.status === 'Rejected' && <span className="flex items-center gap-1 w-fit px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"><XCircle className="w-3 h-3" /> Rejected</span>}
                      {reqItem.status === 'Pending' && <span className="flex items-center gap-1 w-fit px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse"><Clock className="w-3 h-3" /> Pending Review</span>}
                    </td>
                    <td className="p-4 text-right">
                      {reqItem.status === 'Pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleExecuteDecision(reqItem.id, 'Approved')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-[#071640] hover:border-emerald-500 transition-all duration-200 cursor-pointer"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleExecuteDecision(reqItem.id, 'Rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 text-white hover:border-red-500 transition-all cursor-pointer"
                          >
                            <X className="w-3 h-3 stroke-[3]" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-gray-canvas/30 uppercase tracking-widest mr-4 select-none">Settled Transaction</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestStockBranch;