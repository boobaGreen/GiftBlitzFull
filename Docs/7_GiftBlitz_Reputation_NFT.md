# GiftBlitz - The NFT Reputation System 🎖️

> **Why we use a Soulbound NFT for reputation and how it works**

### The Big Picture: Security, Speed & Utility
![Why Soulbound Master](./why_soulbound_master.png)
*Figure 1: The 3 Pillars of GiftBlitz Reputation System*

---

### 🤔 What about Notarization? (NFT vs Ledger)

You rightly asked: *"But wasn't the blockchain enough?"*
The answer is that **we use both**, but for different purposes. Imagine the difference between a **Bank Statement** and your **Credit Score**.

| Feature | **Notarization (IOTA Tangle)** | **Soulbound NFT (Smart Contract)** |
| :--- | :--- | :--- |
| **What is it?** | The **Complete Registry** (Log) | The **Current Score** (State) |
| **Data** | "Trade #123 started", "Trade #123 locked", "Trade #123 dispute..." | "Level: 3", "Total Trades: 15" |
| **Usage** | **Audit & Search**: *"Let me see exactly what happened in trade X"* | **Access**: *"Can the user enter here?"* (Yes/No immediate) |
| **Analogy** | 📜 **The Bank Statement** (Thousands of lines) | 💳 **The Gold Card** (A single object) |

**Notarization is the "Source of Truth"**. The NFT is the **calculated result** from that truth, optimized to be used by machines (Smart Contract) and humans (UI) in real-time.

---

## 🎯 What is the Reputation NFT for?

The Reputation NFT is an **on-chain certificate** that tracks your history on GiftBlitz. It serves to:

| Function | Why It's Important |
|----------|---------------------|
| **Track Trade Count** | Determines your buying limits |
| **Prevent Sybil Attack** | You cannot buy/sell reputation |
| **Transparency** | Everyone sees your history |
| **Persistence** | Data survives even if you switch wallets |

---

## 🔒 What is a "Soulbound" NFT?

A Soulbound NFT (SBT) is a token that **CANNOT be transferred or sold**.

```
Normal NFT:            Soulbound NFT:
┌─────────────┐        ┌─────────────┐
│  Can be     │        │  Bound      │
│  sold       │        │  forever to │
│  or gifted  │        │  your wallet│
└─────────────┘        └─────────────┘
      ↓                      ↓
   Tradable              NON Tradable
```

### Why Soulbound?

| Problem | Soulbound Solution |
|----------|---------------------|
| "I buy a Pro account from someone" | ❌ Impossible, the NFT doesn't move |
| "I make 100 accounts and farm them" | ❌ Expensive (1% fee × trade) + time |
| "I sell my reputation" | ❌ The NFT stays in your wallet |

### 🛠️ Why technically do we need an NFT? (vs Log)

Could we simply read the transaction history on the blockchain? Yes, but it would be **inefficient** for two critical reasons on IOTA/EVM:

![Efficiency Comparison](./sbt_efficiency.png)

1.  **Computation Efficiency (Gas & Storage):**
    *   **Log/History:** To know if you are "reliable", the Smart Contract would have to re-read *all* your 100+ past transactions every time you buy something. This costs computation (Gas) and on IOTA L1 would require increasing **Storage Deposit** (you would have to lock more and more IOTA to save new data).
    *   **NFT (State):** The NFT is like a "single variable" precisely updated. Reading your level always costs **very little and is instant**, whether you have done 1 trade or 1 million.

2.  **Future Composability (Trust Lego):**
    *   A simple internal "log" is visible only to our contract.
    *   A **Standard NFT (ERC-721)** is an object that "lives" in your wallet.
    *   *Future Example:* Another lending dApp on IOTA might say: *"If you have the Veteran Badge on GiftBlitz, we give you a loan with lower collateral"*. This is impossible without a standard token.

---

## 📊 What Does the Reputation NFT Contain?

```solidity
struct ReputationNFT {
    address owner;           // Your wallet (fixed forever)
    uint256 totalTrades;     // How many trades you completed
    uint256 totalVolume;     // Total volume in € 
    uint256 disputes;        // How many disputes you had
    uint256 firstTradeTime;  // When you started
}
```

### Practical Example

