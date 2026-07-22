import React, { useState, useEffect } from 'react'
import { Image, Layers, Plus, CheckSquare, Square, Trash2, Edit3, X, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const BASELINE_PRESETS = [
  "100gram", "200gram", "250gram", "1/2 kg", "1kg", "100ml", "200ml", "250ml", 
  "1/2 litre", "1 litre", "Brand Name", "RAM and ROM", "Water Resistant", "Battery", "Color"
]

const SellerCategory = () => {
  const [categories, setCategories] = useState([])
  const [isLoadingCats, setIsLoadingCats] = useState(false)
  const [dynamicPresets, setDynamicPresets] = useState(BASELINE_PRESETS)

  // Get user session data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = user?.id || user?._id
  const userRole = user?.role || 'seller'

  // Creation State Matrix
  const [name, setName] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [customSpecInput, setCustomSpecInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Specific Nested Color Tabs State (Creation)
  const [colorInput, setColorInput] = useState('')
  const [definedColors, setDefinedColors] = useState([])

  // Editing State Matrix
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSpecs, setEditSpecs] = useState([])
  const [editCustomSpec, setEditCustomSpec] = useState('')
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editRawFile, setEditRawFile] = useState(null)
  
  // Specific Nested Color Tabs State (Editing)
  const [editColorInput, setEditColorInput] = useState('')
  const [editDefinedColors, setEditDefinedColors] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      const uniqueSpecs = new Set([...BASELINE_PRESETS])
      categories.forEach(cat => {
        if (cat.attributes && Array.isArray(cat.attributes)) {
          cat.attributes.forEach(attr => {
            if (attr && !attr.startsWith("Color: ")) {
              uniqueSpecs.add(attr)
            }
          })
        }
      })
      setDynamicPresets(Array.from(uniqueSpecs))
    }
  }, [categories])

  const fetchCategories = async () => {
    setIsLoadingCats(true)
    try {
      const response = await fetch(API_CAT_URL)
      if (response.ok) {
        const data = await response.json()
        
        // FILTERING LOGIC: If seller, show only their created categories. If admin, show all.
        if (userRole === 'admin') {
          setCategories(data)
        } else {
          const sellerOnlyCategories = data.filter(cat => 
            String(cat.sellerId || cat.userId || cat.createdBy) === String(currentUserId)
          )
          setCategories(sellerOnlyCategories)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingCats(false)
    }
  }

  const handleAddColorTab = (isEditMode = false) => {
    const targetInput = isEditMode ? editColorInput : colorInput
    const trimmed = targetInput.trim()
    if (!trimmed) return

    if (isEditMode) {
      if (!editDefinedColors.includes(trimmed)) {
        setEditDefinedColors([...editDefinedColors, trimmed])
      }
      setEditColorInput('')
    } else {
      if (!definedColors.includes(trimmed)) {
        setDefinedColors([...definedColors, trimmed])
      }
      setColorInput('')
    }
  }

  const handleRemoveColorTab = (colorToRemove, isEditMode = false) => {
    if (isEditMode) {
      setEditDefinedColors(editDefinedColors.filter(c => c !== colorToRemove))
    } else {
      setDefinedColors(definedColors.filter(c => c !== colorToRemove))
    }
  }

  const handleAddCustomSpecGlobal = (isEditMode = false) => {
    const targetInput = isEditMode ? editCustomSpec : customSpecInput
    const trimmed = targetInput.trim()
    if (!trimmed) return

    if (!dynamicPresets.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      setDynamicPresets([...dynamicPresets, trimmed])
    }

    if (isEditMode) {
      if (!editSpecs.includes(trimmed)) setEditSpecs([...editSpecs, trimmed])
      setEditCustomSpec('')
    } else {
      if (!selectedSpecs.includes(trimmed)) setSelectedSpecs([...selectedSpecs, trimmed])
      setCustomSpecInput('')
    }
  }

  const toggleSpec = (spec, isEditMode = false) => {
    if (isEditMode) {
      setEditSpecs(editSpecs.includes(spec) ? editSpecs.filter(i => i !== spec) : [...editSpecs, spec])
    } else {
      setSelectedSpecs(selectedSpecs.includes(spec) ? selectedSpecs.filter(i => i !== spec) : [...selectedSpecs, spec])
    }
  }

  const handleImageChange = (e, isEditMode = false) => {
    const file = e.target.files[0]
    if (!file) return
    if (isEditMode) {
      setEditRawFile(file)
      setEditImagePreview(URL.createObjectURL(file))
    } else {
      setRawFile(file)
      setEditImagePreview(null)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rawFile) return toast.error("Please upload a category image.")

    setIsSubmitting(true)
    const loadId = toast.loading("Deploying category matrix...")

    let finalAttributes = [...selectedSpecs]
    if (selectedSpecs.includes("Color") && definedColors.length > 0) {
      definedColors.forEach(col => finalAttributes.push(`Color: ${col}`))
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('categoryImage', rawFile)
    formData.append('attributes', JSON.stringify(finalAttributes))
    if (currentUserId) {
      formData.append('sellerId', currentUserId)
    }

    try {
      const response = await fetch(API_CAT_URL, { method: 'POST', body: formData })
      if (response.ok) {
        toast.success("Category deployed completely!", { id: loadId })
        setName(''); setImagePreview(null); setRawFile(null); setSelectedSpecs([]); setDefinedColors([])
        fetchCategories()
      } else {
        toast.error("Deployment failure.", { id: loadId })
      }
    } catch (err) {
      toast.error("Network fault.", { id: loadId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditImagePreview(cat.image_url || cat.imageUrl)
    setEditRawFile(null)

    const plainSpecs = []
    const parsedColors = []

    if (cat.attributes) {
      cat.attributes.forEach(attr => {
        if (attr.startsWith("Color: ")) {
          parsedColors.push(attr.replace("Color: ", ""))
        } else {
          plainSpecs.push(attr)
        }
      })
    }

    setEditSpecs(plainSpecs)
    setEditDefinedColors(parsedColors)
  }

  const handleUpdate = async (id) => {
    const loadId = toast.loading("Updating category matrix details...")
    
    let finalEditAttributes = [...editSpecs]
    if (editSpecs.includes("Color") && editDefinedColors.length > 0) {
      editDefinedColors.forEach(col => finalEditAttributes.push(`Color: ${col}`))
    }

    const formData = new FormData()
    formData.append('name', editName)
    formData.append('attributes', JSON.stringify(finalEditAttributes))
    if (editRawFile) {
      formData.append('categoryImage', editRawFile)
    } else {
      formData.append('imageUrl', editImagePreview)
    }

    try {
      const response = await fetch(`${API_CAT_URL}/${id}`, { method: 'PUT', body: formData })
      if (response.ok) {
        toast.success("Updated cleanly!", { id: loadId })
        setEditingId(null)
        fetchCategories()
      } else {
        toast.error("Update execution error.", { id: loadId })
      }
    } catch (err) {
      toast.error("Network fault occurred.", { id: loadId })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely remove this category?")) return
    const loadId = toast.loading("Scrubbing registry item...")
    try {
      const response = await fetch(`${API_CAT_URL}/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success("Purged successfully.", { id: loadId })
        fetchCategories()
      } else {
        toast.error("Failed to purge category record.", { id: loadId })
      }
    } catch (err) {
      toast.error("Network drop context.")
    }
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
          <span className="text-lime-400">{userRole === 'admin' ? 'Admin' : 'Seller'}</span> Category Setup
        </h2>
        <p className="text-xs text-white/50 font-medium mt-1">Configure product category specifications & color attributes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Category Name *</label>
            <input 
              type="text" required placeholder="e.g., Mobiles, Groceries" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Category Image *</label>
            <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl px-4 py-1.5 relative min-h-[46px]">
              <input type="file" required={!imagePreview} accept="image/*" onChange={(e) => handleImageChange(e, false)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <Image className="w-4 h-4 text-white/40" />
              <span className="text-[11px] font-bold text-white/50 truncate max-w-[150px]">{rawFile ? rawFile.name : "Choose Asset Banner"}</span>
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-8 h-8 object-cover rounded-lg ml-auto border border-white/10" />}
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-white/5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Map Specification Parameters & Variants</label>
            <div className="flex items-center gap-1.5">
              <input 
                type="text" placeholder="Add custom spec..." value={customSpecInput}
                onChange={(e) => setCustomSpecInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSpecGlobal(false))}
                className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-lime-400"
              />
              <button type="button" onClick={() => handleAddCustomSpecGlobal(false)} className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-lime-400 text-xs font-bold"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-3 bg-black/30 border border-white/5 rounded-xl">
            {dynamicPresets.map((spec, idx) => {
              const isChecked = selectedSpecs.includes(spec)
              return (
                <button type="button" key={idx} onClick={() => toggleSpec(spec, false)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left transition-all text-[11px] font-medium ${isChecked ? 'bg-lime-400/10 border-lime-400/40 text-lime-400' : 'bg-white/5 border-white/5 text-white/60'}`}>
                  {isChecked ? <CheckSquare className="w-3 h-3 text-lime-400" /> : <Square className="w-3 h-3 text-white/30" />}
                  <span>{spec}</span>
                </button>
              )
            })}
          </div>
        </div>

        {selectedSpecs.includes("Color") && (
          <div className="space-y-3 border-t border-white/5 pt-4 bg-lime-400/5 p-4 rounded-2xl border border-lime-400/10 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-lime-400 block">Configure Color Options Matrix</label>
                <p className="text-[10px] text-white/40 font-medium">Type color variant name and hit Enter to add.</p>
              </div>
              <div className="flex items-center gap-1.5">
                <input 
                  type="text" placeholder="e.g., Crimson Red, Navy Blue" value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColorTab(false))}
                  className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-lime-400"
                />
                <button type="button" onClick={() => handleAddColorTab(false)} className="p-1.5 bg-lime-400 text-slate-900 hover:opacity-90 rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
              {definedColors.length === 0 ? (
                <span className="text-[10px] text-white/30 italic">No color tabs appended yet.</span>
              ) : (
                definedColors.map((color, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-black/40 border border-white/10 text-white px-2 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide">
                    <span>{color}</span>
                    <button type="button" onClick={() => handleRemoveColorTab(color, false)} className="text-red-400 hover:text-red-500 font-bold ml-1">×</button>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-400 text-slate-950 hover:shadow-[0_4px_25px_rgba(165,206,0,0.35)] transition-all font-black disabled:opacity-50 cursor-pointer">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isSubmitting ? "Processing..." : "Deploy Category Matrix"}</span>
        </button>
      </form>

      <div className="space-y-4 border-t border-white/10 pt-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-white/60 flex items-center gap-2">
          <Layers className="w-4 h-4 text-lime-400" />
          <span>{userRole === 'admin' ? 'All System Categories' : 'Your Added Categories'} ({categories.length})</span>
        </h3>

        {isLoadingCats ? (
          <p className="text-center text-[11px] font-mono text-lime-400/60 animate-pulse py-6">READING LIVE LOGS...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-xs text-white/30 py-6">No categories found for this account.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl shadow-md transition-all">
                {editingId === cat.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-lime-400"
                      />
                      <div className="flex items-center gap-2 relative bg-black/30 border border-white/10 rounded-xl px-3 py-1 text-xs">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        <span className="text-[10px] text-white/50 truncate max-w-[120px]">{editRawFile ? editRawFile.name : "Replace Cover"}</span>
                        {editImagePreview && <img src={editImagePreview} alt="Edit Prev" className="w-6 h-6 object-cover rounded-md ml-auto border border-white/10" />}
                      </div>
                    </div>

                    <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-bold text-white/50 uppercase">Update Specs</span>
                        <div className="flex items-center gap-1">
                          <input 
                            type="text" placeholder="Add custom spec..." value={editCustomSpec}
                            onChange={(e) => setEditCustomSpec(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSpecGlobal(true))}
                            className="bg-black/30 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none"
                          />
                          <button type="button" onClick={() => handleAddCustomSpecGlobal(true)} className="p-1 bg-lime-400/20 rounded text-lime-400"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dynamicPresets.map((spec, i) => {
                          const isChecked = editSpecs.includes(spec)
                          return (
                            <button type="button" key={i} onClick={() => toggleSpec(spec, true)} className={`px-2 py-1 rounded text-[10px] font-medium border ${isChecked ? 'bg-lime-400/10 border-lime-400 text-lime-400' : 'bg-transparent border-white/5 text-white/40'}`}>
                              {spec}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {editSpecs.includes("Color") && (
                      <div className="space-y-2 bg-black/40 border border-lime-400/20 p-3 rounded-xl">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-lime-400 uppercase">Modify Color Tabs</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" placeholder="Add color variant..." value={editColorInput}
                              onChange={(e) => setEditColorInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColorTab(true))}
                              className="bg-black/30 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none"
                            />
                            <button type="button" onClick={() => handleAddColorTab(true)} className="p-1 bg-lime-400 text-slate-900 rounded"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {editDefinedColors.map((color, i) => (
                            <span key={i} className="flex items-center gap-1 bg-black/50 px-2 py-0.5 border border-white/5 text-[10px] rounded text-white uppercase font-medium">
                              <span>{color}</span>
                              <button type="button" onClick={() => handleRemoveColorTab(color, true)} className="text-red-400 ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase bg-white/5 text-white hover:bg-white/10"><X className="w-3.5 h-3.5" /> Cancel</button>
                      <button type="button" onClick={() => handleUpdate(cat.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase bg-lime-400 text-slate-950 hover:opacity-90"><Save className="w-3.5 h-3.5" /> Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img src={cat.image_url || cat.imageUrl} alt={cat.name} className="w-12 h-12 object-cover rounded-xl border border-white/10 bg-black/40 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-white">{cat.name}</h4>
                        <div className="flex flex-wrap gap-1">
                          {cat.attributes && cat.attributes.length > 0 ? (
                            cat.attributes.map((attr, i) => {
                              const isColorVal = attr.startsWith("Color: ")
                              return (
                                <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${isColorVal ? 'bg-lime-400/10 border-lime-400/30 text-lime-400 font-semibold' : 'bg-white/5 border-white/5 text-white/70'}`}>
                                  {attr}
                                </span>
                              )
                            })
                          ) : (
                            <span className="text-[9px] text-white/30 italic">No specifications bound.</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button onClick={() => startEdit(cat)} className="p-2 bg-white/5 border border-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerCategory