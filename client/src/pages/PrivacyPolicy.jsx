import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[var(--color-royal-dark)] text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-5xl mx-auto space-y-8 mt-15">

                    {/* Header Header */}
                    <div className="bg-[#132c5d] border border-slate-700/60 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-lime-accent)]/10 rounded-full blur-3xl pointer-events-none"></div>
                        <p className="text-[var(--color-lime-accent)] text-xs font-bold uppercase tracking-widest mb-2">
                            Data Safety & Encryption Standard
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            PRIVACY POLICY
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">
                            Effective Date: July 31, 2026
                        </p>
                    </div>

                    {/* Content Box */}
                    <div className="bg-[#132c5d] border border-slate-700/60 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">

                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base border-b border-slate-700/60 pb-6">
                            At <strong className="text-white">AVG MART</strong>, we take customer data privacy seriously. This document outlines the types of personal data we collect, how it is secured using top-tier encryption, and how you can exercise your data rights.
                        </p>

                        {/* Card Section */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl bg-[var(--color-royal-dark)]/60 border border-slate-700/50">
                                <h3 className="text-[var(--color-lime-accent)] font-bold text-sm uppercase tracking-wider mb-2">
                                    Information Collected
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Contact information (Name, Email, Phone), delivery shipping addresses, device IP details, and purchase history required to process your gear orders.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-[var(--color-royal-dark)]/60 border border-slate-700/50">
                                <h3 className="text-[var(--color-lime-accent)] font-bold text-sm uppercase tracking-wider mb-2">
                                    100% Secure Usage
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Your data is exclusively utilized to process orders, facilitate doorstep delivery, optimize search preferences, and prevent fraudulent attempts.
                                </p>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                1. Third-Party Data Sharing
                            </h2>
                            <p className="pl-5 text-sm text-slate-300 leading-relaxed">
                                We <strong className="text-white">do not sell, rent, or trade</strong> your personal information to third-party marketing companies. Data is shared exclusively with verified operational logistics carriers (for shipment tracking) and authorized payment gateways (for transaction clearance).
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                2. Cookies & Session Storage
                            </h2>
                            <p className="pl-5 text-sm text-slate-300 leading-relaxed">
                                AVG MART utilizes session cookies to keep track of items added to your active shopping cart, account authorization tokens, and general site performance analytics. You can adjust your browser to block cookies, though cart persistence may be affected.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                3. Data Safeguards & Encryption
                            </h2>
                            <p className="pl-5 text-sm text-slate-300 leading-relaxed">
                                We employ SSL/TLS end-to-end encryption protocols across the entire AVG MART web network to keep your personal transactions protected at all times.
                            </p>
                        </section>

                        {/* Support Bar */}
                        <div className="p-6 rounded-xl bg-[var(--color-royal-main)]/50 border border-[var(--color-royal-main)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                            <div>
                                <h3 className="text-white font-bold text-sm">Want to remove your account data?</h3>
                                <p className="text-xs text-slate-400">Request complete data erasure by emailing our Data Officer.</p>
                            </div>
                            <a href="mailto:privacy@avgmart.com" className="px-5 py-2.5 rounded-lg bg-[var(--color-lime-accent)] text-[var(--color-royal-dark)] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all">
                                Privacy Desk
                            </a>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;