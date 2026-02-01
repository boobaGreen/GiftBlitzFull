# GiftBlitz - IOTA Hackathon Alignment 🚀

> **Alignment Check:** How GiftBlitz implements the Core Workshops

| Workshop Track | GiftBlitz Feature | Status |
| :--- | :--- | :--- |
| **Core 1-3 (Move)** | **Smart Escrow & Shared Objects** | ✅ Ready (The "Box") |
| **IOTA Notarization** | **Immutable Audit Trail** | ✅ Ready (Event Logs) |
| **IOTA Identity** | **Soulbound Reputation NFT** | ✅ Ready (SBT Identity) |

---

## 1. 🆔 IDENTITY TRACK (Workshop: IOTA Identity)

**Our Solution:** Soulbound Reputation NFT (ERC-5192)
Instead of just a "DID", we gamify Identity. The NFT *is* the user's on-chain Passport.

| Requirement | GiftBlitz Implementation |
| :--- | :--- |
| **Verifiable Credentials** | The NFT metadata (Trades, Volume, Disputes) |
| **Sybil Resistance** | Soulbound mechanism (Non-transferable) |
| **Reputation History** | On-chain state tracking |

---

## 2. 📜 NOTARIZATION TRACK (Workshop: TrueDoc)
![Notarization Architecture](./notarization_infographic.png)

**Our Solution:** The "Trustless Audit Trail"
Every step of the trade is a notarized event on the Tangle.

| Event | Data Notarized | Purpose |
| :--- | :--- | :--- |
| `BoxCreated` | Hash + Seller Stake | Proof of Commitment |
| `TradeConfirmed` | Timestamps + Release | Proof of Success |
| `TradeDisputed` | **Burn Proof** | Proof of Resolution |

---

## 3. 🧠 CORE / MOVE TRACK (Workshops: Core 1-3)

**Our Solution:** Smart Escrow & Shared Objects
GiftBlitz uses advanced Move patterns strictly aligned with the "Core" workshops.

*   **Shared Objects (Core 2):** The `GiftBox` is a shared object that anyone can interact with (Buy), but only under specific logic conditions.
*   **Capabilities (Core 3):** The `AdminCap` or `SellerCap` ensures only the right person can perform actions (like "Reveal Code").
*   **Dynamic Fields:** Used to attach the "Secret Code" securely to the Box object.

---

---

## 🏆 Hackathon Coverage Summary

We are hitting **5 out of 6** key workshops perfectly:

| Workshop | GiftBlitz Status | Note |
| :--- | :--- | :--- |
| **Core 1 (Intro)** | ✅ **Covered** | Base Logic |
| **Core 2 (Shared Obj)** | ✅ **Covered** | The `GiftBox` Listing |
| **Core 3 (Caps)** | ✅ **Covered** | Admin & Seller Permissions |
| **Notarization** | ✅ **Covered** | Event Logging (Audit) |
| **Identity** | ✅ **Covered** | Soulbound NFT (Custom) |
| **Gas Station** | ⏳ *Future* | Could add "Sponsored Tx" later |

**Conclusion:** The project is perfectly aligned with the technical requirements. We don't need to force other services. 🚀
