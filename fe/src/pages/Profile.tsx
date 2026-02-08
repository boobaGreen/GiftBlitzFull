import React, { useState, useEffect } from 'react';
import { useMarket } from '../hooks/useMarket';
import { useIotaClient } from '@iota/dapp-kit';
import contracts from '../data/contracts.json';
import BoxCard from '../components/BoxCard';
import { TrendingUp, Package, Shield, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTierConfig, type Box } from '../types';
import { useNavigate } from 'react-router-dom';
import Avatar from 'boring-avatars';

const Profile: React.FC = () => {
    const { user, boxes, repNftId, syncIdentity, updateVaultIdentity, refreshUserStats, keyMatch } = useMarket();
    const iotaClient = useIotaClient();
    const tierConfig = getTierConfig(user.tradeCount);
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isUpdatingVault, setIsUpdatingVault] = useState(false);
    const [hasAdminCap, setHasAdminCap] = useState(false);

    // Check for Admin Cap
    useEffect(() => {
        const checkAdmin = async () => {
            if (!user.address) return;
            try {
                const objects = await iotaClient.getOwnedObjects({
                    owner: user.address,
                    filter: { StructType: `${contracts.PACKAGE_ID}::giftblitz::AdminCap` }
                });
                setHasAdminCap(objects.data.length > 0);
            } catch (err) {
                console.error("Failed to check admin cap:", err);
            }
        };
        checkAdmin();
    }, [user.address, iotaClient]);


    const handleSyncIdentity = async () => {
        if (!user.vault) return;
        setIsSyncing(true);
        try {
            const success = await syncIdentity(user.vault);
            if (success) {
                await refreshUserStats();
            }
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleUpdateVault = async () => {
        if (!repNftId) return;
        setIsUpdatingVault(true);
        try {
            await updateVaultIdentity(repNftId);
            await refreshUserStats();
        } catch (error) {
            console.error("Update vault failed:", error);
        } finally {
            setIsUpdatingVault(false);
        }
    };

    // Minting of profile is now handle atomically by useGiftBlitz.ts hooks

    // User's active boxes (as seller)
    const myBoxes = boxes.filter((b: Box) => b.seller.toLowerCase() === user.address.toLowerCase());
    // User's bought boxes (as buyer)
    const boughtBoxes = boxes.filter((b: Box) => b.buyer?.toLowerCase() === user.address.toLowerCase());

    // Combine and deduplicate
    const allMyRelatedBoxes = [...boughtBoxes, ...myBoxes].filter((box, index, self) =>
        index === self.findIndex((b) => b.id === box.id)
    );

    // Filter Logic
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'CANCELED'>('ALL');

    const filteredBoxes = allMyRelatedBoxes.filter(box => {
        if (filter === 'ALL') return box.status !== 'CANCELED';
        if (filter === 'ACTIVE') return box.status === 'OPEN' || box.status === 'LOCKED' || box.status === 'REVEALED';
        if (filter === 'COMPLETED') return box.status === 'COMPLETED';
        if (filter === 'DISPUTED') return box.status === 'DISPUTED';
        if (filter === 'CANCELED') return box.status === 'CANCELED';
        return true;
    });

    // Progress to next tier
    const progressToNextTier = tierConfig.nextTier
        ? Math.min(100, Math.round((user.tradeCount / tierConfig.tradesNeeded) * 100))
        : 100;

    // Action Required Logic (Urgent Items)
    const TIMEOUT_MS = 259200000; // 72h
    const urgentActions = allMyRelatedBoxes.filter(box => {
        const isSeller = box.seller.toLowerCase() === user.address.toLowerCase();
        const isBuyer = box.buyer?.toLowerCase() === user.address.toLowerCase();
        const now = Date.now();

        if (box.status === 'LOCKED') {
             if (isSeller) return true; // Seller must reveal
             // Buyer claim refund if timeout passed
             if (isBuyer && box.lockedAt && now > box.lockedAt + TIMEOUT_MS) return true;
        }
        if (box.status === 'REVEALED') {
            if (isBuyer) return true; // Buyer must finalize
            // Seller claim auto-finalize if timeout passed
            if (isSeller && box.revealTimestamp && now > box.revealTimestamp + TIMEOUT_MS) return true;
        }
        return false;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl p-6"
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                }}
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 20% 50%, ${tierConfig.color.includes('yellow') ? 'rgba(234, 179, 8, 0.3)' : tierConfig.color.includes('purple') ? 'rgba(168, 85, 247, 0.3)' : 'rgba(59, 130, 246, 0.3)'} 0%, transparent 50%)`,
                    }}
                />

                <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar & Level Badge */}
                    <div className="flex flex-col items-center gap-3">
                        <Avatar
                            name={user.address}
                            size={96}
                            variant="marble"
                            colors={["#06b6d4", "#8b5cf6", "#ec4899", "#1e293b", "#0f172a"]}
                        />
                        <div className={`px-4 py-1.5 rounded-full ${tierConfig.bg} ${tierConfig.border} border ${tierConfig.color} text-sm font-bold whitespace-nowrap`}>
                            {tierConfig.icon} {tierConfig.name}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white mb-1">{user.address.slice(0, 10)}...{user.address.slice(-4)}</h1>
                        <p className="text-gray-500 text-sm mb-4">
                            {user.memberEpoch !== null && user.memberEpoch !== undefined
                                ? `Member since Epoch ${user.memberEpoch}`
                                : "New Member"}
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs text-gray-500">Volume</span>
                                </div>
                                <p className="text-lg font-bold text-white">{(user.volume / 1_000_000_000).toFixed(2)} IOTA</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Package className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs text-gray-500">Trade</span>
                                </div>
                                <p className="text-lg font-bold text-white">{user.tradeCount}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-4 h-4 text-orange-400" />
                                    <span className="text-xs text-gray-500">Dispute</span>
                                </div>
                                <p className="text-lg font-bold text-white">{user.disputes}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs text-gray-500">Max Buy</span>
                                </div>
                                <p className="text-lg font-bold text-white">{tierConfig.maxBuy} IOTA</p>
                            </div>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className="flex flex-col gap-2">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-center md:text-right">
                            <p className="text-xs text-gray-500 mb-1">Balance</p>
                            <p className="text-3xl font-bold text-white">{user.balance.toFixed(2)}</p>
                            <p className="text-cyan-400 text-sm">IOTA</p>
                        </div>
                        
                        {repNftId && (
                            <div className="space-y-2">
                                <div className="text-[10px] text-gray-500 text-center md:text-right">
                                    NFT: {repNftId.slice(0, 6)}...{repNftId.slice(-4)}
                                </div>
                                {hasAdminCap && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="w-full py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Shield className="w-3 h-3" /> Admin Panel
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Tier Progress */}
            {tierConfig.nextTier && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl bg-slate-800/60 border border-white/5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Progress to <span className="text-purple-400 font-bold">{tierConfig.nextTier}</span></span>
                        </div>
                        <span className="text-xs text-gray-500">{tierConfig.tradesNeeded} trades needed</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressToNextTier}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{user.tradeCount}/{tierConfig.tradesNeeded} trades</span>
                        <span>Goal: {tierConfig.nextMaxBuy} IOTA max buy</span>
                    </div>
                </motion.div>
            )}

            {/* Identity Protection Status */}
            {repNftId && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-5 rounded-2xl bg-slate-800/40 border border-white/5 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Shield className="w-16 h-16 text-cyan-400" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className={`w-5 h-5 ${keyMatch === true ? 'text-green-400' : 'text-amber-400'}`} />
                                <h3 className="text-lg font-bold text-white">Identity Protection</h3>
                            </div>
                            <p className="text-sm text-gray-400 max-w-lg">
                                Your encryption keys are used to safely share gift codes. 
                                {keyMatch === true 
                                    ? " Your identity is secured and synced on the blockchain." 
                                    : " Your browser's identity doesn't match your profile. This happens if you switch devices or clear cache."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px]">
                            {keyMatch === false && user.vault && (
                                <button
                                    onClick={handleSyncIdentity}
                                    disabled={isSyncing}
                                    className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-extrabold text-sm hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 animate-pulse"
                                >
                                    {isSyncing ? "Syncing..." : "🔄 Sync Identity"}
                                </button>
                            )}
                            
                             {keyMatch === true && (
                                    <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center justify-center gap-2">
                                         <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                         Identity Synced
                                    </div>
                            )}

                            {keyMatch === false && !user.vault && (
                                <button
                                    onClick={handleUpdateVault}
                                    disabled={isUpdatingVault}
                                    className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                                >
                                    <Shield className="w-3 h-3" /> {isUpdatingVault ? "Enabling..." : "🔐 Enable Vault"}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* My Boxes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
             {/* Action Center - Urgent Items */}
             {urgentActions.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        Action Required
                    </h2>
                    <div className="grid gap-3">
                        {urgentActions.map(box => {
                            const isSeller = box.seller.toLowerCase() === user.address.toLowerCase();
                             const now = Date.now();
                             let msg = "Action needed";
                             if (box.status === 'LOCKED') {
                                 if (isSeller) msg = "⚠️ Pending Reveal (72h Deadline)";
                                 else if (now > (box.lockedAt || 0) + TIMEOUT_MS) msg = "💰 Claim Refund (Seller Timeout)";
                                 else msg = "Waiting for reveal...";
                             } else if (box.status === 'REVEALED') {
                                 if (!isSeller) msg = "✅ Verify & Finalize (72h Deadline)";
                                 else if (now > (box.revealTimestamp || 0) + TIMEOUT_MS) msg = "💰 Claim Auto-Finalize";
                                 else msg = "Waiting for buyer...";
                             }

                            return (
                                <div key={box.id} className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/20">
                                            <Clock className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{box.brand} • {(box.value/1_000_000_000).toFixed(0)} IOTA</h3>
                                            <p className="text-xs text-orange-300 font-medium">
                                                {msg}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/trade/${box.id}`)}
                                        className="px-4 py-2 rounded-lg bg-orange-500 text-black font-bold text-xs hover:bg-orange-400 transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-bold text-white">My Trades</h2>

                    {/* Filter Tabs */}
                    <div className="flex p-1 rounded-xl bg-slate-800/50 border border-white/5 overflow-x-auto">
                        {[
                            { id: 'ALL', label: 'History', icon: '📋' },
                            { id: 'ACTIVE', label: 'Active', icon: '⚡' },
                            { id: 'COMPLETED', label: 'Success', icon: '✅' },
                            { id: 'DISPUTED', label: 'Burned', icon: '🔥' },
                            { id: 'CANCELED', label: 'Canceled', icon: '⭕' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as 'ALL' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'CANCELED')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2
                                    ${filter === tab.id
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {filteredBoxes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-slate-800/30 rounded-2xl border border-white/5">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                        <p>No transactions found</p>
                        <p className="text-sm text-gray-600 mt-1">
                            {filter === 'ALL' ? "Buy or sell a card to get started!" : `No ${filter.toLowerCase()} trades yet.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredBoxes.map((box) => (
                            <BoxCard
                                key={box.id}
                                box={box}
                                onClick={() => navigate(`/trade/${box.id}`)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Profile;
