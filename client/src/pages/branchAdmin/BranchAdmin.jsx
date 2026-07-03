import React, { useState, useEffect } from 'react'
import { User, Mail, Building2, MapPin, Key, Eye, EyeOff, Edit2, Plus, X, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

const BranchAdmin = () => {
  // Master database state matrix for live connected backend nodes
  const [admins, setAdmins] = useState([])
  const [isLoadingRegistry, setIsLoadingRegistry] = useState(true)

  // UI state orchestration variables
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState({})

  // Form core object properties
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    pincodes: '',
    password: ''
  })

  const token = localStorage.getItem("token")

  // --- FETCH ALL ACTIVE NODES FROM LIVE BACKEND ---
  const fetchBranchAdministrators = async () => {
    setIsLoadingRegistry(true)
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/branch", {
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      } else {
        toast.error("Failed to query localized administrative cluster registries.")
      }
    } catch (err) {
      console.error("Network synchronization fault:", err)
      toast.error("Telemetry connection error mapping backend databases.")
    } finally {
      setIsLoadingRegistry(false)
    }
  }

  useEffect(() => {
    fetchBranchAdministrators()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleOpenCreateModal = () => {
    setFormData({ name: '', email: '', branch: '', pincodes: '', password: '' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      branch: admin.branch,
      pincodes: admin.pincodes,
      password: admin.password
    })
    setEditingId(admin.id)
    setIsModalOpen(true)
  }

  // --- LIVE WRITE ENGINE: CREATE / MODIFY ENDPOINT CALLS ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (!formData.name || !formData.email || !formData.branch || !formData.pincodes || !formData.password) {
      toast.error("Please fill in all mandatory profile configuration fields.")
      setIsSubmitting(false)
      return
    }

    const toastId = toast.loading(
      editingId 
        ? "Reconfiguring core node matrices..." 
        : "Registering administrative node & triggering mail distribution payload..."
    )

    try {
      const url = editingId 
        ? `http://localhost:5000/api/auth/admin/branch/${editingId}`
        : "http://localhost:5000/api/auth/admin/branch"
      
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(
          editingId 
            ? "Node properties modified cleanly inside record registry." 
            : "Admin profile compiled. Access credentials successfully dispatched via Nodemailer.", 
          { id: toastId }
        )
        setIsModalOpen(false)
        setFormData({ name: '', email: '', branch: '', pincodes: '', password: '' })
        setEditingId(null)
        
        // Force sync table view state back with backend PostgreSQL changes
        fetchBranchAdministrators()
      } else {
        toast.error(result.message || "Failed processing custom validation rules.", { id: toastId })
      }
    } catch (err) {
      console.error("Structural sync connection error caught:", err)
      toast.error("Network communication failure executing state mutation.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark min-h-screen text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Control Title Block Layout Grid */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">Create <span className='text-lime-400'>Branch</span> Admin</h2>
          <p className="text-xs text-white/50 font-medium mt-1">Configure structural logistics access, assign local fulfillment sectors, and track serviceable postal codes.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 self-start sm:self-center text-[10px] font-black uppercase tracking-wider bg-lime-accent text-royal-dark hover:bg-white px-4 py-3 rounded-xl transition-all font-sans font-bold shadow-lg cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Branch Admin
        </button>
      </div>

      {/* Master Node Data Registry Table */}
      <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 relative z-10 backdrop-blur-md">
        <div className="text-left">
          <h3 className="text-sm font-black tracking-wide uppercase text-white">Active Branch Admin</h3>
          <p className="text-[11px] text-white/40 mt-0.5">Live routing terminal matrices containing systemic logistical coverage scopes inside PostgreSQL.</p>
        </div>

        {isLoadingRegistry ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-20">
            Parsing structural PostgreSQL cluster registries...
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-16 text-xs font-mono tracking-widest text-white/20 uppercase border border-dashed border-white/10 rounded-xl">
            No active nodes mapped inside active administrative database storage modules
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-royal-dark/40">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4 w-24">Node ID</th>
                  <th className="p-4">Administrator Info</th>
                  <th className="p-4">Operational Hub</th>
                  <th className="p-4 max-w-xs">Coverage Pincodes</th>
                  <th className="p-4 w-44">Credentials Matrix</th>
                  <th className="p-4 w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white/80 font-medium">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap">{admin.nodeId || `BR-${admin.id}`}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">{admin.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{admin.email}</div>
                    </td>
                    <td className="p-4 text-white/70 font-semibold">{admin.branch}</td>
                    <td className="p-4 font-mono text-white/50 break-words max-w-xs text-[11px] leading-relaxed">
                      {admin.pincodes}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 w-fit">
                        <span className="font-mono text-[11px] text-white/60">
                          {visiblePasswords[admin.id] ? admin.password : "••••••••••••"}
                        </span>
                        <button 
                          onClick={() => togglePasswordVisibility(admin.id)}
                          className="text-white/40 hover:text-white transition-colors cursor-pointer ml-1"
                        >
                          {visiblePasswords[admin.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => handleOpenEditModal(admin)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-lime-accent hover:text-royal-dark transition-all cursor-pointer font-bold"
                      >
                        <Edit2 className="w-3 h-3" /> <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Modal Configuration Shell */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-6 animate-fadeIn">
            
            {/* Modal Control Header Panel */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-accent font-mono">System Node Interface</span>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  {editingId ? `Modify Administrative Record` : "Register New Administrator Vector"}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Registry Processing Input Forms */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              
              {/* Admin Name Input Vector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Branch Admin Name</label>
                <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-lime-accent transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent font-sans text-xs text-white placeholder-white/20 focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {/* Admin Email Input Vector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Email Address</label>
                <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-lime-accent transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin.hq@storefront.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent font-mono text-xs text-white focus:outline-none placeholder-white/20"
                    required
                  />
                </div>
              </div>

              {/* Secure Password Input Vector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Credential Gateway Password</label>
                <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-lime-accent transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter access authentication password tokens"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent font-mono text-xs text-white focus:outline-none placeholder-white/20"
                    required
                  />
                </div>
              </div>

              {/* Logistics Branch Office Input Vector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Assigned Delivery Branch</label>
                <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-lime-accent transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    placeholder="e.g. South Bengaluru Hub"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent font-sans text-xs text-white placeholder-white/20 focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {/* Serviceable Pincodes Input Matrix */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Serviceable Coverage Pincodes</label>
                <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-lime-accent transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3.5 pt-3 flex items-start pointer-events-none text-white/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    name="pincodes"
                    rows="3"
                    value={formData.pincodes}
                    onChange={handleInputChange}
                    placeholder="Enter postal codes separated by commas (e.g. 560001, 560011, 560078)"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent font-mono text-xs text-white focus:outline-none placeholder-white/20 resize-none leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* Execution Action Bar Footer */}
              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-accent text-royal-dark hover:bg-white transition-all font-bold shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Processing Database Hooks...</span>
                  ) : (
                    <>
                      <span>{editingId ? "Save Node Changes" : "Commit Administrative Node"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchAdmin