# 🎬 GiftBlitz — VIDEO SCENEGGIATURA V3

> **Tone**: Cinematic documentary meets tech reveal — serious, genuine, dry humor through contrast
> **Style**: Starts like a problem documentary, transitions to a confident product demo
> **Visual**: Cinematic stylized — atmospheric shots, clean infographics, abstract figures (NOT cartoon, NOT photorealistic)
> **Tool**: Nano Banana Video (AI clips) + Screen Recording + CapCut
> **Duration**: 5:00 max
> **Language**: English

---

## 🎭 THE CORE APPROACH

The video tells a story in 3 emotional beats:

1. **"This is broken"** — the gift card problem (empathy, frustration)
2. **"Here's something better"** — GiftBlitz solution (confidence, clarity)
3. **"Here's how it works"** — demo + tech (credibility, trust)

No bragging. No hype. Let the product speak for itself.
The humor comes from treating gift cards with the same gravity as a financial crisis documentary.

### Visual Style: Cinematic Stylized

- **Mood shots**: atmospheric, cinematic lighting, dramatic camera movements
- **Infographics**: clean, dark background, neon/glowing elements for data
- **People**: silhouettes or abstract figures (avoids AI "uncanny valley")
- **Transitions**: smooth morphs, particle effects, light explosions
- **Color palette**: dark backgrounds, blue/gold accents, red for problems, green for solutions

---

## 📦 FILES TO RECORD

| # | File | Content | Who |
|---|------|---------|-----|
| 1 | `voiceover_problem.mp3` | Voice: Act 1 — The Problem | AI voice (ElevenLabs — **David**, Stability 30%, Style 25%) |
| 2 | `voiceover_solution.mp3` | Voice: Act 2 — The Solution | AI voice (ElevenLabs — **Charlie**, Stability 50%, Style 20%) |
| 3 | `voiceover_closing.mp3` | Voice: Acts 4–5 — Tech + Closing | **Claudio** (you read this yourself) |
| 4 | `demo_screen.mp4` | Screen recording of trade flow (2 wallets) | **You** (Xbox Game Bar/OBS) |
| 5 | `explorer_screen.mp4` | IOTA Explorer package (10 sec) | **You** |

---

# 🎬 RECORDING GUIDE — EXACTLY WHAT TO FILM

> **Important**: The demo uses **2 wallets alternating** (Seller → Buyer → Seller → Buyer).
> You record everything in a **single continuous session**, then CapCut cuts and adds transitions.

---

## ⚡ SETUP (before you hit record)

```
1. Wallet SELLER — loaded with 30+ IOTA testnet
2. Wallet BUYER — loaded with 20+ IOTA testnet
3. App: gift-blitz-full.vercel.app on IOTA TESTNET (or localhost)
4. Screen: 1920×1080, clean desktop (close Discord, chat, notifications)
5. Tool: Xbox Game Bar (Win+G) or OBS — 30fps, MP4
6. ⚠️ NEVER show private keys or real gift card codes
7. Prepare 2 browser tabs (Seller Tab | Buyer Tab) for clean wallet switching
```

---

## 📹 VIDEO 1: `demo_screen.mp4` (~2:00 min raw footage)

Covers **ACT 3 (1:25–3:20)** of the storyboard. Record in continuous sequence.

| Min | Action | Wallet | Page | What you show |
|-----|--------|--------|------|---------------|
| 0:00 | Connect Wallet | **SELLER** | Homepage | Click "Connect" → confirm |
| 0:10 | Create GiftBox | **SELLER** | `/create` | Form: Amazon, 10 IOTA value, 8 IOTA price → "Create" |
| 0:30 | Submit TX | **SELLER** | `/create` | Sign TX → confirmation "GiftBox Live" |
| 0:40 | **🔄 SWITCH WALLET** | → **BUYER** | — | Alt+Tab to Buyer Tab |
| 0:45 | Connect Wallet | **BUYER** | Homepage | Connect buyer wallet |
| 0:50 | Browse Market | **BUYER** | `/market` | Find the Amazon GiftBox → click |
| 1:00 | Purchase Review | **BUYER** | `/purchase` | See: 8 IOTA price + 11 IOTA deposit |
| 1:10 | Buy + Lock | **BUYER** | `/purchase` | Click "Buy" → sign TX → "Box Locked" |
| 1:25 | **🔄 SWITCH WALLET** | → **SELLER** | — | Back to Seller Tab |
| 1:30 | Reveal Key | **SELLER** | `/profile` | "Reveal Key" → sign → success |
| 1:40 | **🔄 SWITCH WALLET** | → **BUYER** | — | Last switch |
| 1:45 | Finalize | **BUYER** | `/profile` | "Finalize" → sign → "Trade Complete" |
| 1:55 | Reputation | **BUYER** | `/profile` | Show reputation stats / Soulbound NFT |

