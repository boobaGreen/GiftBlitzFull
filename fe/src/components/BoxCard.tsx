import React, { useState } from 'react';
import { Lock, CheckCircle, Clock, X, TrendingUp, Package, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarket } from '../hooks/useMarket';
import { getBrand } from '../data/giftCards';
import { getTierConfig, getMaxBuyValue, type Box } from '../types';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import Avatar from 'boring-avatars';

interface TierInfo {
    name: string;
    color: string;
    icon: string;
}

interface SellerStats {
    trades: number;
    volume: number;
    disputes: number;
    tier: TierInfo;
    maxBuy: number;
}



interface BoxCardProps {
    box: Box;
    onClick?: () => void;
}



const BoxCard: React.FC<BoxCardProps> = ({ box, onClick }) => {
    const { user, sellersRep } = useMarket();
    const discount = Math.round(((box.value - box.price) / box.value) * 100);
    const brand = getBrand(box.brand);
    const { getReputationNFT } = useGiftBlitz();
    const [showProfile, setShowProfile] = useState(false);
    const [realSellerStats, setRealSellerStats] = useState<SellerStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    const isSeller = user.address === box.seller;
    const isBuyer = user.address === box.buyer;
    
    // Real stats from context
    const contextRep = sellersRep[box.seller.toLowerCase()];
    const currentTier = contextRep ? getTierConfig(contextRep.trades) : getTierConfig(0);

    // Real stats comparison for modal
    const displayStats: SellerStats = realSellerStats || (contextRep ? {
        trades: contextRep.trades,
        volume: contextRep.volume,
        disputes: contextRep.disputes,
        maxBuy: getMaxBuyValue(contextRep.trades),
        tier: currentTier
    } : {
        trades: 0,
        volume: 0,
        disputes: 0,
        maxBuy: getMaxBuyValue(0),
        tier: getTierConfig(0)
    });

    // Dynamic Button Logic
    const getButtonConfig = () => {
        if (box.status === 'COMPLETED') {
            if (isBuyer) return { text: 'Purchased', bg: 'bg-green-500/20 text-green-400', icon: CheckCircle };
            return { text: 'Sold', bg: 'bg-green-500/20 text-green-400', icon: null };
        }
        if (box.status === 'DISPUTED') {
            if (isSeller) return { text: 'Burned (Seller)', bg: 'bg-red-500/20 text-red-400', icon: null };
            if (isBuyer) return { text: 'Burned (Buyer)', bg: 'bg-red-500/20 text-red-400', icon: null };
            return { text: 'Burned', bg: 'bg-red-500/20 text-red-400', icon: null };
        }

        if (isSeller) {
            if (box.status === 'OPEN') return { text: 'My Listing', bg: 'bg-slate-700 text-gray-300', icon: null };
            if (box.status === 'LOCKED') return { text: 'Action Needed', bg: 'bg-yellow-500/20 text-yellow-400', icon: Clock };
        }

        if (isBuyer) {
            if (box.status === 'LOCKED') {
                // Check if seller has encrypted the code for the buyer
                if (!box.encryptedCodeOnChain || !box.encryptedKeyOnChain) {
                    return { text: 'Waiting for Seller', bg: 'bg-yellow-500/20 text-yellow-400', icon: Clock };
                }
                return { text: 'Validate Code', bg: 'bg-green-500 text-black font-bold animate-pulse', icon: CheckCircle };
            }
        }

        // Default visitor / potential buyer
        if (box.status === 'OPEN') return { text: 'Buy Now', bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]', icon: null };

        return { text: box.status, bg: 'bg-slate-700 text-gray-500', icon: Lock };
    };

    const btnConfig = getButtonConfig();

    const handleProfileClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowProfile(true);
        if (!realSellerStats) {
            setIsLoadingStats(true);
            try {
                const nft = await getReputationNFT(box.seller);
                if (nft) {
                    setRealSellerStats({
                        trades: nft.tradeCount,
                        volume: nft.volume,
                        disputes: nft.disputes,
                        maxBuy: getMaxBuyValue(nft.tradeCount),
                        tier: getTierConfig(nft.tradeCount)
                    });
                } else {
                    // No profile yet
                    setRealSellerStats({
                        trades: 0,
                        volume: 0,
                        disputes: 0,
                        maxBuy: getMaxBuyValue(0),
                        tier: getTierConfig(0)
                    });
                }
            } catch (err) {
                console.error("Failed to fetch seller stats:", err);
            } finally {
                setIsLoadingStats(false);
            }
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="relative overflow-hidden rounded-[2rem] cursor-pointer group"
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }}
            >
                {/* Visual Accent - Top Gradient Beam */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Glowing Background Glow on hover */}
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                {/* Lock icon top-right - Modernized */}
                <div className="absolute top-4 right-4 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:border-cyan-500/30 transition-colors">
                    <Lock className="w-4 h-4 text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
                </div>

                <div className="p-6">
                    {/* Brand Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center p-3 text-3xl shadow-inner">
                            {brand.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-[0.2em] mb-0.5">{brand.label} Protocol</p>
                            <h3 className="text-2xl font-black text-white tracking-tight leading-none">{brand.label}</h3>
                        </div>
                    </div>

                    {/* Value & Price Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Face Value</span>
                            <span className="text-white font-black text-lg flex items-baseline gap-1">
                                {(box.value / 1000000000).toFixed(0)}
                                <span className="text-[10px] text-gray-500">IOTA</span>
                            </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 group-hover:border-cyan-500/20 transition-colors">
                            <span className="text-[10px] text-cyan-500/70 font-bold uppercase tracking-wider block mb-1">Buy Price</span>
                            <div className="flex items-center justify-between">
                                <span className="text-cyan-400 font-black text-lg flex items-baseline gap-1">
                                    {(box.price / 1000000000).toFixed(0)}
                                    <span className="text-[10px] text-cyan-500/50">IOTA</span>
                                </span>
                                <span className="text-[10px] font-black text-emerald-400">-{discount}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Seller & Reputation */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <button
                            onClick={handleProfileClick}
                            className="flex items-center gap-2.5 hover:bg-white/5 p-1.5 -m-1.5 rounded-xl transition-all"
                        >
                            <div className="p-0.5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500">
                                <div className="p-0.5 bg-slate-900 rounded-full">
                                    <Avatar
                                        name={box.seller}
                                        size={28}
                                        variant="marble"
                                        colors={["#06b6d4", "#8b5cf6", "#ec4899", "#1e293b", "#0f172a"]}
                                    />
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-white text-xs font-black tracking-tight">{box.seller.slice(0, 8)}...</p>
                                <div className="flex items-center gap-1 group/tier">
                                     <span className={`text-[9px] font-black uppercase tracking-widest ${currentTier.color}`}>{currentTier.name}</span>
                                </div>
                            </div>
                        </button>

                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${btnConfig.bg}`}>
                            {btnConfig.icon && <btnConfig.icon className="w-3 h-3 inline-block mr-1 mb-0.5" />}
                            {btnConfig.text}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Seller Profile Modal (Soulbound NFT View) */}
            <AnimatePresence>
                {showProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowProfile(false)}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-sm rounded-3xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                boxShadow: '0 0 60px rgba(6, 182, 212, 0.2)',
                            }}
                        >
                            {/* Header gradient */}
                            <div className="h-20 bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30" />

                            {/* Close button */}
                            <button
                                onClick={() => setShowProfile(false)}
                                className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>

                            {/* Avatar */}
                            <div className="flex justify-center -mt-12">
                                <div className="p-1 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500">
                                    <div className="bg-slate-900 p-1 rounded-xl">
                                        <Avatar
                                            name={box.seller}
                                            size={80}
                                            variant="marble"
                                            colors={["#06b6d4", "#8b5cf6", "#ec4899", "#1e293b", "#0f172a"]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-4 text-center">
                                <h3 className="text-lg font-bold text-white mb-1">{box.seller.slice(0, 10)}...{box.seller.slice(-4)}</h3>
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${displayStats.tier.color} bg-white/5 border border-white/10`}>
                                    {displayStats.tier.icon} {displayStats.tier.name}
                                </div>

                                {/* Citizen Passport Badge */}
                                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">🔗 Citizen Passport</p>
                                    <p className="text-gray-400 text-xs">Soulbound identity on the IOTA network</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 relative">
                                        {isLoadingStats && <div className="absolute inset-x-0 bottom-1 flex justify-center"><div className="w-1 h-3 bg-cyan-500 animate-pulse rounded-full"/></div>}
                                        <TrendingUp className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-white">{displayStats.trades}</p>
                                        <p className="text-[10px] text-gray-500">Trades</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 relative">
                                        {isLoadingStats && <div className="absolute inset-x-0 bottom-1 flex justify-center"><div className="w-1 h-3 bg-purple-500 animate-pulse rounded-full"/></div>}
                                        <Package className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-white">{(displayStats.volume / 1000000000).toFixed(0)}</p>
                                        <p className="text-[10px] text-gray-500">IOTA Vol</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 relative">
                                        {isLoadingStats && <div className="absolute inset-x-0 bottom-1 flex justify-center"><div className="w-1 h-3 bg-orange-500 animate-pulse rounded-full"/></div>}
                                        <Shield className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-white">{displayStats.disputes}</p>
                                        <p className="text-[10px] text-gray-500">Disputes</p>
                                    </div>
                                </div>

                                {/* Max Buy Info */}
                                <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">Max Buy Limit</span>
                                        <span className="text-cyan-400 font-bold">{displayStats.maxBuy} IOTA</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BoxCard;
