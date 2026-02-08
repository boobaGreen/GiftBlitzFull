import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Shield,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="pb-20">
      {/* HERO SECTION - Minimum Noise, Maximum Impact */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            GiftBlitz MVP Live
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-none">
            Turn Unused Cards <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Into Liquid Cash.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            The first trustless marketplace secured by Game Theory and IOTA
            Smart Contracts. No middleman. No scams. Just code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/market"
              className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-xl overflow-hidden hover:scale-105 transition-transform"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Market{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/create"
              className="px-8 py-4 bg-white/5 text-white text-lg font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              Sell Gift Card
            </Link>
          </div>
        </motion.div>
      </section>

      {/* THE PROBLEM - VISUAL INFOGRAPHIC */}
      <section className="py-24 bg-black relative border-y border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/20">
              The Status Quo is Broken
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Gift Cards Suck (Today).
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              The current market is fundamentally flawed. It's either unsafe,
              expensive, or wasteful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* PAIN 1: TRUST GAP */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#1a0505] p-1 rounded-3xl border border-red-900/50 hover:border-red-500/50 transition-colors group"
            >
              <div className="h-full bg-black/40 rounded-[20px] p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-100 mb-2">
                  The Trust Dilemma
                </h3>
                <p className="text-red-200/60 text-sm leading-relaxed mb-6">
                  "Who sends first?" <br />
                  If I send the code, you might vanish. If I pay first, you
                  might send a used code.
                </p>
                <div className="mt-auto w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-xs font-bold text-red-400 uppercase">
                    Risk Level
                  </div>
                  <div className="text-2xl font-black text-white">CRITICAL</div>
                </div>
              </div>
            </motion.div>

            {/* PAIN 2: BILLIONS LOST */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a0505] p-1 rounded-3xl border border-red-900/50 hover:border-red-500/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-full bg-black/40 rounded-[20px] p-8 flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-red-500 rotate-180" />
                </div>
                <h3 className="text-xl font-bold text-red-100 mb-2">
                  Trapped Value
                </h3>
                <p className="text-red-200/60 text-sm leading-relaxed mb-6">
                  Unused cards collect dust in drawers because liquidating them
                  is too hard.
                </p>
                <div className="mt-auto w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-xs font-bold text-red-400 uppercase">
                    Global Annual Loss
                  </div>
                  <div className="text-2xl font-black text-white">
                    $23 Billion
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PAIN 3: MIDDLEMAN TAX */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a0505] p-1 rounded-3xl border border-red-900/50 hover:border-red-500/50 transition-colors group"
            >
              <div className="h-full bg-black/40 rounded-[20px] p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute top-10 right-10 rotate-12">
                  <div className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded rotate-12 shadow-lg">
                    SCAM?
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-100 mb-2">
                  The Middleman Tax
                </h3>
                <p className="text-red-200/60 text-sm leading-relaxed mb-6">
                  Safe sites charge 30%+ fees. P2P sites are wild west
                  minefields of scammers.
                </p>
                <div className="mt-auto w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-xs font-bold text-red-400 uppercase">
                    Avg. Platform Fee
                  </div>
                  <div className="text-2xl font-black text-white">~30%</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE SOLUTION - IOTA Architecture */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-900/10 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              The Web3 Solution
            </h2>
            <p className="text-xl text-gray-400">
              Powered by IOTA. Secured by Math.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* PILLAR 1: TOKENIZATION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Tokenization
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Your reputation is a <b>Soulbound NFT</b>. It can't be bought,
                sold, or faked. It proves you are trustworthy on-chain.
              </p>
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                Reputation NFT
              </span>
            </motion.div>

            {/* PILLAR 2: NOTARIZATION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Notarization
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Every trade step is an immutable event. The blockchain is the
                ultimate judge, creating a perfect audit trail.
              </p>
              <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">
                Immutable History
              </span>
            </motion.div>

            {/* PILLAR 3: SMART ESCROW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Smart Escrow
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                <b>Dual-Deposit Game Theory</b>. Seller deposits 100% Face
                Value. Buyer deposits 110% Value. Cheating burns both.
              </p>
              <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                Trust Deposits
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROGRESSION SYSTEM - Anti-Griefing & Tiers */}
      <section className="py-24 relative bg-slate-900/50 border-y border-white/5 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg backdrop-blur-md">
              <Shield className="w-3 h-3" /> Anti-Griefing System
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Earn Trust. Level Up.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Your <b>Soulbound Reputation NFT</b> is your passport. It records
              your trading history on-chain. Real reliability unlocks real
              value.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative max-w-7xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-700 via-cyan-900 to-purple-900 z-0" />

            {/* TIER 1: Newcomer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 group"
            >
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="relative h-full bg-[#0f172a] p-1 rounded-3xl border border-white/10 group-hover:border-blue-500/30 transition-colors shadow-2xl">
                <div className="h-full bg-slate-900/50 rounded-[20px] p-6 flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-white">Newcomer</h3>
                    <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center border border-blue-500/20 text-blue-400">
                      1
                    </div>
                  </div>

                  {/* NFT Data Block */}
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs space-y-3 mb-6">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">status</span>
                      <span className="text-blue-400">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">trades</span>
                      <span className="text-white">0 - 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">volume</span>
                      <span className="text-white">€0 - €90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">disputes</span>
                      <span className="text-green-400">0</span>
                    </div>
                  </div>

                  {/* Benefit */}
                  <div className="mt-auto">
                    <div className="text-[10px] text-blue-300/70 uppercase tracking-widest mb-1">
                      Current Limit
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        €30
                      </span>
                      <span className="text-sm text-gray-500">/ trade</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TIER 2: Verified (Formerly Member) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative z-10 group"
            >
              <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-xl group-hover:bg-cyan-500/20 transition-colors" />
              <div className="relative h-full bg-[#0f172a] p-1 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-shadow">
                <div className="h-full bg-slate-900/50 rounded-[20px] p-6 flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-white">Verified</h3>
                    <div className="w-8 h-8 rounded-lg bg-cyan-900/30 flex items-center justify-center border border-cyan-500/20 text-cyan-400 font-bold text-sm">
                      2
                    </div>
                  </div>

                  {/* NFT Data Block */}
                  <div className="bg-black/40 rounded-xl p-4 border border-cyan-500/20 font-mono text-[10px] space-y-3 mb-6 relative overflow-hidden">
                    <div className="flex justify-between border-b border-white/5 pb-2 relative z-10">
                      <span className="text-gray-500">status</span>
                      <span className="text-cyan-400">VERIFIED</span>
                    </div>
                    <div className="flex justify-between relative z-10">
                      <span className="text-gray-500">trades</span>
                      <span className="text-white">3 - 6</span>
                    </div>
                    <div className="flex justify-between relative z-10">
                      <span className="text-gray-500">volume</span>
                      <span className="text-white">€100+</span>
                    </div>
                    <div className="flex justify-between relative z-10">
                      <span className="text-gray-500">disputes</span>
                      <span className="text-green-400">0</span>
                    </div>
                  </div>

                  {/* Benefit */}
                  <div className="mt-auto">
                    <div className="text-[10px] text-cyan-300/70 uppercase tracking-widest mb-1">
                      Current Limit
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        €50
                      </span>
                      <span className="text-xs text-gray-500">/ trade</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TIER 3: Professional (New) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="relative z-10 group"
            >
              <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl group-hover:bg-indigo-500/20 transition-colors" />
              <div className="relative h-full bg-[#0f172a] p-1 rounded-3xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)] group-hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-shadow">
                <div className="h-full bg-slate-900/50 rounded-[20px] p-6 flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-white">Pro</h3>
                    <div className="w-8 h-8 rounded-lg bg-indigo-900/30 flex items-center justify-center border border-indigo-500/20 text-indigo-400 font-bold text-sm">
                      3
                    </div>
                  </div>

                  {/* NFT Data Block */}
                  <div className="bg-black/40 rounded-xl p-4 border border-indigo-500/20 font-mono text-[10px] space-y-3 mb-6 relative overflow-hidden">
                    <div className="flex justify-between border-b border-white/5 pb-2 relative z-10">
                      <span className="text-gray-500">status</span>
                      <span className="text-indigo-400">PRO</span>
                    </div>
                    <div className="flex justify-between relative z-10">
                      <span className="text-gray-500">trades</span>
                      <span className="text-white">7 - 14</span>
                    </div>
                    <div className="flex justify-between relative z-10">
                      <span className="text-gray-500">volume</span>
                      <span className="text-white">€500+</span>
                    </div>
                    <div className="flex justify-between relative z-10">
                      <span className="text-gray-500">disputes</span>
                      <span className="text-green-400">0</span>
                    </div>
                  </div>

                  {/* Benefit */}
                  <div className="mt-auto">
                    <div className="text-[10px] text-indigo-300/70 uppercase tracking-widest mb-1">
                      Current Limit
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        €100
                      </span>
                      <span className="text-xs text-gray-500">/ trade</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TIER 4: Veteran Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10 group"
            >
              <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-2xl group-hover:bg-purple-500/30 transition-colors" />
              <div className="relative h-full bg-[#0f172a] p-1 rounded-3xl border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transition-shadow">
                <div className="absolute -top-3 -right-3 z-20">
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-purple-500 border-2 border-white"></span>
                  </span>
                </div>

                <div className="h-full bg-slate-900/50 rounded-[20px] p-6 flex flex-col overflow-hidden relative">
                  {/* Shine effect */}
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      Veteran
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold text-sm">
                      4
                    </div>
                  </div>

                  {/* NFT Data Block */}
                  <div className="bg-black/40 rounded-xl p-4 border border-purple-500/30 font-mono text-[10px] space-y-3 mb-6 relative">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">status</span>
                      <span className="text-purple-400 font-bold">LEGEND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">trades</span>
                      <span className="text-white">15+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">volume</span>
                      <span className="text-white">€2,500+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">disputes</span>
                      <span className="text-green-400">0</span>
                    </div>
                  </div>

                  {/* Benefit */}
                  <div className="mt-auto">
                    <div className="text-[10px] text-purple-300/70 uppercase tracking-widest mb-1">
                      Current Limit
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        €200
                      </span>
                      <span className="text-xs text-purple-400">Max</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Ultra Clean Flow) */}
      <section className="py-24 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              How it Works
            </h2>
            <p className="text-gray-400 text-lg">
              Trustless trading in 3 simple steps.
            </p>
          </div>

          <div className="relative pt-8 pb-12">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-[52px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-gray-800 via-cyan-900 to-gray-800 border-t border-white/5 border-dashed" />

            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                {
                  step: "1",
                  title: "List & Lock",
                  desc: "Seller sets price & locks the card code in the smart contract.",
                  icon: Lock,
                },
                {
                  step: "2",
                  title: "Dual Deposit",
                  desc: "Buyer matches the deposit. Funds are held in neutral escrow.",
                  icon: Shield,
                },
                {
                  step: "3",
                  title: "Swap & Release",
                  desc: "Buyer verifies code. Funds release instantly. Reputation grows.",
                  icon: Zap,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl group-hover:bg-cyan-500/10 transition-colors" />
                    <item.icon className="w-10 h-10 text-cyan-400" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Ready to reclaim your value?
        </h2>
        <Link
          to="/market"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all"
        >
          Launch App <Zap className="w-5 h-5 ml-2 fill-current" />
        </Link>
      </section>
    </div>
  );
};

export default Home;
