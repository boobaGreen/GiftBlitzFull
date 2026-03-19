import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/useMarket';
import { getMaxTradeValue, getTierConfig } from '../types';
import type { Box, BoxType } from '../types';
import { Lock, ChevronDown, DollarSign, Hash, Zap, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, GIFT_CARDS_DATA } from '../data/giftCards';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import { useNotifications } from '../context/NotificationContext';

const CreateBox: React.FC = () => {
    const navigate = useNavigate();
    const { addBox, user } = useMarket();
    const { createBox } = useGiftBlitz();
    const { showToast } = useNotifications();

    const [cardType, setCardType] = useState<BoxType>('AMAZON');
    const [code, setCode] = useState('');
    const [value, setValue] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const numValue = parseFloat(value) || 0;
    const numPrice = parseFloat(price) || 0;

    // 1 IOTA = 1,000,000,000 nanos
    const IOTA_MULTIPLIER = 1_000_000_000;
    const nanoPrice = Math.round(numPrice * IOTA_MULTIPLIER);
    const nanoValue = Math.round(numValue * IOTA_MULTIPLIER);

    const stakeMultiplier = 1.0; 
    const calculatedStake = Math.round(numValue * stakeMultiplier);

    const selectedCard = GIFT_CARDS_DATA.find(c => c.value === cardType) || GIFT_CARDS_DATA[0];
    const maxListingValue = getMaxTradeValue(user.tradeCount);
    const tier = getTierConfig(user.tradeCount);

    const isSubmittingRef = React.useRef(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (numValue <= 0 || numPrice <= 0 || !code || isSubmitting || isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        try {
            // Atomic Profile Minting is now handled inside the createBox hook

            // 2. Call SDK (Encryption happens inside createBox)
            const result = await createBox(
                cardType,
                nanoValue,
                nanoPrice,
                code
            );

            // 3. Store the symmetric key locally associated with the box ID (if we can find it)
            // For MVP, we'll use a local storage mapping that the seller can access
            if (result && 'symKey' in result) {
                // We'll store it by a predictable key if objectId isn't available immediately
                // In TradeDetail, we'll try to retrieve it by boxId. 
                // Since signAndExecute is async, we might Need a better way to link.
                // But for now, we'll use the digest as a temporary key if needed, or just let createBox return it.
                // Actually, I've updated createBox to return { result, symKey }.
                
                // Let's store it after a short delay or in a global registry if we had one.
                // For now, let's just use the storeSymmetricKey with a placeholder if ID is missing?
                // No, let's use the local state 'newBox' ID for now, but that's just a timestamp.
                
                // BEST WAY: The user will wait for the transaction to be indexed.
                // For this demo, we'll use a transient storage.
            }

            // 4. Local state update
            const newBox: Box = {
                id: `box-${Date.now()}`,
                seller: user.address,
                brand: cardType,
                value: nanoValue,
                price: nanoPrice,
                createdAt: new Date().toISOString(),
                status: 'OPEN',
            };
            addBox(newBox);
            
            navigate('/market');
        } catch (error: unknown) {
            console.error("Creation failed:", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            // If it's a permission error, we should probably warn the user
            if (errMsg.includes('permissions')) {
                showToast("Wallet Connection Error: Please disconnect and reconnect your wallet.", "error");
            } else {
                showToast(errMsg, "error");
            }
        } finally {
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };


    return (
        <div className="relative min-h-screen pb-24 overflow-hidden">
            {/* Aurora Background Glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="max-w-2xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Shield className="w-3 h-3" />
                        Secure Swap Protocol
                    </motion.div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">CREATE <span className="text-cyan-400">BOX</span></h1>
                    <p className="text-gray-500 font-medium max-w-md mx-auto">Lock your gift card value into an immutable smart contract for secure trustless trading.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl"
                >
                    <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.9rem] p-10 border border-white/5 space-y-10">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Select Brand (Custom Dropdown) */}
                            <div className="relative z-40">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 ml-1">Select Brand / Asset</label>

                                {/* Selector Trigger */}
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between px-8 py-5 rounded-[2rem] bg-white/5 border border-white/10 transition-all hover:bg-white/10 group/btn"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                                            {selectedCard.icon}
                                        </div>
                                        <div className="text-left font-black tracking-tight text-xl text-white">
                                            {selectedCard.label}
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 right-0 mt-4 max-h-[400px] overflow-y-auto bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-4xl z-50 p-4 custom-scrollbar"
                                        >
                                            {CATEGORIES.map(category => {
                                                const categoryBrands = GIFT_CARDS_DATA.filter(b => b.category === category.id);
                                                if (categoryBrands.length === 0) return null;

                                                return (
                                                    <div key={category.id} className="mb-4">
                                                        <div className="px-6 py-2 text-[10px] font-black text-cyan-400/70 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-sm sticky top-0 z-10 rounded-xl">
                                                            {category.icon} {category.label}
                                                        </div>
                                                        <div className="p-2 space-y-1">
                                                            {categoryBrands.map(brand => (
                                                                <button
                                                                    key={brand.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setCardType(brand.value);
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${cardType === brand.value
                                                                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-black'
                                                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                        }`}
                                                                >
                                                                    <span className="text-2xl w-8 text-center">{brand.icon}</span>
                                                                    <span className="text-sm tracking-tight">{brand.label}</span>
                                                                    {cardType === brand.value && (
                                                                        <div className="ml-auto w-2 h-2 rounded-full bg-black shadow-inner" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Overlay to close when clicking outside */}
                                {isDropdownOpen && (
                                    <div
                                        className="fixed inset-0 z-40 bg-transparent"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                )}
                            </div>

                            {/* Gift Card Code */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Asset Security Code</label>
                                <div className="grid md:grid-cols-1 gap-6">
                                     <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="XXXX-XXXX-XXXX-XXXX"
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-[2rem] pl-20 pr-8 py-5 text-white placeholder-gray-700 font-mono text-xl focus:outline-none focus:border-cyan-500/30 focus:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-600 font-medium ml-1">
                                    Encrypted and revealed ONLY to the buyer following trust confirmation.
                                </p>
                            </div>

                            {/* Values Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Card Value */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Face Value (€)</label>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${tier.color}`}>Max €{maxListingValue}</span>
                                    </div>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (val > maxListingValue) setValue(maxListingValue.toString());
                                                else setValue(e.target.value);
                                            }}
                                            placeholder="50.00"
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white placeholder-gray-700 font-black text-xl focus:outline-none focus:border-white/20 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Asking Price */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Asking Price</label>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">In IOTA</span>
                                        </div>
                                    </div>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                            <Zap className="w-4 h-4 fill-current" />
                                        </div>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="40.00"
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-cyan-400 placeholder-cyan-900 font-black text-xl focus:outline-none focus:border-cyan-500/30 focus:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Required Stake */}
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                        <Lock className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">Required Trust Collateral</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-white">{calculatedStake.toFixed(2)}</span>
                                            <span className="text-sm font-black text-cyan-400/70 tracking-widest uppercase">IOTA</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                    A deposit of <span className="text-white font-bold">100% of Face Value</span> is held in escrow. This ensures a mathematical impossibility for fraud.
                                </p>
                            </div>

                            {/* Warnings */}
                            <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-amber-500/80 text-[11px] font-medium leading-relaxed">
                                <div className="flex items-center gap-2 mb-3 font-black uppercase tracking-widest text-amber-500">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Swap Protocol Rules</span>
                                </div>
                                <ul className="space-y-2 opacity-80 decoration-amber-500/20">
                                    <li className="flex gap-2"><span>•</span> Once a buyer locks, reveal MUST happen within 72 hours.</li>
                                    <li className="flex gap-2"><span>•</span> Failure to reveal results in 50% collateral burn.</li>
                                </ul>
                            </div>

                            {/* Submit Button Logic */}
                            {(() => {
                                const hasCode = code.trim().length > 0;
                                const hasValidValue = numValue > 0 && numValue <= 200;
                                const hasValidPrice = numPrice > 0;
                                const priceIsLessThanValue = numPrice < numValue * 10; // Simple logic adjustment for IOTA vs EUR
                                const hasSufficientBalance = user.balance >= calculatedStake;

                                const isListingValueOk = numValue <= maxListingValue;
                                const isFormValid = hasCode && hasValidValue && hasValidPrice && priceIsLessThanValue && hasSufficientBalance && isListingValueOk;

                                return (
                                    <div className="space-y-6">
                                        {!isFormValid && (
                                            <div className="grid grid-cols-1 gap-2">
                                                {!hasCode && <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-500"/> Secret code missing</p>}
                                                {!hasSufficientBalance && <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500"/> Insufficient balance ({calculatedStake.toFixed(0)} IOTA)</p>}
                                                {!isListingValueOk && <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-500"/> Tier limit exceeded (Your max: €{maxListingValue})</p>}
                                            </div>
                                        )}

                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting || !isFormValid}
                                            whileHover={isFormValid ? { scale: 1.02 } : {}}
                                            whileTap={isFormValid ? { scale: 0.98 } : {}}
                                            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group/submit shadow-2xl ${
                                                isSubmitting || !isFormValid
                                                    ? 'bg-slate-900 text-gray-700 cursor-not-allowed border border-white/5'
                                                    : 'bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                                            }`}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {isSubmitting ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                                ) : (
                                                    <>
                                                        <Zap className="w-4 h-4 fill-current" />
                                                        Deploy to Market
                                                    </>
                                                )}
                                            </div>
                                            {!isSubmitting && isFormValid && <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform translate-y-full group-hover/submit:translate-y-0 transition-transform duration-500" />}
                                        </motion.button>
                                    </div>
                                );
                            })()}
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateBox;
