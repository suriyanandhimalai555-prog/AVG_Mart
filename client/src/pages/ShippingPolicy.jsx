import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ShippingPolicy = () => {
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
                            Fast Logistics & Fulfillment
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                            Shipping Policy
                        </h1>
                        <p className="text-gray-400 text-xs font-bold mt-2">
                            Effective Date: July 31, 2026
                        </p>
                    </div>

                    {/* CONTENT CARD */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">

                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base border-b border-gray-100 pb-6 font-medium">
                            At <strong className="text-gray-900">AVG MART</strong>, we ensure essential groceries, fresh produce, and core household products are packed securely and dispatched through reliable delivery networks operating nationwide and local hubs.
                        </p>

                        {/* TIMELINES GRID */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                                <span className="text-2xl font-black block mb-1" style={{ color: '#A5CE00' }}>10 - 20 MINS</span>
                                <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">Instant Express</span>
                                <p className="text-xs text-gray-500 font-medium mt-1.5">Priority dispatch for nearby dark stores.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                                <span className="text-2xl font-black block mb-1" style={{ color: '#A5CE00' }}>3 - 5 DAYS</span>
                                <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">Metro & Major Cities</span>
                                <p className="text-xs text-gray-500 font-medium mt-1.5">Direct courier air and surface transit.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                                <span className="text-2xl font-black block mb-1" style={{ color: '#A5CE00' }}>5 - 7 DAYS</span>
                                <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">Rest of India</span>
                                <p className="text-xs text-gray-500 font-medium mt-1.5">Delivered straight to doorstep pincodes.</p>
                            </div>
                        </div>

                        {/* SECTION 1 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                1. Shipping Costs & Charges
                            </h2>
                            <div className="pl-5 space-y-2 text-xs sm:text-sm text-gray-600 font-medium">
                                <p>• <strong className="text-gray-900">FREE Shipping:</strong> Applicable on orders exceeding ₹499 across all eligible pincodes.</p>
                                <p>• <strong className="text-gray-900">Standard Fee:</strong> A nominal ₹49 delivery charge is applied to orders under ₹499.</p>
                                <p>• Any applicable COD processing charges will be calculated and highlighted directly at the checkout step.</p>
                            </div>
                        </section>

                        {/* SECTION 2 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                2. Order Tracking & Dispatch Notifications
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                As soon as your shipment leaves our hub, a tracking link and AWB code will be dispatched via SMS and email. You can also monitor your live delivery status in real-time under the <strong className="text-gray-900">My Orders</strong> dashboard.
                            </p>
                        </section>

                        {/* SECTION 3 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                3. Damaged Outer Packages
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                If the courier box appears tampered or physically damaged upon delivery, please refuse receipt from the courier executive and contact our shipping helpline immediately for priority replacement.
                            </p>
                        </section>

                        {/* SUPPORT BANNER */}
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                            <div>
                                <h3 className="text-gray-900 font-extrabold text-sm">Facing delivery delays with your shipment?</h3>
                                <p className="text-xs text-gray-500 font-medium">Share your tracking ID with our dispatch support team.</p>
                            </div>
                            <a 
                                href="mailto:shipping@avgmart.com" 
                                className="px-5 py-2.5 rounded-xl text-gray-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 hover:opacity-90"
                                style={{ backgroundColor: '#A5CE00' }}
                            >
                                Track Order Support
                            </a>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ShippingPolicy;