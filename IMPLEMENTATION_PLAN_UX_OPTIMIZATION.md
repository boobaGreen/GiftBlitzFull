# 🚀 Implementation Plan: UX Optimization & New Trade Flow

> **Date**: 2026-02-01  
> **Goal**: Implement complete trade flow with timeouts, auto-finalize, and optimized UX

---

## 📋 Executive Summary

### New System Rules

1. ✅ **NO Cancellation After Join**: Once buyer purchases, seller cannot cancel
2. ✅ **Reveal Timeout: 72h**: Seller must reveal key within 72 hours or buyer gets refund + compensation
3. ✅ **Auto-Finalize: 72h**: If buyer doesn't confirm/dispute within 72h after reveal, trade auto-finalizes (assumes valid)
4. ✅ **Compensation**: Buyer gets 50% of seller stake if seller doesn't reveal in time
5. ✅ **1% Protocol Fee**: A 1% fee is deducted from the seller's revenue on every successful trade
6. ✅ **UX Optimization**: Clear countdowns, warnings, and auto-polling

---

## 🎯 Implementation Checklist

### Phase 1: Documentation Updates

- [ ] Update `KEY_DISTRIBUTION_SOLUTIONS.md` with final decision
- [ ] Update `FINAL_PROPOSAL.md` with implementation details
- [ ] Update `Clod/6_SecretBox_Rules_Mechanics.md` with new timeout rules
- [ ] Update `Clod/9_Backend_Project_Document.md` with new smart contract logic
- [ ] Create `TRADE_FLOW_SPECIFICATION.md` with complete flow diagrams

### Phase 2: Smart Contract Changes

- [ ] Add `locked_at` timestamp to `GiftBox` struct
- [ ] Add `STATE_EXPIRED` constant
- [ ] Remove `cancel_box()` function (or restrict to OPEN state only)
- [ ] Implement `claim_reveal_timeout()` function
- [ ] Update `claim_auto_finalize()` to work 72h after reveal (not 24h)
- [ ] Add compensation logic (50% stake to buyer, 50% Protocol Treasury)
- [ ] Implement 1% platform fee in `finalize()`
- [ ] Update events to include timestamps
- [ ] Add helper view functions for timeout calculations

### Phase 3: Frontend - Core Logic

- [ ] Update `useGiftBlitz.ts` hook with new timeout functions
- [ ] Add `claimRevealTimeout()` function
- [ ] Remove or restrict `cancelBox()` function
- [ ] Add countdown timer utilities
- [ ] Add auto-polling for key reveal detection
- [ ] Update box state management for EXPIRED state

### Phase 4: Frontend - UI Components

- [ ] Create `CountdownTimer.tsx` component
- [ ] Create `WarningModal.tsx` for pre-purchase warning
- [ ] Update `TradeDetail.tsx` with countdown and warnings
- [ ] Update `PurchaseBox.tsx` with pre-purchase modal
- [ ] Update `Profile.tsx` to show urgent actions
- [ ] Create `VerificationGuide.tsx` component for code testing
- [ ] Add browser notifications support

### Phase 5: Testing

- [ ] Test reveal timeout flow (seller doesn't reveal)
- [ ] Test auto-finalize flow (buyer doesn't confirm)
- [ ] Test happy path (seller reveals, buyer confirms)
- [ ] Test dispute flow
- [ ] Test UI countdowns and warnings
- [ ] Test edge cases (exactly at timeout, etc.)

---

## 📊 New Trade Flow Diagram

```
States Flow:
[OPEN] → Seller creates box
   ↓
[LOCKED] → Buyer purchases (72h countdown starts)
   ↓
   ├─→ [EXPIRED] → Seller didn't reveal in 72h (buyer claims refund)
   └─→ [REVEALED] → Seller reveals key (72h countdown starts)
       ↓
       ├─→ [COMPLETED] → Buyer confirms OR 72h auto-finalize (1% fee collected)
       └─→ [BURNED/CONFISCATED] → Buyer disputes (All stakes to Treasury)

Timeouts:
- LOCKED → EXPIRED: 72h (reveal timeout)
- REVEALED → COMPLETED: 72h (auto-finalize timeout)
```

---

## 🔧 Smart Contract Changes

### 1. Updated `GiftBox` Struct

```move
public struct GiftBox has key, store {
    id: UID,
    seller: address,
    buyer: Option<address>,
    card_brand: String,
    face_value: u64,
    price: u64,

    // Stakes & Payment
    seller_stake: Balance<IOTA>,
    buyer_stake: Balance<IOTA>,
    payment: Balance<IOTA>,

    // Security
    encrypted_code_hash: vector<u8>,
    encrypted_code: vector<u8>,
    encrypted_key: Option<vector<u8>>,

    // State & Timestamps
    state: u8,
    created_at: u64,
    locked_at: Option<u64>,        // NEW: When buyer joined
    reveal_timestamp: Option<u64>,
}
```

### 2. New Constants

```move
// States
const STATE_EXPIRED: u8 = 5;  // NEW

// Timeouts
const REVEAL_TIMEOUT_MS: u64 = 259200000; // 72 hours
const FINALIZE_TIMEOUT_MS: u64 = 259200000; // 72 hours
```

### 3. New Function: `claim_reveal_timeout()`

Buyer can claim refund + compensation if seller doesn't reveal within 72h.

### 4. Updated `claim_auto_finalize()`

Changed from 24h to 72h after reveal.

### 5. Restrict `cancel_box()` to OPEN State Only

Seller can only cancel if nobody has purchased yet.

---

## 🎨 Frontend UX Changes

### 1. Pre-Purchase Warning Modal

Shows before buyer purchases, warning about 72h verification requirement.

### 2. Countdown Timer Component

Displays time remaining with urgent warnings when < 24h.

### 3. Updated TradeDetail Page

- Auto-polling for key reveal
- Countdown timers for both timeouts
- Verification guide
- Urgent warnings
- Claim timeout button

### 4. Verification Guide Component

Step-by-step instructions for testing gift codes on different platforms.

---

## 📝 Documentation Updates Needed

### Root Documentation:

- `KEY_DISTRIBUTION_SOLUTIONS.md`
- `FINAL_PROPOSAL.md`
- `SECURITY_ANALYSIS_3A.md`
- `PRE_ENCRYPTION_ARCHITECTURE.md`

### Clod Documentation:

- `Clod/6_SecretBox_Rules_Mechanics.md`
- `Clod/9_Backend_Project_Document.md`
- Create `Clod/TRADE_FLOW_COMPLETE.md`

---

## 🧪 Testing Checklist

### Smart Contract Tests

- [ ] claim_reveal_timeout at 72h
- [ ] claim_auto_finalize at 72h after reveal
- [ ] cancel_box restricted to OPEN state
- [ ] Compensation calculation (50% buyer, 50% Treasury)
- [ ] 1% Platform fee calculation and collection

### Frontend Tests

- [ ] Countdown timers
- [ ] Auto-polling
- [ ] Pre-purchase warning
- [ ] Verification guide
- [ ] Browser notifications

---

## 📅 Implementation Timeline

- **Day 1**: Smart Contract updates
- **Day 2**: Frontend core logic
- **Day 3**: Frontend UI components
- **Day 4**: Documentation & testing

---

## ✅ Success Criteria

- [ ] Seller cannot cancel after buyer joins
- [ ] Buyer gets refund + compensation if seller doesn't reveal in 72h
- [ ] Trade auto-finalizes if buyer doesn't act in 72h after reveal
- [ ] All countdowns display correctly
- [ ] Warnings are clear and prominent
- [ ] Documentation complete

---

**Ready to implement!** 🚀
