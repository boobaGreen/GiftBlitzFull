import React, { useState, useMemo } from 'react';
import { useMarket } from '../hooks/useMarket';
import BoxCard from '../components/BoxCard';
import { Search, Package, Plus, Shield, SlidersHorizontal, ArrowUpDown, TrendingDown, Clock, Euro, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, getBrand } from '../data/giftCards';
import { getMaxBuyValue } from '../types';

type SortOption = 'discount' | 'value_asc' | 'value_desc' | 'recent';

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'discount', label: 'Best Discount', icon: <TrendingDown className="w-4 h-4" /> },
    { value: 'value_asc', label: 'Value: Low → High', icon: <Euro className="w-4 h-4" /> },
    { value: 'value_desc', label: 'Value: High → Low', icon: <Euro className="w-4 h-4" /> },
    { value: 'recent', label: 'Most Recent', icon: <Clock className="w-4 h-4" /> },
];

const VALUE_RANGES = [
    { label: 'All', min: 0, max: Infinity },
    { label: '€0-25', min: 0, max: 25 },
    { label: '€25-50', min: 25, max: 50 },
    { label: '€50-100', min: 50, max: 100 },
    { label: '€100-200', min: 100, max: 200 },
];

const Market: React.FC = () => {
    const { boxes, user } = useMarket();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showSafeOnly, setShowSafeOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('discount');
    const [valueRange, setValueRange] = useState(0); // Index into VALUE_RANGES
    const [showFilters, setShowFilters] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const maxBuyValue = getMaxBuyValue(user.tradeCount);

    const filteredAndSortedBoxes = useMemo(() => {
        const range = VALUE_RANGES[valueRange];

        // Filter
        const filtered = boxes.filter(b => {
            if (b.status !== 'OPEN') return false;
            if (searchTerm && !b.brand.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (selectedCategory) {
                const brand = getBrand(b.brand);
                if (brand.category !== selectedCategory) return false;
            }
            if (showSafeOnly && b.price > (maxBuyValue * 1000000000)) return false;
            const valueEur = b.value / 1000000000;
            if (valueEur < range.min || valueEur > range.max) return false;
            return true;
        });

        // Sort
        return filtered.sort((a, b) => {
            const discountA = ((a.value - a.price) / a.value) * 100;
            const discountB = ((b.value - b.price) / b.value) * 100;

            switch (sortBy) {
                case 'discount':
                    return discountB - discountA; // Highest discount first
                case 'value_asc':
                    return a.value - b.value;
                case 'value_desc':
                    return b.value - a.value;
                case 'recent':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });
    }, [boxes, searchTerm, selectedCategory, showSafeOnly, sortBy, valueRange, maxBuyValue]);

    return (
        <div className="relative space-y-12 pb-24 min-h-screen">
            {/* Aurora Background Glow - Subdued for functional pages */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] animate-pulse" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Premium Header Section */}
            <div className="space-y-6">
                 <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">EXPLORE <span className="text-cyan-400">MARKET</span></h1>
                    <p className="text-gray-500 font-medium">Secure, anonymous, and instant gift card swaps.</p>
                </div>

                {/* Search & Controls Container - Glassmorphic */}
                <div className="p-2 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-2xl shadow-2xl">
                    <div className="flex flex-col lg:flex-row gap-2">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by brand (e.g. Amazon, Steam)..."
                                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.05)] transition-all font-medium"
                            />
                        </div>

                        <div className="flex gap-2">
                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${showFilters
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                    : 'bg-slate-950/40 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                    }`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Filters</span>
                            </button>

                            {/* Safe Buy Toggle */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSafeOnly(!showSafeOnly)}
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${showSafeOnly
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                        : 'bg-slate-950/40 border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                        }`}
                                >
                                    <Shield className={`w-4 h-4 ${showSafeOnly ? 'fill-cyan-400/20' : ''}`} />
                                    <div className="text-left hidden sm:block">
                                        <div className="text-[10px] font-black uppercase tracking-widest">Safe Buy</div>
                                        <div className="text-[9px] opacity-50 font-bold">Max €{maxBuyValue}</div>
                                    </div>
                                    <HelpCircle className="w-3 h-3 opacity-30" />
                                </button>

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {showTooltip && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-4 w-72 p-6 rounded-3xl bg-slate-950 border border-white/10 shadow-3xl z-50 backdrop-blur-3xl"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 rounded-xl bg-cyan-500/10">
                                                    <Shield className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-wider">Trading Limits</h4>
                                            </div>
                                            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                                                To prevent fraud, new accounts have a purchase limit. Complete successful trades to unlock higher tiers.
                                            </p>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                                    <span className="text-gray-500">Current Max:</span>
                                                    <span className="text-cyan-400">€{maxBuyValue}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel Expansion */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border-t border-white/5 mt-2"
                            >
                                <div className="p-6 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 block">Card Value Range</label>
                                        <div className="flex flex-wrap gap-2">
                                            {VALUE_RANGES.map((range, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setValueRange(idx)}
                                                    className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all border ${valueRange === idx
                                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 block">Sort Protocol</label>
                                        <div className="flex flex-wrap gap-2">
                                            {SORT_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setSortBy(option.value)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all border ${sortBy === option.value
                                                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    {option.icon}
                                                    <span className="uppercase tracking-widest">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Category Filter Chips - Professional Grid */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedCategory === null
                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                        }`}
                >
                    All Assets
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border-cyan-500/40 shadow-[0_00_20px_rgba(6,182,212,0.1)]'
                            : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Results Count & Active Filters */}
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                <span className="text-gray-500">
                    {filteredAndSortedBoxes.length} card{filteredAndSortedBoxes.length !== 1 ? 's' : ''} found
                </span>
                <div className="flex items-center gap-4">
                    {/* Value Range indicator */}
                    {valueRange !== 0 && (
                        <div className="flex items-center gap-1 text-cyan-400">
                            <Euro className="w-3 h-3" />
                            <span className="text-xs">{VALUE_RANGES[valueRange].label}</span>
                        </div>
                    )}
                    {/* Sort indicator */}
                    <div className="flex items-center gap-1 text-gray-400">
                        <ArrowUpDown className="w-3 h-3" />
                        <span className="text-xs">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            {filteredAndSortedBoxes.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 mb-2">No gift cards found.</p>
                    <p className="text-gray-600 text-sm">
                        {showSafeOnly
                            ? "Try turning off 'Safe Buy' to see higher value cards."
                            : "Try adjusting your filters or be the first to create a GiftBox!"}
                    </p>
                    <Link to="/create" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                        <Plus className="w-4 h-4" />
                        Create Box
                    </Link>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    key={`${selectedCategory}-${searchTerm}-${showSafeOnly}-${sortBy}-${valueRange}`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                    }}
                >
                    {filteredAndSortedBoxes.map((box) => (
                        <motion.div
                            key={box.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <BoxCard 
                                box={box} 
                                onClick={() => {
                                    const path = box.seller === user.address ? `/trade/${box.id}` : `/buy/${box.id}`;
                                    navigate(path);
                                }} 
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Floating Action Button */}
            <Link
                to="/create"
                className="fixed bottom-24 right-6 p-4 rounded-full transition-all hover:scale-110 z-50"
                style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)',
                }}
            >
                <Plus className="w-6 h-6 text-white" />
            </Link>
        </div>
    );
};

export default Market;
