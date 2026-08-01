import React, { useState, useEffect } from 'react'
import { Image, Layers, Plus, CheckSquare, Square, Trash2, Edit3, X, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const BASELINE_PRESETS = [
  "100gram", "200gram", "250gram", "1/2 kg", "1kg", "100ml", "200ml", "250ml", 
  "1/2 litre", "1 litre", "Brand Name", "RAM and ROM", "Water Resistant", "Battery", "Color", "Size"
]

const AddCategory = () => {
  const [categories, setCategories] = useState([])
  const [isLoadingCats, setIsLoadingCats] = useState(false)
  const [dynamicPresets, setDynamicPresets] = useState(BASELINE_PRESETS)

  // --- Creation State Matrix ---
  const [name, setName] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const [selectedSpecs, setSelectedSpecs] = useState([])
  const [customSpecInput, setCustomSpecInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Specific Nested Color Tabs State (Creation)
  const [colorInput, setColorInput] = useState('')
  const [definedColors, setDefinedColors] = useState([])

  // Specific Nested Size Tabs State (Creation)
  const [sizeInput, setSizeInput] = useState('')
  const [definedSizes, setDefinedSizes] = useState([])

  // --- Editing State Matrix ---
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSpecs, setEditSpecs] = useState([])
  const [editCustomSpec, setEditCustomSpec] = useState('')
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editRawFile, setEditRawFile] = useState(null)
  
  // Specific Nested Color & Size Tabs State (Editing)
  const [editColorInput, setEditColorInput] = useState('')
  const [editDefinedColors, setEditDefinedColors] = useState([])
  const [editSizeInput, setEditSizeInput] = useState('')
  const [editDefinedSizes, setEditDefinedSizes] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      const uniqueSpecs = new Set([...BASELINE_PRESETS])
      const standardSizesRegex = /^(s|m|l|xl|xxl|xxxl|uk\s?\d+|\d+)$/i

      categories.forEach(cat => {
        if (cat.attributes && Array.isArray(cat.attributes)) {
          cat.attributes.forEach(attr => {
            if (attr && !attr.startsWith("Color: ") && !standardSizesRegex.test(attr)) {
              uniqueSpecs.add(attr)
            }
          })
        }
      })
      setDynamicPresets(Array.from(uniqueSpecs))
    }
  }, [categories])

  const handleAddColorTab = (isEditMode = false) => {
    const targetInput = isEditMode ? editColorInput : colorInput
    const trimmed = targetInput.trim()
    if (!trimmed) return
    if (isEditMode) {
      if (!editDefinedColors.includes(trimmed)) setEditDefinedColors([...editDefinedColors, trimmed])
      setEditColorInput('')
    } else {
      if (!definedColors.includes(trimmed)) setDefinedColors([...definedColors, trimmed])
      setColorInput('')
    }
  }

  const handleRemoveColorTab = (colorToRemove, isEditMode = false) => {
    if (isEditMode) setEditDefinedColors(editDefinedColors.filter(c => c !== colorToRemove))
    else setDefinedColors(definedColors.filter(c => c !== colorToRemove))
  }

  const handleAddSizeTab = (isEditMode = false) => {
    const targetInput = isEditMode ? editSizeInput : sizeInput
    const trimmed = targetInput.trim()
    if (!trimmed) return
    if (isEditMode) {
      if (!editDefinedSizes.includes(trimmed)) setEditDefinedSizes([...editDefinedSizes, trimmed])
      setEditSizeInput('')
    } else {
      if (!definedSizes.includes(trimmed)) setDefinedSizes([...definedSizes, trimmed])
      setSizeInput('')
    }
  }

  const handleRemoveSizeTab = (sizeToRemove, isEditMode = false) => {
    if (isEditMode) setEditDefinedSizes(editDefinedSizes.filter(s => s !== sizeToRemove))
    else setDefinedSizes(definedSizes.filter(s => s !== sizeToRemove))
  }

  const loadPresetSizes = (type, isEditMode = false) => {
    const presets = type === 'clothing' 
      ? ['S', 'M', 'L', 'XL', 'XXL'] 
      : ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
    
    if (isEditMode) {
      setEditDefinedSizes([...new Set([...editDefinedSizes, ...presets])])
    } else {
      setDefinedSizes([...new Set([...definedSizes, ...presets])])
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

    // Filter out the meta-tags "Color" and "Size" before saving
    let finalAttributes = selectedSpecs.filter(spec => spec !== "Color" && spec !== "Size")
    
    if (selectedSpecs.includes("Color") && definedColors.length > 0) {
      definedColors.forEach(col => finalAttributes.push(`Color: ${col}`))
    }
    if (selectedSpecs.includes("Size") && definedSizes.length > 0) {
      definedSizes.forEach(sz => finalAttributes.push(sz))
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('categoryImage', rawFile)
    formData.append('attributes', JSON.stringify(finalAttributes))

    try {
      const response = await fetch(API_CAT_URL, { method: 'POST', body: formData })
      if (response.ok) {
        toast.success("Deployed completely!", { id: loadId })
        setName(''); setImagePreview(null); setRawFile(null); setSelectedSpecs([]); setDefinedColors([]); setDefinedSizes([])
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
    const parsedSizes = []
    const standardSizesRegex = /^(s|m|l|xl|xxl|xxxl|uk\s?\d+|\d+)$/i

    if (cat.attributes) {
      cat.attributes.forEach(attr => {
        if (attr.startsWith("Color: ")) {
          parsedColors.push(attr.replace("Color: ", ""))
        } else if (standardSizesRegex.test(attr)) {
          parsedSizes.push(attr)
        } else {
          plainSpecs.push(attr)
        }
      })
    }

    if (parsedColors.length > 0) plainSpecs.push("Color")
    if (parsedSizes.length > 0) plainSpecs.push("Size")

    setEditSpecs(plainSpecs)
    setEditDefinedColors(parsedColors)
    setEditDefinedSizes(parsedSizes)
  }

  const handleUpdate = async (id) => {
    const loadId = toast.loading("Updating category matrix details...")
    
    let finalEditAttributes = editSpecs.filter(spec => spec !== "Color" && spec !== "Size")
    
    if (editSpecs.includes("Color") && editDefinedColors.length > 0) {
      editDefinedColors.forEach(col => finalEditAttributes.push(`Color: ${col}`))
    }
    if (editSpecs.includes("Size") && editDefinedSizes.length > 0) {
      editDefinedSizes.forEach(sz => finalEditAttributes.push(sz))
    }

    const formData = new FormData()
    formData.append('name', editName)
    formData.append('attributes', JSON.stringify(finalEditAttributes))
    if (editRawFile) formData.append('categoryImage', editRawFile)
    else formData.append('imageUrl', editImagePreview)

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

  const fetchCategories = async () => {
    setIsLoadingCats(true)
    try {
      const response = await fetch(API_CAT_URL)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingCats(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-royal-dark min-h-screen text-gray-canvas max-w-6xl mx-auto space-y-10 rounded-2xl">
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider"><span className='text-lime-400'>Global</span> Category Configuration</h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">Configure parameters and handle specific color/size variants dynamically.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-royal-main/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Category Name *</label>
            <input 
              type="text" required placeholder="e.g., Mobiles, Groceries" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas focus:outline-none focus:border-lime-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Image Asset *</label>
            <div className="flex items-center gap-3 bg-royal-main/40 border border-white/10 rounded-xl px-4 py-1.5 relative min-h-[46px]">
              <input type="file" required={!imagePreview} accept="image/*" onChange={(e) => handleImageChange(e, false)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <Image className="w-4 h-4 text-gray-canvas/40" />
              <span className="text-[11px] font-bold text-gray-canvas/50 truncate max-w-[150px]">{rawFile ? rawFile.name : "Choose Asset banner"}</span>
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-8 h-8 object-cover rounded-lg ml-auto border border-white/10" />}
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-white/5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Map Specification Parameters & Variants</label>
            <div className="flex items-center gap-1.5">
              <input 
                type="text" placeholder="Add unlisted spec..." value={customSpecInput}
                onChange={(e) => setCustomSpecInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSpecGlobal(false))}
                className="bg-royal-dark border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-gray-canvas focus:outline-none focus:border-lime-accent"
              />
              <button type="button" onClick={() => handleAddCustomSpecGlobal(false)} className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-lime-400 text-xs font-bold"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-3 bg-royal-dark/50 border border-white/5 rounded-xl">
            {dynamicPresets.map((spec, idx) => {
              const isChecked = selectedSpecs.includes(spec)
              return (
                <button type="button" key={idx} onClick={() => toggleSpec(spec, false)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left transition-all text-[11px] font-medium ${isChecked ? 'bg-lime-accent/10 border-lime-accent/40 text-lime-400' : 'bg-royal-main/20 border-white/5 text-gray-canvas/60'}`}>
                  {isChecked ? <CheckSquare className="w-3 h-3 text-lime-400" /> : <Square className="w-3 h-3 text-gray-canvas/30" />}
                  <span>{spec}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* INTERACTIVE COLOR NESTED MULTI-TAB INJECTOR */}
        {selectedSpecs.includes("Color") && (
          <div className="space-y-3 border-t border-white/5 pt-4 bg-lime-accent/5 p-4 rounded-2xl border border-lime-accent/10 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-lime-400 block">Configure Color Options Matrix</label>
              </div>
              <div className="flex items-center gap-1.5">
                <input 
                  type="text" placeholder="e.g., Blue, Crimson Red" value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColorTab(false))}
                  className="bg-royal-dark border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-gray-canvas focus:outline-none focus:border-lime-accent"
                />
                <button type="button" onClick={() => handleAddColorTab(false)} className="p-1.5 bg-lime-accent text-royal-dark hover:opacity-90 rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center">
              {definedColors.length === 0 ? <span className="text-[10px] text-gray-canvas/30 italic">No color tabs appended yet.</span> : definedColors.map((color, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-royal-dark border border-white/10 text-gray-canvas px-2 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide">
                  <span>{color}</span><button type="button" onClick={() => handleRemoveColorTab(color, false)} className="text-red-400 hover:text-red-500 font-bold ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE SIZE NESTED MULTI-TAB INJECTOR */}
        {selectedSpecs.includes("Size") && (
          <div className="space-y-3 border-t border-white/5 pt-4 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">Configure Size Options Matrix</label>
                <div className="flex gap-2 mt-1.5">
                  <button type="button" onClick={() => loadPresetSizes('clothing', false)} className="text-[10px] bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg font-bold border border-blue-500/20 hover:bg-blue-500/30">👕 Clothing Presets</button>
                  <button type="button" onClick={() => loadPresetSizes('footwear', false)} className="text-[10px] bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg font-bold border border-blue-500/20 hover:bg-blue-500/30">👟 Footwear Presets</button>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input 
                  type="text" placeholder="Custom size (e.g., XXXL)" value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSizeTab(false))}
                  className="bg-royal-dark border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-gray-canvas focus:outline-none focus:border-blue-400"
                />
                <button type="button" onClick={() => handleAddSizeTab(false)} className="p-1.5 bg-blue-500 text-white hover:opacity-90 rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center mt-2">
              {definedSizes.length === 0 ? <span className="text-[10px] text-gray-canvas/30 italic">No size tabs appended yet.</span> : definedSizes.map((sz, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-royal-dark border border-white/10 text-gray-canvas px-2 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide">
                  <span>{sz}</span><button type="button" onClick={() => handleRemoveSizeTab(sz, false)} className="text-red-400 hover:text-red-500 font-bold ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_25px_rgba(165,206,0,0.35)] transition-all font-black disabled:opacity-50">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isSubmitting ? "Processing..." : "Deploy Category Matrix"}</span>
        </button>
      </form>

      {/* --- LIVE REGISTRY MANAGEMENT GRID DISPLAY --- */}
      <div className="space-y-4 border-t border-white/10 pt-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-canvas/60 flex items-center gap-2">
          <Layers className="w-4 h-4 text-lime-400" />
          <span>Active Registry Catalog ({categories.length})</span>
        </h3>

        {isLoadingCats ? (
          <p className="text-center text-[11px] font-mono text-lime-accent/60 animate-pulse py-6">READING LIVE LOGS...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-xs text-gray-canvas/30 py-6">No data variants found inside registry.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-royal-main/30 border border-white/5 p-4 rounded-2xl shadow-md transition-all">
                {editingId === cat.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-royal-dark border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-gray-canvas focus:outline-none focus:border-lime-accent"
                      />
                      <div className="flex items-center gap-2 relative bg-royal-dark border border-white/10 rounded-xl px-3 py-1 text-xs">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        <span className="text-[10px] text-gray-canvas/50 truncate max-w-[120px]">{editRawFile ? editRawFile.name : "Replace Cover"}</span>
                        {editImagePreview && <img src={editImagePreview} alt="Edit Prev" className="w-6 h-6 object-cover rounded-md ml-auto border border-white/10" />}
                      </div>
                    </div>

                    <div className="space-y-2 bg-royal-dark/60 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-bold text-gray-canvas/50 uppercase">Update Specs</span>
                        <div className="flex items-center gap-1">
                          <input 
                            type="text" placeholder="Add custom spec..." value={editCustomSpec}
                            onChange={(e) => setEditCustomSpec(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSpecGlobal(true))}
                            className="bg-royal-main/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-gray-canvas focus:outline-none"
                          />
                          <button type="button" onClick={() => handleAddCustomSpecGlobal(true)} className="p-1 bg-lime-accent/20 rounded text-lime-400"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dynamicPresets.map((spec, i) => {
                          const isChecked = editSpecs.includes(spec)
                          return (
                            <button type="button" key={i} onClick={() => toggleSpec(spec, true)} className={`px-2 py-1 rounded text-[10px] font-medium border ${isChecked ? 'bg-lime-400/10 border-lime-400 text-lime-400' : 'bg-transparent border-white/5 text-gray-canvas/40'}`}>
                              {spec}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {editSpecs.includes("Color") && (
                      <div className="space-y-2 bg-royal-dark/40 border border-lime-accent/20 p-3 rounded-xl">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-lime-400 uppercase">Modify Color Tabs</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" placeholder="Add color variant..." value={editColorInput}
                              onChange={(e) => setEditColorInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColorTab(true))}
                              className="bg-royal-main/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-gray-canvas focus:outline-none"
                            />
                            <button type="button" onClick={() => handleAddColorTab(true)} className="p-1 bg-lime-accent text-royal-dark rounded"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {editDefinedColors.map((color, i) => (
                            <span key={i} className="flex items-center gap-1 bg-royal-dark px-2 py-0.5 border border-white/5 text-[10px] rounded text-gray-canvas uppercase font-medium">
                              <span>{color}</span><button type="button" onClick={() => handleRemoveColorTab(color, true)} className="text-red-400 ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {editSpecs.includes("Size") && (
                      <div className="space-y-2 bg-royal-dark/40 border border-blue-500/20 p-3 rounded-xl">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-blue-400 uppercase">Modify Size Tabs</span>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" placeholder="Add size variant..." value={editSizeInput}
                              onChange={(e) => setEditSizeInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSizeTab(true))}
                              className="bg-royal-main/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-gray-canvas focus:outline-none"
                            />
                            <button type="button" onClick={() => handleAddSizeTab(true)} className="p-1 bg-blue-500 text-white rounded"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {editDefinedSizes.map((sz, i) => (
                            <span key={i} className="flex items-center gap-1 bg-royal-dark px-2 py-0.5 border border-white/5 text-[10px] rounded text-gray-canvas uppercase font-medium">
                              <span>{sz}</span><button type="button" onClick={() => handleRemoveSizeTab(sz, true)} className="text-red-400 ml-1">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase bg-white/5 text-gray-canvas hover:bg-white/10"><X className="w-3.5 h-3.5" /> Cancel</button>
                      <button type="button" onClick={() => handleUpdate(cat.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase bg-lime-accent text-royal-dark hover:opacity-90"><Save className="w-3.5 h-3.5" /> Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img src={cat.image_url || cat.imageUrl} alt={cat.name} className="w-12 h-12 object-cover rounded-xl border border-white/10 bg-royal-dark shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-canvas">{cat.name}</h4>
                        <div className="flex flex-wrap gap-1">
                          {cat.attributes && cat.attributes.length > 0 ? (
                            cat.attributes.map((attr, i) => {
                              const isColorVal = attr.startsWith("Color: ")
                              const isSizeVal = /^(s|m|l|xl|xxl|xxxl|uk\s?\d+|\d+)$/i.test(attr)
                              return (
                                <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${isColorVal ? 'bg-lime-400/10 border-lime-400/30 text-lime-400 font-semibold' : isSizeVal ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold' : 'bg-white/5 border-white/5 text-gray-canvas/70'}`}>
                                  {attr}
                                </span>
                              )
                            })
                          ) : (
                            <span className="text-[9px] text-gray-canvas/30 italic">No specifications bound.</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button onClick={() => startEdit(cat)} className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-canvas/60 hover:text-white hover:bg-white/10 transition-colors">
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

export default AddCategory