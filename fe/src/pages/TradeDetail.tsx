import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/useMarket';
import { Lock, CheckCircle, ArrowRight, Flame, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
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
    const [isRevealed, setIsRevealed] = useState(false);
    const [decryptedCode, setDecryptedCode] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
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
            setIsProcessing(false);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            alert("Reveal failed: " + errMsg);
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
            // 1. Fetch Seller's Public Key from their profile
            const sellerNft = await getReputationNFT(box.seller);
            if (!sellerNft || !sellerNft.publicKey) {
                throw new Error("Seller encryption key not found");
            }

            // 2. Fetch my (buyer) keys
            const myKeys = await getEncryptionKeyPair(user.address);

            // 3. Decrypt Symmetric Key
            const encKeyBytes = new Uint8Array(JSON.parse(box.encryptedKeyOnChain));
            const sellerPubBytes = new Uint8Array(JSON.parse(sellerNft.publicKey));
            
            const symmetricKey = await decryptKeyForMe(encKeyBytes, myKeys.privateKey, sellerPubBytes);

            // 5. Decrypt the Gift Code
            console.log("5. Decrypting code with retrieved symmetric key...");
            const encryptedCodeBytes = new Uint8Array(JSON.parse(box.encryptedCodeOnChain!));
            
            // Handle Salt+Ciphertext format
            let ciphertextToDecrypt = encryptedCodeBytes;
            try {
                // If it's the new format (Salt + IV + Ciphertext), length should be > 32 + 12
                if (encryptedCodeBytes.length > 44) {
                    const { ciphertext } = unpackCiphertextWithSalt(encryptedCodeBytes);
                    ciphertextToDecrypt = ciphertext;
                    console.log("Detected Salted Ciphertext, unpacking...");
                }
            } catch (e) {
                console.warn("Failed to unpack salt, assuming legacy format or raw ciphertext", e);
            }

            const code = await decryptCode(ciphertextToDecrypt, symmetricKey);
            console.log("6. Decryption successful!");
            setDecryptedCode(code);
            setIsRevealed(true);
            setIsProcessing(false);
        } catch (error: unknown) {
            console.error("Decryption failed:", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert("Decryption failed: " + errMsg);
            setIsProcessing(false);
        }
    };

    const handleConfirm = async () => {
        if (!repNftId || isProcessing) return;
        setIsProcessing(true);
        try {
            await finalizeBox(box.id, repNftId);
            localFinalize(box.id);
            setIsProcessing(false);
        } catch (error) {
            console.error("Finalization failed:", error);
            setIsProcessing(false);
        }
    };

    const handleDispute = () => {
        setShowDisputeModal(true);
    };

    const confirmDispute = async () => {
        if (!repNftId || showDisputeModal) setShowDisputeModal(false);
        if (!repNftId || isProcessing) return;
        
        setIsProcessing(true);
        try {
            await disputeBox(box.id, repNftId);
            localDispute(box.id);
            setIsProcessing(false);
        } catch (error) {
            console.error("Dispute failed:", error);
            setIsProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (isProcessing) return;
        if (!window.confirm("Are you sure you want to cancel this listing? Your trust deposit will be returned.")) return;

        setIsProcessing(true);
        try {
            await localCancel(box.id);
            setIsProcessing(false);
            navigate('/profile');
        } catch (error) {
            console.error("Cancel failed:", error);
            setIsProcessing(false);
        }
    };

    const handleClaimRevealTimeout = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await claimRevealTimeout(box.id);
            localClaimTimeout(box.id);
            setIsProcessing(false);
        } catch (error) {
            console.error("Claim timeout failed:", error);
            alert("Failed to claim timeout. Check console.");
            setIsProcessing(false);
        }
    };

    const handleClaimAutoFinalize = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await claimAutoFinalize(box.id);
            localClaimAutoFinalize(box.id);
            setIsProcessing(false);
        } catch (error) {
            console.error("Claim auto-finalize failed:", error);
            alert("Failed to claim auto-finalize. Check console.");
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

                {/* Secret Code Section (The Core Value) */}
                <div className="relative overflow-hidden rounded-3xl p-1"
                    style={{ background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.4), rgba(168, 85, 247, 0.4))' }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-[22px] p-8 text-center space-y-4">
                        <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                        <h2 className="text-xl text-gray-400 font-medium">Encrypted Gift Code</h2>

                                {box.status === 'LOCKED' || box.status === 'REVEALED' || box.status === 'COMPLETED' ? (
                                    <div className="relative max-w-md mx-auto space-y-4">
                                        <div className={`p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-2xl tracking-widest
                                            ${(isRevealed || box.status === 'COMPLETED') ? 'text-white' : 'text-gray-600 blur-sm select-none'}`}>
                                            {(isRevealed || box.status === 'COMPLETED') 
                                                ? (decryptedCode || "CONFIRMED") 
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

                                        {isBuyer && box.status === 'REVEALED' && (
                                            <button
                                                onClick={handleDecryptBuyer}
                                                disabled={isProcessing}
                                                className="w-full py-3 rounded-xl bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isProcessing ? "Decrypting..." : decryptedCode ? (isRevealed ? "🙈 Hide Code" : "👁️ Show Code") : "🔐 Decrypt with my Secret Key"}
                                            </button>
                                        )}
                                    </div>
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
                                            Buyer compensated.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 font-bold">
                                        CODE BURNED / UNAVAILABLE
                                    </div>
                                )}

                                <p className="text-sm text-gray-500">
                                    {box.status === 'OPEN' 
                                        ? "This card is active on the market. Once someone buys it, you will need to reveal the code."
                                        : box.status === 'LOCKED'
                                            ? isSeller ? "You must reveal the code from your wallet to proceed." : "Seller is preparing the code..."
                                            : box.status === 'CANCELED' 
                                                ? "This listing was canceled by the seller." 
                                                : isBuyer 
                                                    ? "Verify this code on the merchant's site. If it works, Confirm & Release Funds." 
                                                    : "The buyer has access to the code and is currently verifying it."}
                                </p>
                    </div>
                </div>

                {/* TIMERS & TIMEOUT ACTIONS */}
                
                {/* 1. Reveal Timeout (Buyer) - LOCKED state */}
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
                            <div className="w-full text-center space-y-2">
                                <p className="text-red-400 text-sm">Seller missed the deadline.</p>
                                <button
                                    onClick={handleClaimRevealTimeout}
                                    disabled={isProcessing}
                                    className="w-full py-3 rounded-xl bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 hover:bg-orange-500/30 transition-all"
                                >
                                    {isProcessing ? "Processing..." : "💰 Claim Refund & Compensation"}
                                </button>
                            </div>
                        )}
                        {!isBuyer && (Date.now() > box.lockedAt + TIMEOUT_MS) && isSeller && (
                            <p className="text-red-400 text-sm">You missed the reveal deadline. Buyer can claim refund.</p>
                        )}
                    </div>
                )}

                {/* 2. Auto-Finalize Timeout (Seller) - REVEALED state */}
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
                         {(Date.now() > box.revealTimestamp + TIMEOUT_MS) && (
                            <div className="w-full text-center space-y-2">
                                <p className="text-green-400 text-sm">Buyer silence period ended.</p>
                                <button
                                    onClick={handleClaimAutoFinalize}
                                    disabled={isProcessing}
                                    className="w-full py-3 rounded-xl bg-green-500/20 text-green-400 font-bold border border-green-500/30 hover:bg-green-500/30 transition-all"
                                >
                                    {isProcessing ? "Processing..." : "✅ Claim Auto-Finalize Funds"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Zone (Only for Buyer when LOCKED) */}
                {isSeller && box.status === 'OPEN' && (
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-6 h-6 text-red-400" />
                            <h3 className="text-lg font-bold text-white">Manage Listing</h3>
                        </div>
                        <p className="text-gray-400 text-sm">
                            This card is still on the market. You can cancel the listing and recover your trust deposit ({(box.price / 1_000_000_000).toFixed(2)} IOTA).
                        </p>
                        <button
                            onClick={handleCancel}
                            disabled={isProcessing}
                            className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isProcessing ? "Processing..." : "🗑️ Cancel Listing & Refund Stake"}
                        </button>
                    </div>
                )}

                {/* Action Zone (Only for Buyer when REVEALED) */}
                {isBuyer && box.status === 'REVEALED' && (
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {/* CONFIRM - Happy Path */}
                        {/* CONFIRM - Happy Path */}
                        <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                                <h3 className="text-lg font-bold text-white">Code works!</h3>
                            </div>

                            <div className="bg-black/30 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-white/5">
                                        <tr className="bg-cyan-500/10">
                                            <td className="p-3 text-cyan-200 font-medium">Gift Card Value</td>
                                            <td className="p-3 text-right font-bold text-cyan-400">{(box.value / 1_000_000_000).toFixed(2)} IOTA</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-gray-400">Buying Price</td>
                                            <td className="p-3 text-right text-gray-300">-{(box.price / 1_000_000_000).toFixed(2)} IOTA</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-gray-400">Seller Trust Deposit</td>
                                            <td className="p-3 text-right text-gray-500">Returned to Seller</td>
                                        </tr>
                                        <tr className="bg-green-500/10">
                                            <td className="p-3 text-green-300 font-medium">Your Trust Deposit</td>
                                            <td className="p-3 text-right font-bold text-green-400">+{(box.price / 1_000_000_000).toFixed(2)} IOTA <span className="text-[10px] font-normal opacity-75">(Returned)</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-gray-400 text-xs text-center flex-grow">
                                Confirming validates the trade and releases funds to the seller.
                            </p>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing || !repNftId}
                                className={`w-full py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 mt-auto
                                    ${!repNftId ? 'bg-slate-700 text-gray-500 border-white/5 opacity-50' : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'}`}
                            >
                                {!repNftId ? "Initialize Profile First" : isProcessing ? "Processing..." : "✅ Release Funds"}
                            </button>
                        </div>

                        {/* DISPUTE - Burn Path */}
                        {/* DISPUTE - Burn Path */}
                        <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 space-y-4 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-2">
                                <Flame className="w-6 h-6 text-red-400" />
                                <h3 className="text-lg font-bold text-white">Code is invalid</h3>
                            </div>

                            <div className="bg-black/30 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-white/5">
                                        <tr>
                                            <td className="p-3 text-gray-400">Gift Card Value</td>
                                            <td className="p-3 text-right text-gray-500 line-through">{(box.value / 1_000_000_000).toFixed(2)} IOTA</td>
                                        </tr>
                                        <tr className="bg-red-500/10">
                                            <td className="p-3 text-red-300 font-bold">YOUR TRUST DEPOSIT</td>
                                            <td className="p-3 text-right font-bold text-red-400">-{(box.price / 1_000_000_000).toFixed(2)} IOTA <span className="text-[10px] font-normal opacity-75">(BURNED)</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-gray-400">Seller Trust Deposit</td>
                                            <td className="p-3 text-right text-orange-400">-{(box.price / 1_000_000_000).toFixed(2)} IOTA <span className="text-[10px] font-normal text-gray-500">(BURNED)</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 text-gray-400">Buying Price</td>
                                            <td className="p-3 text-right text-green-400">+{(box.price / 1_000_000_000).toFixed(2)} IOTA <span className="text-[10px] font-normal text-gray-500">(REFUND)</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-gray-400 text-xs text-center flex-grow">
                                Only use this if the code is truly invalid. <span className="text-red-400">Irreversible.</span>
                            </p>
                            <button
                                onClick={handleDispute}
                                disabled={isProcessing}
                                className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 mt-auto"
                            >
                                {isProcessing ? "Processing..." : "🔥 Burn Trust Deposits (Dispute)"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Result Message for Completed/Disputed */}
                {box.status === 'COMPLETED' && (
                    <div className="p-6 rounded-3xl bg-green-500/10 border border-green-500/20 text-center">
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Trade Successful! 🎉</h3>
                        <p className="text-green-300">Funds released. Trust Deposits returned. Reputation increased.</p>
                    </div>
                )}
                {box.status === 'CANCELED' && (
                    <div className="p-6 rounded-3xl bg-slate-800/50 border border-white/5 text-center">
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">Listing Canceled</h3>
                        <p className="text-gray-500">The card was removed from the market and the trust deposit was refunded to the seller.</p>
                    </div>
                )}
                {box.status === 'EXPIRED' && (
                    <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-center">
                        <h3 className="text-2xl font-bold text-orange-400 mb-2">Trade Expired ⌛</h3>
                        <p className="text-orange-300">Seller failed to reveal time. Funds refunded to buyer with compensation.</p>
                    </div>
                )}
                {box.status === 'DISPUTED' && (
                    <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
                        <h3 className="text-2xl font-bold text-red-400 mb-2">Trade Disputed (Burned) 🔥</h3>
                        <p className="text-red-300">Both trust deposits verified destroyed. Price refunded to buyer.</p>
                    </div>
                )}

                {/* DISPUTE MODAL */}
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

                                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-left space-y-3 text-sm">
                                    <p className="text-red-200">
                                        Are you sure you want to <strong>BURN</strong> the Trust Deposits?
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-red-300/80">
                                        <li>You will LOSE your entire Trust Deposit ({(box.price / 1_000_000_000).toFixed(2)} IOTA).</li>
                                        <li>Seller will LOSE their entire Trust Deposit ({(box.price / 1_000_000_000).toFixed(2)} IOTA).</li>
                                        <li>Your <strong>Reliability Score</strong> will be reset to 0 (Cap Reset).</li>
                                        <li>This action is <strong>IRREVERSIBLE</strong>.</li>
                                    </ul>
                                </div>

                                <p className="text-gray-400 text-xs">
                                    This creates a financial loss for YOU to prevent the seller from profiting.
                                    Only proceed if the code is truly invalid. Use this responsibly.
                                </p>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowDisputeModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDispute}
                                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                                    >
                                        🔥 Yes, Burn Everything
                                    </button>
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
