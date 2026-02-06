# Implementation Plan - GiftBlitz MVP

## 🎯 Obiettivo

Costruire una dApp P2P per lo scambio sicuro di Gift Card su IOTA, utilizzando il modello "Mutual Trust Deposit" (Doppio Deposito) per eliminare le dispute senza intermediari.

## 🛠️ Tech Stack

- **Frontend:** React 18 (Vite) + TailwindCSS + Lucide Icons.
- **Smart Contracts:** IOTA Smart Contracts (ISC) - Rust/Wasm.
- **Network:** IOTA Testnet (EVM compatible or Native).
- **Storage (Off-chain):** IPFS o Local Storage criptato (per il codice della card prima dello sblocco).
- **NFT Standard:** ERC-5192 (Soulbound Token) per Reputation NFT.
- **SVG Generation:** On-chain dynamic metadata per badge visivi.

## 📅 Roadmap di Sviluppo

### Phase 1: Smart Contract Core (The "Box" + NFT Foundation)

- Implementazione logica `GiftBlitz` Contract.
- `createBox(price, trust_deposit)`: Blocca fondi venditore.
- `joinBox(boxId)`: Blocca fondi compratore + pagamento.
- `openBox(secretKey)`: Rilascia fondi se la chiave è corretta (Happy Path).
- `cancelBox()`: Ritiro box dal mercato (SOLO se stato = OPEN). Ritorna il trust deposit al venditore.
- `autoFinalize()`: **Safety Feature.** Se il buyer non chiude né disputa entro 24h dalla rivelazione chiave → Fondi al Venditore.
- `claimRefund()`: **Safety Feature.** Se il venditore non rivela la chiave entro 24h dal join → Rimborso totale al Buyer.
- `burnBox()`: Funzione di distruzione reciproca (Dispute Path).
- **🎨 NFT Integration:**
  - `mintReputationNFT(address user)`: Minta Soulbound NFT al primo trade.
  - `_updateNFTStats(address user, uint256 value)`: Aggiorna volume/trade count (chiamato per ENTRAMBI buyer e seller).
  - `getMaxBuyValue(uint256 tradeCount)`: Calcola buyer cap automatico (0-2→€30, 3-6→€50, 7-14→€100, 15+→€200).
  - `getMaxSellValue()`: Ritorna sempre €200 (seller può vendere dal giorno 1).
  - **Nota:** Trust Deposit Asimmetrico: Seller 100% Prezzo, Buyer 110% Valore.
  - **Nota:** Ogni trade completato aggiorna la reputazione di ENTRAMBE le parti (seller + buyer).

### Phase 2: Frontend & Wallet Integration

- Setup progetto Vite + IOTA SDK/Wagmi (se EVM).
- Connessione Wallet (Metamask o TanglePay).
- Generazione chiavi crittografiche Deterministiche (Stateless) via Wallet Signature (per evitare Local Storage).

### Phase 3: Core User Flows + NFT Minting

- **Seller Flow:**
  - Input dati card → Generazione Salt (Random) → Wallet Sign(Salt) → Derive Key.
  - Encrypt Code con Key → Append Salt a Ciphertext.
  - Call SC `createBox` (Store `Ciphertext + Salt` on-chain).
  - Se primo trade → Minta Soulbound NFT automaticamente.
- **Buyer Flow:**
  - Listato Box disponibili (filtrato automaticamente per buyer caps).
  - Call SC `joinBox` (Deposit Payment + Trust Deposit = 110% del Valore Card).
  - Se primo trade → Minta Soulbound NFT automaticamente.
- **Reveal Flow:**
  - Seller rivela la chiave AES (o lo fa automaticamente dopo il lock del buyer?).
  - _Nota:_ Il design atomico richiede che la chiave venga rivelata on-chain o via swap atomico. Per MVP semplice: Seller invia chiave off-chain dopo lock, se non lo fa → Burn.
- **Finalize Flow:**
  - Buyer conferma codice valido → SC aggiorna NFT stats (volume, trade count, level).

### Phase 4: NFT Visual Design & Metadata

- Implementazione `tokenURI(uint256 tokenId)` con SVG dinamico on-chain.
- Design badge per 4 tier basati su trade count (Newcomer/Member/Trusted/Veteran).
- Metadata JSON con stats aggiornati (volume, trade count, disputes).
- Test rendering NFT su wallet (MetaMask, OpenSea testnet).

## ✅ Verifica (Testing Plan)

1.  **Unit Test SC:** Testare tutti gli scenari economici (Happy path, Fraud attempt, Burn).
2.  **Simulation:** Script TypeScript (già iniziato) per validare i modelli di trust deposit.
3.  **Testnet Deployment:** Deploy su Shimmer/IOTA Testnet.

## 📂 Struttura File Prevista

```
/contracts
  GiftBlitz.rs (Escrow Logic)
  ReputationNFT.rs (Soulbound ERC-5192)
/src
  /components
    CreateBoxForm.tsx
    MarketplaceList.tsx
    SwapInterface.tsx
    ReputationBadge.tsx (Mostra NFT utente)
  /hooks
    useGiftBlitzContract.ts
    useReputationNFT.ts
  /lib
    crypto.ts (AES logic)
    svgGenerator.ts (Badge rendering)
```
