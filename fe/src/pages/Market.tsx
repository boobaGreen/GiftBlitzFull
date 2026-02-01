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
        <div className="space-y-6 pb-24">
            {/* Search & Controls Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Secret Boxes..."
                        className="w-full bg-slate-800/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all"
                    />
                </div>

                {/* Filters Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all ${showFilters
                        ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                        : 'bg-slate-800/60 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="text-sm font-medium">Filters</span>
                </button>

                {/* Safe Buy Toggle & Info */}
                <div className="relative flex items-center">
                    <button
                        onClick={() => setShowSafeOnly(!showSafeOnly)}
                        className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${showSafeOnly
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                            : 'bg-slate-800/60 border-white/10 text-gray-400 hover:border-white/20'
                            }`}
                    >
                        <Shield className={`w-5 h-5 ${showSafeOnly ? 'fill-cyan-400/20' : ''}`} />
                        <div className="text-left">
                            <div className="text-xs font-bold uppercase tracking-wider">Unlocked</div>
                            <div className="text-[10px] opacity-70">My Limit: €{maxBuyValue}</div>
                        </div>
                    </button>

                    {/* Info Icon */}
                    <button
                        className="ml-2 p-2 text-gray-500 hover:text-cyan-400 transition-colors"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(!showTooltip);
                        }}
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* Modern Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-3 w-72 p-5 rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl border border-cyan-500/20 shadow-2xl z-50"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="p-2 rounded-lg bg-cyan-500/10">
                                        <Shield className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Anti-Griefing System</h4>
                                        <p className="text-[10px] text-cyan-400 font-mono uppercase">Protection Active</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                                    To prevent spam and scams, new users have a <strong>Purchase Limit</strong>.
                                </p>
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white">Your Level:</span>
                                        <span className="text-cyan-400 font-bold">
                                            {maxBuyValue <= 30 ? 'Newcomer' : maxBuyValue <= 100 ? 'Member' : 'Veteran'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white">Max Buy:</span>
                                        <span className="text-gray-300">€{maxBuyValue}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-3 italic">
                                    Complete successful trades to level up and unlock higher limits.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Expanded Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 rounded-2xl bg-slate-800/40 border border-white/5 space-y-4">
                            {/* Value Range */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                                    Card Value
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {VALUE_RANGES.map((range, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setValueRange(idx)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${valueRange === idx
                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                : 'bg-black/20 text-gray-400 border border-white/5 hover:bg-black/30'
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                                    Sort By
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${sortBy === option.value
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-black/20 text-gray-400 border border-white/5 hover:bg-black/30'
                                                }`}
                                        >
                                            {option.icon}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Category Filter Chips */}
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all text-center ${selectedCategory === null
                        ? 'bg-white text-black'
                        : 'bg-slate-800/60 text-gray-400 border border-white/5 hover:bg-slate-700'
                        }`}
                >
                    All
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        className={`flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-medium transition-all ${selectedCategory === cat.id
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-slate-800/60 text-gray-400 border border-white/5 hover:bg-slate-700'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span className={selectedCategory === cat.id ? '' : 'hidden sm:inline'}>{cat.label}</span>
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
