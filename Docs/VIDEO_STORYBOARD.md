# 🎬 GiftBlitz — Video Storyboard & Production Guide

> **Total Duration**: 5:00 max
> **Format**: Mix — Voiceover (intro + closing) + Music & Text Overlays (demo)
> **Resolution**: 1920×1080 (Full HD)
> **Tool**: CapCut Desktop (free) + Xbox Game Bar for screen recording

---

## 📦 Files to Record (3 separate recordings)

| # | File Name            | What to Record                | Audio         | Duration  |
|---|----------------------|-------------------------------|---------------|-----------|
| 1 | `intro_voice.mp4`   | Webcam or black screen + voice | Your voice    | ~30 sec   |
| 2 | `demo_screen.mp4`   | Screen recording of the dApp  | No audio      | ~3 min    |
| 3 | `closing_voice.mp4` | Webcam or screen + voice      | Your voice    | ~1:30     |

---

## 🎵 Music

- Use CapCut's built-in royalty-free music library
- Style: **upbeat electronic / tech ambient** — NOT dramatic, NOT too fast
- Volume: **low** during voiceover sections, **medium** during demo sections
- Suggested search in CapCut: "technology", "innovation", "corporate upbeat"

---

# FULL STORYBOARD — SECOND BY SECOND

---

## PART 1 — INTRO (Voiceover + Title Cards)

> 🎤 **RECORD YOUR VOICE** for this part. Read the script below.
> 🎵 Music plays softly underneath.

---

### 0:00 – 0:04 | TITLE CARD (text on dark background)

**What's on screen**: Dark/gradient background (dark blue → black)

**Text overlay (center, large, white, fade-in animation)**:
```
🚀 GiftBlitz
```

**Text overlay (below, smaller, light gray, fade-in 0.5s delay)**:
```
Trustless P2P Gift Card Exchange on IOTA
```

**Voiceover**: *(nothing yet, just music for 4 seconds)*

---

### 0:04 – 0:12 | PROBLEM STATEMENT

**What's on screen**: Same dark background, or slow transition to dApp homepage

**Text overlay (top-left corner, small, yellow/accent color)**:
```
THE PROBLEM
```

**Voiceover**:
> *"Hi, I'm Claudio Dall'Ara. Every year, billions of dollars in gift cards go unused — sold on social media groups with huge scam risks, or on centralized platforms that charge 15 to 20 percent in fees."*

---

### 0:12 – 0:20 | SOLUTION INTRO

**What's on screen**: Transition to GiftBlitz homepage (https://gift-blitz-full.vercel.app/)

**Text overlay (top-left corner, small, green/accent color)**:
```
THE SOLUTION
```

**Voiceover**:
> *"GiftBlitz solves this with a fully decentralized exchange protocol on IOTA, where fraud is mathematically irrational — thanks to a Mutual Trust Deposit system."*

---

### 0:20 – 0:30 | TECH INTRO

**What's on screen**: Still on homepage, slowly scrolling down to show features

**Text overlay (bottom-center, medium)**:
```
Built on IOTA L1 • Move Smart Contracts • Zero Backend
```

**Voiceover**:
> *"Everything runs on IOTA Layer 1 smart contracts written in Move. No backend, no intermediaries — fully decentralized. Let me show you how it works."*

---

## PART 2 — LIVE DEMO (Music + Text Overlays, NO voice)

> 🎵 **MUSIC ONLY** — increase volume slightly
> 📱 **SCREEN RECORDING** of the live dApp
> ✏️ **ADD TEXT OVERLAYS** in CapCut after recording

### Pre-recording setup:
- Open Chrome at https://gift-blitz-full.vercel.app/
- Have IOTA wallet extension ready with testnet funds
- If possible, have 2 browser profiles (Seller wallet + Buyer wallet)
- Clear any old boxes from the marketplace if it looks cluttered
- Browser zoom: 100% or 110% so elements are clearly visible

---

### 0:30 – 0:37 | CONNECT WALLET

**Action on screen**: Click "Connect Wallet" button → wallet popup → approve connection

**Text overlay (top-center, white on semi-transparent dark bar)**:
```
Step 1: Connect IOTA Wallet
```

---

### 0:37 – 0:42 | NAVIGATE TO CREATE

**Action on screen**: Click "Create Box" or navigate to /create page

**Text overlay (top-center)**:
```
Step 2: Create a GiftBox (Seller Flow)
```

---

### 0:42 – 1:05 | FILL CREATE FORM

**Action on screen**: 
- Select brand: **Amazon**
- Set Face Value: **10 IOTA** (use small amounts for demo)
- Set Price: **8 IOTA**
- Enter a dummy gift card code (e.g., "DEMO-XXXX-YYYY-ZZZZ")
- Show the form filling slowly so viewers can follow

