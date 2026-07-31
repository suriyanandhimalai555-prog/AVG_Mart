import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ShippingPolicy = () => {
    return (
        <div className="">
            <Navbar />
            <div className="min-h-screen bg-[var(--color-royal-dark)] text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-5xl mx-auto space-y-8 mt-15">

                    {/* Header Header */}
                    <div className="bg-[#132c5d] border border-slate-700/60 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-lime-accent)]/10 rounded-full blur-3xl pointer-events-none"></div>
                        <p className="text-[var(--color-lime-accent)] text-xs font-bold uppercase tracking-widest mb-2">
                            Fast Logistics & Worldwide Networks
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            SHIPPING POLICY
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">
                            Effective Date: July 31, 2026
                        </p>
                    </div>

                    {/* Content Box */}
                    <div className="bg-[#132c5d] border border-slate-700/60 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">

                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base border-b border-slate-700/60 pb-6">
                            At <strong className="text-white">AVG MART</strong>, we ensure premium setup products, core electronics, and streamlined accessories are packed securely and dispatched through reliable delivery networks operating nationwide and worldwide.
                        </p>

                        {/* Timelines Cards */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-xl bg-[var(--color-royal-dark)]/60 border border-slate-700/50 text-center">
                                <span className="text-2xl font-black text-[var(--color-lime-accent)] block mb-1">24 - 48 HRS</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider block">Express Dispatch</span>
                                <p className="text-xs text-slate-400 mt-2">Priority packing for fast processing setups.</p>
                            </div>
                            <div className="p-5 rounded-xl bg-[var(--color-royal-dark)]/60 border border-slate-700/50 text-center">
                                <span className="text-2xl font-black text-[var(--color-lime-accent)] block mb-1">3 - 5 DAYS</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider block">Metro & Major Cities</span>
                                <p className="text-xs text-slate-400 mt-2">Direct courier air and surface transit.</p>
                            </div>
                            <div className="p-5 rounded-xl bg-[var(--color-royal-dark)]/60 border border-slate-700/50 text-center">
                                <span className="text-2xl font-black text-[var(--color-lime-accent)] block mb-1">5 - 7 DAYS</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider block">Rest of India</span>
                                <p className="text-xs text-slate-400 mt-2">Delivered straight to doorstep pincodes.</p>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                1. Shipping Costs & Charges
                            </h2>
                            <div className="pl-5 space-y-2 text-sm text-slate-300">
                                <p>• <strong className="text-white">FREE Shipping:</strong> Applicable on orders exceeding ₹499 across all eligible pincodes.</p>
                                <p>• <strong className="text-white">Standard Fee:</strong> A nominal ₹49 shipping charge is applied to orders under ₹499.</p>
                                <p>• Any applicable COD processing charges will be calculated and highlighted directly at the checkout step.</p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                2. Order Tracking & Dispatch Notifications
                            </h2>
                            <p className="pl-5 text-sm text-slate-300 leading-relaxed">
                                As soon as your shipment leaves our hub, a tracking URL and AWB code will be dispatched via SMS and email. You can also monitor your live delivery status in real-time under the <strong className="text-white">My Orders</strong> dashboard.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                3. Damaged Outer Packages
                            </h2>
                            <p className="pl-5 text-sm text-slate-300 leading-relaxed">
                                If the courier box appears tampered or physically damaged upon delivery, please refuse receipt from the courier executive and contact our shipping helpline immediately for priority replacement.
                            </p>
                        </section>

                        {/* Support Bar */}
                        <div className="p-6 rounded-xl bg-[var(--color-royal-main)]/50 border border-[var(--color-royal-main)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                            <div>
                                <h3 className="text-white font-bold text-sm">Facing delivery delays with your shipment?</h3>
                                <p className="text-xs text-slate-400">Share your tracking ID with our dispatch team.</p>
                            </div>
                            <a href="mailto:shipping@avgmart.com" className="px-5 py-2.5 rounded-lg bg-[var(--color-lime-accent)] text-[var(--color-royal-dark)] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all">
                                Track Order Support
                            </a>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShippingPolicy;