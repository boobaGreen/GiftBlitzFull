import React from 'react';
import { Shield, Key, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncIdentityModalProps {
    isOpen: boolean;
    onSync: () => Promise<void>;
    onClose: () => void;
    isSyncing: boolean;
}

const SyncIdentityModal: React.FC<SyncIdentityModalProps> = ({ isOpen, onSync, onClose, isSyncing }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-cyan-500/30 p-8 shadow-2xl"
                    >
                        {/* Background Pulse */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative text-center">
                            <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                                <Shield className="w-10 h-10 text-cyan-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Recover Your Identity</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                We've detected that you have an active profile on-chain, but your browser's security keys are missing or out of sync. 
                                <br/><br/>
                                To safely access your gift codes and trades, we need to recover your original keys from the blockchain vault.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onSync}
                                    disabled={isSyncing}
                                    className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-extrabold text-base hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 group"
                                >
                                    {isSyncing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Restoring Keys...
                                        </>
                                    ) : (
                                        <>
                                            <Key className="w-5 h-5" />
                                            Sign to Restore Identity
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    disabled={isSyncing}
                                    className="w-full py-3 rounded-xl bg-transparent text-gray-500 font-medium text-sm hover:text-gray-300 transition-colors"
                                >
                                    Remind me later
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] text-gray-500">
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> E2E Encrypted</span>
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No Servers</span>
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pure P2P</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SyncIdentityModal;
