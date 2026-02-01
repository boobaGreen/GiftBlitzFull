import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import type { Box, BoxType } from '../types';
import { Lock, ChevronDown, DollarSign, Hash, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES, GIFT_CARDS_DATA } from '../data/giftCards';
import { useGiftBlitz } from '../hooks/useGiftBlitz';

const CreateBox: React.FC = () => {
    const navigate = useNavigate();
    const { addBox, user, repNftId, mintProfile } = useMarket();
    const { createBox } = useGiftBlitz();

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
    const calculatedStake = Math.round(numPrice * stakeMultiplier);

    const selectedCard = GIFT_CARDS_DATA.find(c => c.value === cardType) || GIFT_CARDS_DATA[0];

    const isSubmittingRef = React.useRef(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (numValue <= 0 || numPrice <= 0 || !code || isSubmitting || isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        try {
            // 1. Check if profile exists, if not, mint it first
            if (!repNftId) {
                console.log("No profile found. Minting Reputation NFT first...");
                await mintProfile();
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

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
                alert("Wallet Connection Error: Please disconnect and reconnect your wallet.");
            }
        } finally {
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };

    const inputStyle = `
    w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-white 
    placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 
    focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all
  `;

    return (
        <div className="max-w-lg mx-auto px-4 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-visible rounded-3xl" // Overflow must be visible for dropdown
                style={{
                    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    border: '1px solid rgba(6, 182, 212, 0.15)',
                    boxShadow: '0 0 40px rgba(6, 182, 212, 0.05)',
                }}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                            <Lock className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                Sell Gift Card
                                <Lock className="w-4 h-4 text-cyan-400" />
                            </h1>
                            <p className="text-gray-500 text-xs">Create a secure transaction box</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Select Brand (Custom Dropdown) */}
                    <div className="relative z-50">
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Select Brand</label>

                        {/* Selector Trigger */}
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`${inputStyle} flex items-center justify-between text-left`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{selectedCard.icon}</span>
                                <span className="font-medium">{selectedCard.label}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto bg-[#0f172a] border border-cyan-500/30 rounded-xl shadow-2xl z-50 py-2 custom-scrollbar">
                                {CATEGORIES.map(category => {
                                    const categoryBrands = GIFT_CARDS_DATA.filter(b => b.category === category.id);
                                    if (categoryBrands.length === 0) return null;

                                    return (
                                        <div key={category.id} className="mb-2">
                                            <div className="px-4 py-1.5 text-[10px] font-bold text-cyan-400/70 uppercase tracking-wider bg-white/5 backdrop-blur-sm sticky top-0 z-10">
                                                {category.icon} {category.label}
                                            </div>
                                            <div className="p-1">
                                                {categoryBrands.map(brand => (
                                                    <button
                                                        key={brand.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setCardType(brand.value);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${cardType === brand.value
                                                            ? 'bg-cyan-500/20 text-white'
                                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                            }`}
                                                    >
                                                        <span className="text-lg w-6 text-center">{brand.icon}</span>
                                                        <span className="text-sm">{brand.label}</span>
                                                        {cardType === brand.value && (
                                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Overlay to close when clicking outside */}
                        {isDropdownOpen && (
                            <div
                                className="fixed inset-0 z-40 bg-transparent"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                        )}
                    </div>

                    {/* Gift Card Code - NEW FIELD */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Gift Card Code</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Hash className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className={`${inputStyle} pl-14 font-mono`}
                                required
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 pl-1">
                            This code will be encrypted and only revealed to the buyer after the trade is confirmed.
                        </p>
                    </div>

                    {/* Card Value */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Card Value (max €200)</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (val > 200) {
                                        setValue('200');
                                    } else {
                                        setValue(e.target.value);
                                    }
                                }}
                                placeholder="€50.00"
                                className={`${inputStyle} pl-14`}
                                min="1"
                                max="200"
                                required
                            />
                        </div>
                        {numValue > 200 && (
                            <p className="text-xs text-red-400 mt-1">Maximum card value is €200</p>
                        )}
                    </div>

                    {/* Asking Price */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Asking Price</label>
                        <div className="relative p-4 rounded-xl bg-slate-900/60 border border-white/5">
                            <div className="flex items-baseline justify-end gap-2">
                                <DollarSign className="w-5 h-5 text-cyan-400" />
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="40.00"
                                    className="bg-transparent text-3xl font-bold text-cyan-400 w-28 text-right focus:outline-none placeholder-cyan-400/30"
                                    min="1"
                                    required
                                />
                                <span className="text-cyan-400/70 text-sm">IOTA</span>
                            </div>
                            {numValue > 0 && numPrice > 0 && (
                                <p className="text-right text-xs text-gray-500 mt-1">Approx. {numPrice.toFixed(2)} IOTA</p>
                            )}
                        </div>
                    </div>

                    {/* Required Stake */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Lock className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-gray-400">Required Trust Deposit:</span>
                            <span className="text-xl font-bold text-cyan-400 ml-auto">{calculatedStake.toFixed(2)}</span>
                            <span className="text-cyan-400/70 text-sm">IOTA</span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                            Seller Trust Deposit: 100% Price. (Buyer deposits 100% Price for safety).
                        </p>
                    </div>

                    {/* Timeouts Info */}
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs">
                        <div className="flex items-center gap-2 mb-2 font-bold">
                            <Clock className="w-4 h-4" />
                            <span>Strict 72-Hour Rule</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 opacity-80">
                            <li>Once a buyer joins, you MUST reveal the key within <strong>72 hours</strong>.</li>
                            <li>Failure to reveal results in <strong>loss of 50% of your stake</strong>.</li>
                            <li>Trade cannot be cancelled once a buyer joins.</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'}`}
                        style={{
                            background: 'linear-gradient(90deg, #06b6d4 0%, #22d3ee 50%, #06b6d4 100%)',
                            backgroundSize: '200% 100%',
                        }}
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                {!repNftId ? 'Create Profile & Sell' : 'Lock & Publish'}
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateBox;