**Text overlay (right side, stacked info box with semi-transparent background)**:
```
📦 Creating a GiftBox

Brand: Amazon
Face Value: 10 IOTA
Selling Price: 8 IOTA

Seller Trust Deposit: 10 IOTA (100%)
```

**Text overlay (bottom-center, smaller, italic)**:
```
The gift card code is encrypted with AES-256 before going on-chain
```

---

### 1:05 – 1:18 | SUBMIT CREATE TRANSACTION

**Action on screen**: Click "Create" → wallet popup → sign transaction → wait for confirmation

**Text overlay (center, animated pop-in)**:
```
🔐 Code Encrypted → Transaction Signed → GiftBox Live!
```

**After confirmation, text overlay (bottom-center)**:
```
The GiftBox is now a Shared Object on IOTA L1
```

---

### 1:18 – 1:25 | SWITCH TO BUYER

**Action on screen**: Switch browser profile/wallet OR open incognito with different wallet

**Text overlay (full-width bar, accent color background)**:
```
👤 Switching to BUYER perspective
```

---

### 1:25 – 1:40 | MARKETPLACE VIEW

**Action on screen**: Navigate to /market → show the list of available GiftBoxes → find our Amazon box

**Text overlay (top-center)**:
```
Step 3: Browse Marketplace (Buyer Flow)
```

**Text overlay (bottom-left, info box)**:
```
📊 Marketplace shows:
• Card brand & value
• Price (discounted)
• Seller reputation
• Box status
```

---

### 1:40 – 2:00 | PURCHASE BOX

**Action on screen**: Click on the Amazon box → review details on purchase page → click "Buy"

**Text overlay (right side, stacked info box)**:
```
💰 Buyer Payment Breakdown

Price: 8 IOTA
Trust Deposit: 11 IOTA (110% of Face Value)
─────────────────
Total Locked: 19 IOTA
```

---

### 2:00 – 2:15 | SIGN PURCHASE TRANSACTION

**Action on screen**: Wallet popup → sign → confirmation

**Text overlay (center, animated)**:
```
✅ Box LOCKED — Funds in Escrow
```

**Text overlay (bottom-center, smaller)**:
```
⏳ 72h countdown starts — Seller must reveal the decryption key
```

---

### 2:15 – 2:20 | WHY 110% EXPLANATION

**Action on screen**: Pause on the trade detail page

**Text overlay (center, larger font, yellow/accent)**:
```
Why 110% Buyer Deposit?

Redeem code + false dispute = Buyer LOSES 11 IOTA, gains only 10
→ Fraud is irrational 🧠
```

---

### 2:20 – 2:30 | SWITCH BACK TO SELLER

**Action on screen**: Switch back to seller's browser/profile

**Text overlay (full-width bar)**:
```
👤 Switching back to SELLER
```

---

### 2:30 – 2:50 | REVEAL KEY

**Action on screen**: On trade detail page → Click "Reveal Key" → sign transaction

**Text overlay (top-center)**:
```
Step 4: Seller Reveals Decryption Key
```

**Text overlay (bottom-center, info)**:
```
🔑 Key is re-encrypted for the Buyer using RSA-2048
(Proxy Re-Encryption — no one else can read the code)
```

---

### 2:50 – 3:00 | SWITCH TO BUYER FOR FINALIZE

**Action on screen**: Switch to buyer → trade detail page shows "REVEALED" state

**Text overlay (full-width bar)**:
```
👤 Back to BUYER — Code received, time to verify
```

---

### 3:00 – 3:20 | FINALIZE TRADE

**Action on screen**: Buyer clicks "Finalize" → sign → trade completed

**Text overlay (center, large, green, animated pop)**:
```
🎉 Trade Completed!
```

**Text overlay (right side, distribution breakdown)**:
```
💸 Fund Distribution (automatic):

→ Seller: 7.92 IOTA (price - 1% fee) + 10 IOTA (deposit back)
→ Buyer: 11 IOTA (deposit back) + gift card ✅
→ Treasury: 0.08 IOTA (1% fee)
```

---

### 3:20 – 3:30 | SHOW REPUTATION UPDATE

**Action on screen**: Navigate to /profile → show ReputationNFT stats updated (trades +1)

**Text overlay (top-center)**:
```
📈 Soulbound Reputation NFT Updated
```

**Text overlay (bottom-center)**:
```
Non-transferable • Tracks trades, volume & disputes on-chain
Progressive buyer caps: €30 → €50 → €100 → €200
```

---

## PART 3 — ARCHITECTURE & CLOSING (Voiceover)

> 🎤 **RECORD YOUR VOICE** again for this part.
> 🎵 Music continues softly underneath.

