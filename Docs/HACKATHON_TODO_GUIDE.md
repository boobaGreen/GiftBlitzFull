# 📋 Hackathon — Cose da Fare Prima della Submission

> Deadline: **31 Marzo 2026**
> Tempo stimato: ~30-40 minuti totali

---

## 1️⃣ Video Walkthrough (max 5 minuti)

### Cosa serve
- Software di registrazione schermo (es. OBS Studio gratuito, oppure Xbox Game Bar su Windows con `Win+G`)
- Microfono (anche quello del PC va bene)
- Account YouTube per l'upload

### Struttura consigliata del video (~5 min)

| Tempo      | Sezione                    | Cosa mostrare                                                |
| ---------- | -------------------------- | ------------------------------------------------------------ |
| 0:00-0:30  | **Intro**                  | Nome progetto, tagline, il problema che risolvi               |
| 0:30-1:30  | **Demo Live — Seller**     | Connetti wallet → Crea GiftBox → Mostra deposito trust       |
| 1:30-2:30  | **Demo Live — Buyer**      | Marketplace → Acquista box → Mostra deposito + pagamento     |
| 2:30-3:30  | **Demo Live — Trade**      | Reveal key → Finalize → Mostra reputazione NFT aggiornata   |
| 3:30-4:15  | **Architettura**           | Mostra schema architettura (dal submission doc o slide)       |
| 4:15-5:00  | **IOTA Integration**       | Mostra contratti su Explorer + spiega perché IOTA             |

### Passi concreti

1. **Prepara l'ambiente**
   - Apri https://gift-blitz-full.vercel.app/ in Chrome
   - Assicurati di avere il wallet IOTA connesso con fondi testnet
   - Prepara 2 wallet diversi (seller + buyer) se possibile, oppure usa 2 browser/profili

2. **Registra con OBS o Xbox Game Bar**
   ```
   # Xbox Game Bar (già installato su Windows)
   Win+G → clicca "Registra" → fai la demo → Stop
   # Il file .mp4 viene salvato in C:\Users\...\Videos\Captures
   ```

3. **Full English Script (read this while recording)**

---

### 🎬 SECTION 1 — Intro (0:00 – 0:30)

> *"Hi, I'm Claudio Dall'Ara and this is GiftBlitz — a fully decentralized peer-to-peer gift card exchange built on IOTA.*
>
> *Every year, billions of dollars in gift cards go unused or are sold on social media with huge scam risks. Centralized platforms charge 15 to 20 percent fees. GiftBlitz solves this with a trustless exchange protocol where fraud is mathematically irrational, thanks to a Mutual Trust Deposit system — all running on IOTA Layer 1 smart contracts written in Move."*

### 🎬 SECTION 2 — Seller Flow Demo (0:30 – 1:30)

> *"Let me show you how it works. First, the seller flow.*
>
> *I connect my IOTA wallet to the dApp. Now I go to 'Create Box' — I select the gift card brand, for example Amazon, I set the face value to 100 IOTA and the selling price to 80 IOTA.*
>
> *The system encrypts my gift card code using AES-256 before anything goes on-chain. I also deposit a Trust Deposit equal to 100% of the face value — so 100 IOTA. This is my skin in the game: if I try to scam the buyer, I lose everything.*
>
> *I confirm the transaction, sign it with my wallet, and the GiftBox is now live on the marketplace as a shared object on IOTA."*

### 🎬 SECTION 3 — Buyer Flow Demo (1:30 – 2:30)

> *"Now let's switch to the buyer's perspective.*
>
> *On the marketplace, I can see all available GiftBoxes with their brand, face value, price, and the seller's reputation. I pick the Amazon box we just created.*
>
> *To purchase, the buyer pays the price — 80 IOTA — plus a Trust Deposit of 110% of the face value, so 110 IOTA. Total: 190 IOTA locked in the smart contract.*
>
> *Why 110%? Because this makes it irrational for the buyer to redeem the code and then file a false dispute — they would lose more than they gain. This is pure game theory.*
>
> *I sign the transaction, and the box is now 'Locked'. A 72-hour countdown starts for the seller to reveal the decryption key."*

### 🎬 SECTION 4 — Trade Completion Demo (2:30 – 3:30)

> *"Back as the seller, I now reveal the encrypted key. This key is re-encrypted specifically for the buyer using Proxy Re-Encryption — RSA-2048. No one else can read the gift card code.*
>
> *The buyer can now decrypt the code, verify it's valid, and click 'Finalize'. At this point, the smart contract distributes funds automatically:*
> - *The seller receives the payment minus a 1% fee, plus their full trust deposit back.*
> - *The buyer gets their trust deposit back, plus they now have a valid gift card at a discount.*
> - *The 1% fee goes to the on-chain Treasury.*
>
> *Both parties' Soulbound Reputation NFTs are updated — trade count goes up, volume increases, and the buyer's purchasing cap grows over time.*
>
> *If the code were invalid, the buyer could dispute — but then both trust deposits get burned to the Treasury. This makes disputes very costly, which is exactly the point."*