### 🔄 Wallet switch tip:
Use 2 separate browser tabs — Alt+Tab between "Seller Tab" and "Buyer Tab".
In CapCut, each switch becomes a transition with an AI clip + text overlay.

---

## 📹 VIDEO 2: `explorer_screen.mp4` (10 seconds)

```
1. Go to IOTA Explorer Testnet
2. Search your package: 0xd30a...a2f3
3. Show: Package details + "Verified" status
4. Scroll slightly to show bytecode/source
```

---

## ✅ What YOU record vs What AI/CAPCUT handles

| Element | Who does it |
|---------|------------|
| Screen recording of trade flow (2 wallets) | **YOU** |
| IOTA Explorer screen (10s) | **YOU** |
| Voiceover audio (voice 3 only) | **YOU** |
| Voiceover voices 1 + 2 | **ElevenLabs AI** |
| ~15 AI clips (atmosphere, transitions, infographics) | **Nano Banana Video** |
| Chapter titles, text overlays, infographics | **CapCut** |
| Music + sound effects | **CapCut library** |

---

# FULL STORYBOARD — SECOND BY SECOND

---

## ACT 1 — "THE PROBLEM" (0:00 – 0:50)

> 🎵 Music: **Dark ambient** — slow tension build, documentary feel
> Think: opening of a social issues documentary about a hidden crisis

---

### 0:00 – 0:03 | BLACK SCREEN

**Video**: Pure black, 2 seconds, then:

**Text overlay (center, white serif, slow fade-in, ALL CAPS):**
```
BASED ON TRUE EVENTS
```

**Audio**: 🎵 Single low note, almost silence

---

### 0:03 – 0:12 | THE UNUSED GIFT CARD

> **This is the real starting point: you have a gift card you can't use.**

**AI Clip Prompt #1** (9 seconds):
```
Cinematic close-up of a person's hands opening a cluttered desk drawer, 
revealing several colorful unused gift cards scattered among everyday items. 
The person picks one up and turns it over with mild frustration. 
Warm indoor lighting, shallow depth of field, slightly melancholic mood. 
Indie film aesthetic. 4K, natural lighting. 
Camera: slow push-in on the drawer, then follow the hand.
```

**🎤 VOICEOVER (slow, deep, documentary — think Morgan Freeman):**
> *"You got a gift card for Christmas. A nice thought. But you don't shop there. So it sits in a drawer. Forgotten. Expired. Worthless."*

---

### 0:12 – 0:20 | THE STAGGERING SCALE

**AI Clip Prompt #2** (8 seconds):
```
Extreme wide shot of an enormous mountain of colorful gift cards piled up 
in the middle of a vast, empty desert landscape. Dramatic golden hour 
lighting from the side. Cinematic drone shot slowly pushing forward. 
The pile looks both beautiful and wasteful. Stylized, epic scale. 4K.
Camera: drone push-in, slowly rising.
```

**Text overlay (center, massive font, appears number by number — typewriter effect):**
```
$899,000,000,000
```

**Text overlay (below, smaller):**
```
Every. Single. Year.
```

**🎤 VOICEOVER:**
> *"Every year, eight hundred and ninety-nine billion dollars in gift cards are sold worldwide. Billions are never redeemed. Just... gone."*

---

### 0:20 – 0:30 | THE P2P SCAM PROBLEM

**AI Clip Prompt #3** (10 seconds):
```
Dark, moody shot of a shadowy figure sitting in a dimly lit room, 
their face illuminated only by a phone screen showing a messaging app. 
Multiple notification bubbles appear. The atmosphere is tense, suspicious, 
untrustworthy. Cinematic noir lighting, thriller mood. 4K.
Camera: slow zoom toward the phone screen.
```

**Text overlay (center, handwritten-style font, slightly tilted):**
```
"Trust me bro, the code works"
— P2P markets, everywhere
```

**🎤 VOICEOVER:**
> *"Some try to sell them online. Telegram. eBay. Facebook. Peer to peer. No protection. No guarantees. Scams on both sides — buyers and sellers."*

---

### 0:30 – 0:42 | THE CENTRALIZED "SOLUTION"

**AI Clip Prompt #4** (6 seconds):
```
A sterile, imposing corporate office building shot from below. 
A giant neon sign glows at the top showing "30% FEE". 
Dark clouds gather around the building. Cold, institutional atmosphere. 
Dystopian corporate mood, Blade Runner style. 4K.
Camera: low angle looking up, slow drift.
```

