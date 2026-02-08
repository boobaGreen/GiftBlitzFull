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
    const BtnIcon = btnConfig.icon;

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
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
            >
                {/* Glowing border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.15), rgba(168, 85, 247, 0.1))',
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)',
                    }}
                />

                {/* Lock icon top-right */}
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                    <Lock className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </div>

                <div className="p-5">
                    {/* Brand Section */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center p-2 text-2xl">
                            {brand.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{brand.label} Gift Card</p>
                            <h3 className="text-xl font-bold text-white tracking-tight">{brand.label}</h3>
                        </div>
                    </div>

                    {/* Value & Price */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                            <span className="text-gray-400 text-sm">Value:</span>
                            <span className="text-white font-semibold flex items-center gap-1">{(box.value / 1000000000).toFixed(2)} IOTA</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                            <span className="text-gray-400 text-sm">Price:</span>
                            <span className="text-cyan-400 font-bold text-lg">{(box.price / 1000000000).toFixed(2)} IOTA</span>
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                -{discount}%
                            </span>
                        </div>
                    </div>

                    {/* Seller & Reputation */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <button
                            onClick={handleProfileClick}
                            className="flex items-center gap-2 hover:bg-white/5 p-1.5 -m-1.5 rounded-lg transition-colors"
                            title="View seller profile"
                        >
                            <Avatar
                                name={box.seller}
                                size={28}
                                variant="marble"
                                colors={["#06b6d4", "#8b5cf6", "#ec4899", "#1e293b", "#0f172a"]}
                            />
                            <div className="text-left">
                                <p className="text-white text-sm font-medium">{box.seller.slice(0, 6)}...</p>
                                <p className={`text-[10px] ${currentTier.color}`}>{currentTier.icon} {currentTier.name}</p>
                            </div>
                        </button>

                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${btnConfig.bg}`}>
                            {BtnIcon && <BtnIcon className="w-3 h-3" />}
                            {btnConfig.text}
                        </button>
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

                                {/* Soulbound NFT Badge */}
                                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">🔗 Soulbound NFT</p>
                                    <p className="text-gray-400 text-xs">Non-transferable reputation token</p>
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
