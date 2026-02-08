# GiftBlitz - Rules and Mechanics 📚

> **Everything you need to know to use GiftBlitz as a Buyer or Seller**

---

## 🎯 The 4 Fundamental Rules

```
1️⃣ TRUST DEPOSIT = Seller: 100% FACE VALUE | Buyer: 110% Card Value
2️⃣ SELLER can sell up to €200 from day 1
3️⃣ BUYER has progressive caps (anti-griefing)
4️⃣ ONE DISPUTE = trade count reset to 0
```

---

## 💰 How Trust Deposit Works

**What is the trust deposit?** A security deposit you lock during the trade. You get it back if everything goes well.

| Who        | What They Deposit    | Example (€100 card, price €80)   |
| ---------- | -------------------- | -------------------------------- |
| **Seller** | 100% Face Value      | €100                             |
| **Buyer**  | Price + 110% Value   | €80 + €110 (110% of €100) = €190 |

### If everything OK ✅

- Seller receives: trust deposit + price - 1% fee = **€179.20**
- Buyer receives: trust deposit back + €100 card = **€80 + €100 card**

### If DISPUTE (Protocol Treasury) 🏦

- Both lose the trust deposit (confiscated by the protocol)
- Buyer recovers the price paid
- **Maximum deterrent**: missing funds feed the platform development fund.

---

## 📦 If You Are a SELLER (Want to Sell)

### What You Can Do

| Trade Count   | Max Box Value  |
| ------------- | -------------- |
| **Any**       | **€200**       |

> ✅ **You can sell a €100 gift card from day one!**

### How It Works

1. **Create a Box** → Insert gift card code (encrypted) + 100% trust deposit
2. **Wait for Buyer** → Someone buys your Box
3. **Buyer Verify** → Checks if the code works
4. **Buyer Confirm** → Receive trust deposit + price - 1% fee

### ⚠️ If You Scam (Fake Code)

```
Buyer activates DISPUTE → You lose trust deposit (goes to Protocol Treasury)
You earn nothing → Only guaranteed loss
```

---

## 🛒 If You Are a BUYER (Want to Buy)

### Limits Based on Completed Trades

| Completed Trades | Max Purchase |
| ---------------- | ------------ |
| 0-2              | €30          |
| 3-6              | €50          |
| 7-14             | €100         |
| 15+              | €200         |

> ⚠️ **Buyer caps exist to prevent griefing (false disputes)**

### How It Works

1. **Choose a Box** → Find a gift card you are interested in
2. **Pay + Trust Deposit** → Deposit price + 110% of Card Value (Trust Deposit)
3. **Receive Code** → Seller reveals the code (still encrypted)
4. **Verify** → Test the code on the brand's site
5. **Confirm or Dispute**:
   - ✅ **Code OK** → Confirm, get trust deposit back
   - ❌ **Fake Code** → Dispute, BURN of both trust deposits

### ⚠️ If You Grief (False Dispute)

```
You lose your trust deposit (€110) to burn seller's trust deposit (€100)
Ratio ~1:1 → Not profitable!
+ Your trade count goes back to 0
```

---

## 📈 How Your Trade Count Grows

| Event                | Effect        |
| -------------------- | ------------- |
| OK Trade as Seller   | +1            |
| OK Trade as Buyer    | +1            |
| Cancelled Box        | None          |
| **DISPUTE**          | **RESET TO 0**|

> 🎯 **IT'S A SINGLE counter!** Grows both when buying and selling.

**Example:**

```
Mario (new, tradeCount = 0)

Trade 1: BUYS €20      → tradeCount = 1
Trade 2: SELLS €25     → tradeCount = 2
Trade 3: BUYS €30      → tradeCount = 3 → MAX BUY = €50! ✨
```

---

## ⏱️ Timeouts and Protections

### 🔒 Rule 1: NO Cancellation After Purchase

**Once a buyer buys your box, you CANNOT cancel anymore.**

- ✅ You can cancel BEFORE someone buys (free)
- ❌ You CANNOT cancel AFTER someone bought
- 🎯 This guarantees commitment and trust

### ⏰ Rule 2: Reveal Timeout (72 Hours)

**The seller has 72 hours (3 days) to reveal the code after the buyer buys.**

**If seller DOES NOT reveal within 72h:**

- Buyer can request full refund
- Buyer recovers: price + trust deposit + 50% of seller trust deposit
- Seller loses: 100% of trust deposit (50% goes to buyer, 50% Protocol Treasury)

**Example:**

