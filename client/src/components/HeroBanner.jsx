import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const API_BANNERS_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/banners`;

const HeroBanner = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch(API_BANNERS_URL);
                const data = await res.json();
                if (data.success && Array.isArray(data.banners)) {
                    setBanners(data.banners);
                }
            } catch (err) {
                console.error("Failed to load hero banners:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-48 md:h-60 bg-gray-100 rounded-3xl animate-pulse" />
                    <div className="hidden md:block h-60 bg-gray-100 rounded-3xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (!banners || banners.length === 0) {
        return null;
    }

    const handleBannerClick = (banner) => {
        if (banner.product_id) {
            navigate(`/product/${banner.product_id}`);
        } else {
            navigate('/allproducts');
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 select-none relative group/banner">
            
            {/* CUSTOM SWIPER NAVIGATION ARROWS */}
            {/* <button 
                id="banner-prev-btn" 
                className="absolute left-6 md:left-10 top-[45%] -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-lg flex items-center justify-center text-gray-800 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover/banner:opacity-100 cursor-pointer disabled:opacity-0"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 -ml-0.5" />
            </button>

            <button 
                id="banner-next-btn" 
                className="absolute right-6 md:right-10 top-[45%] -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-lg flex items-center justify-center text-gray-800 hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover/banner:opacity-100 cursor-pointer disabled:opacity-0"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 -mr-0.5" />
            </button> */}

            {/* SWIPER CAROUSEL */}
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                loop={banners.length > 2}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    el: '.custom-banner-pagination',
                }}
                navigation={{
                    prevEl: '#banner-prev-btn',
                    nextEl: '#banner-next-btn',
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                }}
                className="overflow-visible"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div 
                            onClick={() => handleBannerClick(banner)}
                            className="relative w-full aspect-[16/8] sm:aspect-[21/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 bg-gray-50 group/card"
                        >
                            <img 
                                src={banner.image_url} 
                                alt={banner.title || "App Banner"} 
                                className="w-full h-full object-cover group-hover/card:scale-[1.02] transition-transform duration-500 ease-out"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ELEGANT PAGINATION DOTS */}
            <div className="custom-banner-pagination flex items-center justify-center gap-1.5 pt-5 md:pt-6" />

            <style>{`
                .custom-banner-pagination .swiper-pagination-bullet {
                    background: #e5e7eb;
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    margin: 0 3px !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .custom-banner-pagination .swiper-pagination-bullet-active {
                    background: #A5CE00;
                    width: 28px;
                    border-radius: 9999px;
                }
            `}</style>
        </section>
    );
};

export default HeroBanner;