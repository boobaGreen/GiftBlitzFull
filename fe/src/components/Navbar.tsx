import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarket } from '../hooks/useMarket';
import { getMaxBuyValue } from '../types';
import { ConnectButton, useCurrentAccount } from '@iota/dapp-kit';

// Trade count based tiers
const TRADE_TIER_BADGES = {
    30: { name: 'Newcomer', icon: '🔵', color: 'text-blue-400', bg: 'bg-blue-500/20', maxBuy: 30 },
    50: { name: 'Member', icon: '🟢', color: 'text-green-400', bg: 'bg-green-500/20', maxBuy: 50 },
    100: { name: 'Trusted', icon: '🟣', color: 'text-purple-400', bg: 'bg-purple-500/20', maxBuy: 100 },
    200: { name: 'Veteran', icon: '🟡', color: 'text-yellow-400', bg: 'bg-yellow-500/20', maxBuy: 200 },
};

function getTierBadge(tradeCount: number) {
    const maxBuy = getMaxBuyValue(tradeCount);
    return TRADE_TIER_BADGES[maxBuy as keyof typeof TRADE_TIER_BADGES] || TRADE_TIER_BADGES[30];
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const { user } = useMarket();
    const account = useCurrentAccount();

    const isConnected = !!account;
    const tierBadge = getTierBadge(user.tradeCount);

    const navLinks = [
        { name: 'Market', path: '/market' },
        { name: 'Sell Card', path: '/create' },
        { name: 'My Profile', path: '/profile' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl group-hover:scale-105 transition-transform">
                        <img src="/giftblitz.svg" alt="GiftBlitz" className="w-10 h-10" />
                        <div className="absolute inset-0 bg-primary-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Gift<span className="text-primary-400">Blitz</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(link.path)
                                ? 'text-white bg-white/10 shadow-inner border border-white/5'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full shadow-[0_0_8px_rgba(0,243,255,0.8)]"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* User / Wallet Section */}
                <div className="hidden md:flex items-center gap-3">
                    <ConnectButton />
                    {isConnected && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1A1F2B] border border-white/5 hover:border-cyan-500/30 transition-all"
                            >
                                {/* Level Badge */}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${tierBadge.bg} ${tierBadge.color}`}>
                                    {tierBadge.icon} {tierBadge.name}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full right-0 mt-2 w-48 glass rounded-xl p-2 border border-white/10"
                                    >
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 text-sm"
                                        >
                                            My Profile
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/5"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-24 left-4 right-4 glass rounded-3xl p-4 md:hidden flex flex-col gap-2 origin-top shadow-2xl z-50 border border-white/10"
                    >
                        {/* Mobile User Info */}
                        {isConnected && (
                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${tierBadge.bg} ${tierBadge.color}`}>
                                        {tierBadge.icon} {tierBadge.name}
                                    </span>
                                    <span className="text-white text-sm">{user.address.slice(0, 6)}...</span>
                                </div>
                                <span className="text-cyan-400 text-sm font-bold">{user.balance} USDC</span>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive(link.path)
                                    ? 'bg-primary-500/10 border border-primary-500/20 text-primary-400'
                                    : 'hover:bg-white/5 text-gray-300'
                                    }`}
                            >
                                <span className="font-medium">{link.name}</span>
                                {isActive(link.path) && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        ))}
                        <div className="h-px bg-white/5 my-2" />
                        {isConnected ? (
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-400 hover:bg-red-500/10">
                                <LogOut className="w-5 h-5" />
                                Disconnect
                            </button>
                        ) : (
                            <button className="w-full btn-primary py-3 rounded-xl justify-center font-bold">
                                <Wallet className="w-5 h-5 mr-2" /> Connect Wallet
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
