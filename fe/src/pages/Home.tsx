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
  Gift,
  Timer,
  Wallet,
  Play,
  MonitorPlay,
} from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="pb-20 bg-slate-950 text-white">
      {/* HERO SECTION - Premium Aurora Design */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-slate-950">
        {/* Animated Aurora Mesh Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-500/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -120, 0],
              y: [0, 80, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-6xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold mb-10 backdrop-blur-xl shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Empowering the Future of P2P Trade
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tight leading-[0.9] text-balance">
            Liquidity for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 animate-gradient-x">
              Unused Assets.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
            The world's first trustless marketplace secured by Game Theory 
            and IOTA Smart Contracts. <span className="text-white italic">No escrow. No risk. Just logic.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link
              to="/market"
              className="group relative px-10 py-5 bg-white text-black text-xl font-black rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Market{" "}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              to="/create"
              className="group px-10 py-5 bg-slate-900/50 text-white text-xl font-bold rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              Start Selling
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hidden sm:flex"
        >
          <span className="text-[10px] uppercase font-black tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent" />
        </motion.div>
      </section>

      {/* THE RELATABLE PROBLEM - Trapped Value Infographic */}
      <section className="py-20 relative bg-[#020617] border-b border-white/5 overflow-hidden">
        {/* Subtle mesh gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              You Have a Gift Card. Why Haven't You Used It?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              You're not alone. Over <b className="text-white">$23 Billion</b> gets trapped every single year.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting dashed line (desktop) */}
            <div className="hidden md:block absolute top-[45%] left-10 right-10 h-[2px] border-t-2 border-dashed border-white/10 -z-10" />

            {/* REASON 1: UNWANTED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-pink-500/30 transition-all flex flex-col items-center text-center shadow-xl"
            >
              <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                <Gift className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Unwanted Gift</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                It was a nice thought from your aunt, but you'll literally never shop at that store. Now it just sits in a drawer collecting dust.
              </p>
            </motion.div>

            {/* REASON 2: EXPIRING */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all flex flex-col items-center text-center shadow-xl"
            >
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                <Timer className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Ticking Clock</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You just got an email: it expires in 30 days. You're about to force yourself to buy something you don't even need just to not waste it.
              </p>
            </motion.div>

            {/* REASON 3: CASH */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all flex flex-col items-center text-center shadow-xl"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <Wallet className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Cash Need</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Store credit is nice, but rent, groceries, and crypto investments require liquid cash. You'd rather have real money right now.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GLOBAL WALKTHROUGH VIDEO SECTION */}
      <section className="py-32 relative bg-slate-950 border-y border-white/5 overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-black uppercase tracking-widest mb-10 backdrop-blur-xl"
          >
            <Play className="w-3 h-3 fill-current" /> See it in action
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Walkthrough.</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            Discover how GiftBlitz secures your trades in under 5 minutes. From listing to instant settlement, witness the power of trustless P2P exchange.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative group lg:max-w-5xl mx-auto"
          >
            {/* Video Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/ogJe7Zjr3RQ?autoplay=0&rel=0&showinfo=0" 
                title="GiftBlitz Official Walkthrough"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Technical Stamp */}
            <div className="absolute -bottom-6 -right-6 hidden md:flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl backdrop-blur-xl z-20">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Format</div>
                <div className="text-sm font-black text-white">1080p Technical Demo</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* THE PROBLEM - MODERN BENTO GRID */}
      <section className="py-32 bg-slate-950 relative border-y border-white/5 overflow-hidden">
        {/* Soft Background Aurora */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-cyan-500/20 backdrop-blur-md"
            >
              The Status Quo is Broken
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              Why Gift Cards <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 font-serif italic">Suck</span> (Today).
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[180px]">
            {/* PAIN 1: TRUST GAP (Big Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-3 md:row-span-2 group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-500 flex flex-col md:justify-end gap-6 md:gap-0"
            >
              <div className="md:absolute md:top-8 md:left-8 w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-4">The Trust Dilemma</h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                  "Who sends first?" In a world of strangers, cooperation fails before it even starts. Scammers thrive in the gap between payment and delivery.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase">
                  Risk Level: Critical
                </div>
              </div>
            </motion.div>

            {/* PAIN 2: TRAPPED VALUE (Wide Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-3 md:row-span-1 group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden hover:border-cyan-500/30 transition-all duration-500 flex items-center gap-8"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-8 h-8 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">Trapped Value</h3>
                <p className="text-gray-400 text-sm">
                  $23 Billion is lost every year to dust, expiry, and unwanted credit.
                </p>
              </div>
            </motion.div>

            {/* PAIN 3: MIDDLEMAN TAX (Wide Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3 md:row-span-1 group relative p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden hover:border-pink-500/30 transition-all duration-500 flex items-center gap-8"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-pink-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-1">The 30% Middleman Tax</h3>
                <p className="text-gray-400 text-sm">
                  Centralized sites bleed you dry with fees just to provide basic protection.
                </p>
              </div>
            </motion.div>

            {/* EXTRA STATS (Vertical Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-6 md:row-span-1 group relative p-8 rounded-[2.5rem] bg-gradient-to-r from-slate-900/40 to-cyan-900/10 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">$23B</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Wasted Annually</div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-black text-white">45%</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Scam Rate Peer-to-Peer</div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-black text-white">0s</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">GiftBlitz Settlement</div>
                </div>
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-cyan-400 font-serif italic text-lg">"The protocol is the platform."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WEB2 COMPETITOR COMPARISON TABLE */}
      <section className="py-24 relative bg-black border-y border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              GiftBlitz vs Traditional Web2
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Why use centralized marketplaces like Raise or CardCash when they steal your money and time?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* TRADITIONAL WEB2 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a0505] p-8 rounded-3xl border border-red-900/50 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl transition-all duration-500 group-hover:bg-red-500/20" />
              <h3 className="text-2xl font-black text-red-500 mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6" /> Web2 (Raise, CardCash)
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black">X</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Massive Middleman Fees</h4>
                    <p className="text-red-200/60 text-sm">They take 15% to 30% of your gift card's value just for verifying.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black">X</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Slow Verification</h4>
                    <p className="text-red-200/60 text-sm">You wait days or even weeks for them to manually check the code and send your funds.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black">X</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Limited Brands</h4>
                    <p className="text-red-200/60 text-sm">They only accept massive global brands. Have a card for a local spa or niche online store? Useless.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* GIFTBLITZ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden group shadow-2xl shadow-cyan-900/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl transition-all duration-500 group-hover:bg-cyan-500/30" />
              <h3 className="text-2xl font-black text-cyan-400 mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6" /> GiftBlitz (Web3)
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black">✓</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Ultra-Low 1% Fee</h4>
                    <p className="text-cyan-200/60 text-sm">Virtually free. Completely peer-to-peer. Our Smart Contract takes practically nothing.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black">✓</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Instant Execution</h4>
                    <p className="text-cyan-200/60 text-sm">No humans in the middle. The Smart Escrow releases funds instantly upon code validation.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black">✓</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Any Brand Globally</h4>
                    <p className="text-cyan-200/60 text-sm">If it has a verifiable digital pin or value, you can sell it. From Airlines to local barbers.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW HOW IT WORKS (Animated Flow) */}
      <section className="py-24 relative overflow-hidden bg-[#020617] border-y border-white/5">
        <div className="absolute top-0 right-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24 md:mb-32">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-8">
              The Protocol
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              How GiftBlitz Actually Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Our <b className="text-white">Asymmetric Escrow</b> makes scamming mathematically impossible. Here is the step-by-step trustless flow.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Line Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent -translate-x-1/2 rounded-full" />

            {/* STEP 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative flex flex-col md:flex-row items-center mb-16 group"
            >
              <div className="md:w-1/2 flex justify-end md:pr-12 mb-6 md:mb-0">
                <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-white/10 group-hover:border-cyan-500/50 transition-colors shadow-2xl text-center md:text-right relative overflow-hidden w-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                  <h3 className="text-2xl font-bold text-white mb-3">1. List & Lock (Seller)</h3>
                  <p className="text-gray-400 leading-relaxed">
                    The seller encrypts the gift card code using their public key and lists it. To prove they aren't selling a fake, they must lock <b className="text-cyan-400">100% of the Face Value</b> as a dynamic deposit into the Smart Contract.
                  </p>
                </div>
              </div>
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-[#020617] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative mb-8 md:mb-0 order-first md:order-none">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-black">1</div>
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:flex items-center text-cyan-500/30">
                <Lock className="w-16 h-16 group-hover:text-cyan-400 transition-colors animate-pulse" />
              </div>
            </motion.div>

            {/* STEP 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative flex flex-col md:flex-row-reverse items-center mb-16 group"
            >
              <div className="md:w-1/2 flex justify-start md:pl-12 mb-6 md:mb-0">
                <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-white/10 group-hover:border-purple-500/50 transition-colors shadow-2xl text-center md:text-left relative overflow-hidden w-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                  <h3 className="text-2xl font-bold text-white mb-3">2. Purchase & Stake (Buyer)</h3>
                  <p className="text-gray-400 leading-relaxed">
                    A buyer wants the card. They pay the agreed price, BUT they must also lock <b className="text-purple-400">110% of the Face Value</b>. This stops internet trolls from buying cards just to falsely dispute them and ruin the seller's day.
                  </p>
                </div>
              </div>
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-[#020617] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(168,85,247,0.4)] relative mb-8 md:mb-0 order-first md:order-none">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-black">2</div>
              </div>
              <div className="md:w-1/2 md:pr-12 hidden md:flex items-center justify-end text-purple-500/30">
                <Shield className="w-16 h-16 group-hover:text-purple-400 transition-colors animate-pulse" />
              </div>
            </motion.div>

            {/* STEP 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative flex flex-col md:flex-row items-center group mb-16"
            >
              <div className="md:w-1/2 flex justify-end md:pr-12 mb-6 md:mb-0">
                <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-white/10 group-hover:border-pink-500/50 transition-colors shadow-2xl text-center md:text-right relative overflow-hidden w-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
                  <h3 className="text-2xl font-bold text-white mb-3">3. Reveal & Swap (Automated)</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Once funds are locked, the seller's client automatically re-encrypts the code specifically for the buyer's public key. The buyer decrypts it locally and uses the gift card on the brand's website.
                  </p>
                </div>
              </div>
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-[#020617] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(236,72,153,0.4)] relative mb-8 md:mb-0 order-first md:order-none">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-black">3</div>
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:flex items-center text-pink-500/30">
                <Zap className="w-16 h-16 group-hover:text-pink-400 transition-colors animate-bounce" />
              </div>
            </motion.div>

            {/* STEP 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative flex flex-col md:flex-row-reverse items-center group"
            >
              <div className="md:w-1/2 flex justify-start md:pl-12">
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 backdrop-blur-sm p-8 rounded-3xl border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] text-center md:text-left relative overflow-hidden w-full">
                  <h3 className="text-2xl font-bold text-white mb-3">4. Happy Resolution (Instant)</h3>
                  <p className="text-gray-400 leading-relaxed">
                    The buyer clicks "Finalize". The smart contract instantly sends the payment to the seller. <b>Both deposits are returned in full.</b> No waiting, no middlemen, and both users level up their Reputation NFTs.
                  </p>
                </div>
              </div>
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-[#020617] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(34,197,94,0.4)] relative mb-8 md:mb-0 order-first md:order-none">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-black">
                  <CheckCircle className="w-4 h-4" />
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
                Citizen Passport
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

      {/* NEW: GAME THEORY & MAD EQUILIBRIUM SECTION */}
      <section className="py-24 relative bg-black border-y border-white/5 overflow-hidden">
        {/* Abstract Math Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_10%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg backdrop-blur-md">
              <Zap className="w-3 h-3" /> Mutually Assured Destruction
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why We Beat the Competition.
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Web3 competitors are few, but they still rely on flawed models like easily exploited flat fees or UX-killing 150% deposits. 
              GiftBlitz introduces a perfectly balanced <b className="text-white">Asymmetric Deposit Model</b> tied to Face Value. 
              Cheating mathematically guarantees a net loss.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* SELLER FRAUD FAILS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group pt-4"
            >
              {/* The "Banned" Overlay Stamp */}
              <div className="absolute -top-4 -right-4 z-20 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg rotate-12 shadow-2xl border-2 border-white/20 animate-bounce">
                FRAUD BLOCKED
              </div>

              <div className="glass-card h-full flex flex-col border-red-500/20 group-hover:border-red-500/40 transition-all duration-500 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 blur-[100px]" />
                
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight">Seller Attempt: Double-Spend</h3>
                      <p className="text-red-400/60 text-[10px] font-black uppercase tracking-widest mt-0.5">Scenario: Fake code or already used</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed italic">
                    "I'll sell a $100 Amazon card, but I'll use it myself first or provide a fake code to steal the buyer's payment."
                  </p>
                </div>

                {/* The "Ledger" UI */}
                <div className="bg-[#050505] rounded-2xl border border-white/5 p-4 mb-8 space-y-3 font-mono">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Asymmetric Ledger Simulation</div>
                  
                  <div className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-400">Gain (Card Used/Fake)</span>
                    </div>
                    <span className="text-sm font-black text-green-400">+$80.00</span>
                  </div>

                  <div className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="text-xs text-gray-400">Locked Deposit (Burned)</span>
                    </div>
                    <span className="text-sm font-black text-red-500">-$100.00</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white font-bold uppercase">Transaction Delta</span>
                    <div className="text-right">
                      <div className="text-lg font-black text-red-500">-$20.00</div>
                      <div className="text-[9px] text-red-400/50 font-black uppercase">Mathematical Loss</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-4 py-3 rounded-xl bg-red-950/20 border border-red-900/40 text-center">
                  <p className="text-xs text-red-200">
                    <span className="font-bold text-red-400">Verdict:</span> At a $100 face value, the attacker loses <span className="font-bold text-white">$20</span> vs competitors where they would net a profit.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* BUYER GRIEFING FAILS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group pt-4"
            >
              {/* The "Protected" Overlay Stamp */}
              <div className="absolute -top-4 -right-4 z-20 bg-cyan-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg rotate-12 shadow-2xl border-2 border-white/20 animate-bounce">
                SELLER PROTECTED
              </div>

              <div className="glass-card h-full flex flex-col border-cyan-500/20 group-hover:border-cyan-500/40 transition-all duration-500 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-600/10 blur-[100px]" />
                
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight">Buyer Attempt: Griefing</h3>
                      <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-widest mt-0.5">Scenario: Falsely disputing valid code</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed italic">
                    "I'll buy the $100 card, use it, and then falsely claim it was already empty to get a refund."
                  </p>
                </div>

                {/* The "Ledger" UI */}
                <div className="bg-[#050505] rounded-2xl border border-white/5 p-4 mb-8 space-y-3 font-mono">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Griefing Cost simulation</div>
                  
                  <div className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-400">Refund Amount</span>
                    </div>
                    <span className="text-sm font-black text-green-400">+$80.00</span>
                  </div>

                  <div className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="text-xs text-gray-400">Stake Burned (110%)</span>
                    </div>
                    <span className="text-sm font-black text-red-500">-$110.00</span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white font-bold uppercase">Transaction Delta</span>
                    <div className="text-right">
                      <div className="text-lg font-black text-red-500">-$30.00</div>
                      <div className="text-[9px] text-red-400/50 font-black uppercase">Net Financial Loss</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-4 py-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-center">
                  <p className="text-xs text-cyan-200">
                    <span className="font-bold text-cyan-400">Verdict:</span> Even with a full refund of the price, the 110% stake ensures the griefing attempt is <span className="font-bold text-white">net-negative</span>.
                  </p>
                </div>
              </div>
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
            <p className="text-gray-400 max-w-3xl mx-auto text-lg mb-8">
              Your <b>Soulbound Citizen Passport</b> is your identity. It records
              your trading history on-chain. Honest behavior unlocks <b>higher trade limits</b> to prevent systemic fraud.
            </p>

            {/* Why it exists explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <div className="flex items-start text-left gap-3 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 px-5 py-4 rounded-xl">
                <div className="mt-1"><Shield className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-white font-bold mb-1">Damage Control</h4>
                  <p className="text-gray-400 text-sm leading-snug">Zero-rep accounts are capped at €30. Spam bots cannot buy or list high-value items.</p>
                </div>
              </div>
              <div className="flex items-start text-left gap-3 bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 px-5 py-4 rounded-xl">
                <div className="mt-1"><Zap className="w-5 h-5 text-purple-400" /></div>
                <div>
                  <h4 className="text-white font-bold mb-1">Mutual Reset (MAD)</h4>
                  <p className="text-gray-400 text-sm leading-snug">Any dispute resets "Total Trades" to zero for BOTH the buyer and seller. Mutually Assured Destruction makes cheating irrational.</p>
                </div>
              </div>
              <div className="flex items-start text-left gap-3 bg-slate-900/50 backdrop-blur-sm border border-red-500/20 px-5 py-4 rounded-xl">
                <div className="mt-1"><AlertCircle className="w-5 h-5 text-red-500 animate-pulse" /></div>
                <div>
                  <h4 className="text-white font-bold mb-1">Rival Bleedout</h4>
                  <p className="text-gray-400 text-sm leading-snug">Griefing the network costs exactly 110% of the damage inflicted. Jealous competitors mathematically bankrupt themselves.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 relative max-w-[90rem] mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-slate-700 via-cyan-900 via-indigo-900 via-purple-900 to-amber-900 z-0" />

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
                      <span className="text-white">1 - 2</span>
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
                      Trade Limit
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
                      <span className="text-white">3 - 5</span>
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
                      Trade Limit
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
                      <span className="text-white">6 - 10</span>
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
                      Trade Limit
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
                      <span className="text-white">11 - 25</span>
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
                      Trade Limit
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        €500
                      </span>
                      <span className="text-xs text-purple-400">/ trade</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* TIER 5: Elite (New) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="relative z-10 group"
            >
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl group-hover:bg-amber-500/30 transition-colors" />
              <div className="relative h-full bg-[#0f172a] p-1 rounded-3xl border border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-shadow">
                <div className="absolute -top-3 -right-3 z-30">
                  <span className="relative flex h-10 w-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50"></span>
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-2 border-slate-950 flex items-center justify-center shadow-2xl">
                      <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                  </span>
                </div>

                <div className="h-full bg-slate-900/50 rounded-[20px] p-6 flex flex-col overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none" />

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      Elite
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-amber-900/30 flex items-center justify-center border border-amber-500/20 text-amber-400 font-bold text-sm">
                      5
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-xl p-4 border border-amber-500/30 font-mono text-[10px] space-y-3 mb-6 relative">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">status</span>
                      <span className="text-amber-400 font-black">UNTOUCHABLE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">trades</span>
                      <span className="text-white">26+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">volume</span>
                      <span className="text-white">€10,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">disputes</span>
                      <span className="text-green-400">0</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-[10px] text-amber-300/70 uppercase tracking-widest mb-1">
                      Trade Limit
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white">
                        €1,000
                      </span>
                      <span className="text-xs text-amber-500 font-bold">VIP</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
