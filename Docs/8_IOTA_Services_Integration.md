# GiftBlitz - IOTA Hackathon Alignment 🚀

> **Alignment Check:** How GiftBlitz uses IOTA Services
>
> **IMPORTANT**: We use **IOTA Tokenization** (L1), NOT IOTA Trust Framework (Identity/Hierarchies)

---

## 📋 Hackathon Requirements vs GiftBlitz

| Requirement                    | Our Implementation                           | Status |
| ------------------------------ | -------------------------------------------- | ------ |
| **Real-world problem**         | P2P Gift Card Exchange (€23B/year lost)      | ✅     |
| **Built on IOTA L1 (Move)**    | Smart Contracts: Escrow, Reputation, Dispute | ✅     |
| **IOTA Service: Tokenization** | GiftBox + Soulbound ReputationNFT            | ✅     |

---

## 🪙 IOTA TOKENIZATION (Primary Integration)

### What We Tokenize

| Token/Object      | Type                               | Purpose                         |
| ----------------- | ---------------------------------- | ------------------------------- |
| **GiftBox**       | Shared Object                      | Escrow for gift card trades     |
| **ReputationNFT** | Soulbound Token (Non-Transferable) | On-chain identity & trust score |

### GiftBox Tokenization

```
GiftBox (Shared Object):
├── face_value: €100 (tokenized value)
├── price: €80 (listing price)
├── seller_stake: Balance<IOTA> (collateral)
├── buyer_stake: Balance<IOTA> (collateral)
├── encrypted_code: vector<u8> (the secret)
└── state: OPEN → LOCKED → REVEALED → COMPLETED
```

### ReputationNFT (Soulbound)

```
ReputationNFT:
├── owner: address (permanent binding)
├── total_trades: u64
├── total_volume: u64
├── disputes: u64
└── NON TRANSFERABLE (Soulbound)
```

> ⚠️ **Clarification**: Our ReputationNFT is **NOT** "IOTA Identity" (DID/Verifiable Credentials).
> It is a **Custom Soulbound Token** that we use as an identity proxy. It falls under **Tokenization**.

---

## 📜 NOTARIZATION (Secondary - Via Events)

Each action generates an on-chain event that serves as an **immutable audit trail**:

| Event            | What It Notarizes                            |
| ---------------- | -------------------------------------------- |
| `BoxCreated`     | Seller committed stake + encrypted code hash |
| `BoxLocked`      | Buyer joined with stake + payment            |
| `KeyRevealed`    | Seller revealed decryption key               |
| `TradeFinalized` | Successful completion                        |
| `TradeDisputed`  | Conflict resolution (burn proof)             |

> **Note**: This is "light" notarization via Move events, not the formal IOTA Notarization service.

---

## 🧠 MOVE SMART CONTRACTS (Core)

| Move Pattern       | Our Usage                          |
| ------------------ | ---------------------------------- |
| **Shared Objects** | `GiftBox` - anyone can interact    |
| **Owned Objects**  | `ReputationNFT` - bound to user    |
| **Capabilities**   | `AdminCap` for treasury operations |
| **Events**         | Audit trail for all state changes  |

---

## ❌ What We Do NOT Use

| IOTA Service                   | Why Not Used                                                |
| ------------------------------ | ----------------------------------------------------------- |
| **IOTA Identity (DID)**        | Not needed for MVP. Could add for "Verified Seller" v2      |
| **IOTA Hierarchies**           | For trust chains (CA → SubCA). Not applicable to P2P trades |
| **IOTA Notarization (formal)** | We use Move Events instead                                  |

---

## 🏆 Hackathon Eligibility Summary

| Requirement        | Met? | How                          |
| ------------------ | ---- | ---------------------------- |
| Real-world problem | ✅   | €23B gift card waste problem |
| IOTA L1 Move       | ✅   | All logic in Move contracts  |
| IOTA Tokenization  | ✅   | GiftBox + ReputationNFT      |

**Conclusion**: GiftBlitz is eligible via **IOTA Tokenization on L1**. We do NOT claim Trust Framework/Identity/Hierarchies. 🚀