---

### 3:30 – 3:38 | ARCHITECTURE TITLE

**What's on screen**: Transition to a dark slide. You can screenshot the architecture diagram from HACKATHON_SUBMISSION.md and show it as an image.

**Text overlay (top-left, accent color)**:
```
SYSTEM ARCHITECTURE
```

**Voiceover**:
> *"Let me walk you through the architecture."*

---

### 3:38 – 3:55 | FRONTEND STACK

**What's on screen**: Architecture diagram or a slide showing the tech stack

**Text overlay (left side, stacked list)**:
```
Frontend
• React 19 + TypeScript
• Vite + TailwindCSS
• Framer Motion (animations)
• @iota/dapp-kit
• @iota/iota-sdk
```

**Voiceover**:
> *"The frontend is a React single-page application with TypeScript and Tailwind CSS, connected to IOTA via the official dApp Kit and IOTA SDK. There is no backend server — everything is fully decentralized."*

---

### 3:55 – 4:20 | SMART CONTRACTS

**What's on screen**: Show the IOTA Explorer page for our deployed package, or a code snippet slide

**Text overlay (left side, stacked)**:
```
Smart Contracts (Move)
• giftblitz.move — 448 lines
  Escrow • 6-state machine • Timeouts • Fees

• reputation.move — 95 lines
  Soulbound NFT • Trade caps • Dispute penalties
```

**Voiceover**:
> *"On-chain, we have two Move smart contracts. Giftblitz.move — about 450 lines — handles the entire escrow lifecycle with a 6-state machine, trust deposits, timeout claims, and fee collection. Reputation.move — about 95 lines — manages the Soulbound Reputation NFT, which is non-transferable and tracks each user's trade history directly on-chain."*

---

### 4:20 – 4:40 | IOTA INTEGRATION

**What's on screen**: IOTA Explorer showing the deployed contract, or transition back to the dApp

**Text overlay (center, medium)**:
```
IOTA Tokenization (Primary Service)
• GiftBox → Tokenized Shared Object
• ReputationNFT → Soulbound Token (on-chain identity)
```

**Voiceover**:
> *"We use IOTA Tokenization as our primary IOTA service. The GiftBox is a tokenized shared object, and the ReputationNFT is a soulbound token that serves as an on-chain identity proxy. The contracts are deployed on IOTA testnet and fully verifiable on the Explorer."*

---

### 4:40 – 4:55 | SUMMARY

**What's on screen**: Return to the GiftBlitz homepage or a closing slide

**Text overlay (center, stacked, fade-in one by one)**:
```
✅ Trustless P2P Exchange
✅ Mathematically Proven Anti-Fraud
✅ End-to-End Encryption
✅ Soulbound On-Chain Reputation
✅ 1% Fee — No Intermediaries
✅ 100% Decentralized
```

**Voiceover**:
> *"To sum up — GiftBlitz brings trustless, low-fee gift card trading to IOTA, with mathematically proven anti-fraud mechanics, end-to-end encryption, and fully on-chain reputation. All built as a solo developer project."*

---

### 4:55 – 5:00 | CLOSING CARD

**What's on screen**: Dark background, final title card

**Text overlay (center, large, white)**:
```
GiftBlitz
```

**Text overlay (below, stacked, smaller)**:
```
by Claudio Dall'Ara

🌐 gift-blitz-full.vercel.app
💻 github.com/boobaGreen/GiftBlitzFull
```

**Voiceover**:
> *"Thank you for watching. I'm Claudio Dall'Ara, and this is GiftBlitz."*

**Music**: Fade out over the last 3 seconds.

---

# 📋 POST-PRODUCTION CHECKLIST (CapCut)

## Text Style Guide
- **Title cards**: Font size 72px, white, center-aligned, fade-in animation
- **Section headers**: Font size 36px, accent color (electric blue #3B82F6 or green #22C55E), top-left
- **Info boxes**: Font size 24px, white text on semi-transparent dark rectangle (#000000 at 70% opacity)
- **Bottom captions**: Font size 20px, light gray, italic, bottom-center

## Transitions
- Between PART 1 → PART 2: **Fade to black** (0.5s)
- Between wallet switches: **Quick cut** (no transition, just the full-width bar)
- Between PART 2 → PART 3: **Fade to black** (0.5s)

## Final Checks
- [ ] Total duration ≤ 5:00
- [ ] Text is readable (big enough, stays on screen ≥ 3 seconds)
- [ ] Music volume doesn't drown out voiceover
- [ ] No sensitive data visible (private keys, real card codes)
- [ ] Wallet addresses are testnet only
- [ ] All text overlays are in English
- [ ] Export at 1080p, MP4 format
