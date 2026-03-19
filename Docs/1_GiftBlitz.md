# GiftBlitz – Secure & Universal P2P Gift Card Exchange

> Exchange unused Gift Cards for Crypto/Cash atomically. Zero Disputes thanks to Mutual Trust Deposit Mathematics.

---

## Identifying the Problem:

- **Who are the users?** Those who receive unwanted gift cards (Amazon, Zara, Zalando, **Steam, PSN, Xbox**) and prefer cash; those looking for discounts (bargain hunters).
- **Where is trust missing?** In remote P2P exchange. "If I give you the code, you disappear." "If I pay you, the code is fake."
- **Where are manual checks still present?** Facebook/Telegram/Subito marketplaces, extremely high scam risks.
- **Where must people use intermediaries?** Centralized sites with high fees (15-20%) and long times (CardCash, Zeek).

---

## One Problem, One User

- **A user:** Claudio has a €100 Amazon gift card (a gift from his aunt) but wants to buy Crypto or pay rent.
- **A problem:** He cannot convert it without risking being scammed or losing 20% in fees.
- **An action:** Creates a "GiftBlitz" by depositing a guarantee Trust Deposit → Mario pays → Smart Contract swaps funds and code instantly (Atomic Swap).

---

## IOTA Technology Used:

- **Tokenization:** ✅ **Soulbound Reputation NFT (ERC-5192)**. Each user receives a non-transferable NFT representing their on-chain reputation. **SECURITY FIX:** The **Seller's** Trust Deposit is **100% of the Price**, the **Buyer's** Trust Deposit is **110% of the Face Value** of the card (to make burning irrational). The NFT tracks trade count, volume, and disputes. **Buyer caps are automatic** based on trade count (Newcomer 0-2→€30, Verified 3-6→€50, Pro 7-14→€100, Veteran 15+→€200). Sellers can sell up to €200 from day 1.
- **Digital ID:** ❌ Not necessary (the EVM address is already pseudonymous, the Soulbound NFT acts as reputational identity)
- **Notarization:** ⚠️ Optional (hash dispute for future audits)
- **Smart Contracts:** ✅ (ISC) Escrow Management, "Burning" Logic (Mutual Stake), and Reputation NFT Minting/Update

---

## Why IOTA?

- **Feeless Logic**: Exchange must cost almost zero. On Ethereum, an escrow + NFT minting costs $15-20, eating up the margin of a €50 gift card.
- **NFT Utility (Tokenization)**: IOTA allows creating NFTs with real utility (Soulbound Reputation) without prohibitive costs. The NFT is not speculative art, but a functional tool that progressively reduces the Trust Deposit.
- **On-Chain Reputation**: Reputation is tracked directly in the Smart Contract and reflected in the NFT. No centralized database, no KYC, maximum privacy.
- **Atomicity**: IOTA Layer 2 Smart Contracts (ISC) allow rapid exchanges and deterministic finality.

---

## Market Data

- **Gift Card Market:** $899 Billion (Global 2023), projected to $2.3 Trillion (2030).
- **Unused Balance:** About **3-5%** of gift cards are never redeemed or are sold off (billions of value locked/lost).
- **Fraud Rate P2P:** The high-risk sector par excellence. A "Trustless" solution opens a liquid market that currently does not exist.
