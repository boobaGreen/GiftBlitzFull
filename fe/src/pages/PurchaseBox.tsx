import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/useMarket';
import { Shield, Lock, AlertTriangle, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMaxBuyValue } from '../types';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import { useNotifications } from '../context/NotificationContext';

const PurchaseBox: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { boxes, user, joinBox: localJoinBox } = useMarket();
    const { joinBox } = useGiftBlitz();
    const { showToast } = useNotifications();
    const [isProcessing, setIsProcessing] = useState(false);

    const box = boxes.find((b: { id: string; seller: string; brand: string; value: number; price: number }) => b.id === id);

    // Redirect seller to trade management page
    React.useEffect(() => {
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

    // nanoPrice is no longer used here as joinBox takes totalToPay

    const handlePurchase = async () => {
        if (!canBuy || isProcessing) return;

        setIsProcessing(true);
        try {
            // Atomic Profile Minting is now handled inside the joinBox hook
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

                        {/* Verification Section */}
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

                        {/* Action Buttons */}
                        <button
                            onClick={handlePurchase}
                            disabled={!canBuy || isProcessing || user.balance < (totalToPay / 1_000_000_000)}
                            className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all group
                                ${!canBuy || user.balance < (totalToPay / 1_000_000_000)
                                    ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-[0_0_30_rgba(6,182,212,0.4)]'
                                }`}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
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

                        {user.balance < (totalToPay / 1_000_000_000) && canBuy && (
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
        </div>
    );
};

export default PurchaseBox;
