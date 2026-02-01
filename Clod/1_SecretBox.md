# GiftBlitz – Scambio P2P Gift Card Sicuro & Universale

> Scambia Gift Card inutilizzate per Crypto/Soldi in modo atomico. Zero Dispute grazie a Mutual Trust Deposit Mathematics.

---

## Trovare il problema:

- **chi sono gli utenti?** Chi riceve buoni regalo indesiderati (Amazon, Zara, Zalando, **Steam, PSN, Xbox**) e preferisce contanti; Chi cerca sconti (bargain hunters).
- **dove manca la fiducia?** Nello scambio P2P remoto. "Se ti do il codice, tu sparisci". "Se ti pago, il codice è falso".
- **dove ci sono ancora check manuali?** Mercatini Facebook/Telegram/Subito, rischi di truffa altissimi.
- **dove le persone devono usare gli intermediari?** Siti centralizzati con fee alte (15-20%) e tempi lunghi (CardCash, Zeek).

---

## Un problema, un utente

- **un user:** Claudio ha un buono Amazon da 100€ (regalo della zia) ma vuole comprare Crypto o pagare l'affitto.
- **un problema:** Non può convertirlo senza rischiare di essere truffato o perdere il 20% in fee.
- **un' azione:** Crea una "GiftBlitz" depositando un Trust Deposit di garanzia → Mario paga → Smart Contract scambia fondi e codice istantaneamente (Atomic Swap).

---

## Tecnologia IOTA utilizzata:

- **tokenizzazione:** ✅ **Soulbound Reputation NFT (ERC-5192)**. Ogni utente riceve un NFT non trasferibile che rappresenta la sua reputazione on-chain. **FIX SICUREZZA:** Il Trust Deposit del **Seller è 100% del Prezzo**, il Trust Deposit del **Buyer è 110% del Valore Facciale** della card (per rendere irrazionale il burning). L'NFT traccia trade count, volume e dispute. I **buyer caps sono automatici** basati sul trade count (0-2→€30, 3-6→€50, 7-14→€100, 15+→€200). I seller possono vendere fino a €200 dal giorno 1.
- **digital ID:** ❌ Non necessario (l'address EVM è già pseudonimo, il Soulbound NFT funge da identità reputazionale)
- **notarizzazione:** ⚠️ Opzionale (hash dispute per audit futuri)
- **smart contracts:** ✅ (ISC) Gestione dell'Escrow, Logica "Burning" (Mutual Stake), e Minting/Update NFT Reputazione

---

## Perché IOTA?

- **Feeless Logic**: Lo scambio deve costare quasi zero. Su Ethereum un escrow + minting NFT costa 15-20$, mangiando il margine di un buono da 50€.
- **NFT Utility (Tokenizzazione)**: IOTA permette di creare NFT con utilità reale (Soulbound Reputation) senza costi proibitivi. L'NFT non è arte speculativa, ma uno strumento funzionale che riduce il Trust Deposit progressivamente.
- **On-Chain Reputation**: La reputazione è tracciata direttamente nello Smart Contract e riflessa nell'NFT. Nessun database centralizzato, nessun KYC, massima privacy.
- **Atomicità**: Gli Smart Contract Layer 2 di IOTA (ISC) permettono scambi rapidi e finalità deterministica.

---

## Dati di mercato

- **Mercato Gift Card:** $899 Miliardi (Globale 2023), proiettato a $2.3 Trilioni (2030).
- **Unused Balance:** Circa il **3-5%** dei buoni non viene mai riscattato o viene svenduto (miliardi di valore bloccato/perso).
- **Fraud Rate P2P:** Il settore high-risk per eccellenza. Una soluzione "Trustless" apre un mercato liquido oggi inesistente.

