# 📜 GiftBlitz Smart Contracts Documentation

## 🎯 Overview

GiftBlitz is a decentralized platform for peer-to-peer gift card trading, built on the IOTA blockchain using the **Move** language. The project implements a secure trading system based on **trust deposits**, **cryptography**, and **on-chain reputation**.

---

## 🛠️ Technologies Used

### 1. **Move Language (2024 Edition)**

- **Language**: Move is a type-safe programming language designed for smart contracts.
- **Framework**: IOTA Move Framework (derived from Sui Move).
- **Key Features**:
  - Resource-oriented ownership system.
  - Compile-time guaranteed type safety and memory safety.
  - No garbage collector (explicit resource management).
  - Support for shared objects and owned objects.

### 2. **IOTA Blockchain**

- **Layer**: IOTA Layer 1.
- **IOTA Services Used**:
  - **Tokenization**: GiftBox as tradable NFTs/assets.
  - **Identity Framework**: ReputationNFT as soulbound identity.
  - **Clock**: Timestamp management for automatic timeouts.

### 3. **Resource Architecture**

- **Balance & Coin**: Native management of IOTA tokens.
- **Shared Objects**: GiftBox and Treasury shared among users.
- **Owned Objects**: Personal and non-transferable ReputationNFT.

---

## 📂 Contracts Structure

The project consists of **two main modules**:

```
contracts/
├── sources/
│   ├── giftblitz.move      (Main module: 448 lines)
│   └── reputation.move     (Reputation system: 95 lines)
├── tests/
│   └── giftblitz_tests.move (Integration tests)
└── Move.toml               (Package configuration)
```

---

## 🔷 MODULE 1: `giftblitz.move`

### Section 1: Imports and Dependencies (Lines 1-9)

```move
use iota::balance::{Self, Balance};
use iota::coin::{Self, Coin};
use iota::iota::IOTA;
use iota::clock::{Self, Clock};
use std::string::String;
use giftblitz::reputation::{Self, ReputationNFT};
```

**What it does**:

- Imports necessary modules from the IOTA framework.
- `Balance` and `Coin`: Management of IOTA tokens.
- `Clock`: Access to blockchain timestamp for timeouts.
- `String`: Type for brand names (e.g., "AMAZON", "NETFLIX").
- `ReputationNFT`: Custom reputation system.

---

### Section 2: Error Codes (Lines 11-17)

```move
const EIncorrectStake: u64 = 0;
const EInvalidState: u64 = 1;
const ENotAuthorized: u64 = 2;
const ETimeNotReached: u64 = 3;
const EKeyAlreadyRevealed: u64 = 4;
const EBuyerCapExceeded: u64 = 5;
```

**What it does**:

- Defines custom error codes for validation.
- `EIncorrectStake`: Incorrect trust deposit.
- `EInvalidState`: Invalid operation in the current state.
- `ENotAuthorized`: User not authorized for the action.
- `ETimeNotReached`: Timeout has not yet expired.
- `EBuyerCapExceeded`: Buyer has exceeded their reputation limit.

---

### Section 3: State Machine (Lines 19-25)

```move
const STATE_OPEN: u8 = 0;       // Box available for purchase
const STATE_LOCKED: u8 = 1;     // Buyer has locked the box
const STATE_REVEALED: u8 = 2;   // Seller has revealed the key
const STATE_COMPLETED: u8 = 3;  // Trade successfully completed
const STATE_BURNED: u8 = 4;     // Cancelled or disputed
const STATE_EXPIRED: u8 = 5;    // Timeout expired
```

**What it does**:

- Implements a 6-state machine.
- Controls the lifecycle flow of a GiftBox.
- Prevents invalid operations (e.g., reveal before lock).

**Normal Flow**:
`OPEN → LOCKED → REVEALED → COMPLETED`

---

### Section 4: Timeouts and Security (Lines 27-29)

```move
const REVEAL_TIMEOUT_MS: u64 = 259200000; // 72 hours
const FINALIZE_TIMEOUT_MS: u64 = 259200000; // 72 hours
```

**What it does**:

- **72 hours for reveal**: If the seller does not reveal the key within 72h of locking, the buyer can claim a refund + penalty.
- **72 hours for finalize**: If the buyer does not finalize/dispute within 72h of the reveal, the system auto-finalizes in favor of the seller.