### 🎬 SECTION 5 — Architecture & IOTA (3:30 – 5:00)

> *"Let me quickly walk you through the architecture.*
>
> *The frontend is a React single-page application with TypeScript and Tailwind CSS, connected to the IOTA blockchain via the official dApp Kit and IOTA SDK. There is no backend server — everything is fully decentralized.*
>
> *On-chain, we have two Move smart contracts:*
> - *giftblitz.move — about 450 lines — handles the entire escrow lifecycle with a 6-state machine, trust deposits, timeout claims, and fee collection.*
> - *reputation.move — about 95 lines — manages the Soulbound Reputation NFT, which is non-transferable and tracks each user's trade history on-chain.*
>
> *We use IOTA Tokenization as our primary IOTA service — the GiftBox is a tokenized shared object, and the ReputationNFT is a soulbound token that serves as an on-chain identity proxy.*
>
> *The contracts are deployed on IOTA testnet and you can verify them on the IOTA Explorer.*
>
> *To sum up: GiftBlitz brings trustless, low-fee gift card trading to IOTA with mathematically proven anti-fraud mechanics, end-to-end encryption, and fully on-chain reputation. All built by a solo developer.*
>
> *Thank you for watching — I'm Claudio Dall'Ara, and this is GiftBlitz."*

---

4. **Upload su YouTube**
   - Vai su https://studio.youtube.com
   - Carica il video → Titolo: `GiftBlitz — MasterZ × IOTA Hackathon Demo`
   - Visibilità: **Non in elenco** (Unlisted) va benissimo
   - Copia il link e aggiungilo nel file `HACKATHON_SUBMISSION.md`

5. **Aggiorna il submission**
   - Apri `Docs/HACKATHON_SUBMISSION.md`
   - Sostituisci `[TODO: Record 5-min demo video and add YouTube link]` con il link YouTube

---

## 2️⃣ Feedback IOTA Developer Experience

### Cosa chiedono
Il form chiede la tua esperienza onesta come sviluppatore con l'ecosistema IOTA. Non serve essere diplomatici — il feedback costruttivo è apprezzato.

### Argomenti da coprire (rispondi a ciascuno con 1-3 frasi)

Apri `Docs/HACKATHON_SUBMISSION.md` e sostituisci il blocco `[TODO]` nella sezione "Feedback" con le tue risposte. Ecco le domande guida:

#### a) Documentazione SDK
- La documentazione di `@iota/dapp-kit` e `@iota/iota-sdk` era chiara?
- Hai trovato facilmente esempi di codice?
- C'erano parti mancanti o outdated?

#### b) Move Development Tooling
- Come è stata l'esperienza con il linguaggio Move?
- Il compilatore e il CLI (`iota move build`, `iota client publish`) funzionavano bene?
- Gli errori del compilatore erano comprensibili?

#### c) Testnet
- La testnet IOTA era stabile e affidabile?
- Il faucet funzionava? Tempi di attesa?
- Hai avuto downtime o problemi durante lo sviluppo?

#### d) dApp Kit / Frontend Integration
- Quanto è stato facile integrare `@iota/dapp-kit` con React?
- La connessione wallet funzionava bene?
- Querying degli oggetti on-chain era intuitivo?

#### e) Pain Points e Suggerimenti
- Qual è stata la cosa più frustrante?
- Cosa miglioreresti per primi?
- Cosa ti ha sorpreso positivamente?

### Esempio di feedback compilato

> **Documentazione**: La documentazione del dApp Kit era ben strutturata ma mancava di esempi avanzati per shared objects. Ho dovuto leggere il codice sorgente per capire alcuni pattern.
>
> **Move Tooling**: Il compilatore Move è eccellente — errori chiari e type safety rigorosa. Il deploy via CLI è semplice una volta configurato, ma il setup iniziale su Windows/WSL richiede troppi step manuali.
>
> **Testnet**: Generalmente stabile. Il faucet ha avuto qualche rallentamento nei weekend. I tempi di conferma transazione sono ottimi (<2s).
>
> **dApp Kit**: L'integrazione React con i hook (`useSignAndExecuteTransaction`, `useIotaClientQuery`) è intuitiva. La gestione degli shared objects richiede attenzione al gas budget.
>
> **Suggerimenti**: Sarebbe utile avere un template starter per dApp React + Move con esempio end-to-end. Più documentazione su Cross-Origin headers per il deploy in produzione.

---

## ✅ Checklist Finale

- [ ] Video registrato (max 5 min)
- [ ] Video caricato su YouTube (unlisted OK)
- [ ] Link YouTube inserito in `HACKATHON_SUBMISSION.md`
- [ ] Feedback IOTA dev experience scritto in `HACKATHON_SUBMISSION.md`
- [ ] Rilettura finale del submission
- [ ] Invio form: https://forms.gle/9QcdekU2mzbcCs2eA
