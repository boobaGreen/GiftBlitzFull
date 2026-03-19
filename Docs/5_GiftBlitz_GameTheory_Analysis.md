# GiftBlitz - Game Theory & Security Analysis 🔒📊

> **Goal:** Analyze and balance the trust deposit system to make it:
>
> 1. **Enticing** → Low entry barriers for honest users
> 2. **Secure** → Fraud mathematically irrational
> 3. **Resistant** → Protection from external attacks (wash trading, griefing)

> [!IMPORTANT]
> **Sections 1-5 are HISTORICAL ANALYSES** documenting the reasoning process.
> **The FINAL DECISION is in Section 6** → Asymmetric Trust Deposit + Buyer caps + No Newbie/Pro levels.

---

## 1. Analysis of Current Model (from WhitePaper)

### 1.1 Seller Trust Deposit

| Level   | Trust Deposit Required  | Logic                                                               |
| ------- | ----------------------- | ------------------------------------------------------------------- |
| Base    | **100% of FACE VALUE**  | **Safety First:** Prevents double-spending with certain net loss    |

### 1.2 Buyer Trust Deposit

| Level   | Trust Deposit Required  | Logic                        |
| ------- | ----------------------- | ---------------------------- |
| Newbie  | 50% of value            | To be verified if sufficient |
| Pro     | 25% of value?           | To be defined                |

### 1.3 Level-Up Requirements (Current)

- **Pro:** 5 trades + €30 average per trade (€150 minimum volume)

## 2. Complete Examples with Money Flow

> **Important Clarification:**
>
> - **Card Value** = How much the card is worth (e.g., €50 Amazon)
> - **Sale Price** = How much the buyer pays (e.g., €40, with 20% discount)
> - **Trust Deposit** = Security deposit (calculated as % of PRICE, not value)

---

### ❓ Q1: Why 100% of Face Value (and not price)?

#### Example: Selling €100 Card at Price €80

**Initial Setup:**
| Actor | Deposits | Total Locked |
|-------|----------|--------------|
| Seller | Trust Deposit = 100% of €100 (Face Value) = **€100** | €100 |
| Buyer | Price €80 + Trust Deposit €110 (110% V) = €190 | **€190** |
| **Total in Escrow** | | **€290** |

---

**🟢 SCENARIO A: Honest Trade (Happy Path)**

1. Seller reveals key, Buyer verifies → confirms.
2. Smart Contract releases funds.

| Actor  | Receives Back                              | Net Gain                  |
| ------ | ------------------------------------------ | ------------------------- |
| Seller | €100 (trust deposit) + €80 (price) = €180  | **+€80** (sells card)     |
| Buyer  | €110 (trust deposit) + Card (€100)         | **+€20** (value - cost)   |

---

**🔴 SCENARIO B: Double Spending (Seller Frauds)**

The Seller sells the card here AND on another platform for €80.
Here provides invalid code (or already used). Buyer disputes.

1. **Elsewhere:** Seller collects €80.
2. **Here (GiftBlitz):** Buyer disputes → Treasury confiscates Seller's deposit (€100).
3. **Seller Calculation:**
   - Gain Elsewhere: +€80
   - Loss Here: -€100
   - **NET: -€20 💸**

**Conclusion:**
With the deposit at **100% of Face Value**, double-spending is mathematically a **certain loss**.
The scammer does not break even (as would happen with deposit on price), but loses money.
**FRAUD IRRATIONAL AND COSTLY. ✅**

---

### 🧮 MATHEMATICAL PROOF: Why the Buyer is ALWAYS Incentivized to BURN

> **⚠️ COMMON OBJECTION:** "If I've already been scammed (fake code), isn't it better to say 'OK' to at least recover my trust deposit, instead of burning everything?"

**ANSWER: NO!** Here is the formal proof.

#### Problem Setup

- **Card:** Face value V = €50
- **Price:** P = €40 (20% discount)
- **Buyer Trust Deposit:** B = 100% × P = €40
- **Seller Trust Deposit:** S = 100% × P = €40 (or 200% for Newbie = €80)

#### Smart Contract Flow

