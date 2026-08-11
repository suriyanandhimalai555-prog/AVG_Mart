import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans antialiased">
            <Navbar />

            <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* HEADER CARD */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
                        <div 
                            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-30"
                            style={{ backgroundColor: '#A5CE00' }}
                        />
                        <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#A5CE00' }}>
                            Data Safety & Encryption Standard
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-400 text-xs font-bold mt-2">
                            Effective Date: July 31, 2026
                        </p>
                    </div>

                    {/* CONTENT CARD */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">

                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base border-b border-gray-100 pb-6 font-medium">
                            At <strong className="text-gray-900">AVG MART</strong>, we take customer data privacy seriously. This document outlines the types of personal data we collect, how it is secured using top-tier encryption, and how you can exercise your data rights.
                        </p>

                        {/* CARDS GRID */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                <h3 className="font-extrabold text-xs uppercase tracking-wider mb-2" style={{ color: '#A5CE00' }}>
                                    Information Collected
                                </h3>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Contact details (Name, Email, Phone), delivery shipping addresses, device IP details, and order history required to process your grocery & product deliveries.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                <h3 className="font-extrabold text-xs uppercase tracking-wider mb-2" style={{ color: '#A5CE00' }}>
                                    100% Secure Usage
                                </h3>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Your data is exclusively utilized to process orders, facilitate doorstep delivery, optimize search preferences, and prevent fraudulent attempts.
                                </p>
                            </div>
                        </div>

                        {/* SECTION 1 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                1. Third-Party Data Sharing
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                We <strong className="text-gray-900">do not sell, rent, or trade</strong> your personal information to third-party marketing companies. Data is shared exclusively with verified operational logistics carriers (for shipment tracking) and authorized payment gateways (for transaction clearance).
                            </p>
                        </section>

                        {/* SECTION 2 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                2. Cookies & Session Storage
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                AVG MART utilizes session cookies to keep track of items added to your active shopping cart, account authorization tokens, and general site performance analytics. You can adjust your browser to block cookies, though cart persistence may be affected.
                            </p>
                        </section>

                        {/* SECTION 3 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                3. Data Safeguards & Encryption
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                We employ SSL/TLS end-to-end encryption protocols across the entire AVG MART web network to keep your personal transactions protected at all times.
                            </p>
                        </section>

                        {/* SUPPORT BANNER */}
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                            <div>
                                <h3 className="text-gray-900 font-extrabold text-sm">Want to remove your account data?</h3>
                                <p className="text-xs text-gray-500 font-medium">Request complete data erasure by emailing our Data Officer.</p>
                            </div>
                            <a 
                                href="mailto:privacy@avgmart.com" 
                                className="px-5 py-2.5 rounded-xl text-gray-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 hover:opacity-90"
                                style={{ backgroundColor: '#A5CE00' }}
                            >
                                Privacy Desk
                            </a>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;