```
Box: Amazon €100, price €80

Seller DOES NOT reveal within 72h:
→ Buyer recovers: €80 (price) + €110 (own trust deposit) + €50 (50% seller trust deposit) = €240
→ Seller loses: €100 (trust deposit)
→ Protocol Treasury: €50
```

**Why 72 hours?**

- Covers weekends and small emergencies
- Enough time for seller to come back online
- Not too long for buyer (3 days is acceptable)

### ⏰ Rule 3: Auto-Finalize (72 Hours After Reveal)

**The buyer has 72 hours (3 days) to verify the code and confirm/dispute.**

**If buyer DOES NOT confirm nor dispute within 72h:**

- The trade **auto-finalizes** automatically
- System assumes: valid code
- Seller receives payment
- Both recover trust deposits

**⚠️ IMPORTANT for Buyer:**

- You MUST verify the code within 72h
- After auto-finalize, you CANNOT dispute anymore
- Ensure you can test the code in the next 3 days!

**Example:**

```
T+0h:   Buyer buys box
T+2h:   Seller reveals code
T+3h:   Buyer receives code but DOES NOT verify
T+74h:  Auto-finalize → Seller receives payment
T+7d:   Buyer tests code → INVALID
        Too late! Cannot dispute anymore
```

**Why 72 hours?**

- Plenty of time to verify a gift code
- Symmetric with reveal timeout (fair for both)
- Protects seller from buyers who "forget" to confirm

### 📊 Complete Timeline

```
T+0h:     Buyer buys box
          ↓ [Seller has 72h to reveal]

T+2h:     Seller reveals code
          ↓ [Buyer has 72h to confirm/dispute]

T+3h:     Buyer verifies code

Scenario A (Happy Path):
T+4h:     Buyer confirms → ✅ Trade completed

Scenario B (Auto-Finalize):
T+74h:    No action → ✅ Auto-finalize (assumes valid)

Scenario C (Dispute):
T+5h:     Invalid Code → ❌ Buyer disputes → Protocol Treasury

Scenario D (Seller Ghosting):
T+72h:    Seller did NOT reveal → ⚠️ Buyer claims refund + compensation
```

---

## 🔄 Visual Summary

```
                       GiftBlitz TRADE FLOW

    SELLER                                      BUYER
    ┌─────────┐                                ┌─────────┐
    │ Create  │◄─────── Matching ──────────────│ Buy     │
    │ Box     │                                │         │
    │+Deposit │                                │+Deposit │
    └────┬────┘                                └────┬────┘
         │                                          │
         ▼                                          ▼
    ┌─────────┐                                ┌─────────┐
    │ Wait    │                                │ Receive │
    │         │◄─────── Code ──────────────────│ Code    │
    └────┬────┘                                └────┬────┘
         │                                          │
         │                                     ┌────┴────┐
         │                                     ▼         ▼
         │                               ┌─────────┐ ┌─────────┐
         │                               │ Confirm │ │ Dispute │
         │                               │   ✅    │ │   🔥    │
         │                               └────┬────┘ └────┬────┘
         │                                    │           │
         ▼                                    ▼           ▼
    ┌─────────────────┐              ┌─────────┐    ┌─────────────┐
    │ Receive Deposit │◄─────────────│ Receive │    │ Protocol    │
    │ + Price - 1% Fee│              │ Deposit │    │ Treasury    │
    └─────────────────┘              └─────────┘    └─────────────┘
```

---

## ❓ Quick FAQ

**Q: Can I sell a €100 gift card as soon as I register?**

> ✅ Yes! Sellers can sell up to €200 from day 1.

**Q: Why can't I buy big boxes immediately?**

> To prevent griefing. You must do some small trades first.

**Q: What happens if I dispute by mistake?**

> You both lose the trust deposit and your trade count goes back to 0. Verify well before disputing!

**Q: If the other disputes, do I lose too?**

> Yes, the dispute burns trust deposits of BOTH. That's why it works as a deterrent.

**Q: How much does it cost to use GiftBlitz?**

> Only 1% fee on the price, deducted from the payment to the seller.

---

## 📊 Final Summary Table

| Aspect                  | Seller               | Buyer                 |
| ----------------------- | -------------------- | --------------------- |
| **Trust Deposit**       | 100% of Face Value   | 110% of Card Value    |
| **Max Trade (new)**     | €200                 | €30                   |
| **Max Trade (veteran)** | €200                 | €200                  |
| **Fee**                 | 1% on price          | 0%                    |
| **Main Risk**           | BURN if fake code    | BURN if fake dispute  |
