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
    }, [iotaClient, user.address]);


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

    // Progress to next tier (Relative to current tier floor)
    const currentTierBase = tierConfig.prevTierLimit ?? 0;
    const nextTierGoal = tierConfig.tradesNeeded;
    const progressValue = user.tradeCount - currentTierBase;
    const totalNeededInCurrentTier = nextTierGoal - currentTierBase;

    const progressToNextTier = tierConfig.nextTier
        ? Math.min(100, Math.max(0, Math.round((progressValue / totalNeededInCurrentTier) * 100)))
        : 100;

    // Action Required Logic (Urgent Items)
    const TIMEOUT_MS = 259200000; // 72h
    const urgentActions = allMyRelatedBoxes.filter(box => {
        const isSeller = box.seller.toLowerCase() === user.address.toLowerCase();
        const isBuyer = box.buyer?.toLowerCase() === user.address.toLowerCase();
        const now = Date.now();

        if (box.status === 'LOCKED') {
             if (isSeller) return true; // Seller must reveal
             if (isBuyer && box.lockedAt && now > box.lockedAt + TIMEOUT_MS) return true;
        }
        if (box.status === 'REVEALED') {
            if (isBuyer) return true; // Buyer must finalize
            if (isSeller && box.revealTimestamp && now > box.revealTimestamp + TIMEOUT_MS) return true;
        }
        return false;
    });

    return (
        <div className="relative min-h-screen pb-24 overflow-hidden">
            {/* Aurora Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] animate-pulse" />
                <div className="absolute top-40 right-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="max-w-5xl mx-auto space-y-12">
                {/* Profile Header Block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl"
                >
                    <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[2.9rem] p-10 border border-white/5">
                        <div className="flex flex-col md:flex-row gap-10 items-center">
                            {/* Avatar & Identity Pulse */}
                            <div className="relative">
                                <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />
                                <div className="relative p-1.5 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 shadow-2xl">
                                    <div className="rounded-full overflow-hidden border-4 border-slate-950">
                                        <Avatar
                                            name={user.address}
                                            size={120}
                                            variant="marble"
                                            colors={["#06b6d4", "#8b5cf6", "#ec4899", "#1e293b", "#0f172a"]}
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-950 border border-white/10 shadow-xl whitespace-nowrap">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${tierConfig.color}`}>
                                        {tierConfig.icon} {tierConfig.name}
                                    </span>
                                </div>
                            </div>

                            {/* Info Block */}
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="space-y-1">
                                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                                        <span className="text-cyan-400">PASSPORT://</span> {user.address.slice(0, 6)}...{user.address.slice(-4)}
                                    </h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <Shield className="w-3 h-3 text-cyan-400" />
                                            Active Citizen
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <Package className="w-3 h-3 text-purple-400" />
                                            {allMyRelatedBoxes.length} Trade Protocols
                                        </div>
                                    </div>
                                </div>

                                {/* Tier Progress Bento Sub-card */}
                                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-1">Reputation Engine</span>
                                            <span className="text-xl font-black text-white">{progressToNextTier}% <span className="text-gray-600 text-sm">to {tierConfig.nextTier || 'MAX Tier'}</span></span>
                                        </div>
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{progressValue} / {totalNeededInCurrentTier} Successes</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressToNextTier}%` }}
                                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                                        />
                                    </div>
                                </div>
                            </div>

                       </div>
                    </div>
                </motion.div>

                {/* Bento Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Trade Volume', val: `${(user.volume / 1_000_000_000).toFixed(0)}`, unit: 'IOTA', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Integrity Rating', val: '100', unit: '%', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                        { label: 'Network Stake', val: '240.00', unit: 'IOTA', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { label: 'System Alerts', val: urgentActions.length.toString(), unit: '!', icon: AlertTriangle, color: urgentActions.length > 0 ? 'text-amber-400' : 'text-gray-500', bg: urgentActions.length > 0 ? 'bg-amber-500/10' : 'bg-white/5' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-slate-950/40 backdrop-blur-3xl border border-white/5 group hover:border-white/10 transition-all shadow-xl"
                        >
                            <div className={`p-3 rounded-2xl ${stat.bg} w-fit mb-6 border border-white/5`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-2">{stat.label}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white tracking-tighter">{stat.val}</span>
                                <span className="text-[10px] font-black text-gray-600 tracking-widest uppercase">{stat.unit}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area - Bento Layout */}
                <div className="grid md:grid-cols-12 gap-8">
                    {/* Left: Identity & Modules (4 cols) */}
                    <div className="md:col-span-4 space-y-8">
                        {/* Identity Protection Module */}
                        <div className="p-8 rounded-[2.5rem] bg-slate-950/40 backdrop-blur-3xl border border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                    <Shield className={`w-5 h-5 ${keyMatch === true ? 'text-cyan-400' : 'text-amber-400'}`} />
                                </div>
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Security Vault</h3>
                            </div>
                            
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                {keyMatch === true 
                                    ? "Your Citizen Passport is secured. Advanced encryption keys are stored in the on-chain vault." 
                                    : "Identity session is currently local. Synchronize with the blockchain to enable cross-device recovery."}
                            </p>

                            <div className="space-y-3">
                                {keyMatch === false && user.vault && (
                                    <button 
                                        onClick={handleSyncIdentity}
                                        disabled={isSyncing}
                                        className="w-full py-4 rounded-2xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-cyan-400 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                                    >
                                        {isSyncing ? (
                                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>Recover Security Keys {"->"}</>
                                        )}
                                    </button>
                                )}

                                {!user.vault && (
                                    <button 
                                        onClick={handleUpdateVault}
                                        disabled={isUpdatingVault}
                                        className="w-full py-4 rounded-2xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-amber-400 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                                    >
                                        {isUpdatingVault ? (
                                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>Secure On-Chain Vault {"->"}</>
                                        )}
                                    </button>
                                )}

                                {keyMatch === true && (
                                    <div className="py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Vault Secured
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Action (if applicable) */}
                        {hasAdminCap && (
                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-4">
                                <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Administrative Protocol</h3>
                                <button 
                                    onClick={() => navigate('/admin')}
                                    className="w-full py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all"
                                >
                                    Access Admin Panel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Transactions (8 cols) */}
                    <div className="md:col-span-8 space-y-8">
                        {/* Action Center - Urgent Items */}
                        {urgentActions.length > 0 && (
                            <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-6">
                                <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Urgent Protocols Required
                                </h2>
                                <div className="space-y-4">
                                    {urgentActions.map(box => (
                                        <div key={box.id} className="p-5 rounded-2xl bg-slate-950/40 border border-amber-500/20 flex items-center justify-between group/action">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-amber-500/10">
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{box.brand} Protocol</h4>
                                                    <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest">Review & Finalize Task</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/trade/${box.id}`)}
                                                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest transition-all hover:bg-amber-400"
                                            >
                                                Execute
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Transaction History */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <h2 className="text-xl font-black text-white tracking-tight uppercase">Protocol <span className="text-cyan-400">Ledger</span></h2>
                                <div className="flex gap-1">
                                    {['ALL', 'ACTIVE', 'COMPLETED'].map((id) => (
                                        <button
                                            key={id}
                                            onClick={() => setFilter(id as 'ALL' | 'ACTIVE' | 'COMPLETED')}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === id ? 'bg-cyan-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {id}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredBoxes.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <Package className="w-12 h-12 text-gray-800 mx-auto" />
                                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">No Active Protocols Found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {filteredBoxes.map((box) => (
                                        <BoxCard
                                            key={box.id}
                                            box={box}
                                            onClick={() => navigate(`/trade/${box.id}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