**Security**: Prevents either party from indefinitely locking the other's funds.

---

### Section 5: Main Data Structures (Lines 31-62)

#### 5.1 AdminCap (Line 32)

```move
public struct AdminCap has key { id: UID }
```

**Capability** owned only by the administrator to withdraw fees from the Treasury.

#### 5.2 Treasury (Lines 35-38)

```move
public struct Treasury has key {
    id: UID,
    balance: Balance<IOTA>
}
```

**Shared Object** that accumulates:

- 1% fee on every trade.
- Burnt deposits in case of disputes.
- Timeout penalties.

#### 5.3 GiftBox (Lines 41-62) - **CENTRAL STRUCTURE**

```move
public struct GiftBox has key, store {
    id: UID,
    seller: address,
    buyer: Option<address>,
    card_brand: String,           // E.g., "AMAZON"
    face_value: u64,              // Nominal value (e.g., 100 IOTA)
    price: u64,                   // Requested price (e.g., 80 IOTA)

    // Trust Deposits
    seller_stake: Balance<IOTA>,  // 100% of face_value
    buyer_stake: Balance<IOTA>,   // 110% of face_value

    // Payment
    payment: Balance<IOTA>,       // Price paid by the buyer

    // Cryptography (Proxy Re-Encryption)
    encrypted_code_hash: vector<u8>,      // Hash of the encrypted code
    encrypted_code: vector<u8>,           // Encrypted gift card code
    encrypted_key: Option<vector<u8>>,    // Encrypted symmetric key for the buyer

    // State and timestamp
    state: u8,
    reveal_timestamp: Option<u64>,
    created_at: u64,
    locked_at: Option<u64>,
}
```

**What it does**:

- **Shared Object**: Accessible to seller, buyer, and system.
- **Trust Deposits**: Economic incentives for honest behavior.
  - Seller deposits 100% of face value → loses everything if they cheat.
  - Buyer deposits 110% of face value → recovers everything if honest.
- **Cryptography**: PRE (Proxy Re-Encryption) system for secure delivery.
- **State Machine**: Controls valid transitions.

---

### Section 6: Events (Lines 64-93)

```move
public struct BoxCreated has copy, drop { ... }
public struct BoxLocked has copy, drop { ... }
public struct KeyRevealed has copy, drop { ... }
public struct TradeFinalized has copy, drop { ... }
public struct BoxExpired has copy, drop { ... }
```

**What it does**:

- Emits on-chain events for every important action.
- The frontend listens to these events to update the UI in real-time.
- Enables full history traceability.

---

### Section 7: Initialization Function (Lines 95-103)

```move
fun init(ctx: &mut TxContext) {
    transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
    transfer::share_object(Treasury {
        id: object::new(ctx),
        balance: balance::zero(),
    });
}
```

**What it does**:

- Automatically executed upon contract deployment.
- Creates the `AdminCap` and transfers it to the deployer.
- Creates the shared `Treasury` to accumulate fees.

---

### Section 8: Core Protocol Functions

#### 8.1 `create_box` (Lines 108-158) - **SELLER CREATES GIFT BOX**

```move
public entry fun create_box(
    card_brand: String,
    face_value: u64,
    price: u64,
    encrypted_code_hash: vector<u8>,
    encrypted_code: vector<u8>,
    stake_coin: Coin<IOTA>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**What it does**:

1. **Validation**: verifies that `price > 0`, `face_value > 0`.
2. **Stake Check**: Seller MUST deposit exactly `face_value` (100%).
3. **Cryptography**: Saves `encrypted_code` and `encrypted_code_hash`.
4. **Initial State**: `STATE_OPEN`.
5. **Sharing**: Makes the GiftBox a shared object accessible to everyone.

**Why does the Seller deposit 100%?**

- If they sell a fake/used code, they lose the entire deposit.
- Economically irrational to cheat.

---

#### 8.2 `join_box` (Lines 161-198) - **BUYER PURCHASES THE BOX**

```move
public entry fun join_box(
    box: &mut GiftBox,
    payment_and_stake: Coin<IOTA>,
    buyer_rep_nft: &ReputationNFT,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**What it does**:

1. **State Check**: Verifies that `state == STATE_OPEN`.
2. **Buyer Caps**: Checks that the price does not exceed the buyer's reputation limit.
   - 1-2 trades: max 30 IOTA
   - 3-5 trades: max 50 IOTA
   - 6-10 trades: max 100 IOTA
   - 11-25 trades: max 500 IOTA
   - 26+ trades: max 1000 IOTA
3. **Total Payment**: `price + (110% face_value)`
   - Example: face_value=100, price=80 → buyer pays `80 + 110 = 190 IOTA`.
4. **Lock**: Changes state to `STATE_LOCKED` and saves timestamp.

**Why does the Buyer deposit 110%?**

- Prevents malicious buyers from locking boxes without intention to complete.
- The extra 10% is an incentive to finalize quickly.

---

#### 8.3 `reveal_key` (Lines 201-221) - **SELLER REVEALS THE KEY**

```move
public entry fun reveal_key(
    box: &mut GiftBox,
    encrypted_key: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**What it does**:

1. **Authorization**: Only the seller can call this function.
2. **State Check**: Box must be in `STATE_LOCKED`.
3. **Reveal**: Saves `encrypted_key` which allows the buyer to decrypt the code.
4. **Timestamp**: Records `reveal_timestamp` to activate the 72h timeout.
5. **New State**: `STATE_REVEALED`.

**Technology**: Uses Proxy Re-Encryption (PRE) for trustless delivery.

---

#### 8.4 `finalize` (Lines 224-270) - **BUYER CONFIRMS (HAPPY PATH)**

```move
public entry fun finalize(
    box: &mut GiftBox,
    rep_nft: &mut ReputationNFT,
    treasury: &mut Treasury,
    ctx: &mut TxContext
)
```

**What it does**:

1. **Authorization**: Only the buyer can finalize.
2. **State Check**: `state == STATE_REVEALED`.
3. **Fund Distribution**:
   - **1% fee** → Treasury.
   - **99% payment** → Seller.
   - **Seller stake** → Seller (deposit refund).
   - **Buyer stake** → Buyer (deposit refund).
4. **Reputation**: Increments buyer's `total_trades` and `total_volume`.
5. **Final State**: `STATE_COMPLETED`.

**Economics**: Both recover their deposits, seller receives payment.

---

#### 8.5 `dispute` (Lines 273-306) - **BUYER DISPUTES (UNHAPPY PATH)**

```move
public entry fun dispute(
    box: &mut GiftBox,
    buyer_rep_nft: &mut ReputationNFT,
    seller_rep_nft: &mut ReputationNFT,
    treasury: &mut Treasury,
    ctx: &mut TxContext
)
```

**What it does**:

1. **Authorization**: Only the buyer can dispute.
2. **When**: If the revealed code is invalid/used.
3. **Distribution**:
   - **Payment** → Buyer (full refund).
   - **Seller stake** → Treasury (BURNT).
   - **Buyer stake** → Treasury (BURNT).
4. **Reputation Penalty**:
   - Buyer: `total_trades` reset to 0.
   - Seller: `total_trades` reset to 0 + `disputes` increment.
5. **State**: `STATE_BURNED`.

**Deterrence**: Both parties lose deposits → discourages frivolous disputes.

---

#### 8.6 `claim_reveal_timeout` (Lines 351-410) - **BUYER CLAIMS SELLER TIMEOUT**

```move
public entry fun claim_reveal_timeout(
    box: &mut GiftBox,
    treasury: &mut Treasury,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**What it does**:

1. **Conditions**:
   - State `LOCKED`.
   - Seller has not revealed the key.
   - 72 hours have passed since `locked_at`.
2. **Distribution**:
   - **Payment** → Buyer.
   - **Buyer stake** → Buyer.
   - **50% Seller stake** → Buyer (compensation).
   - **50% Seller stake** → Treasury.
3. **State**: `STATE_EXPIRED`.

**Protection**: The buyer is not left stuck if the seller disappears.

---

#### 8.7 `claim_auto_finalize` (Lines 309-348) - **AUTO-FINALIZE AFTER TIMEOUT**

```move
public entry fun claim_auto_finalize(
    box: &mut GiftBox,
    treasury: &mut Treasury,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**What it does**:

1. **Conditions**:
   - State `REVEALED`.
   - 72 hours have passed since `reveal_timestamp`.
   - Buyer has neither finalized nor disputed.
2. **Distribution**:
   - **Payment (- 1% fee)** → Seller.
   - **Seller stake** → Seller.
   - **Buyer stake** → Buyer (returned).
3. **State**: `STATE_COMPLETED`.

**Logic**: Buyer's silence equates to acceptance.

---

#### 8.8 `cancel_box` (Lines 413-426) - **SELLER CANCELS UNSOLD BOX**

```move
public entry fun cancel_box(
    box: &mut GiftBox,
    ctx: &mut TxContext
)
```

**What it does**:

- Allows the seller to recover their stake if no one has purchased.
- Only in `STATE_OPEN` state.
- Fully refunds `seller_stake`.

---

#### 8.9 `withdraw_fees` (Lines 429-446) - **ADMIN WITHDRAWS FEES**

```move
public entry fun withdraw_fees(
    _: &AdminCap,
    treasury: &mut Treasury,
    amount: Option<u64>,
    ctx: &mut TxContext
)
```

**What it does**:

- Only the `AdminCap` holder can call.
- Withdraws accumulated fees from Treasury.
- If `amount` is `None`, withdraws everything.

---

## 🔷 MODULE 2: `reputation.move`

### Overview

**On-chain identity and soulbound reputation** (non-transferable) system.

---

### Main Structure: `ReputationNFT` (Lines 9-18)

```move
public struct ReputationNFT has key {
    id: UID,
    owner: address,
    public_key: vector<u8>,  // Public key for PRE
    vault: vector<u8>,       // Encrypted private key (identity recovery)
    total_trades: u64,       // Number of completed trades
    total_volume: u64,       // Total traded volume
    disputes: u64,           // Number of disputes
    first_trade_time: u64,   // Timestamp of first trade
}
```

**Features**:

- **Soulbound**: Only `has key` (NOT `has store`) → non-transferable.
- **Identity Anchor**: Contains keys for encryption and recovery.
- **On-Chain Reputation**: Publicly verifiable statistics.

---

### Main Functions

#### `mint_profile` (Lines 35-54) - **PROFILE CREATION**

```move
public entry fun mint_profile(
    public_key: vector<u8>,
    vault: vector<u8>,
    ctx: &mut TxContext
)
```

**What it does**:

- Creates a new ReputationNFT.
- Initializes statistics to zero.
- Transfers the NFT to the user (soulbound).

**Usage**: First step for every user of the platform.

---

#### `update_stats` (Lines 57-60) - **UPDATE AFTER TRADE**

```move
public(package) fun update_stats(nft: &mut ReputationNFT, volume: u64)
```

**What it does**:

- Increments `total_trades` by 1.
- Adds `volume` to `total_volume`.
- **Visibility `package`**: Only `giftblitz.move` can call it.

---

#### `get_max_trade_value` (Lines 87-94) - **MIRROR CAPS**

```move
public fun get_max_trade_value(nft: &ReputationNFT): u64 {
    let t = nft.total_trades;
    if (t <= 1) { return 30_000_000_000 }       // 30 IOTA (Human 1-2)
    else if (t <= 4) { return 50_000_000_000 }  // 50 IOTA (Human 3-5)
    else if (t <= 9) { return 100_000_000_000 } // 100 IOTA (Human 6-10)
    else if (t <= 24) { return 500_000_000_000 } // 500 IOTA (Human 11-25)
    else { return 1_000_000_000_000 }            // 1000 IOTA (Human 26+)
}
```

**What it does**:

- Limits how much a buyer can spend based on reputation.
- Progressive "leveling" system.
- Protects sellers from high-risk new buyers.

---

#### `reset_on_dispute` and `record_dispute_counterparty` (Lines 63-72)

**What it does**:

- **Full reset** of `total_trades` to 0.
- Increments `disputes` counter.
- **Maximum penalty**: Both parties return to level 0.

**Deterrence**: Avoids frivolous disputes (too costly in terms of reputation).

---

#### `update_vault` (Lines 75-79) - **IDENTITY RECOVERY**

```move
public entry fun update_vault(
    nft: &mut ReputationNFT,
    new_public_key: vector<u8>,
    new_vault: vector<u8>,
    ctx: &TxContext
)
```

**What it does**:

- Allows owner to update cryptographic keys.
- **Usage**: Cross-device recovery, browser change, security reset.

---

## 🔷 MODULE 3: `giftblitz_tests.move`

### Full Integration Test (Lines 20-93)

```move
#[test]
fun test_happy_path()
```

**Tested Flow**:

1. **Setup**: Initialize scenario with Alice (seller) and Bob (buyer).
2. **Bob mint_profile**: Creates ReputationNFT.
3. **Alice create_box**: Creates GiftBox (price=100, face=100, stake=100).
4. **Bob join_box**: Pays 210 (100 price + 110 stake).
5. **Alice reveal_key**: Reveals encrypted key.
6. **Bob finalize**: Confirms trade, updates reputation.

**Validations**:

- Bob's reputation passes from 0 to 1 trade.
- All funds distributed correctly.
- States transition correctly.

---

## 🎨 Technologies and Advanced Patterns

### 1. **Proxy Re-Encryption (PRE)**

- Seller encrypts the code with a symmetric key.
- The symmetric key is re-encrypted for the buyer.
- **Zero trust**: No central server can read the code.

### 2. **Game Theory & Economic Security**

- **Trust Deposits**: Make it economically irrational to cheat.
- **Timeouts**: Prevent deadlocks and griefing.
- **Reputation Stakes**: Progressive leveling system.

### 3. **Shared Objects Architecture**

- `GiftBox`: Shared between seller, buyer, and system.
- `Treasury`: Globally shared.
- **Ownership**: Personal non-transferable ReputationNFT.

### 4. **Event-Driven Frontend**

- All on-chain events are listened to by the frontend.
- Real-time UI updates without polling.
- Full history traceability.

---

## 📊 Main Flow Diagram

```
1. SELLER creates box (STATE_OPEN)
   ├─ Deposits 100% face_value
   └─ Encrypts gift card code

2. BUYER purchases (STATE_LOCKED)
   ├─ Pays price + 110% face_value
   └─ Verifies buyer caps reputation

3. SELLER reveals key (STATE_REVEALED)
   ├─ Publishes encrypted_key
   └─ Activates 72h timeout

4a. BUYER confirms (STATE_COMPLETED) ✅
    ├─ Recovers all (payment+stake)
    ├─ Seller receives payment+stake
    └─ Reputation increased

4b. BUYER disputes (STATE_BURNED) ⚠️
    ├─ Buyer recovers only payment
    ├─ All stakes → Treasury
    └─ Reputation reset for both

4c. Timeout auto-finalize (STATE_COMPLETED) ⏱️
    └─ After 72h without buyer action
```

---

## 🔐 Security Mechanisms

1. **Trust Deposits**: Economic deterrence against fraud.
2. **Timeouts**: 72h for reveal + 72h for finalize.
3. **Mirror Caps**: Progressive limits for both Buyers and Sellers based on reputation.
4. **Dispute Penalties**: Full reputation reset.
5. **PRE Encryption**: Zero knowledge of gift card code.
6. **Admin Separation**: Only fee withdrawal, no trade control.

---

## 💡 Key Innovations

### 1. **Total Decentralization**

No intermediaries, no backend → everything on-chain.

### 2. **Soulbound Identity**

ReputationNFT as verifiable identity that cannot be bought.

### 3. **Economically Rational Security**

Penalties make it uneconomical to cheat.

### 4. **Instant Delivery**

Proxy Re-Encryption for immediate trustless delivery.

### 5. **Fair Dispute System**

Both parties lose stake → avoids frivolous disputes.

---

## 📈 Contract Statistics

- **Total lines of code**: ~640 (including comments).
- **Public functions**: 11.
- **Events**: 5.
- **States**: 6.
- **Timeouts**: 2 (reveal, finalize).
- **Test coverage**: Integrated happy path.

---

## 🚀 Conclusions

GiftBlitz contracts implement a **trustless decentralized marketplace** for gift cards using:

- **Move language** for type safety.
- **IOTA blockchain** for scalability.
- **Trust deposits** for economic incentives.
- **PRE encryption** for privacy.
- **Soulbound reputation** for on-chain identity.

The system is **fully autonomous**, without central servers or custodians, making censorship or centralized control impossible.
