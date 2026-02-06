import React from 'react';
import { Book, Shield, Zap, Clock, AlertTriangle, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Wiki: React.FC = () => {
    const sections = [
        {
            id: 'basics',
            title: 'Protocol Core',
            icon: <Book className="w-5 h-5 text-cyan-400" />,
            content: "GiftBlitz is a trustless P2P gift card exchange built on IOTA. It solves the 'double-spend' problem of gift cards without requiring a central authority or escrow."
        },
        {
            id: 'trust-deposits',
            title: 'Trust Deposits',
            icon: <Shield className="w-5 h-5 text-purple-400" />,
            content: "Both buyers and sellers lock a 'Trust Deposit' (Seller: 100% of Face Value, Buyer: 110% of Face Value) into the smart contract. If the trade succeeds, deposits are returned."
        },
        {
            id: 'timeout-reveal',
            title: '72-Hour Reveal',
            icon: <Clock className="w-5 h-5 text-orange-400" />,
            content: "Once a buyer joins, the seller has 72 hours to reveal the encrypted key. Failure results in the seller losing 50% of their stake as compensation to the buyer."
        },
        {
            id: 'reputation',
            title: 'Hacker Reputation',
            icon: <Award className="w-5 h-5 text-green-400" />,
            content: "Your Reputation NFT tracks your trade history. Higher reputation unlocks larger trade caps (up to €1000). The protocol charges a minimal 1% fee on successful sales for maintenance."
        }
    ];

    const flows = [
        {
            title: "1. Encrypt & List",
            desc: "Seller encrypts the code with a symmetric key and lists it. Only the seller knows the key.",
            status: "complete"
        },
        {
            title: "2. Lock & Re-Encrypt",
            desc: "Buyer joins and locks funds. Protocol re-encrypts the key specifically for the buyer.",
            status: "active"
        },
        {
            title: "3. Verify & Release",
            desc: "Buyer decrypts and validates the code. On success, funds are released to the seller.",
            status: "pending"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 pb-24 space-y-16">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Book className="w-3 h-3" /> Technical Manual v1.0
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">
                    HACKER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">WIKI</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Understand the game theory, encryption mechanics, and protocol rules that make GiftBlitz the most secure way to trade digital value.
                </p>
            </motion.div>

            {/* Quick Navigation Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-cyan-500/30 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            {section.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{section.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {section.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* The 72-Hour Rule - Visualized */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
                            <Clock className="w-6 h-6 text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">The 72-Hour Protocol</h2>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        To prevent "Ghost" sellers, the protocol enforces a strict timeout on every action. 
                        Once a buyer commits capital, the seller is bound by a smart contract time-lock.
                    </p>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold text-sm">Seller Timeout</h4>
                                <p className="text-xs text-gray-500">
                                    Missed the 72h reveal window? 50% of your trust deposit is confiscated by the Protocol Treasury, and the other 50% is sent to the buyer as compensation.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex gap-4">
                            <Zap className="w-6 h-6 text-green-400 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold text-sm">Auto-Finalization</h4>
                                <p className="text-xs text-gray-500">
                                    If the buyer doesn't confirm within 72h of the reveal, the seller can trigger auto-finalization to claim the funds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Flow Representation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />
                    <div className="relative p-8 rounded-[40px] bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-8">
                        {flows.map((step, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs
                                        ${step.status === 'complete' ? 'bg-green-500/20 border-green-500 text-green-400' :
                                          step.status === 'active' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' :
                                          'bg-slate-800 border-white/10 text-gray-500'}`}>
                                        {i + 1}
                                    </div>
                                    {i < flows.length - 1 && <div className="w-[2px] h-12 bg-white/5 mt-2" />}
                                </div>
                                <div className="space-y-1">
                                    <h4 className={`font-bold ${step.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{step.title}</h4>
                                    <p className="text-sm text-gray-400 leading-snug">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Game Theory Section */}
            <div className="p-12 rounded-[40px] bg-gradient-to-br from-slate-900 to-black border border-white/5 relative overflow-hidden text-center space-y-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                <Users className="w-12 h-12 text-purple-400 mx-auto" />
                <div className="max-w-3xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold text-white">Trust via Mutually Assured Destruction</h2>
                    <p className="text-gray-400">
                        The "Dispute" mechanism is the ultimate deterrent. If a seller sends a fake code, the buyer can <strong>CONFISCATE</strong> both stakes to the Protocol Treasury. 
                        Since the seller deposits 100% of the Face Value, attempting to double-spend results in a guaranteed net loss.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">110%</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">Trust Stake</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">0.0s</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">Escrow Latency</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">PRE</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">Privacy Arch</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="text-center">
                <button 
                    onClick={() => window.history.back()}
                    className="px-8 py-3 rounded-2xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all font-bold"
                >
                    Back to Terminal
                </button>
            </div>
        </div>
    );
};

export default Wiki;