1. Buyer deposits: **P + B** = €40 + €40 = €80
2. Seller deposits: **S** = €40 (or €80)
3. Total in escrow: €120 (or €160)

#### What Happens in Case of BURN:

```
 ┌─────────────────────────────────────────────────────┐
 │   TREASURY = Confiscates ONLY Trust Deposits (B + S)     │
 │   The PRICE (P) is RETURNED to the Buyer!                │
 └─────────────────────────────────────────────────────┘
```

#### Buyer Decision Table (when scammed)

| Action              | Buyer Loses           | Buyer Recovers        | Net Result Buyer      |
| ------------------- | --------------------- | --------------------- | --------------------- |
| Confirm OK (false)  | P = €40               | Trust Deposit B = €40 | **-€40** ❌           |
| DISPUTE             | Trust Deposit B = €40 | Price P = €40         | **€0** ✅             |

#### ✅ FORMAL CONCLUSION

**If the buyer has been scammed (invalid code):**

```
Payoff(Confirm OK) = -P = -€40
Payoff(BURN)        = -B + P = -€40 + €40 = €0

Since €0 > -€40 → DISPUTE is ALWAYS the rational choice!
```

**In general formula:**

```
If B ≤ P → BURN is always dominant for scammed buyer.
BUT WARNING: If Card Value > Trust Deposit, a malicious buyer could scam (Burner Account Scenario).
**Solution:** Set Buyer Trust Deposit > Card Value (e.g., 110%).
```

---

### 🎯 IMPLICATION: Why the Seller Cannot Scam

Knowing that the Buyer will **always** BURN if scammed:

| Scenario          | Seller Gains    | Seller Loses | Seller EV        |
| ----------------- | --------------- | ------------ | ---------------- |
| Honest Trade      | +P = €40        | €0           | **+€40** ✅      |
| Fraud (→ Dispute) | €0              | S = €40/€80  | **-€40/-€80** ❌ |

**The rational seller knows that fraud causes BURN with certainty → never frauds.**

---

### 📊 Complete Game Matrix (Nash Equilibrium)

|                   | Buyer Confirms | Buyer BURN               |
| ----------------- | -------------- | ------------------------ |
| **Seller Honest** | (+40, +10) ✅  | (-80, 0)                 |
| **Seller Frauds** | (+40, -40)     | (-80, 0) ← happens always|

**Nash Equilibrium:** (Seller Honest, Buyer Confirms) = (+40, +10)

- If Seller frauds → Buyer opens Dispute (because 0 > -40)
- Knowing this → Seller does not fraud (because -80 < +40)
- → Equilibrium: Honest trade

---

**📊 Conclusion Q1:**

```
Trust Deposit 100% of PRICE = €40 to sell €50 card at €40 price
Fraud: Max gain €0 (because BURN), Max loss €40-€80
→ FRAUD MATHEMATICALLY IRRATIONAL ✅
```

**💡 Final Note:**
The system works because the **price returns to the buyer in case of burn**.
This makes the BURN "zero cost" for the scammed buyer, while the seller loses the trust deposit.

---

### ❓ Q2: Is 100% fair for Pro sellers?

#### Example: Card €100, Price €80

**Setup with 100% Trust Deposit:**
| Actor | Deposits |
|-------|----------|
| Pro Seller | Trust Deposit = 100% of €80 = **€80** |
| Buyer | Price €80 + Trust Deposit 50% = €40 | **€120** |

**Seller Fraud:**

```
Max gain (buyer doesn't dispute): €80 (price)
Loss (buyer disputes): €80 (trust deposit)
Ratio: 1:1 → NEUTRAL ⚠️
```

**Problem:** With 1:1 ratio, the fraudster might try if:

- Already intends to abandon the platform
- Can create multiple accounts (Sybil)

**💡 Proposal for Pro:**

1. **Trust Deposit 100% + Trade Value Cap:**
   - Pro max trade = €200
   - Limits max damage per single fraud
2. **Cooling period:** Pro must wait 24h before trading >€100
3. **Dynamic Trust Deposit:** Trust Deposit = 100% + (10% per past dispute)

