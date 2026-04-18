# 🗺️ GiftBlitz — Roadmap & Implementation Tracker

## ✅ COMPLETED (Hackathon Phase)

### Smart Contracts
- [x] `giftblitz.move` — Main trading module (454 LOC)
- [x] `reputation.move` — Soulbound Reputation NFT (95 LOC)
- [x] State machine: OPEN → LOCKED → REVEALED → COMPLETED / BURNED / EXPIRED
- [x] Dual Deposit system (100% seller / 110% buyer)
- [x] 72h timeouts (reveal + finalize)
- [x] 1% fee to Treasury
- [x] AdminCap for fee withdrawal
- [x] Integration tests (happy path)
- [x] Deployment on IOTA Testnet

### Frontend  
- [x] Home page with full product explanation  
- [x] Marketplace with filters, search, categories
- [x] CreateBox page with brand selector
- [x] PurchaseBox page with financial breakdown
- [x] TradeDetail page with state management
- [x] Profile page with reputation display
- [x] Wiki/FAQ page
- [x] Admin Dashboard
- [x] Wallet integration (IOTA dApp Kit)
- [x] Notification system (Toast)
- [x] Identity Sync Modal

### Security
- [x] AES-256-GCM encryption for gift card codes
- [x] ECDH P-256 key exchange
- [x] Deterministic key derivation (salt + signature)
- [x] Encrypted vault for cross-device recovery
- [x] PRE (Proxy Re-Encryption) flow

### DevOps
- [x] Vercel deployment config
- [x] Automated deploy script (publish_testnet.sh)
- [x] Contract docs (Contract_Documentation.md)
- [x] README with setup guide
- [x] YouTube walkthrough video

---

## 📋 PHASE 1: Post-Hackathon Improvements (High Priority)

### 1.1 Custom Voucher/Code Support
- [ ] Extend `BoxType` to accept any string (types/index.ts)
- [ ] Add `CUSTOM` category to giftCards.ts
- [ ] Add custom brand name input field in CreateBox.tsx
- [ ] Add custom emoji/icon selector for custom brands
- [ ] Update BoxCard.tsx to display unknown brands elegantly
- [ ] Update Market.tsx filters for custom category
- [ ] Update getBrand() fallback logic
- [ ] Test full flow with custom brand end-to-end

### 1.2 UX Flow Simplification
- [ ] Auto-mint profile during CreateBox if not exists
- [ ] Auto-mint profile during PurchaseBox if not exists (seamless)
- [ ] Add discount suggestion chips in CreateBox (e.g., -10%, -20%, -30%)
- [ ] Add type-ahead search in brand dropdown
- [ ] One-click finalize with visual confirmation
- [ ] Add visual trade timeline/stepper in TradeDetail
- [ ] Reduce wallet signing popups where possible

### 1.3 Design Premium Upgrade
- [ ] Add animated noise/grain texture to backgrounds
- [ ] Implement holographic shimmer effect on BoxCards
- [ ] Add 3D tilt effect on cards (mouse parallax)
- [ ] Animated number counters for statistics
- [ ] Spring physics for micro-interactions (framer-motion)
- [ ] Enhanced Navbar with scroll blur transition
- [ ] Better mobile responsive layouts
- [ ] Add loading skeleton states

---

## 📋 PHASE 2: Growth & Grants (Medium Priority)

### 2.1 IOTA Grants Application
- [ ] Prepare Tier 1 application ($10K)
- [ ] Define SMART milestones and deliverables
- [ ] Submit application on iotadlt.foundation
- [ ] Attend Grant Committee interview
- [ ] Begin milestone delivery upon approval

### 2.2 Masterz Acceleration
- [ ] Respond to Masterz acceleration invitation
- [ ] Prepare updated one-pager and pitch deck
- [ ] Attend mentorship sessions
- [ ] Participate in Demo Day (if selected)

### 2.3 Documentation & Content
- [ ] Create comprehensive API documentation
- [ ] Record updated walkthrough video (post-improvements)
- [ ] Create social media content (see 02_PROMPTS.md)
- [ ] Write Medium articles explaining Game Theory
- [ ] Prepare investor pitch deck

---

## 📋 PHASE 3: Production Ready (Lower Priority)

### 3.1 Mainnet Deployment
- [ ] Self-audit smart contracts 
- [ ] Optimize gas costs
- [ ] Plan Mainnet deployment
- [ ] Deploy to IOTA Mainnet
- [ ] Update contracts.json with mainnet IDs
- [ ] Test full flow on Mainnet

### 3.2 Advanced Features
- [ ] RPC query caching (reduce API calls)
- [ ] Pagination for fetchAllBoxes
- [ ] Error boundaries for graceful crash handling
- [ ] PWA / Service Worker for offline support
- [ ] Push notifications for trade state changes
- [ ] Multi-language support (i18n)
- [ ] Analytics dashboard (on-chain metrics)

### 3.3 Cross-Chain Expansion
- [ ] Research Sui Foundation grant program
- [ ] Port smart contracts to Sui Move
- [ ] Evaluate Solidity port for Ethereum/Base
- [ ] Evaluate Rust/Anchor port for Solana

---

## 📅 TIMELINE

```
APRILE 2026 (ORA)
├── Week 3: Submit IOTA Grant Tier 1 application
├── Week 3: Implement Custom Codes (frontend only)
├── Week 4: UX simplification (auto-mint, one-click)
│
MAGGIO 2026
├── Week 1-2: Design premium upgrade
├── Week 2: Updated video / social content
├── Week 3: Masterz acceleration kickoff
├── Week 4: Grant interview + milestone start
│
GIUGNO 2026
├── Week 1-2: Complete Phase 1 milestones
├── Week 3: Security review + optimization
├── Week 4: Mainnet deployment preparation
│
LUGLIO 2026
├── Week 1: IOTA Mainnet deployment
├── Week 2: Apply Tier 2 grant ($50K)
├── Week 3-4: Cross-chain research (Sui)
│
AGOSTO 2026+
├── Community growth
├── Partnership with gift card brands
├── Potential Sui port + Sui Foundation grant
└── Scale operations
```

---

## 📊 KPI TRACKING

| Metric | Current | Target (3 months) | Target (6 months) |
|--------|---------|-------------------|-------------------|
| Testnet Trades | ~10 | 100+ | N/A (migrate) |
| Mainnet Trades | 0 | 50+ | 500+ |
| Active Users | ~5 | 50+ | 200+ |
| Brands Supported | 120+ preset | +unlimited custom | +unlimited |
| Total Volume | — | 1,000 IOTA | 10,000 IOTA |
| Grants Received | $0 | $10,000 | $50,000+ |
| Social Followers | ~0 | 500+ | 2,000+ |