**AI Clip Prompt #5 — COMPARISON GRAPHIC** (6 seconds):
```
Clean dark background with a neon-glowing infographic. Two columns:
Left column has a red warning icon with text "P2P" and "SCAM RISK" below.
Right column has a corporate icon with "30% FEE" and "WEEKS" below.
Between them, a wall divides the options. Below both, small icons show 
"LIMITED BRANDS" with few logos. Modern motion graphics, sleek. 4K.
Elements animate in sequence, each appearing with a subtle pulse.
```

**Text overlay (stacked, appearing one by one, red accents):**
```
Centralized platforms:
❌ Fees up to 30%
❌ Weeks to verify a single code
❌ Only select brands accepted
```

**🎤 VOICEOVER:**
> *"The alternative? Centralized platforms. Fees up to thirty percent. Weeks — sometimes weeks — to verify a single code. And they only accept a handful of brands."*
>
> *(slight pause, tone drops)*
>
> *"So you're stuck. Sell and risk getting scammed... or pay a fortune to a middleman."*

---

### 0:48 – 0:50 | THE SILENCE

**Video**: Smash cut to **BLACK SCREEN**
**Audio**: Complete silence. 2 full seconds. (Crucial — creates anticipation)

---

## ACT 2 — "THE SOLUTION" (0:50 – 1:25)

> 🎵 Music: Builds from a single piano note → growing electronic energy → beat drop at GiftBlitz reveal

---

### 0:50 – 0:55 | THE QUESTION

**Video**: Still black

**Text overlay (center, white, appears word by word with pauses):**
```
What if...
```
*(1 second)*
```
math...
```
*(0.5 second)*
```
could fix trust?
```

**🎤 VOICEOVER (tone shift — now confident, intrigued):**
> *"What if... MATH... could fix trust?"*

---

### 0:55 – 1:02 | THE GIFTBLITZ REVEAL

**AI Clip Prompt #6** (7 seconds):
```
A brilliant explosion of golden and blue light particles erupting 
in a dark void. The particles scatter outward like a supernova, 
then converge into a glowing geometric shape at the center. 
Triumphant, powerful, cinematic. Tech product reveal moment. 
4K, dramatic slow motion. 
Camera: static, centered on the light explosion.
```

**Text overlay (center, large, bold, glowing effect — appears with the explosion):**
```
🚀 GIFTBLITZ
```

**Text overlay (below, elegant, fade in):**
```
Trustless P2P Gift Card Exchange
Built on IOTA
```

**🎤 VOICEOVER:**
> *"Introducing GiftBlitz. A peer-to-peer gift card exchange... where cheating is mathematically impossible."*

**Music**: 🎵 Full electronic beat drops here — energetic, confident

---

### 1:02 – 1:12 | THE THREE ADVANTAGES

**AI Clip Prompt #7** (10 seconds):
```
Clean, dark background. Three large glowing icons appear in sequence:
1. A globe icon pulsing with golden light (ANY BRAND)
2. A percentage symbol showing "1%" in bright green (LOW FEES)
3. A lightning bolt crackling with blue energy (FAST)
Each icon appears with a subtle shockwave effect.
Modern, minimal, premium tech aesthetic. 4K.
Camera: static, centered. Icons appear left to right.
```

**Text overlay (appears in sequence, large, with percussive sound hits):**
```
🌍 ANY BRAND — from Amazon to your local gelato shop
```
```
💰 1% FEES — not fifteen. Not thirty. One.
```
```
⚡ FAST — potentially instant when both parties act
```

**🎤 VOICEOVER:**
> *"Any brand. Any code. From Amazon to your local shop. Even travel vouchers and experience packages."*
>
> *"One percent fees. Not fifteen. Not thirty. One."*
>
> *"And when both parties act honestly — the trade can happen almost instantly."*

---

### 1:12 – 1:18 | BUYER ADVANTAGE

**Text overlay (center, clean motion graphic on dark background):**
```
💰 BUYERS WIN TOO

Buy a $100 gift card for $80
Real discounts. No catch.
```

**🎤 VOICEOVER:**
> *"The buyer gets a real discount. The seller gets liquidity. Everyone wins."*

---

### 1:18 – 1:25 | GAME THEORY TEASER — TRANSITION TO DEMO

**AI Clip Prompt #8** (7 seconds):
```
Abstract visualization: two glowing human silhouettes face each other 
across a dark space. Each holds a glowing sphere of light (their stake). 
Golden threads of energy connect them. A balanced scale appears between 
them, perfectly level. Elegant, mathematical, mysterious. 4K.
Camera: slow push-in toward the scale.
```

**Text overlay (center, elegant, serif font):**
```
Both players have something to lose.
That's the design.
```

**🎤 VOICEOVER:**
> *"Both players put skin in the game. And that... changes everything."*

---

## ACT 3 — "THE DEMO" (1:25 – 3:20)

