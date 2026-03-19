import React, { useState } from 'react';
import { Book, Shield, Zap, Clock, AlertTriangle, Award, ChevronRight, Code, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Wiki: React.FC = () => {
    const [activeSection, setActiveSection] = useState('basics');

    const sections = [
        {
            id: 'basics',
            title: 'Protocol Core',
            icon: <Book className="w-4 h-4" />,
            description: 'The foundation of trustless gift card exchange.',
            content: (
                <div className="space-y-6">
                    <p className="text-gray-400 text-lg leading-relaxed">
                        GiftBlitz is a decentralized, peer-to-peer protocol built on the IOTA Tangle. It eliminates the need for centralized intermediaries by using game theory to secure transactions.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 shadow-xl">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Code className="w-4 h-4 text-cyan-400" /> Layer 1 Security
                            </h4>
                            <p className="text-sm text-gray-500">Built on IOTA's fee-less infrastructure for micro-transactions.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 shadow-xl">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-purple-400" /> Trustless Escrow
                            </h4>
                            <p className="text-sm text-gray-500">Atomic swaps ensured by smart contract logic, not humans.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'trust-deposits',
            title: 'Game Theory & Deposits',
            icon: <Shield className="w-4 h-4" />,
            description: 'Mathematical guarantees against fraud.',
            content: (
                <div className="space-y-6">
                    <p className="text-gray-400 text-lg leading-relaxed">
                        To ensure honest behavior, both parties lock collateral into the contract. This creates a <span className="text-white font-bold">Nash Equilibrium</span> where cheating is always a net loss.
                    </p>
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 space-y-6">
                        <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-gray-500 px-2">
                            <span>Role</span>
                            <span>Collateral (%)</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-white font-bold">Seller</span>
                                <span className="text-cyan-400 font-black">100% of Face Value</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-white font-bold">Buyer</span>
                                <span className="text-purple-400 font-black">110% of Face Value</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <p className="text-xs text-gray-500 italic">
                                * Deposits are automatically released by the contract upon successful trade verification.
                            </p>
                            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">Mutual Reset (MAD)</h5>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        Any dispute results in a <b>full reputation wipe</b> for both the buyer and seller. This "Mutually Assured Destruction" protocol makes griefing a suicidal strategy for any high-tier account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'timeouts',
            title: 'The 72-Hour Rule',
            icon: <Clock className="w-4 h-4" />,
            description: 'Strict liveness guarantees.',
            content: (
                <div className="space-y-6">
                    <p className="text-gray-400 text-lg leading-relaxed">
                        GiftBlitz enforces a strict 72-hour window for the seller to reveal the encryption keys. This prevents malicious actors from "hanging" a buyer's liquidity indefinitely.
                    </p>
                    <div className="flex items-start gap-4 p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10">
                        <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                        <div>
                            <h4 className="text-orange-500 font-bold mb-1 uppercase text-xs tracking-widest">Penalties</h4>
                            <p className="text-sm text-gray-400">If the seller fails to reveal the key within the window, their 100% deposit is slashed: 50% to the buyer and 50% to the protocol treasury.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'reputation',
            title: 'Reputation NFTs',
            icon: <Award className="w-4 h-4" />,
            description: 'Scaling your trade limits.',
            content: (
                <div className="space-y-6">
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Every user holds a non-transferable Soulbound Passport. Successful trades burn "Experience Points" into the NFT, unlocking higher liquidity tiers.
                    </p>
                    <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900/30">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Tier</th>
                                    <th className="px-6 py-4">Required Trades</th>
                                    <th className="px-6 py-4">Max Trade (Buy/Sell)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="px-6 py-4 text-white font-bold">Newcomer</td>
                                    <td className="px-6 py-4 text-gray-500">1 - 2</td>
                                    <td className="px-6 py-4 text-white">€30</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-cyan-400 font-bold">Verified</td>
                                    <td className="px-6 py-4 text-gray-500">3 - 5</td>
                                    <td className="px-6 py-4 text-cyan-400 font-bold">€50</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-indigo-400 font-bold">Pro</td>
                                    <td className="px-6 py-4 text-gray-500">6 - 10</td>
                                    <td className="px-6 py-4 text-indigo-400 font-bold">€100</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-purple-400 font-bold">Veteran</td>
                                    <td className="px-6 py-4 text-gray-500">11 - 25</td>
                                    <td className="px-6 py-4 text-purple-400 font-bold">€500</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-amber-400 font-bold">Elite</td>
                                    <td className="px-6 py-4 text-gray-500">26+</td>
                                    <td className="px-6 py-4 text-amber-400 font-bold">€1000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
            {/* Header / Nav */}
            <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white fill-white" />
                        </div>
                        <span className="font-black text-white tracking-widest text-xl">WIKI<span className="text-cyan-400">.</span></span>
                    </div>
                    <button 
                        onClick={() => window.history.back()}
                        className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                    >
                        CLOSE MANUAL <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="flex gap-16">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-160px)] sticky top-28 overflow-y-auto pr-4 scrollbar-hide">
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mb-4">Introduction</h3>
                                {sections.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setActiveSection(s.id);
                                            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group
                                            ${activeSection === s.id ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <div className={`transition-colors ${activeSection === s.id ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                            {s.icon}
                                        </div>
                                        <span className="text-sm font-bold">{s.title}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/10">
                                <Info className="w-5 h-5 text-cyan-500 mb-3" />
                                <h4 className="text-xs font-bold text-white mb-2">Technical Support</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    Need deeper integration details? Access our protocol level API specs on GitHub.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 pb-32">
                        <section className="max-w-3xl space-y-24">
                            {sections.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    id={s.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    onViewportEnter={() => setActiveSection(s.id)}
                                    className="space-y-6 pt-8 border-t border-white/5 first:border-0"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                            {s.icon} Section 0{i+1}
                                        </div>
                                        <h2 className="text-4xl font-black text-white tracking-tight">{s.title}</h2>
                                        <p className="text-gray-500 font-medium italic">{s.description}</p>
                                    </div>
                                    <div className="pt-4">
                                        {s.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Protocol Flow / Visual List */}
                            <motion.div 
                                className="p-12 rounded-[3.5rem] bg-slate-900/30 border border-white/10 relative overflow-hidden"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10" />
                                <h3 className="text-2xl font-black text-white mb-8">Protocol Workflow</h3>
                                <div className="space-y-8">
                                    {[
                                        { t: 'Encrypt & List', d: 'Seller generates a PRE (Proxy Re-Encryption) key and locks the asset.' },
                                        { t: 'Multi-party Reveal', d: 'Smart contract verified inputs and triggers the re-encryption fragment.' },
                                        { t: 'Decryption', d: 'Buyer recovers the plaintext key and validates the gift card code.' }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex gap-6">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-cyan-400 border border-white/5">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold">{step.t}</h4>
                                                <p className="text-sm text-gray-500">{step.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Wiki;
