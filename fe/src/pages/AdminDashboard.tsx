import React, { useEffect, useState, useCallback } from 'react';
import { Shield, TrendingUp, Download, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIotaClient, useCurrentAccount } from '@iota/dapp-kit';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import contracts from '../data/contracts.json';
import { useNotifications } from '../context/NotificationContext';

const AdminDashboard: React.FC = () => {
    const account = useCurrentAccount();
    const iotaClient = useIotaClient();
    const { withdrawFees } = useGiftBlitz();
    const { showToast } = useNotifications();
    
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [hasAdminCap, setHasAdminCap] = useState(false);
    const [adminCapId, setAdminCapId] = useState<string | null>(null);

    const TREASURY_ID = (contracts as { TREASURY_ID: string }).TREASURY_ID;

    const checkAdminStatus = useCallback(async () => {
        if (!account) return;
        
        try {
            const objects = await iotaClient.getOwnedObjects({
                owner: account.address,
                filter: { StructType: `${contracts.PACKAGE_ID}::giftblitz::AdminCap` }
            });

            if (objects.data.length > 0) {
                setHasAdminCap(true);
                setAdminCapId(objects.data[0].data?.objectId || null);
            } else {
                setHasAdminCap(false);
            }
        } catch (err) {
            console.error("Error checking admin status:", err);
        }
    }, [account, iotaClient]);

    const fetchTreasuryBalance = useCallback(async () => {
        if (!TREASURY_ID) return;
        setLoading(true);
        try {
            const res = await iotaClient.getObject({
                id: TREASURY_ID,
                options: { showContent: true }
            });

            if (res.data?.content && 'fields' in res.data.content) {
                const fields = res.data.content.fields as { balance: string };
                const balanceVal = fields.balance;
                setBalance(Number(balanceVal));
            }
        } catch (err) {
            console.error("Error fetching treasury balance:", err);
            showToast("Failed to fetch treasury state", "error");
        } finally {
            setLoading(false);
        }
    }, [TREASURY_ID, iotaClient, showToast]);

    useEffect(() => {
        checkAdminStatus();
        fetchTreasuryBalance();
    }, [checkAdminStatus, fetchTreasuryBalance]);

    const handleWithdraw = async () => {
        if (!adminCapId) {
            showToast("Admin Capability not found in wallet", "error");
            return;
        }

        try {
            setIsWithdrawing(true);
            await withdrawFees(adminCapId);
            showToast("Withdrawal successful!", "success");
            fetchTreasuryBalance(); // Refresh
        } catch (err) {
            console.error("Withdrawal failed:", err);
            showToast("Withdrawal failed", "error");
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <Shield className="w-16 h-16 text-gray-700" />
                <h1 className="text-2xl font-bold text-white">Restricted Access</h1>
                <p className="text-gray-400">Please connect your wallet to access the Admin Dashboard.</p>
            </div>
        );
    }

    if (!hasAdminCap) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <Shield className="w-16 h-16 text-red-500/50" />
                <h1 className="text-2xl font-bold text-white">Unauthorized</h1>
                <p className="text-gray-400">You do not possess the Admin Capability for this protocol.</p>
                <button 
                    onClick={() => window.history.back()}
                    className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all font-bold"
                >
                    Return Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
                        <Shield className="w-4 h-4" /> Protocol Authority
                    </div>
                    <h1 className="text-4xl font-black text-white">TREASURY <span className="text-cyan-500">OPS</span></h1>
                </div>
                <button 
                    onClick={fetchTreasuryBalance}
                    disabled={loading}
                    className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 p-8 rounded-[32px] bg-slate-900 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TrendingUp className="w-32 h-32 text-cyan-500" />
                    </div>
                    
                    <div className="relative space-y-6">
                        <div className="text-gray-500 font-bold text-sm uppercase tracking-wider">Accumulated Protocol Fees</div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-white">
                                {loading ? '...' : (balance !== null ? (balance / 1e9).toFixed(2) : '0.00')}
                            </span>
                            <span className="text-2xl font-bold text-cyan-500">IOTA</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 w-fit px-3 py-1.5 rounded-full border border-white/5">
                            <Shield className="w-3 h-3 text-cyan-500" />
                            Securely stored in Treasury: {TREASURY_ID?.substring(0, 10)}...
                        </div>
                    </div>
                </motion.div>

                {/* Withdraw Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-[32px] bg-gradient-to-br from-cyan-600 to-blue-700 flex flex-col justify-between group"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                        <Download className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Collect Revenue</h3>
                        <p className="text-cyan-100/70 text-sm leading-relaxed">
                            Withdraw all accumulated platform fees directly to your administrative wallet.
                        </p>
                        <button 
                            onClick={handleWithdraw}
                            disabled={isWithdrawing || !balance || balance === 0}
                            className="w-full py-4 rounded-2xl bg-white text-cyan-600 font-black hover:bg-cyan-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Withdraw Funds"}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Info Section */}
            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="text-sm text-gray-400 leading-relaxed">
                    <strong className="text-blue-300">Identity Verified.</strong> Access to this dashboard is cryptographically secured by the <code className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">AdminCap</code>. 
                    Only you can authorize withdrawals from the Protocol Treasury. All actions are permanent and recorded on the IOTA Tangle.
                </div>
            </div>

            <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
        </div>
    );
};

export default AdminDashboard;
