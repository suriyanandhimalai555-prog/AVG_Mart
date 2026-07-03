import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { User, Mail, Building2, MapPin, Key, Save, ShieldCheck, Edit3, Lock, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const BranchProfile = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [profileId, setProfileId] = useState(null)
  
  // Standard profile data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    pincodes: ''
  })

  // Separate Password change form fields state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const token = localStorage.getItem("token")

  const fetchBranchProfile = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/branch`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = Array.isArray(res.data) ? res.data[0] : res.data

      if (data) {
        setProfileId(data.id)
        setFormData({
          name: data.name || '',
          email: data.email || '',
          branch: data.branch || '',
          pincodes: data.pincodes || ''
        })
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to load Branch Profile configurations.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBranchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  // Action 1: Save standard Profile Changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profileId) return

    setIsSubmitting(true)
    const toastId = toast.loading("Saving configuration updates...")

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/branch/${profileId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Profile synchronized cleanly.", { id: toastId })
      setIsEditable(false)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed updating record parameters.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Action 2: Change Password Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password matching sequence validation failed.")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Altering access credentials...")

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/branch/${profileId}`,
        {
          ...formData, // Keep existing values constant
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Security credentials modified successfully.", { id: toastId })
      setIsPasswordModalOpen(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed updating password fields.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-xs font-mono tracking-widest text-lime-400 uppercase animate-pulse bg-[#030e26] min-h-screen flex items-center justify-center">
        Parsing structural administrative cluster records...
      </div>
    )
  }

  // Premium WebKit horizontal scrollbar optimization styling string
  const customScrollbarClasses = "scrollbar-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"

  return (
    <div className="space-y-8 min-h-screen text-white relative overflow-hidden text-left">
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" /> */}

      {/* Profile Header Segment with Toggle Button in Top Right Corner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
            Branch <span className="text-lime-400">Profile</span> Configurations
          </h2>
          <p className="text-xs text-white/50 font-medium mt-1">
            Review logistical identity metrics, assign active hub scopes, or override security parameters.
          </p>
        </div>

        {/* TOP RIGHT CORNER: Toggle Edit Mode Switch Button */}
        <button
          onClick={() => setIsEditable(!isEditable)}
          className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer border self-start sm:self-center ${
            isEditable 
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
              : 'bg-lime-400 text-black border-lime-400 font-bold hover:bg-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditable ? "Cancel Editing" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Main Core Form Block Wrapper */}
      <div className="max-w-2xl bg-[#071640] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-lime-400/10 rounded-xl border border-lime-400/20 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wider uppercase text-white">Branch Admin Profile</h3>
              <p className="text-[10px] text-white/40 mt-0.5">
                {isEditable ? "System interface is open for profile modification." : "Fields locked. Click 'Edit Profile' to modify fields."}
              </p>
            </div>
          </div>

          {/* DEDICATED SEPARATE BUTTON FOR PASSWORD ALTERATION - Styled like the secondary action layouts */}
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-lime-400 hover:text-black transition-all cursor-pointer self-end sm:self-center"
          >
            <Lock className="w-3.5 h-3.5" /> 
            <span>Change Password</span>
          </button>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Operator Name Vector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Operator Name</label>
            <div className={`relative rounded-xl border bg-white/5 focus-within:border-lime-400 transition-all duration-300 ${!isEditable ? 'border-white/5 opacity-50' : 'border-white/10'}`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                disabled={!isEditable}
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-transparent font-sans text-xs text-white focus:outline-none font-medium disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Email Vector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Email Identifier Link</label>
            <div className={`relative rounded-xl border bg-white/5 focus-within:border-lime-400 transition-all duration-300 ${!isEditable ? 'border-white/5 opacity-50' : 'border-white/10'}`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                disabled={!isEditable}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-transparent font-mono text-xs text-white focus:outline-none disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Assigned Logistic Hub */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Assigned Logistic Hub</label>
            <div className={`relative rounded-xl border bg-white/5 focus-within:border-lime-400 transition-all duration-300 ${!isEditable ? 'border-white/5 opacity-50' : 'border-white/10'}`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="branch"
                disabled={!isEditable}
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-transparent font-sans text-xs text-white focus:outline-none font-medium disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Coverage Service Pincodes Area */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Active Handling Pincodes</label>
            <div className={`relative rounded-xl border bg-white/5 focus-within:border-lime-400 transition-all duration-300 ${!isEditable ? 'border-white/5 opacity-50' : 'border-white/10'}`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 flex items-start pointer-events-none text-white/30">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                name="pincodes"
                rows="3"
                disabled={!isEditable}
                value={formData.pincodes}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-transparent font-mono text-xs text-white focus:outline-none resize-none leading-relaxed disabled:cursor-not-allowed ${customScrollbarClasses}`}
                required
              />
            </div>
          </div>

          {/* Form Action Save Bar - Only visible during active Editing operations */}
          {isEditable && (
            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-400 text-[#071640] hover:bg-lime-300 hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isSubmitting ? "Updating Matrix..." : "Save Configuration Matrix"}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* SECURE SEPARATE PASSWORD CHANGES MODAL - PORTAL IMPLEMENTATION */}
      {isPasswordModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#071640] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-6 text-white text-left">
            
            {/* PORTAL MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 font-mono">
                  Access Credential
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-lime-400" />
                  <span>Update Access Key</span>
                </h3>
              </div>
              <button 
                onClick={() => setIsPasswordModalOpen(false)} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM FIELD LAYOUT PATTERNS */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* 1. Enter Current Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              {/* 2. Enter New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="New password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              {/* 3. Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Re-type New password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              {/* PORTAL ACTION BUTTON CONTROLS */}
              <div className="flex justify-end pt-4 border-t border-white/5 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-400 text-[#071640] hover:bg-lime-300 font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default BranchProfile