> 🎵 Music: **Cool electronic / lo-fi beats** — stylish, not distracting
> **No voiceover** in this act — only text overlays and screen recording
> Each section has a cinematic "chapter title"

---

### 1:25 – 1:28 | CHAPTER TITLE — THE SELLER

**Video**: Dark background

**Text overlay (center, bold serif, cinematic letter-spacing):**
```
C H A P T E R   O N E
The Seller
```

**Audio**: 🎵 Brief drum fill → cool beat starts

---

### 1:28 – 1:35 | Connect Wallet (SELLER)

**Video**: 📹 Screen recording — SELLER tab → click Connect Wallet → approve

**Text overlay (top-center, monospace, neon blue glow):**
```
> CONNECTING TO IOTA NETWORK...
> WALLET AUTHENTICATED ✓
```

---

### 1:35 – 1:55 | Create GiftBox (SELLER)

**Video**: 📹 Screen recording — fill form: Amazon, 10 IOTA face value, 8 IOTA price

**Text overlay (right side, info panel with dark semi-transparent background):**
```
📦 THE GIFTBOX

Brand:      Amazon
Face Value: 10 IOTA
Price:       8 IOTA (20% discount)

Seller deposits 10 IOTA as guarantee
"Skin in the game."
```

**Text overlay (bottom, appears at 1:48, smaller):**
```
🔐 Gift card code: encrypted with AES-256
Nobody can read it. Not even us. That's the point.
```

---

### 1:55 – 2:08 | Submit Transaction (SELLER)

**Video**: 📹 Screen recording — click Create → sign TX → confirmation appears

**Text overlay (center, animated pop, "achievement" style):**
```
🏆 GIFTBOX IS NOW LIVE ON IOTA
```

---

### 2:08 – 2:12 | CHAPTER TITLE — THE BUYER + WALLET SWITCH

**AI Clip Prompt #9** (4 seconds):
```
Abstract digital transition: a neon blue glowing silhouette smoothly 
morphs into a different neon green silhouette. Minimal dark background, 
smooth, stylish motion graphics. Clean and modern. 4K.
```

**Text overlay (center, bold serif):**
```
C H A P T E R   T W O
The Buyer
```

---

### 2:12 – 2:22 | Browse Marketplace (BUYER)

**Video**: 📹 Screen recording — BUYER connects wallet → browses /market → finds Amazon box → clicks

**Text overlay (top-center, monospace):**
```
> SCANNING MARKETPLACE...
> TARGET: Amazon Gift Card — 20% OFF
```

---

### 2:22 – 2:38 | Purchase + Lock (BUYER)

**Video**: 📹 Screen recording — purchase page → review breakdown → click Buy → sign TX → "Locked"

**Text overlay (right side, styled like a movie prop receipt):**
```
┌───────────────────────────┐
│   💰 OPERATION BREAKDOWN  │
│                           │
│  Price:         8 IOTA    │
│  Buyer Deposit: 11 IOTA   │
│  (110% of face value)     │
│  ────────────────────     │
│  TOTAL LOCKED: 19 IOTA    │
│                           │
│  Both players have        │
│  something to lose.       │
│  That's the design.       │
└───────────────────────────┘
```

**Text overlay (center, after TX confirmed):**
```
🔒 BOX LOCKED — Funds in Escrow
```

---

### 2:38 – 2:58 | 🧠 THE GAME THEORY MOMENT (MAD EQUILIBRIUM)

> **This is the KEY educational moment of the entire video.**
> Screen recording PAUSES. Music drops to near silence. Full-screen infographic.

> 🎵 Music: drops to almost silent. Single piano note.

**FULL SCREEN GRAPHIC — Split screen design, dark background:**

**LEFT SIDE (red tint):**
```
🔴 WHY SELLER FRAUD FAILS:

Deposit at stake:    100% Face Value
Payment received:    80% Price
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Net result of fraud: -20% NET LOSS
+ Reputation NFT Reset
```

**RIGHT SIDE (blue tint):**
```
🔵 WHY BUYER GRIEFING FAILS:

Deposit at stake:    110% Face Value
Would recover:       80% Price 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Net result of lying: -30% NET LOSS
+ Reputation NFT Reset
```

**CENTER BOTTOM (gold text, appears after 3 seconds):**
```
✅ MUTUALLY ASSURED DESTRUCTION (MAD)
Honesty is the only mathematically profitable strategy.
(Unlike competitors with exploitable flat fees or UX-killing 150% deposits)
```

> 🎵 Music: beat drops back in

---

### 2:58 – 3:08 | 🛡️ THE SYBIL DEFENSE (Competitor Bleedout)

> 🎵 Music: **Deep, heavy bass synth drop** — intimidating, highly secure feel.

**FULL SCREEN GRAPHIC — Dark purple/neon aesthetic:**

