# 🚀 GiftBlitz – Hackathon Submission Draft

> **Hackathon IOTA 2026 Europe (MasterZ × IOTA)** — Deadline: March 31, 2026
> Use this as a reference to fill out the [submission form](https://forms.gle/9QcdekU2mzbcCs2eA).

---

## Project Name

**GiftBlitz**

### Tagline

Secure & trustless P2P gift card exchange on IOTA — Secured by Mirror Reputation & Mutual Trust Deposit mathematics.

---

## 📖 Overview

### The Use-Case

Every year, **$899 billion** in gift cards are sold globally (projected $2.3 trillion by 2030), yet **3-5% are never redeemed** — billions in locked value. Users who receive unwanted gift cards (Amazon, Netflix, Steam, PSN, Xbox) face a painful choice: sell them on Facebook/Telegram groups risking scams, or use centralized platforms that charge **15-20% fees** with multi-day processing.

**Target users:**
- **Sellers**: People with unused gift cards wanting cash/crypto at fair rates
- **Buyers**: Bargain hunters seeking discounted gift cards from trusted, transparent trades

**Why needed**: No existing solution offers trustless P2P exchange without high fees, intermediaries, or fraud risk.

### The Solution

GiftBlitz is a **fully decentralized dApp** on IOTA L1 that enables atomic, trustless P2P gift card trades via a **Double Trust Deposit** game theory mechanism. Both buyer and seller lock collateral into a Move smart contract escrow — making fraud **mathematically irrational**. Our **Mirror Reputation Protocol** partitions the market into "Elite Circles" where high-value trades are reserved for established users.

🛡️ **TIER-CROSSING PROTECTION**
High-value trades are reserved for "Elite Circles".
Low-tier bots are hard-capped at €30.
Veteran "Elite" traders can swap up to €1,000.
This prevents **Tier-Crossing harassment**, where low-tier trolls attempt to burn the deposits of veteran members through fake disputes.

**Core value proposition**: 1% fee (vs 15-20% centralized), instant settlement, zero counterparty risk, fully on-chain reputation.

---

## ✨ Key Features

- **Mutual Trust Deposit Escrow**: Seller stakes 100% of face value; buyer stakes 110% — game theory ensures honest behavior is the only rational choice (Nash Equilibrium).
- **Anti-Griefing Protection (MAD)**: Any dispute triggers a **Mutually Assured Destruction** protocol where both the buyer and seller's on-chain trade history is instantly reset to zero.
- **Mirror Reputation NFT**: An on-chain profile that tracks `total_trades` and `volume`. It enforces a **5-tier progressive limit** system (€30 to €1,000) that partitions the market into "Elite Circles" and creates a "Trusted Firewall" against low-tier attacks.
- **End-to-End Encrypted Delivery**: Gift card codes encrypted with AES-256, keys exchanged via RSA-2048 Proxy Re-Encryption — no plaintext ever on-chain
- **72h Safety Timeouts**: Automatic refunds if seller doesn't reveal key; auto-finalize if buyer doesn't respond — no funds ever locked forever
- **1% Platform Fee**: Accumulated in an on-chain Treasury — 15-20× cheaper than centralized alternatives
- **Full Audit Trail**: 5 on-chain events (BoxCreated, BoxLocked, KeyRevealed, TradeFinalized, BoxExpired) provide immutable traceability

---

## Use of IOTA Technology

### IOTA Move Smart Contracts (Core)
Two Move modules (~540 lines total) implement the entire trading protocol:
- `giftblitz.move` (448 lines): Escrow lifecycle with 6-state machine (OPEN→LOCKED→REVEALED→COMPLETED/BURNED/EXPIRED), trust deposit management, timeout claims, fee collection, and **Mirror Limit validation** for sellers.
- `reputation.move` (95 lines): Soulbound NFT minting, progressive trade caps, dispute penalties.

### IOTA Tokenization (Primary IOTA Service)
- **GiftBox** as a **Shared Object**: Tokenized escrow accessible to seller, buyer, and system — holds encrypted code, trust deposits, payments
- **ReputationNFT** as a **Soulbound Token** (`has key` only, no `store`): Non-transferable on-chain identity with public key for PRE, trade stats, and encrypted vault for cross-browser recovery

### IOTA Blockchain Primitives
- **Capabilities pattern** (`AdminCap`): Secure admin-only treasury withdrawal
- **Clock module**: On-chain timestamps for 72h timeout enforcement
- **Move Events**: 5 event types for real-time frontend updates and immutable audit trail

> **Note**: We intentionally do NOT use IOTA Identity (DID) or IOTA Hierarchies — our Soulbound ReputationNFT serves as a custom identity proxy under the **Tokenization** service category.

---

## 🏗 System Architecture

### High-Level Design

```
┌─────────────────────────┐
│   React Frontend (SPA)  │
│   Vite + TypeScript     │
│   TailwindCSS + Framer  │
└────────┬───────┬────────┘
         │       │
    @iota/dapp-kit    @iota/iota-sdk
         │       │
┌────────▼───────▼────────┐
│   IOTA Wallet (Browser  │
│   Extension)            │
└────────┬────────────────┘
         │ Sign & Submit TXs
┌────────▼────────────────┐
│   IOTA L1 (Testnet)     │
│ ┌─────────────────────┐ │
│ │ giftblitz.move      │ │
│ │ (Escrow + Trading)  │ │
│ ├─────────────────────┤ │
│ │ reputation.move     │ │
│ │ (Soulbound NFT)     │ │
│ ├─────────────────────┤ │
│ │ Treasury (Shared)   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Key interaction flow:**
1. Frontend connects to IOTA wallet via `@iota/dapp-kit`
2. User actions (create box, join, reveal, finalize/dispute) submit Move transactions
3. Smart contracts manage all state, funds, and encryption on-chain
4. Frontend listens to Move Events for real-time UI updates
5. No backend server needed — fully decentralized architecture

### Technical Stack

| Layer              | Technology                                                    |
| ------------------ | ------------------------------------------------------------- |
| **Language**       | Move (2024 Edition), TypeScript 5.9                           |
| **Smart Contracts**| IOTA Move Framework (Sui Move-derived)                        |
| **Frontend**       | React 19.2 + Vite 7 + TailwindCSS 3.4                        |
| **Animations**     | Framer Motion 12.29                                           |
| **State Mgmt**     | @tanstack/react-query 5.90                                    |
| **IOTA SDKs**      | @iota/dapp-kit 0.8.3, @iota/iota-sdk 1.10.1                  |
| **Routing**        | react-router-dom 7.13                                         |
| **Hosting**        | Vercel (with COOP/COEP headers)                               |
| **Encryption**     | AES-256 (code), RSA-2048 (key exchange)                       |

---

## Live Demo & Media

| Item                      | Link                                                          |
| ------------------------- | ------------------------------------------------------------- |
| **Live Demo**             | https://giftblitz.claudiodallara.it                           |
| **Video Walkthrough**     | https://youtu.be/ogJe7Zjr3RQ                                  |
| **Smart Contract Explorer** | [IOTA Explorer — Package](https://explorer.iota.org/testnet/object/0xd30abab51e9b8edfee630a96dc11ba943698547bd9a3c1e9f79f875595d0a2f3) |
| **Treasury Object**       | [IOTA Explorer — Treasury](https://explorer.iota.org/testnet/object/0xe15edb5d2b3f288033cab0c8468c71c88eef41eaca78c7932f152788d817a1a1) |

---

## 🛠 Setup & Installation

```bash
# 1. Clone the repo
git clone https://github.com/boobaGreen/GiftBlitzFull.git

# 2. Install frontend dependencies
cd GiftBlitzFull/fe
npm install

# 3. Configure environment (contracts.json is pre-configured for testnet)
# fe/src/data/contracts.json already contains deployed contract IDs

# 4. Run the app
npm run dev
# Open http://localhost:5173
```

**Smart Contract Deployment (optional — for deploying your own instance):**
```bash
# Requires WSL + IOTA CLI installed in iota-service/
cd GiftBlitzFull
bash publish_testnet.sh
```

---

## 👥 The Team

- **Claudio Dall'Ara** — Solo Developer (Full-Stack + Smart Contracts)
  - 🌐 [claudiodallara.it](https://www.claudiodallara.it/)
  - 💻 [GitHub](https://github.com/boobaGreen)
  - 💼 [LinkedIn](https://www.linkedin.com/in/claudio-dall-ara-730aa0302/)

---

## 📝 GitHub Repository

**https://github.com/boobaGreen/GiftBlitzFull**

---

## 🗣 Feedback about the IOTA Developer Experience

`[TODO: Fill in your honest feedback about:]`
- SDK documentation quality
- Move development tooling
- Testnet reliability
- dApp Kit ease of use
- Any pain points or suggestions for improvement

---

## ⏩ Checklist Before Submitting

- [x] Live demo deployed and accessible
- [x] 5-min video walkthrough recorded & uploaded to YouTube
- [ ] GitHub repo is public with clean README
- [ ] Smart contracts verified on IOTA Explorer
- [ ] Team information filled in
- [ ] IOTA developer experience feedback written
- [ ] Form submitted at https://forms.gle/9QcdekU2mzbcCs2eA
