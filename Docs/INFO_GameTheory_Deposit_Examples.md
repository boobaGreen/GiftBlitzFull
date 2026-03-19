# 🎲 Game Theory & Asymmetric Deposits
> **Deep dive: Why 100% Face Value (Seller) and 110% Face Value (Buyer)?**

This document explains exactly how the math protects GiftBlitz users, showing various scenarios with different percentages to prove why the current system is the most secure design possible.

## 🔑 The Core Principle
GiftBlitz operates on one fundamental rule of game theory: **Fraud must always result in a net mathematical loss.**

- **Target:** Make cheating irrational.
- **Method:** "Skin in the game" — trust deposits that are *burned* if someone cheats.
- **Rule:** If `Net Gain from Cheating < 0`, no rational actor will cheat.

---

## 📈 Scenario 1: The Current System (100% / 110%)
*Seller deposits 100% of Face Value. Buyer deposits Price + 110% of Face Value.*

**The Setup:**
* Gift Card Face Value: **€100**
* Sale Price: **€80** (20% discount)
* Seller Deposit: **€100** (100% of Face Value)
* Buyer Total Payment: **€80 (Price) + €110 (110% Face Value) = €190**

| State | Action | Seller Net Result | Buyer Net Result | Protocol Treasury |
|-------|--------|-------------------|------------------|-------------------|
| **Happy Path** | Buyer confirms the code works. | **+€79.20** (€80 payment - 1% fee. Gets €100 deposit back) | **+€20 Net Value** (Pays €80, gets €100 card. Gets €110 deposit back) | **+€0.80** (1% fee) |
| **Seller Frauds** | Provides fake/used code. Buyer disputes. | **-€100 Net Loss** (Loses deposit. Gets no payment. **Reputation ruined**) | **€0 Net Loss** (Loses €110 deposit, but *price* €80 is refunded. Gets no card) | **+€210** (Both deposits burned) |
| **Buyer Frauds** | Code works, but buyer lies and disputes. | **-€100 Net Loss** (Loses deposit and the card) | **-€30 Net Loss** (Cost: €190 total paid. Recovery: €100 card + €80 refund = €180 value. **Reputation NFT reset to 0 / penalized**) | **+€210** (Both deposits burned) |

✅ **Conclusion:** Both Seller and Buyer lose money if they fraud. **The system is mathematically sound.**

---

## ❌ Scenario 2: What if Deposits were based on PRICE instead of Face Value?
*E.g. Seller deposits 100% of PRICE (€80).*

**The Setup:**
* Card Value: **€100**
* Price: **€80**
* Seller Deposit: **€80** (100% of Price)

**If Seller Frauds (Double Spend):**
1. Seller sells the card on eBay for €80.
2. Seller uploads the same (now used) code to GiftBlitz to earn *another* €80.
3. Buyer disputes. Seller loses their €80 deposit.
4. **Seller Net Result: €0** (+€80 from eBay, -€80 GiftBlitz deposit).

❌ **Conclusion:** If the deposit is based on the *discounted price*, a scammer breaks even. There is no deterrent. **The deposit MUST be tied to the face value** so that the penalty exceeds any possible gain elsewhere.

---

## ❌ Scenario 3: What if the Buyer Deposit was only 50%?
*E.g. Buyer deposits 50% of Face Value (€50).*

**The Setup:**
* Card Value: **€100**
* Price: **€80**
* Buyer Total Payment: **€80 (Price) + €50 (Deposit) = €130**
* Seller Deposit: **€100**

**If a Competitor wants to destroy GiftBlitz (Griefing Attack):**
A rival company creates fake buyer accounts to dispute every trade, burning honest sellers' deposits to ruin the platform's reputation.

1. Honesty Seller deposits €100.
2. Malicious Buyer buys for €80 + €50 deposit.
3. Malicious Buyer immediately disputes (despite the code working).
4. **Cost to Attacker:** Loses €50 deposit (but gets €80 price back).
5. **Damage to Honest Seller:** Loses €100 deposit.

❌ **Conclusion:** The attacker causes €100 of damage for only €50. The "Damage-to-Cost" ratio is 2:1. This makes griefing attacks highly profitable.

---

## ❌ Scenario 4: What if both deposits were exactly 100%?
*Seller 100% (€100) / Buyer 100% (€100).*

This is better, but it creates a tie.

**If Buyer Frauds (Lies to get the card for free):**
1. Code works. Buyer redeems the €100 gift card immediately.
2. Buyer disputes.
3. Buyer loses €100 deposit, gets €80 price back.
4. **Buyer Financial Cost:** -€100 (deposit lost) + €80 (price returned) = -€20 out of pocket.
5. **Buyer Real Net (including card):** -€20 (cash lost) + €100 (value of card received) = **+€80 NET PROFIT!**

❌ **Conclusion:** If the buyer's deposit is exactly equal to the card's face value, they can theoretically profit by successfully redeeming the card and immediately disputing. It fails to create a Mutually Assured Destruction (MAD) equilibrium.

---

## 🛡️ Why 110% is the Magic Number for Buyers

By pushing the Buyer's deposit to **110% of Face Value**:

1. **Griefing is unprofitable:** To inflict €100 of damage on a seller, a malicious actor must sacrifice €110. (Cost > Damage).
2. **False claims are unprofitable:** Even if the buyer successfully redeems the €100 card before disputing, they lose the €110 deposit. **Financial Loss: -€110 deposit + €80 refund = -€30 out of pocket. Card Value: +€100. Total Net: -€30 loss vs €20 profit if honest.** They mathematically cannot profit from lying.
3. **Reputation System:** Any dispute instantly triggers a penalty on the Soulbound Reputation NFT, neutralizing bad actors from repeating the attack.

### The Final Asymmetric Balance:
* **Seller risks 100%** to prove the code is real (and not sold elsewhere).
* **Buyer risks 110%** to prove they won't make false claims or grief the platform.

*(Note: While the 110% requirement seems high, honest buyers get 100% of this deposit back safely. It acts strictly as a psychological and mathematical barrier to entry for scammers).*
