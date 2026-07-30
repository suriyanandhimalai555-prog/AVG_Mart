import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/categories`);
        if (!response.ok) throw new Error('Failed to load categories');
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-royal-dark py-10 flex items-center justify-center text-lime-accent">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs font-bold tracking-widest uppercase">Loading Hubs...</span>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="bg-royal-dark text-white py-12 px-4 md:px-12 relative overflow-hidden select-none">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_5px),linear-gradient(to_bottom,#ffffff03_1px,transparent_5px)] bg-[size:40px_40px]" />
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-accent/5 rounded-full blur-[180px] pointer-events-none" /> */}

      {/* Ambient Lime Spotlight */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lime-accent/10 rounded-full blur-[140px] pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Title Block */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
            <Sparkles className="w-3 h-3 text-lime-accent" /> Featured Collections
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider">
            Shop By <span className="text-lime-accent font-light">Category</span>
          </h2>
          <div className="w-16 h-[2px] bg-lime-accent rounded-full mt-2" />
        </div>

        {/* Category Carousel Row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
        >
          {categories.map((cat, idx) => (
            <div
              key={cat.id || cat._id || idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative flex-shrink-0 w-36 sm:w-44 md:w-48 cursor-pointer rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col items-center text-center transition-all duration-300 hover:border-lime-accent/80 hover:bg-white/[0.08] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5"
            >
              {/* Category Image Avatar Box */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 rounded-2xl overflow-hidden bg-black/40 border border-white/10 group-hover:border-lime-accent transition-all duration-300 shadow-inner">
                <img
                  src={cat.image_url || cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-95 group-hover:brightness-110"
                />

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                {/* Top Corner Badge */}
                <span className="absolute top-1.5 right-1.5 text-[8px] font-black uppercase tracking-widest bg-lime-accent text-royal-dark px-1.5 py-0.5 rounded shadow-md">
                  NEW
                </span>
              </div>

              {/* Title & Action Subtitle */}
              <div className="w-full space-y-1">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-lime-accent transition-colors line-clamp-1">
                  {cat.name}
                </h3>

                <div className="flex items-center justify-center gap-1 text-[10px] text-white/50 font-semibold group-hover:text-white/90 transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3 text-lime-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </div>
              </div>

              {/* Bottom Glow Ribbon */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-lime-accent opacity-0 group-hover:opacity-100 group-hover:w-24 transition-all duration-300 rounded-full shadow-[0_0_8px_#a3e635]" />
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-royal-dark hover:bg-lime-accent transition-all active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-royal-dark hover:bg-lime-accent transition-all active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Category;