```
👤 Mario - Reputation NFT

┌────────────────────────────────────┐
│  🎖️ GiftBlitz Reputation          │
│                                    │
│  Owner: 0x71C...9A21               │
│  Total Trades: 12                  │
│  Total Volume: €450                │
│  Disputes: 0 ✅                    │
│  Member Since: Jan 2026            │
│                                    │
│  Status: VETERAN (15+ trades)      │
│  Max Buy: €200                     │
└────────────────────────────────────┘
```

---

## 🛡️ How Does the System Protect?

### 1. Anti-Sybil (Many Fake Accounts)

**Without NFT:**
```
Attacker creates 100 wallets → 100 clean identities
Can do infinite griefing
```

**With Soulbound NFT:**
```
Attacker creates 100 wallets → 100 new NFTs
Each NFT starts from 0 trades → Max buy €30
To reach €200: needs to do 15 real trades × 100 accounts
Cost: huge time + fees
```

### 2. Anti-Reputation Farming

**Scenario:** User trades with themselves to inflate numbers

```
Trade count = 15 → "Unlocked" €200 max
But costs: 15 × €30 × 1% = €4.50 in fees
+ Time for each trade
+ If disputes by mistake = reset to 0
```

### 3. Total Transparency

When you buy from a seller, you can see:
- ✅ How many trades they have done
- ✅ How many disputes they have had (ideally 0)
- ✅ How long they have been on the platform

---

## 🎨 How Does It Look Visually?

The NFT shows a dynamic badge that changes based on your experience:

| Trade Count | Badge | Color |
|-------------|-------|--------|
| 0-2 | 🔵 Newcomer | Blue |
| 3-6 | 🟢 Member | Green |
| 7-14 | 🟣 Trusted | Purple |
| 15+ | 🟡 Veteran | Gold |

```svg
┌────────────────────────┐
│    ⭐ VETERAN ⭐        │
│                        │
│    12 Trades           │
│    €450 Volume         │
│    0 Disputes          │
│                        │
│    [█████████░] 80%    │
│    to next level       │
└────────────────────────┘
```

---

## ❓ FAQ

**Q: When do I receive my NFT?**
> Automatically upon your first completed trade.

**Q: Can I have multiple NFTs on different wallets?**
> Yes, each wallet has its own NFT with its separate history.

**Q: If I lose access to the wallet, do I lose reputation?**
> Yes, reputation is tied to the wallet. Use a secure wallet!

**Q: Does the NFT cost gas to be created?**
> On IOTA the NFT is created without gas fees thanks to the feeless architecture.

**Q: If I dispute, what happens to my NFT?**
> The `disputes` field increases by 1 and `totalTrades` goes back to 0.

---

## ✅ Conclusion: Is the NFT Still Needed?

**YES, absolutely!** Here is why:

| Without NFT | With Soulbound NFT |
|-----------|-------------------|
| Anyone can pretend to be a veteran | Data is on-chain and verifiable |
| You can buy "Pro" accounts | Impossible to transfer reputation |
| No persistent history | Everything is tracked forever |
| Easy Sybil attack | Expensive and slow Sybil attack |

### The Reputation NFT is the "ID card" of GiftBlitz:
- 🔒 **Unfalsifiable** (on-chain)
- 🔒 **Non-transferable** (Soulbound)
- 🔒 **Transparent** (everyone can verify)
- 🔒 **Persistent** (cannot be deleted)

---

## 🔧 Technical Implementation

```solidity
// Standard: ERC-5192 (Soulbound Token Extension)
// Network: IOTA EVM (ISC)

interface ISoulbound {
    // Blocks any transfer
    function locked(uint256 tokenId) external view returns (bool);
    // Always true for our NFTs
}

contract GiftBlitzReputation is ERC721, ISoulbound {
    mapping(uint256 => ReputationData) public reputation;
    
    // Override transfer to block
    function _beforeTokenTransfer(...) internal override {
        require(from == address(0), "Soulbound: non transferable");
    }
}
```

---

## 📌 Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    REPUTATION NFT                           │
│                                                             │
│  ✅ Tracks: trades, volume, disputes, time                 │
│  ✅ Non-transferable: bound to wallet forever              │
│  ✅ Determines: purchase limits (buyer caps)               │
│  ✅ Prevents: Sybil, farming, account trading              │
│  ✅ Shows: visual badge of your status                     │
│                                                             │
│  → It is the on-chain proof that you are a reliable user   │
└─────────────────────────────────────────────────────────────┘
```