**Text overlay (Center, typing effect, fast):**
```
> What if a jealous competitor attacks the network?
> What if botnets try to grief high-value trades?
```

**Text overlay (Below, large, slamming onto screen with a metallic THUD sound):**
```
💥 RIVAL BLEEDOUT
Griefing costs 110% of the damage inflicted. 
Malicious actors mathematically bankrupt themselves.

🛡️ DAMAGE CONTROL TIERS
Zero-reputation bots are hard-capped at €30. 
They cannot touch high-value €500 cards.
```

**🎤 VOICEOVER (Claudio — serious, definitive):**
> *"Even if a jealous competitor tries to attack the network... griefing costs them one hundred and ten percent of the damage they inflict. And since new accounts are hard-capped to small amounts, spam bots can't even touch high-value trades. They just mathematically bleed out."*

---

### 2:58 – 3:02 | CHAPTER TITLE — THE REVEAL

**AI Clip Prompt #10** (4 seconds):
```
Abstract smooth transition: a green glowing silhouette morphs back 
to a blue silhouette. Minimal, dark background. Clean motion graphics. 4K.
```

**Text overlay (center, bold serif):**
```
C H A P T E R   T H R E E
The Reveal
```

---

### 3:02 – 3:10 | Seller Reveals Key (SELLER)

**Video**: 📹 Screen recording — switch to SELLER wallet → find box on /profile → click Reveal Key → sign TX → done

**Text overlay (top-center):**
```
> SELLER REVEALS DECRYPTION KEY
> BUYER CAN NOW READ THE GIFT CARD CODE
```

**Text overlay (bottom, info):**
```
🔑 Encrypted with RSA-2048
Only the buyer can decrypt it.
```

---

### 3:10 – 3:13 | Quick Transition

**Text overlay (full-width dark bar):**
```
👤 Back to the Buyer — Moment of truth.
```

---

### 3:13 – 3:20 | Finalize + Trade Complete (BUYER)

**Video**: 📹 Screen recording — switch to BUYER wallet → click Finalize → sign TX → success

**Text overlay (center, HUGE, green, explosion effect):**
```
🎉 TRADE COMPLETE
```

**Text overlay (right side, styled as "operation debrief"):**
```
📊 FINAL SCORE:

Seller: payment + deposit back ✅
Buyer: deposit back + discounted gift card ✅
Protocol: 1% fee collected 🏦

Fair trade. No middleman. No waiting.
```

---

## ACT 4 — "HOW IT'S BUILT" (3:20 – 4:35)

> 🎵 Music: **Confident, forward-moving** — tech innovation feel, slightly inspiring
> **Claudio reads this voiceover** — genuine, clear, proud but humble

---

### 3:20 – 3:25 | TITLE

**Video**: Fade to black → fade in

**Text overlay (center, spaced out):**
```
H O W   I T ' S   B U I L T
```

---

### 3:25 – 3:45 | Architecture — No Backend Reveal

**AI Clip Prompt #11** (8 seconds):
```
Futuristic holographic blueprint of a system architecture floating 
in a dark command center room. Glowing blue wireframe nodes connected 
by light beams. Two prominent nodes pulse with energy. 
A single figure observes the hologram from behind, silhouetted.
Sci-fi briefing room aesthetic, Mission Impossible feel. 4K cinematic.
Camera: slow drift around the hologram.
```

**🎤 VOICEOVER (Claudio — clear, confident, genuine):**
> *"A React frontend connects directly to the IOTA blockchain through its official SDK. And the backend..."*
>
> *(pause)*
>
> *"...there is no backend. No servers. No databases. Nothing in between. Everything lives on-chain. Fully decentralized. There is literally nothing to hack."*

**Text overlay (left side, monospace, appearing line by line):**
```
FRONTEND
  React + TypeScript
  @iota/dapp-kit
  @iota/iota-sdk

BACKEND
  ████████████████
  [NONE]
  (fully on-chain)
```

---

### 3:45 – 4:00 | Smart Contracts — What They DO

**AI Clip Prompt #12** (8 seconds):
```
Close-up of glowing lines of abstract code scrolling on a transparent 
holographic display floating in dark space. Blue-green color scheme. 
The code occasionally highlights and pulses. 
Matrix meets Iron Man aesthetic. Elegant, slow camera drift. 4K.
```

**🎤 VOICEOVER (Claudio):**
> *"Two smart contracts written in Move handle the entire system. The first manages trades — escrow, timeouts, disputes, automatic resolution. All on-chain, all trustless."*
>
> *"The second builds your reputation over time. A Soulbound NFT. It can't be bought. It can't be faked. It can't be transferred. You earn it — trade by trade."*

**Text overlay (right side):**
```
📋 SMART CONTRACTS

giftblitz.move
  Full trade lifecycle
  Escrow • Timeouts • Disputes
  Automatic resolution

reputation.move
  Soulbound NFT system
  Non-transferable identity
  "You earn it — or you don't."
```

---

### 4:00 – 4:15 | WHY IOTA + Explorer

**AI Clip Prompt #13** (5 seconds):
```
A stylized visualization of the IOTA network: glowing nodes connected 
by fast-moving light pulses on a dark background. The network looks 
alive, efficient, modern. Data flows smoothly between nodes.
Clean, futuristic, tech aesthetic. 4K.
Camera: pulling back to reveal the full network.
```

**Then**: 📹 `explorer_screen.mp4` — Screen recording of IOTA Explorer (10 seconds)

**🎤 VOICEOVER (Claudio):**
> *"Why IOTA? Because it gives us exactly what we need. Tokenized shared objects for every GiftBox. Soulbound identities for reputation. A fast, efficient Layer 1. Everything deployed, verified, and fully transparent."*

**Text overlay (bottom-center):**
```
📋 DEPLOYED ON IOTA TESTNET
Package verified on IOTA Explorer
Fully transparent — check it yourself.
```

---

### 4:15 – 4:25 | RAPID-FIRE STATS

**Video**: Dark background, text appears rapidly with punchy cuts

> 🎵 Music: Percussive hits on each line

**Text overlay (each appears with a BOOM sound, stays 1.5 seconds):**
```
2 SMART CONTRACTS
```
```
6 ESCROW STATES
```
```
72-HOUR TIMEOUTS
```
```
1% FEE
```
```
0 INTERMEDIARIES
```
```
ANY BRAND. ANY CODE.
```

---

### 4:25 – 4:35 | THE POTENTIAL

**AI Clip Prompt #14** (5 seconds):
```
Montage of quick, stylized shots: a glowing Amazon logo, a local 
coffee shop sign, an airplane ticket, a weekend travel voucher — 
all appearing as holographic cards floating in dark space, each 
pulsing with golden light. Modern, aspirational. 4K.
Camera: slow tracking shot past the floating cards.
```

**🎤 VOICEOVER (Claudio — warm, visionary):**
> *"From global retailers to your local coffee shop. Travel packages. Experience vouchers. Any code, any brand. Accessible to anyone with a wallet and something to trade."*

---

## ACT 5 — "CLOSING" (4:35 – 5:00)

> 🎵 Music: **Inspiring orchestral swell** — triumphant but not over-the-top

---

### 4:35 – 4:48 | SUMMARY

**AI Clip Prompt #15** (8 seconds):
```
Cinematic shot of a person sitting at a desk with a glowing monitor 
in a dark room. Through a large window behind them, a dramatic sunrise 
breaks over a city skyline. Golden light gradually fills the room. 
The figure is silhouetted, composed, quietly satisfied.
Inspiring, cinematic. 4K, Christopher Nolan style.
Camera: slow push-in toward the figure.
```

**🎤 VOICEOVER (Claudio — genuine, proud but humble):**
> *"GiftBlitz. Trustless peer-to-peer exchange. Secured by game theory. End-to-end encrypted. One percent fees. No intermediaries. No single point of failure."*

**Text overlay (center, checkmarks appear one by one, timed with voiceover):**
```
✅ Trustless P2P Exchange
✅ Game Theory Security
✅ E2E Encryption (AES-256 + RSA-2048)
✅ Soulbound Reputation
✅ 1% Fee — No Intermediaries
✅ 100% On-Chain
✅ Any Brand, Any Code
```

---

### 4:48 – 4:55 | THE CLOSING WORDS

**AI Clip Prompt #16** (7 seconds):
```
Close-up of a steaming espresso cup on a dark desk next to a glowing 
laptop keyboard. The steam rises elegantly in slow motion, catching 
the monitor's blue light. Warm, intimate, cinematic. 
Italian coffee aesthetic meets quiet tech pride. 4K slow motion.
```

**🎤 VOICEOVER (Claudio — warm, sincere, a smile in the voice):**
> *"A project born from a simple idea: gift cards deserve better. And now... they do."*
>
> *"Thank you for watching. I'm Claudio Dall'Ara... and this is GiftBlitz."*

---

### 4:55 – 5:00 | FINAL CARD

**AI Clip Prompt #17** (5 seconds):
```
Elegant dark background with very subtle floating golden particles. 
Minimal, clean, premium feel. Slow gentle drift upward. 
Perfect for end credits. Cinematic 4K, very subtle motion.
```

**Text overlay (center, main title, large):**
```
GIFTBLITZ
```

**Text overlay (below, stacked, elegant):**
```
Claudio Dall'Ara

🌐 gift-blitz-full.vercel.app
💻 github.com/boobaGreen/GiftBlitzFull
```

**Text overlay (very bottom, tiny, appears last):**
```
No gift cards were harmed in the making of this demo.
```

**Music**: 🎵 Final note holds, then fades to silence at 5:00.

---

# 🍌 AI CLIP PROMPTS — QUICK REFERENCE

| # | Time | Duration | Prompt Summary |
|---|------|----------|----------------|
| 1 | 0:03–0:12 | 9s | Person finding unused gift cards in drawer |
| 2 | 0:12–0:20 | 8s | Mountain of gift cards in desert (epic scale) |
| 3 | 0:20–0:30 | 10s | Shadowy figure on phone — scam atmosphere |
| 4 | 0:30–0:36 | 6s | Corporate building with "30% FEE" neon sign |
| 5 | 0:36–0:42 | 6s | Infographic: P2P vs Centralized problems |
| 6 | 0:55–1:02 | 7s | Golden light explosion — GiftBlitz reveal |
| 7 | 1:02–1:12 | 10s | Three glowing icons (any brand, 1%, fast) |
| 8 | 1:18–1:25 | 7s | Two silhouettes with scale — game theory |
| 9 | 2:08–2:12 | 4s | Blue→green silhouette morph (buyer switch) |
| 10 | 2:58–3:02 | 4s | Green→blue silhouette morph (seller switch) |
| 11 | 3:25–3:33 | 8s | Holographic architecture blueprint |
| 12 | 3:45–3:53 | 8s | Glowing code on holographic display |
| 13 | 4:00–4:05 | 5s | IOTA network visualization |
| 14 | 4:25–4:30 | 5s | Floating holographic brand cards (potential) |
| 15 | 4:35–4:43 | 8s | Silhouette at desk, sunrise behind |
| 16 | 4:48–4:55 | 7s | Espresso cup with laptop, slow motion |
| 17 | 4:55–5:00 | 5s | Elegant dark particles (credits) |

**Total AI clips needed: 17** (most are 5-10s)

---

# 🎤 COMPLETE VOICEOVER SCRIPTS

---

## Script 1: `voiceover_problem.mp3` — AI Voice (David)

**Duration**: ~48 seconds | **Tone**: Deep, documentary, Morgan Freeman-esque

> *"You got a gift card for Christmas. A nice thought. But you don't shop there. So it sits in a drawer. Forgotten. Expired. Worthless.*
>
> *Every year, eight hundred and ninety-nine billion dollars in gift cards are sold worldwide. Billions are never redeemed. Just... gone.*
>
> *Some try to sell them online. Telegram. eBay. Facebook. Peer to peer. No protection. No guarantees. Scams on both sides — buyers and sellers.*
>
> *The alternative? Centralized platforms. Fees up to thirty percent. Weeks — sometimes weeks — to verify a single code. And they only accept a handful of brands.*
>
> *So you're stuck. Sell and risk getting scammed... or pay a fortune to a middleman."*

**ElevenLabs Settings**: Voice: David | Stability: 30% | Style: 25%

---

## Script 2: `voiceover_solution.mp3` — AI Voice (Charlie)

**Duration**: ~35 seconds | **Tone**: Confident, intrigued, building energy

> *"What if... MATH... could fix trust?*
>
> *Introducing GiftBlitz. A peer-to-peer gift card exchange... where cheating is mathematically impossible.*
>
> *Any brand. Any code. From Amazon to your local shop. Even travel vouchers and experience packages.*
>
> *One percent fees. Not fifteen. Not thirty. One.*
>
> *And when both parties act honestly — the trade can happen almost instantly.*
>
> *The buyer gets a real discount. The seller gets liquidity. Everyone wins.*
>
> *Both players put skin in the game. And that... changes everything."*

**ElevenLabs Settings**: Voice: Charlie | Stability: 50% | Style: 20%

---

## Script 3: `voiceover_closing.mp3` — CLAUDIO (you read this)

**Duration**: ~1:40 | **Tone**: Genuine, clear, proud but humble. Not bragging — presenting.

> *"A React frontend connects directly to the IOTA blockchain through its official SDK. And the backend...*
>
> *(pause)*
>
> *...there is no backend. No servers. No databases. Nothing in between. Everything lives on-chain. Fully decentralized. There is literally nothing to hack.*
>
> *Two smart contracts written in Move handle the entire system. The first manages trades — escrow, timeouts, disputes, automatic resolution. All on-chain, all trustless.*
>
> *The second builds your reputation over time. A Soulbound NFT. It can't be bought. It can't be faked. It can't be transferred. You earn it — trade by trade.*
>
> *Why IOTA? Because it gives us exactly what we need. Tokenized shared objects for every GiftBox. Soulbound identities for reputation. A fast, efficient Layer 1. Everything deployed, verified, and fully transparent.*
>
> *From global retailers to your local coffee shop. Travel packages. Experience vouchers. Any code, any brand. Accessible to anyone with a wallet and something to trade.*
>
> *GiftBlitz. Trustless peer-to-peer exchange. Secured by game theory. End-to-end encrypted. One percent fees. No intermediaries. No single point of failure.*
>
> *A project born from a simple idea: gift cards deserve better. And now... they do.*
>
> *Thank you for watching. I'm Claudio Dall'Ara... and this is GiftBlitz."*

