import React, { useState, useEffect } from 'react'
import { Image, Layers, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const AddCategory = () => {
  const [name, setName] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [isLoadingCats, setIsLoadingCats] = useState(false)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoadingCats(true)
    try {
      const response = await fetch(API_CAT_URL)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error("Error fetching live categories:", err)
    } finally {
      setIsLoadingCats(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setRawFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rawFile) {
      toast.error("Please upload a category image.")
      return
    }

    setIsSubmitting(true)
    const loadId = toast.loading("Creating new category bundle...")
    const formData = new FormData()
    formData.append('name', name)
    formData.append('categoryImage', rawFile)

    try {
      const response = await fetch(API_CAT_URL, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Category deployed cleanly into live registry!", { id: loadId })
        setName('')
        setImagePreview(null)
        setRawFile(null)
        fetchCategories() // Refresh the list beneath immediately!
      } else {
        toast.error(`Error: ${data.message || "Failed deployment"}`, { id: loadId })
      }
    } catch (err) {
      console.error(err)
      toast.error("Network communication line error.", { id: loadId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-royal-dark/20 min-h-screen text-gray-canvas max-w-xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider"><span className='text-lime-400'>Add</span> Category</h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">Deploy structural filters to classify catalog lines.</p>
      </div>

      {/* CREATE FORM */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-royal-main/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Category Name *</label>
          <input 
            type="text" 
            required
            placeholder="e.g., Hoodies, Sneakers, Accessories" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas placeholder-gray-canvas/30 focus:outline-none focus:border-lime-accent transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Category Accent Cover Asset *</label>
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl bg-royal-main/20 hover:border-white/20 transition-colors relative cursor-pointer group">
            <input 
              type="file" 
              required={!imagePreview}
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
            ) : (
              <>
                <Image className="w-8 h-8 text-gray-canvas/40 group-hover:text-lime-accent transition-colors mb-2" />
                <span className="text-xs font-bold text-gray-canvas/70">Click to upload banner asset</span>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_25px_rgba(165,206,0,0.35)] transition-all cursor-pointer font-black disabled:opacity-50"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isSubmitting ? "Processing..." : "Create Category"}</span>
        </button>
      </form>

      {/* --- VISUAL DISPLAY OF CATEGORIES BELOW --- */}
      <div className="space-y-4 pt-4">
        <div className="border-b border-white/10 pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-canvas/60 flex items-center gap-2">
            <Layers className="w-4 h-4 text-lime-400" />
            <span>Active Registries ({categories.length})</span>
          </h3>
        </div>

        {isLoadingCats ? (
          <p className="text-center text-[11px] font-mono tracking-wider text-lime-accent/60 animate-pulse">LOADING REGISTRIES...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-xs font-medium text-gray-canvas/30 py-4">No active categories found inside live database logs.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 bg-royal-main/30 border border-white/5 p-3 rounded-2xl shadow-md">
                <img 
                  src={cat.image_url || cat.imageUrl} 
                  alt={cat.name} 
                  className="w-12 h-12 object-cover rounded-xl border border-white/10 bg-royal-dark" 
                />
                <span className="text-xs font-bold uppercase tracking-wide text-gray-canvas truncate">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddCategory