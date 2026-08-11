import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const TermsCondition = () => {
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
                            Legal & Operational Guidelines
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-400 text-xs font-bold mt-2">
                            Effective Date: July 31, 2026
                        </p>
                    </div>

                    {/* CONTENT CARD */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">

                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base border-b border-gray-100 pb-6 font-medium">
                            Welcome to <strong className="text-gray-900">AVG MART</strong>. By browsing, accessing, or placing an order through our platform (https://avgmart.com/), you acknowledge that you have read, understood, and agreed to be bound by the following terms, conditions, and operational policies.
                        </p>

                        {/* SECTION 1 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                1. User Account & Security
                            </h2>
                            <div className="pl-5 space-y-2 text-xs sm:text-sm text-gray-600 font-medium">
                                <p>• You must be at least 18 years old or under adult supervision to transact on AVG MART.</p>
                                <p>• Users are solely responsible for maintaining the confidentiality of their account credentials, login passwords, and activity performed under their account profile.</p>
                                <p>• AVG MART reserves the right to terminate accounts, decline orders, or remove content at its sole discretion if fraud or breach of terms is suspected.</p>
                            </div>
                        </section>

                        {/* SECTION 2 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                2. Products & Pricing
                            </h2>
                            <div className="pl-5 space-y-2 text-xs sm:text-sm text-gray-600 font-medium">
                                <p>• We strive to ensure all groceries, fresh essentials, and consumer product details and prices are accurate. However, errors may occur.</p>
                                <p>• Prices listed are inclusive of applicable taxes. Delivery and convenience fees are calculated at checkout prior to final payment.</p>
                                <p>• AVG MART reserves the right to correct pricing errors and cancel orders resulting from system or technical glitches, even if order confirmation was generated.</p>
                            </div>
                        </section>

                        {/* SECTION 3 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                3. Payments & Gateway Safety
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                All transactions are processed through encrypted 100% secure payment gateways (UPI, Cards, NetBanking, Wallets). AVG MART does not store full credit card numbers or banking secrets on server databases.
                            </p>
                        </section>

                        {/* SECTION 4 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                4. Return & Replacement Protocol
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                Products can be returned or replaced within <strong className="text-gray-900 font-extrabold">14 days of delivery</strong> under our Hassle-Free Guarantee, provided items remain in original packaging with intact tags.
                            </p>
                        </section>

                        {/* SECTION 5 */}
                        <section className="space-y-3">
                            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A5CE00' }}></span>
                                5. Intellectual Property
                            </h2>
                            <p className="pl-5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                All logos, brand assets, UI layouts, source code, and website media are protected IP owned by AVG MART. Unapproved commercial reproduction or scraping is strictly forbidden.
                            </p>
                        </section>

                        {/* SUPPORT BANNER */}
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                            <div>
                                <h3 className="text-gray-900 font-extrabold text-sm">Have queries about our terms?</h3>
                                <p className="text-xs text-gray-500 font-medium">Reach out directly to our support desk team.</p>
                            </div>
                            <a 
                                href="mailto:support@avgmart.com" 
                                className="px-5 py-2.5 rounded-xl text-gray-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 hover:opacity-90"
                                style={{ backgroundColor: '#A5CE00' }}
                            >
                                Contact Legal Desk
                            </a>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsCondition;