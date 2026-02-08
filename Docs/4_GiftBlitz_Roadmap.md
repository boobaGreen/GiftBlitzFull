# Implementation Plan - GiftBlitz MVP

## 🎯 Goal

Build a P2P dApp for the secure exchange of Gift Cards on IOTA, using the "Mutual Trust Deposit" (Double Deposit) model to eliminate disputes without intermediaries.

## 🛠️ Tech Stack

- **Frontend:** React 18 (Vite) + TailwindCSS + Lucide Icons.
- **Smart Contracts:** IOTA Smart Contracts (ISC) - Rust/Wasm.
- **Network:** IOTA Testnet (EVM compatible or Native).
- **Storage (Off-chain):** IPFS or Encrypted Local Storage (for card code before unlock).
- **NFT Standard:** ERC-5192 (Soulbound Token) for Reputation NFT.
- **SVG Generation:** On-chain dynamic metadata for visual badges.

## 📅 Development Roadmap

### Phase 1: Smart Contract Core (The "Box" + NFT Foundation)

- Implementation of `GiftBlitz` Contract logic.
- `createBox(price, trust_deposit)`: Locks seller funds.
- `joinBox(boxId)`: Locks buyer funds + payment.
- `openBox(secretKey)`: Releases funds if key is correct (Happy Path).
- `cancelBox()`: Withdraw box from market (ONLY if state = OPEN). Returns trust deposit to seller.
- `autoFinalize()`: **Safety Feature.** If buyer does not close nor dispute within 24h of key reveal → Funds to Seller.
- `claimRefund()`: **Safety Feature.** If seller does not reveal key within 24h of join → Full refund to Buyer.
- `burnBox()`: Mutual destruction function (Dispute Path).
- **🎨 NFT Integration:**
  - `mintReputationNFT(address user)`: Mints Soulbound NFT on first trade.
  - `_updateNFTStats(address user, uint256 value)`: Updates volume/trade count (called for BOTH buyer and seller).
  - `getMaxBuyValue(uint256 tradeCount)`: Calculates automatic buyer cap (0-2→€30, 3-6→€50, 7-14→€100, 15+→€200).
  - `getMaxSellValue()`: Always returns €200 (seller can sell from day 1).
  - **Note:** Asymmetric Trust Deposit: Seller 100% Price, Buyer 110% Face Value.
  - **Note:** Each completed trade updates the reputation of BOTH parties (seller + buyer).

### Phase 2: Frontend & Wallet Integration

- Setup Vite project + IOTA SDK/Wagmi (if EVM).
- Wallet Connection (Metamask or TanglePay).
- Deterministic (Stateless) Cryptographic Key Generation via Wallet Signature (to avoid Local Storage).

### Phase 3: Core User Flows + NFT Minting

- **Seller Flow:**
  - Input card data → Generate Salt (Random) → Wallet Sign(Salt) → Derive Key.
  - Encrypt Code with Key → Append Salt to Ciphertext.
  - Call SC `createBox` (Store `Ciphertext + Salt` on-chain).
  - If first trade → Mints Soulbound NFT automatically.
- **Buyer Flow:**
  - List available Boxes (automatically filtered by buyer caps).
  - Call SC `joinBox` (Deposit Payment + Trust Deposit = 110% of Card Value).
  - If first trade → Mints Soulbound NFT automatically.
- **Reveal Flow:**
  - Seller reveals AES key (or does it automatically after buyer lock?).
  - _Note:_ Atomic design requires key to be revealed on-chain or via atomic swap. For simple MVP: Seller sends key off-chain after lock, if not → Burn.
- **Finalize Flow:**
  - Buyer confirms valid code → SC updates NFT stats (volume, trade count, level).

### Phase 4: NFT Visual Design & Metadata

- Implementation of `tokenURI(uint256 tokenId)` with on-chain dynamic SVG.
- Badge design for 4 tiers based on trade count (Newcomer/Member/Trusted/Veteran).
- JSON Metadata with updated stats (volume, trade count, disputes).
- Test NFT rendering on wallet (MetaMask, OpenSea testnet).

## ✅ Verification (Testing Plan)

1.  **Unit Test SC:** Test all economic scenarios (Happy path, Fraud attempt, Burn).
2.  **Simulation:** TypeScript script (already started) to validate trust deposit models.
3.  **Testnet Deployment:** Deploy on Shimmer/IOTA Testnet.

## 📂 Expected File Structure

```
/contracts
  GiftBlitz.rs (Escrow Logic)
  ReputationNFT.rs (Soulbound ERC-5192)
/src
  /components
    CreateBoxForm.tsx
    MarketplaceList.tsx
    SwapInterface.tsx
    ReputationBadge.tsx (Shows user NFT)
  /hooks
    useGiftBlitzContract.ts
    useReputationNFT.ts
  /lib
    crypto.ts (AES logic)
    svgGenerator.ts (Badge rendering)
```