**Recording tips for Claudio:**
- Record in a quiet room
- Speak at a natural, confident pace — not too fast
- Let the pauses breathe (especially "And the backend... ...there is no backend")
- Smile slightly during the closing — it comes through in the voice
- Don't try to sound like a movie narrator — be yourself, just polished

---

# 🎵 MUSIC GUIDE (CapCut Library Search Terms)

| Moment | Search In CapCut | Mood |
|--------|------------------|------|
| Act 1 (0:00–0:48) | "dramatic cinematic" or "dark ambient" | Tension, documentary weight |
| Silence (0:48–0:50) | *(no music)* | Total silence — crucial beat |
| Act 2 (0:50–1:25) | "epic reveal" or "cinematic drop" | Building → triumphant |
| Act 3 demo (1:25–2:38) | "lo-fi electronic" or "chill tech" | Cool, stylish, not distracting |
| Game Theory (2:38–2:58) | *(drop to piano note)* | Thoughtful pause, then beat returns |
| Act 4 (3:20–4:35) | "tech innovation" or "confident corporate" | Professional, forward-moving |
| Act 5 (4:35–5:00) | "inspiring orchestral" or "triumphant" | Pride, emotion, gentle crescendo |

---

# ✏️ FONT GUIDE (CapCut)

| Element | Font Style | Why |
|---------|-----------|-----|
| "BASED ON TRUE EVENTS" | Serif, thin, uppercase | Movie opening cliché |
| Chapter titles | Serif bold, tracked wide | Cinematic chapter feel |
| Info boxes / receipts | Monospace (Courier-style) | Tech terminal feel |
| Cheeky comments | Italic, lighter weight | Reads as an aside |
| Big numbers ($899B) | Sans-serif ultra bold | Maximum visual impact |
| Advantages (✅ lines) | Clean sans-serif | Clear, scannable |
| Credits | Elegant serif | Classic film credits |
| Game Theory graphic | Clean sans-serif, bold | Infographic clarity |

---

# ✅ PRODUCTION CHECKLIST

### Phase 1 — Prepare
- [ ] Setup Wallet SELLER with 30+ IOTA testnet
- [ ] Setup Wallet BUYER with 20+ IOTA testnet
- [ ] Open app in 2 browser tabs (Seller Tab / Buyer Tab)
- [ ] Clean desktop — close Discord, chat, notifications

### Phase 2 — Record your materials
- [ ] Record `demo_screen.mp4`: full 2-wallet trade flow
- [ ] Record `explorer_screen.mp4`: IOTA Explorer package (10 seconds)
- [ ] Record `voiceover_closing.mp3`: Script 3 — your voice (Acts 4-5)

### Phase 3 — Generate AI voiceover
- [ ] Generate `voiceover_problem.mp3` on ElevenLabs (David, Script 1)
- [ ] Generate `voiceover_solution.mp3` on ElevenLabs (Charlie, Script 2)

### Phase 4 — Generate AI clips
- [ ] Generate 17 AI clips on Nano Banana Video (prompts in table above)

### Phase 5 — CapCut Assembly
- [ ] Import all materials into CapCut
- [ ] Place clips following the storyboard timeline (ACT 1–5)
- [ ] Add ALL text overlays as specified per section
- [ ] Build game theory freeze-frame graphic (2:38–2:58)
- [ ] Add wallet switch transitions with AI clips #9/#10
- [ ] Add music tracks — switch at Act transitions (see MUSIC GUIDE)
- [ ] Adjust volume: LOW during voiceover, MEDIUM during demo, SILENT at 0:48
- [ ] Add percussive "boom" sounds for rapid-fire stats (4:15–4:25)

### Phase 6 — Final QA
- [ ] Verify total duration ≤ 5:00
- [ ] Verify all text stays on screen ≥ 3 seconds
- [ ] Check no private keys or real card codes visible
- [ ] Export at 1080p MP4
- [ ] Watch it yourself — does it make you feel proud? ✅

### Phase 7 — Publish
- [ ] Upload to YouTube (Unlisted)
- [ ] Copy YouTube link → update `Docs/HACKATHON_SUBMISSION.md`