---

### ❓ Q3: Is the "5 trades + €30 average" requirement correct to become Pro?

#### Sybil Attack Analysis (Reputation Farming)

**Cost to create 1 Pro account:**

```
5 trades × €30 avg = €150 volume
Fee 1% = €1.50 spent
Time: ~1 week if active
```

**Then frauds:**

```
1 trade of €100 → Gain €80 (if buyer doesn't dispute)
                → Loss €80 (if disputes)
```

**Problem:** After becoming Pro, can fraud with ~1:1 ratio.
The €1.50 cost to "buy" Pro status is too low!

**💡 Proposal Pro Requirements:**

| Requirement     | Current | Proposed      | Why                         |
| --------------- | ------- | ------------- | --------------------------- |
| Trade count     | 5       | **10**        | More friction               |
| Avg Volume      | €30     | **€40**       | Avoids micro-trade farming  |
| Total Volume    | €150    | **€400**      | Farming cost = €4 fee       |
| Min Time        | -       | **14 days**   | Prevents hit-and-run        |
| Max Disputes    | -       | **0**         | One dispute = reset to Newbie|

**New farming cost:**

```
10 trades × €40 × 1% fee = €4
+ 14 days waiting
+ Risk that a counterparty disputes (reset)
```

More expensive and risky → Disincentivizes Sybil

---

## 3. In-Depth Analysis: Buyer

### ❓ Q4: How much trust deposit for Buyer Newbie?

**Scenario:** Buyer Newbie buys €50 card at price €40

- **System Risk:** Buyer claims fake fraud to burn seller's trust deposit
- **Griefing Cost:** The buyer's own trust deposit is burned

**Current (assumed):** 50% of price = €20

**Analysis:**

```
Griefing: Cost = €20 burned
Damage inflicted = €100 (Newbie seller trust deposit) or €50 (Pro)
Damage/Cost Ratio = 5:1 or 2.5:1 → PROFITABLE for griefer!
```

**⚠️ CRITICAL VULNERABILITY:** A competitor could:

1. Buy with fake account
2. Always dispute → burn honest sellers' trust deposits
3. Cost: only €20 to cause €100 damage

**💡 Proposal:**
| Buyer Level | Proposed Trust Deposit | Logic |
|-------------|------------------------|-------|
| Newbie | **100% of PRICE** | Equal to Pro seller |
| Pro | **50% of price** | Reduced for verified buyers |

With 100%: Griefing costs €40 to burn €100 → Ratio 2.5:1 still risky
**Alternative:** Buyer trust deposit = Seller trust deposit (symmetric)

---

### ❓ Q5: How much trust deposit for Buyer Pro?

If Buyer Pro has 50% trust deposit:

- Trade €100 at €80 → Trust Deposit €40
- Griefing: Cost €40, Damage €100 → Ratio 2.5:1

**💡 Proposal:** Buyer Pro trust deposit = **75% of price**

- Damage/Cost Ratio = 1.33:1 → marginal but not profitable considering:
  - Reputation loss ("Pro" account wasted)
  - Cost farming new Pro account

---

## 4. Unified Reputation Mechanics

### ❓ Q6: Is the single counter dynamic clear?

**Current Rule:** Each completed trade → +1 trade count + volume for BOTH

**Scenarios:**
| Scenario | Seller | Buyer | Result |
|----------|--------|-------|--------|
| Trade OK | +1 trade, +€50 vol | +1 trade, +€50 vol | Both grow |
| Dispute (burn) | +1 dispute | +1 dispute | Both punished |
| Cancel (pre-lock) | No effect | N/A | No effect |

**✅ Simple and clear.** No asymmetry.

**⚠️ Problem:** Can a seller "buy" from themselves to farm reputation?

**Wash Trading Analysis:**

- Seller creates Box €100
- Buyer (same owner) buys and finalizes
- Cost: 1% fee = €1
- Gain: +2 trade count (one per role)

**💡 Anti-Wash Proposal:**

1. **Cooldown** between trades with same counterparty (24h)
2. **Pattern detection:** Flag if >50% trades with same addresses
3. **Volume proportional Trust Deposit:** Small trades (<€20) don't count for level-up

