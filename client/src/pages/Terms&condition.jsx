import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const TermsCondition = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[var(--color-royal-dark)] text-slate-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-5xl mx-auto space-y-8 mt-15">

                    {/* Header Header */}
                    <div className="bg-[#132c5d] border border-slate-700/60 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-lime-accent)]/10 rounded-full blur-3xl pointer-events-none"></div>
                        <p className="text-[var(--color-lime-accent)] text-xs font-bold uppercase tracking-widest mb-2">
                            Legal & Operational Guidelines
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            TERMS & CONDITIONS
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">
                            Effective Date: July 31, 2026
                        </p>
                    </div>

                    {/* Content Box */}
                    <div className="bg-[#132c5d] border border-slate-700/60 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">

                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base border-b border-slate-700/60 pb-6">
                            Welcome to <strong className="text-white">AVG MART</strong>. By browsing, accessing, or placing an order through our platform (https://avgmart.com/), you acknowledge that you have read, understood, and agreed to be bound by the following terms, conditions, and operational policies.
                        </p>

                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                1. User Account & Security
                            </h2>
                            <div className="pl-5 space-y-2 text-sm text-slate-300">
                                <p>• You must be at least 18 years old or under adult supervision to transact on AVG MART.</p>
                                <p>• Users are solely responsible for maintaining the confidentiality of their account credentials, login passwords, and activity performed under their account profile.</p>
                                <p>• AVG MART reserves the right to terminate accounts, decline orders, or remove content at its sole discretion if fraud or breach of terms is suspected.</p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                2. Products & Pricing
                            </h2>
                            <div className="pl-5 space-y-2 text-sm text-slate-300">
                                <p>• We strive to ensure all hardware gear, setups, apparel, and core electronics details and prices are accurate. However, errors may occur.</p>
                                <p>• Prices listed are inclusive of applicable taxes. Delivery and convenience fees are calculated at checkout prior to final payment.</p>
                                <p>• AVG MART reserves the right to correct pricing errors and cancel orders resulting from system or technical glitches, even if order confirmation was generated.</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                3. Payments & Gateway Safety
                            </h2>
                            <p className="pl-5 text-sm text-slate-300">
                                All transactions are processed through encrypted 100% secure payment gateways (UPI, Cards, NetBanking, Wallets). AVG MART does not store full credit card numbers or banking secrets on server databases.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                4. Return & Replacement Protocol
                            </h2>
                            <p className="pl-5 text-sm text-slate-300">
                                Products can be returned or replaced within <strong className="text-[var(--color-lime-accent)]">14 days of delivery</strong> under our Hassle-Free Safety Vault Protocol, provided items remain in original packaging with intact tags.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-lime-accent)]"></span>
                                5. Intellectual Property
                            </h2>
                            <p className="pl-5 text-sm text-slate-300">
                                All logos, brand assets, UI layouts, source code, and website media are protected IP owned by AVG MART. Unapproved commercial reproduction or scraping is strictly forbidden.
                            </p>
                        </section>

                        {/* Support Bar */}
                        <div className="p-6 rounded-xl bg-[var(--color-royal-main)]/50 border border-[var(--color-royal-main)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                            <div>
                                <h3 className="text-white font-bold text-sm">Have queries about our terms?</h3>
                                <p className="text-xs text-slate-400">Reach out directly to our support desk team.</p>
                            </div>
                            <a href="mailto:support@avgmart.com" className="px-5 py-2.5 rounded-lg bg-[var(--color-lime-accent)] text-[var(--color-royal-dark)] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all">
                                Contact Legal Desk
                            </a>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsCondition;