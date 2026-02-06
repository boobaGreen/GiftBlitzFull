import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/useMarket';
import { Shield, Lock, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMaxBuyValue } from '../types';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import { useNotifications } from '../context/NotificationContext';

const PurchaseBox: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { boxes, user, joinBox: localJoinBox } = useMarket();
    const { joinBox, mintProfile, getReputationNFT } = useGiftBlitz();
    const { showToast } = useNotifications();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);

    const box = boxes.find((b: { id: string; seller: string; brand: string; value: number; price: number }) => b.id === id);

    // Check if user has profile on mount
    useEffect(() => {
        const checkProfile = async () => {
            if (user.address) {
                const nft = await getReputationNFT(user.address);
                setHasProfile(!!nft);
            }
        };
        checkProfile();
    }, [user.address, getReputationNFT]);

    // Redirect seller to trade management page
    useEffect(() => {
        if (box && box.seller === user.address) {
            navigate(`/trade/${box.id}`, { replace: true });
        }
    }, [box, user.address, navigate]);

    if (!box) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold text-white mb-2">Box Not Found</h2>
                <button onClick={() => navigate('/market')} className="text-cyan-400 hover:underline">
                    Return to Market
                </button>
            </div>
        );
    }

    // Buyer Cap Verification
    const maxBuyValue = getMaxBuyValue(user.tradeCount);
    const priceIota = box.price / 1_000_000_000;
    const canBuy = priceIota <= maxBuyValue;

    // Trust Deposit Calculation: Buyer pays 110% Face Value (Move contract rule)
    const buyerStake = (box.value * 110) / 100; 
    const totalToPay = box.price + buyerStake;

    const handleCreateProfile = async () => {
        setIsCreatingProfile(true);
        try {
            await mintProfile();
            setHasProfile(true);
            setShowProfileModal(false);
            showToast("Profile created! Now you can purchase.", "success");
        } catch (error) {
            console.error("Profile creation failed:", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            showToast(`Profile creation failed: ${errMsg}`, "error");
        } finally {
            setIsCreatingProfile(false);
        }
    };

    const handlePurchase = async () => {
        if (isProcessing) return;

        // Check if user has profile - if not, show modal
        if (!hasProfile) {
            setShowProfileModal(true);
            return;
        }

        if (!canBuy) {
            showToast("Your buyer cap doesn't allow this purchase yet.", "error");
            return;
        }

        setIsProcessing(true);
        try {
            await joinBox(box.id, totalToPay);
            
            // Local state update
            localJoinBox(box.id, user.address);
            
            showToast("Purchase Successful!", "success");
            setIsProcessing(false);
            navigate('/profile'); 
        } catch (error: unknown) {
            console.error("Purchase failed:", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            showToast(errMsg, "error");
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/market')} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Secure Purchase</h1>
                        <p className="text-gray-400 text-sm">Review transaction details before locking funds</p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="relative overflow-hidden rounded-3xl p-1"
                    style={{
                        background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2))',
                    }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-[22px] p-6 md:p-8">

                        {/* Box Summary */}
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                                {box.brand === 'AMAZON' ? '📦' : box.brand === 'STEAM' ? '🎮' : '🎁'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{box.brand} Gift Card</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-400">Value:</span>
                                    <span className="text-white font-semibold">{(box.value / 1_000_000_000).toFixed(2)} IOTA</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">
                                        Save {Math.round(((box.value - box.price) / box.value) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Transaction Breakdown</h3>

                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-cyan-400" />
                                    <span className="text-gray-300">Price to Pay</span>
                                </div>
                                <span className="text-white font-bold text-lg">{(box.price / 1_000_000_000).toFixed(2)} IOTA</span>
                            </div>

                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <span className="text-gray-300 block">Trust Deposit</span>
                                        <span className="text-xs text-gray-500">Refundable upon success</span>
                                    </div>
                                </div>
                                <span className="text-white font-bold text-lg">{(buyerStake / 1_000_000_000).toFixed(2)} IOTA</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-gray-400">Total Lock Amount</span>
                                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                    {(totalToPay / 1_000_000_000).toFixed(2)} IOTA
                                </span>
                            </div>
                        </div>


                        {/* Rules Info */}
                        <div className="bg-slate-800/50 p-4 rounded-xl mb-8 space-y-2">
                             <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" /> 
                                Important Rules
                            </h4>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                                <li>Seller has <strong className="text-orange-300">72 hours</strong> to reveal the code after purchase.</li>
                                <li>If they fail, you can claim a <strong className="text-orange-300">full refund + compensation</strong>.</li>
                                <li>Once revealed, you have <strong className="text-green-300">72 hours</strong> to verify.</li>
                                <li>If you don't act in time, the trade <strong className="text-green-300">auto-finalizes</strong>.</li>
                            </ul>
                        </div>

                        {/* Verification Section - Only show if has profile */}
                        {hasProfile !== null && hasProfile && (
                            <div className={`p-4 rounded-xl border mb-8 ${canBuy ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                {canBuy ? (
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                                        <div>
                                            <h4 className="text-green-400 font-bold text-sm">Approved for Purchase</h4>
                                            <p className="text-green-400/70 text-xs mt-1">
                                                Your trade count ({user.tradeCount}) allows you to buy items up to {maxBuyValue} IOTA.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                                        <div>
                                            <h4 className="text-red-400 font-bold text-sm">Limit Exceeded</h4>
                                            <p className="text-red-400/70 text-xs mt-1">
                                                You need {priceIota.toFixed(2)} IOTA purchases, but your limit is {maxBuyValue} IOTA.
                                            </p>
                                            <p className="text-red-400/70 text-xs mt-1 font-bold">
                                                Complete more small trades to level up!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Profile Notice */}
                        {hasProfile === false && (
                            <div className="p-4 rounded-xl border mb-8 bg-cyan-500/10 border-cyan-500/20">
                                <div className="flex items-start gap-3">
                                    <UserPlus className="w-5 h-5 text-cyan-400 mt-0.5" />
                                    <div>
                                        <h4 className="text-cyan-400 font-bold text-sm">Profile Required</h4>
                                        <p className="text-cyan-400/70 text-xs mt-1">
                                            Create your GiftBlitz identity to start trading. It's free and takes 5 seconds!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing || (hasProfile === true && (!canBuy || user.balance < (totalToPay / 1_000_000_000)))}
                            className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all group
                                ${hasProfile === false
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                                    : (!canBuy || user.balance < (totalToPay / 1_000_000_000))
                                        ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                                }`}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : hasProfile === false ? (
                                <>
                                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Create Identity & Buy
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {!canBuy
                                        ? `Requires Higher Trade Count`
                                        : user.balance < (totalToPay / 1_000_000_000)
                                            ? `Insufficient Balance`
                                            : `Confirm & Lock ${(totalToPay / 1_000_000_000).toFixed(2)} IOTA`
                                    }
                                </>
                            )}
                        </button>

                        {user.balance < (totalToPay / 1_000_000_000) && canBuy && hasProfile && (
                            <p className="text-center text-red-400 text-xs mt-3">
                                You need {(totalToPay / 1_000_000_000).toFixed(2)} IOTA in your wallet. Current: {user.balance.toFixed(2)} IOTA.
                            </p>
                        )}

                        <p className="text-center text-gray-500 text-xs mt-4">
                            Funds are held in smart contract escrow until you verify the code.
                        </p>

                    </div>
                </div>
            </motion.div>

            {/* Profile Creation Modal */}
            <AnimatePresence>
                {showProfileModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !isCreatingProfile && setShowProfileModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md rounded-3xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.99) 100%)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                boxShadow: '0 0 60px rgba(6, 182, 212, 0.2)',
                            }}
                        >
                            <div className="p-8 text-center">
                                {/* Icon */}
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                                    <Sparkles className="w-10 h-10 text-cyan-400" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">One More Step!</h2>
                                <p className="text-gray-400 mb-6">
                                    To protect buyers, we need to create your GiftBlitz Identity (free, takes 5 seconds).
                                </p>

                                {/* Benefits */}
                                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">Creates your on-chain reputation</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">Unlocks buyer caps (start at 30 IOTA)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">Enables secure code delivery</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleCreateProfile}
                                    disabled={isCreatingProfile}
                                    className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                                >
                                    {isCreatingProfile ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Creating Identity...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Create Identity & Continue
                                        </>
                                    )}
                                </button>

                                <p className="text-gray-500 text-xs mt-4">
                                    💡 After this, you won't need to do it again.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PurchaseBox;