---

## 5. External Attack Vectors

### 🔴 Attack 1: Competitor Griefing

**Scenario:** A competitor (e.g., CardCash) wants to destroy GiftBlitz

- Buys 100 cards from honest sellers
- Always disputes → burns €10,000 of sellers' trust deposits
- Attacker cost: €10,000 (burned trust deposit) + €500 cards = €10,500

**Defense:**

- ✅ If buyer trust deposit = seller trust deposit → Cost = Damage (neutral)
- ✅ Rate limiting: Max 3 disputes/day per account
- ✅ Blocklist: Accounts with >30% dispute rate blocked

### 🔴 Attack 2: Sybil Farming

**Scenario:** Create many Pro accounts to then fraud

- Cost for 1 Pro: 10 trades × €50 × 1% = €5
- Then fraud 1 trade of €500 → Gain €500
- ROI: 100x

**Defense:**

- ✅ Max trade value = f(reputation): Newbie max €50, Pro max €200
- ✅ Minimum time on platform (30 days for Pro)
- ✅ Optional KYC to unlock high limits (with incentives)

### 🟢 Auto-Confirm Timer (24h)

**Problem:** Buyer 'forgets' to confirm or disappears.
**Solution:** Smart Contract has a timer.

- If after **24 HOURS** from reveal there is no Dispute nor Confirmation → **Auto-Confirm**.
- Funds released to Seller.
- Protects Seller from ghosting.

**Final Defense:**

- ✅ Asymmetric Trust Deposit (Buyer > Value)
- ✅ **Auto-Confirm 24h** (no cooling period needed)
- ✅ Pattern detection: flag if same user disputes >30% trades
- ✅ Ability to upload screenshot proof in dispute (off-chain)

---

## 6. ✅ FINAL DECISION (APPROVED - v3 Asymmetric Caps)

### 📊 Final System

```
RULE 1: Selected Asymmetric Trust Deposit (Safe Trust Deposit)
   - Seller Trust Deposit: 100% of Price
   - Buyer Trust Deposit: 110% of Card VALUE
RULE 2: Seller can sell up to €200 FROM DAY 1
RULE 3: Buyer has progressive caps (anti-griefing)
RULE 4: One dispute = trade count reset to 0
```

### 📈 Asymmetric Caps

**SELLER (Who Sells):**
| Trade Count | Max Box Value |
|-------------|---------------|
| 0+ | **€200** |

> ✅ A new user can sell their €100 gift card immediately!

**BUYER (Who Buys):**
| Trade Count | Max Purchase |
|-------------|--------------|
| 0-2 | €30 |
| 3-6 | €50 |
| 7-14 | €100 |
| 15+ | €200 |

### 🛡️ Anti-Abuse Protections

| Protection              | Implementation                                                             |
| ----------------------- | -------------------------------------------------------------------------- |
| **Trust Deposit Model** | **Asymmetric (Safe Trust Deposit)**: Buyer 110% Value > Seller 100% Price  |
| **Seller Caps**         | €200 (already has 100% trust deposit)                                      |
| **Buyer Caps**          | Progressive (anti-griefing)                                                |
| **Auto-Confirm**        | After 24h if no action                                                     |
| **Reset Dispute**       | One dispute = trade count back to 0                                        |

> **Why this system?**
>
> - ✅ Simpler (no "levels" to explain)
> - ✅ Same security level
> - ✅ Natural progression
> - ✅ Strong deterrent (complete reset on dispute)

---

## 7. Implementation

### ✅ DOCUMENTATION (Completed)

- [x] WhitePaper updated with simplified system
- [x] Game Theory Analysis updated
- [x] Competitor Analysis updated

### ✅ CODE (Completed)

- [x] `types/index.ts`: Removed `reputationLevel`, added `getMaxTradeValue()`
- [x] `mockData.ts`: Updated to `minTrades` instead of `minReputation`
- [x] Trust Deposit = 100% Price (Seller), 110% Value (Buyer)
- [ ] Trust Deposit calculator: price \* 1.0 (100%)
