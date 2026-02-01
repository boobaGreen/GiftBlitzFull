import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/useMarket';
import { Lock, CheckCircle, ArrowRight, Flame, Trash2, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import { useNotifications } from '../context/NotificationContext';
import { getEncryptionKeyPair, decryptKeyForMe, decryptCode, unpackCiphertextWithSalt } from '../utils/security';
import CountdownTimer from '../components/CountdownTimer';

const TradeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        boxes, 
        user, 
        repNftId, 
        finalizeBox: localFinalize, 
        disputeBox: localDispute, 
        cancelBox: localCancel,
        claimRevealTimeout: localClaimTimeout,
        claimAutoFinalize: localClaimAutoFinalize
    } = useMarket();
    const { revealKey, finalizeBox, disputeBox, getReputationNFT, claimRevealTimeout, claimAutoFinalize } = useGiftBlitz();
    const { showToast } = useNotifications();
    const [isRevealed, setIsRevealed] = useState(false);
    const [decryptedCode, setDecryptedCode] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [, setForceUpdate] = useState(0); // Trigger re-render on timeout

    const TIMEOUT_MS = 259200000; // 72 hours

    const box = boxes.find(b => b.id === id);

    if (!box) {
        return <div className="text-center py-20 text-gray-500">Trade not found</div>;
    }

    const isBuyer = box.buyer?.toLowerCase() === user.address.toLowerCase();
    const isSeller = box.seller.toLowerCase() === user.address.toLowerCase();

    // Only Buyer or Seller can view this
    if (!isBuyer && !isSeller) {
        return <div className="text-center py-20 text-red-500">Access Denied</div>;
    }

    const handleRevealSeller = async () => {
        if (!box.buyer || isProcessing) return;
        
        setIsProcessing(true);
        try {
            await revealKey(box.id, box.buyer);
            setIsRevealed(true);
            showToast("Key revealed successfully!", "success");
            setIsProcessing(false);
        } catch (error: unknown) {
            const err = error as Error;
            showToast(err.message || "Reveal failed", "error");
            setIsProcessing(false);
        }
    };

    const handleDecryptBuyer = async () => {
        if (decryptedCode) {
            setIsRevealed(!isRevealed);
            return;
        }

        if (!box.encryptedCodeOnChain || !box.encryptedKeyOnChain || isProcessing) return;

        setIsProcessing(true);
        try {
            const sellerNft = await getReputationNFT(box.seller);
            if (!sellerNft || !sellerNft.publicKey) {
                throw new Error("Seller encryption key not found");
            }

            const myKeys = await getEncryptionKeyPair(user.address);
            console.log("1. Local Hub Key retrieved for:", user.address);

            // DIAGNOSTIC: Check if local key matches on-chain profile
            const myNft = await getReputationNFT(user.address);
            if (myNft && myNft.publicKey) {
                const onChainPub = new Uint8Array(JSON.parse(myNft.publicKey));
                const localPub = myKeys.publicKey;
                const match = onChainPub.length === localPub.length && onChainPub.every((b, i) => b === localPub[i]);
                if (!match) {
                    console.error("⚠️ IDENTITY MISMATCH DETECTED!");
                    console.log("Local Key (first 8 bytes):", Array.from(localPub).slice(0, 8));
                    console.log("On-Chain Key (first 8 bytes):", Array.from(onChainPub).slice(0, 8));
                    throw new Error("Your browser's encryption key doesn't match your on-chain profile. This happens if you switch browsers, domains (e.g. localhost -> Vercel) or clear cache. You need to reset your Identity in Profile.");
                } else {
                    console.log("✅ Local Hub Key matches On-Chain profile.");
                }
            }

            const encKeyBytes = new Uint8Array(JSON.parse(box.encryptedKeyOnChain));
            const sellerPubBytes = new Uint8Array(JSON.parse(sellerNft.publicKey));
            console.log("2. Derived Peer PubKey (Seller) recovered from chain.");

            console.log("3. Attempting ECDH shared secret derivation...");
            const symmetricKey = await decryptKeyForMe(encKeyBytes, myKeys.privateKey, sellerPubBytes);
            console.log("✅ Symmetric Key decrypted successfully for buyer.");

            const encryptedCodeBytes = new Uint8Array(JSON.parse(box.encryptedCodeOnChain!));
            console.log("Raw encrypted code from chain (length):", encryptedCodeBytes.length);
            
            let ciphertextToDecrypt = encryptedCodeBytes;
            try {
                if (encryptedCodeBytes.length > 44) {
                    const { ciphertext, salt } = unpackCiphertextWithSalt(encryptedCodeBytes);
                    ciphertextToDecrypt = ciphertext;
                    console.log("Unpacked salt from on-chain payload:", Array.from(salt).slice(0, 8), "...");
                } else {
                    console.log("Payload length <= 44, assuming legacy format (no salt).");
                }
            } catch (e) {
                console.warn("Failed to unpack salt, falling back to full payload", e);
            }

            console.log("Attempting AES-GCM decryption of code...");
            const code = await decryptCode(ciphertextToDecrypt, symmetricKey);
            console.log("Decryption successful!");
            setDecryptedCode(code);
            setIsRevealed(true);
            setIsProcessing(false);
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Decryption Diagnostic Failure:", {
                message: err.message,
                name: err.name,
                stack: err.stack
            });
            showToast(`Decryption failed: ${err.name}`, "error");
            setIsProcessing(false);
        }
    };

    const handleConfirm = async () => {
        if (!repNftId || isProcessing) return;
        setIsProcessing(true);
        try {
            await finalizeBox(box.id, repNftId);
            localFinalize(box.id);
            showToast("Trade completed successfully!", "success");
            setIsProcessing(false);
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Finalization failed:", err);
            showToast(err.message || "Finalization failed", "error");
            setIsProcessing(false);
        }
    };

    const handleDispute = () => {
        setShowDisputeModal(true);
    };

    const confirmDispute = async () => {
        setShowDisputeModal(false);
        if (!repNftId || isProcessing) return;
        
        setIsProcessing(true);
        try {
            await disputeBox(box.id, repNftId);
            localDispute(box.id);
            showToast("Dispute initiated. Stakes burned.", "warning");
            setIsProcessing(false);
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Dispute failed:", err);
            showToast(err.message || "Dispute failed", "error");
            setIsProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (isProcessing) return;
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        setShowCancelModal(false);
        setIsProcessing(true);
        try {
            await localCancel(box.id);
            showToast("Listing canceled successfully", "info");
            setIsProcessing(false);
            navigate('/profile');
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Cancel failed:", err);
            showToast(err.message || "Cancellation failed", "error");
            setIsProcessing(false);
        }
    };

    const handleClaimRevealTimeout = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await claimRevealTimeout(box.id);
            localClaimTimeout(box.id);
            showToast("Claim successful! Refunded with bonus.", "success");
            setIsProcessing(false);
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Claim timeout failed:", err);
            showToast(err.message || "Failed to claim timeout", "error");
            setIsProcessing(false);
        }
    };

    const handleClaimAutoFinalize = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await claimAutoFinalize(box.id);
            localClaimAutoFinalize(box.id);
            showToast("Auto-finalize successful! Funds released.", "success");
            setIsProcessing(false);
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Claim auto-finalize failed:", err);
            showToast(err.message || "Failed to claim auto-finalize", "error");
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate('/profile')} className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Trade #{box.id.slice(0, 8)}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border
                                ${box.status === 'OPEN' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                    box.status === 'LOCKED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        box.status === 'REVEALED' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                            box.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                box.status === 'CANCELED' ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                                                    box.status === 'EXPIRED' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                    'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                {box.status}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {box.brand} • {(box.value / 1_000_000_000).toFixed(2)} IOTA
                            </span>
                        </div>
                    </div>
                </div>

                {/* Secret Code Section */}
                <div className="relative overflow-hidden rounded-3xl p-1"
                    style={{ background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.4), rgba(168, 85, 247, 0.4))' }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-[22px] p-8 text-center space-y-4">
                        <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                        <h2 className="text-xl text-gray-400 font-medium">Encrypted Gift Code</h2>

                        <div className="relative max-w-md mx-auto space-y-4">
                            {box.status === 'LOCKED' || box.status === 'REVEALED' || box.status === 'COMPLETED' ? (
                                <>
                                    <div className={`p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-2xl tracking-widest
                                        ${isRevealed && decryptedCode ? 'text-white' : 'text-gray-600 blur-sm select-none'}`}>
                                        {isRevealed && decryptedCode 
                                            ? decryptedCode 
                                            : "••••-••••-••••-••••"}
                                    </div>
                                    
                                    {isSeller && box.status === 'LOCKED' && !isRevealed && (
                                        <button
                                            onClick={handleRevealSeller}
                                            disabled={isProcessing}
                                            className="w-full py-3 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? "Processing..." : "🔑 Encrypt for Buyer & Reveal"}
                                        </button>
                                    )}

                                    {isBuyer && (box.status === 'REVEALED' || box.status === 'COMPLETED') && (
                                        <button
                                            onClick={handleDecryptBuyer}
                                            disabled={isProcessing}
                                            className={`w-full py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2
                                                ${box.status === 'COMPLETED' 
                                                    ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' 
                                                    : 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30'}`}
                                        >
                                            {isProcessing ? "Decrypting..." : decryptedCode ? (isRevealed ? "🙈 Hide Code" : "👁️ Show Code") : (box.status === 'COMPLETED' ? "👁️ View My Code" : "🔐 Decrypt with my Secret Key")}
                                        </button>
                                    )}
                                </>
                            ) : box.status === 'OPEN' ? (
                                <div className="p-4 rounded-xl bg-cyan-900/10 border border-cyan-500/20 text-cyan-500/80 font-bold tracking-wider">
                                    WAITING FOR BUYER
                                </div>
                            ) : box.status === 'CANCELED' ? (
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-500/30 text-slate-400 font-bold">
                                    LISTING REMOVED
                                </div>
                            ) : box.status === 'EXPIRED' ? (
                                <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-500/30 text-orange-400 font-bold flex flex-col items-center">
                                    <span>TIMED OUT - FUNDS REFUNDED</span>
                                    <span className="text-xs font-normal opacity-70 mt-1">
                                        Seller failed to reveal key in 72h.
                                    </span>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 font-bold">
                                    CODE BURNED / UNAVAILABLE
                                </div>
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-500">
                            {box.status === 'OPEN' 
                                ? "Waiting for someone to buy this card."
                                : box.status === 'LOCKED'
                                    ? isSeller ? "You must reveal the code from your wallet." : "Seller is preparing the code..."
                                    : box.status === 'REVEALED' 
                                        ? isBuyer ? "Verify the code. If it works, Release Funds." : "Buyer is verifying the code."
                                        : "Trade final state reached."}
                        </p>
                    </div>
                </div>
                
                {/* Trade Financials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4"
                >
                    {box.status === 'DISPUTED' ? (
                        <>
                            {/* DISPUTED - Show burned stakes */}
                            <div className="flex items-center gap-3 mb-2">
                                <Flame className="w-5 h-5 text-red-400" />
                                <h3 className="text-lg font-bold text-white">Burned Stakes</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="p-4 rounded-2xl bg-red-900/20 border border-red-500/30 space-y-3">
                                    <div className="flex justify-between items-center text-sm py-2 border-b border-red-500/20">
                                        <span className="text-gray-400">Seller Trust Deposit (100% of Value)</span>
                                        <span className="text-red-400 font-bold line-through">{(box.value / 1_000_000_000).toFixed(2)} IOTA</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm py-2 border-b border-red-500/20">
                                        <span className="text-gray-400">Buyer Trust Deposit (110% of Value)</span>
                                        <span className="text-red-400 font-bold line-through">{((box.value * 1.1) / 1_000_000_000).toFixed(2)} IOTA</span>
                                    </div>
                                    <div className="flex justify-between items-center text-md pt-2">
                                        <span className="text-white font-bold">Total Burned</span>
                                        <span className="text-red-500 font-black flex items-center gap-2">
                                            🔥 {((box.value * 2.1) / 1_000_000_000).toFixed(2)} IOTA
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 text-center italic">
                                    Both parties lost their trust deposits due to the dispute.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Normal transaction breakdown */}
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">Financial Breakdown</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                                    <span className="text-gray-400">Card Face Value</span>
                                    <span className="text-white font-bold">{(box.value / 1_000_000_000).toFixed(2)} IOTA</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                                    <span className="text-gray-400">Sale Price</span>
                                    <span className="text-cyan-400 font-bold">{(box.price / 1_000_000_000).toFixed(2)} IOTA</span>
                                </div>
                                
                                <div className="space-y-4 pt-2">
                                    <div className="p-4 rounded-2xl bg-black/30 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 italic">Protocol Maintenance Fee (1%)</span>
                                            <span className="text-purple-400 font-mono">- {((box.price * 0.01) / 1_000_000_000).toFixed(2)} IOTA</span>
                                        </div>
                                        <div className="flex justify-between items-center text-md pt-2 border-t border-white/10">
                                            <span className="text-white font-bold">{isSeller ? "Estimated Earnings" : "Seller Payout"}</span>
                                            <span className="text-green-400 font-black">
                                                {((box.price * 0.99) / 1_000_000_000).toFixed(2)} IOTA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* TIMERS */}
                
                {box.status === 'LOCKED' && box.lockedAt && (
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 flex flex-col items-center gap-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                             <Clock className="w-5 h-5 text-cyan-400" /> Reveal Deadline
                        </h3>
                        <CountdownTimer 
                            targetTime={box.lockedAt + TIMEOUT_MS} 
                            onExpire={() => setForceUpdate(n => n + 1)}
                            label="Seller has"
                        />
                        {isBuyer && (Date.now() > box.lockedAt + TIMEOUT_MS) && (
                            <button
                                onClick={handleClaimRevealTimeout}
                                disabled={isProcessing}
                                className="w-full py-3 rounded-xl bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 hover:bg-orange-500/30 transition-all"
                            >
                                {isProcessing ? "Processing..." : "💰 Claim Refund & Compensation"}
                            </button>
                        )}
                    </div>
                )}

                {box.status === 'REVEALED' && box.revealTimestamp && (
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 flex flex-col items-center gap-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                             <Clock className="w-5 h-5 text-green-400" /> Auto-Finalize Deadline
                        </h3>
                        <CountdownTimer 
                            targetTime={box.revealTimestamp + TIMEOUT_MS} 
                            onExpire={() => setForceUpdate(n => n + 1)}
                            label="Buyer has"
                        />
                         {isSeller && (Date.now() > box.revealTimestamp + TIMEOUT_MS) && (
                            <button
                                onClick={handleClaimAutoFinalize}
                                disabled={isProcessing}
                                className="w-full py-3 rounded-xl bg-green-500/20 text-green-400 font-bold border border-green-500/30 hover:bg-green-500/30 transition-all"
                            >
                                {isProcessing ? "Processing..." : "✅ Claim Auto-Finalize Funds"}
                            </button>
                        )}
                    </div>
                )}

                {/* Seller Actions (OPEN state) */}
                {isSeller && box.status === 'OPEN' && (
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-6 h-6 text-red-400" />
                            <h3 className="text-lg font-bold text-white">Manage Listing</h3>
                        </div>
                        <button
                            onClick={handleCancel}
                            disabled={isProcessing}
                            className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? "Processing..." : "🗑️ Cancel Listing & Refund Stake"}
                        </button>
                    </div>
                )}

                {/* Buyer Actions (REVEALED state) */}
                {isBuyer && box.status === 'REVEALED' && (
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {/* CONFIRM */}
                        <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                                <h3 className="text-lg font-bold text-white">Code works!</h3>
                            </div>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing || !repNftId}
                                className={`w-full py-3 rounded-xl font-bold border transition-all mt-auto
                                    ${!repNftId ? 'bg-slate-700 text-gray-500 border-white/5 opacity-50' : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'}`}
                            >
                                {isProcessing ? "Processing..." : "✅ Release Funds"}
                            </button>
                        </div>

                        {/* DISPUTE */}
                        <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-2">
                                <Flame className="w-6 h-6 text-red-400" />
                                <h3 className="text-lg font-bold text-white">Code is invalid</h3>
                            </div>
                            <button
                                onClick={handleDispute}
                                disabled={isProcessing}
                                className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all mt-auto"
                            >
                                {isProcessing ? "Processing..." : "🔥 Burn Deposits (Dispute)"}
                            </button>
                        </div>
                    </div>
                )}

                {/* MODALS */}
                {showDisputeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDisputeModal(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Flame className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Serious Warning ⚠️</h3>
                                <p className="text-sm text-red-200">
                                    Burning trust deposits is irreversible. Both you and the seller will lose your stakes.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => setShowDisputeModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold">Cancel</button>
                                    <button onClick={confirmDispute} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">🔥 Yes, Burn Everything</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                    <Trash2 className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Cancel Listing?</h3>
                                <p className="text-sm text-gray-400">
                                    Your trust deposit will be returned to your wallet.
                                </p>
                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold">No, keep it</button>
                                    <button onClick={confirmCancel} className="flex-1 py-3 rounded-xl bg-cyan-500 text-black font-bold">Yes, Cancel Listing</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TradeDetail;
