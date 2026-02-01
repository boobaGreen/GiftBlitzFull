# GiftBlitz - Il Sistema di Reputazione NFT 🎖️

> **Perché usiamo un NFT Soulbound per la reputazione e come funziona**

### The Big Picture: Security, Speed & Utility
![Why Soulbound Master](./why_soulbound_master.png)
*Figure 1: The 3 Pillars of GiftBlitz Reputation System*

---

### 🤔 E la Notarizzazione? (NFT vs Ledger)

Hai chiesto giustamente: *"Ma non bastava la blockchain?"*
La risposta è che **usiamo entrambe**, ma per scopi diversi. Immagina la differenza tra un **Estratto Conto** e il tuo **Credit Score**.

| Feature | **Notarizzazione (IOTA Tangle)** | **Soulbound NFT (Smart Contract)** |
| :--- | :--- | :--- |
| **Cos'è?** | Il **Registro Completo** (Log) | Il **Punteggio Attuale** (Stato) |
| **Dati** | "Trade #123 started", "Trade #123 locked", "Trade #123 dispute..." | "Level: 3", "Total Trades: 15" |
| **Uso** | **Audit & Ricerca**: *"Fammi vedere esattamente cosa è successo nel trade X"* | **Accesso**: *"L'utente può entrare qui?"* (Sì/No immediato) |
| **Analoga** | 📜 **L'Estratto Conto** (Migliaia di righe) | 💳 **La Carta Gold** (Un solo oggetto) |

**La Notarizzazione è la "Fonte della Verità"**. L'NFT è il **risultato calcolato** da quella verità, ottimizzato per essere usato dalle macchine (Smart Contract) e dagli umani (UI) in tempo reale.

---

## 🎯 A Cosa Serve il Reputation NFT?

Il Reputation NFT è un **certificato on-chain** che traccia la tua storia su GiftBlitz. Serve a:

| Funzione | Perché È Importante |
|----------|---------------------|
| **Tracciare Trade Count** | Determina i tuoi limiti di acquisto |
| **Prevenire Sybil Attack** | Non puoi comprare/vendere reputazione |
| **Trasparenza** | Tutti vedono la tua storia |
| **Persistenza** | I dati sopravvivono anche se cambi wallet |

---

## 🔒 Cos'è un NFT "Soulbound"?

Un NFT Soulbound (SBT) è un token che **NON può essere trasferito o venduto**.

```
NFT Normale:           NFT Soulbound:
┌─────────────┐        ┌─────────────┐
│  Può essere │        │  Legato per │
│  venduto    │        │  sempre al  │
│  o regalato │        │  tuo wallet │
└─────────────┘        └─────────────┘
      ↓                      ↓
   Tradable              NON Tradable
```

### Perché Soulbound?

| Problema | Soluzione Soulbound |
|----------|---------------------|
| "Compro un account Pro da qualcuno" | ❌ Impossibile, l'NFT non si muove |
| "Faccio 100 account e li farmo" | ❌ Costoso (1% fee × trade) + tempo |
| "Vendo la mia reputazione" | ❌ L'NFT resta nel tuo wallet |

### 🛠️ Perché tecnicamente serve un NFT? (vs Log)

Potremmo semplicemente leggere lo storico delle transazioni sulla blockchain? Sì, ma sarebbe **inefficiente** per due motivi critici su IOTA/EVM:

![Efficiency Comparison](./sbt_efficiency.png)

1.  **Efficienza di Calcolo (Gas & Storage):**
    *   **Log/Storia:** Per sapere se sei "affidabile", lo Smart Contract dovrebbe rileggere *tutte* le tue 100+ transazioni passate ogni volta che compri qualcosa. Questo costa calcolo (Gas) e su IOTA L1 richiederebbe un **Storage Deposit** crescente (dovresti bloccare sempre più IOTA per salvare i nuovi dati).
    *   **NFT (Stato):** L'NFT è come una "variabile unica" orecisamente aggiornata. Leggere il tuo livello costa sempre **pochissimo ed è istantaneo**, sia che tu abbia fatto 1 trade o 1 milione.

2.  **Componibilità Futura (Trust Lego):**
    *   Un semplice "log" interno è visibile solo al nostro contratto.
    *   Un **NFT Standard (ERC-721)** è un oggetto che "vive" nel tuo wallet.
    *   *Esempio Futuro:* Un'altra dApp di prestiti su IOTA potrebbe dire: *"Se hai il Badge Veteran su GiftBlitz, ti diamo un prestito con collaterale più basso"*. Questo è impossibile senza un token standard.

---

## 📊 Cosa Contiene il Reputation NFT?

```solidity
struct ReputationNFT {
    address owner;           // Il tuo wallet (fisso per sempre)
    uint256 totalTrades;     // Quanti trade hai completato
    uint256 totalVolume;     // Volume totale in € 
    uint256 disputes;        // Quante dispute hai avuto
    uint256 firstTradeTime;  // Quando hai iniziato
}
```

### Esempio Pratico

```
👤 Mario - Reputation NFT

┌────────────────────────────────────┐
│  🎖️ GiftBlitz Reputation          │
│                                    │
│  Owner: 0x71C...9A21               │
│  Total Trades: 12                  │
│  Total Volume: €450                │
│  Disputes: 0 ✅                    │
│  Member Since: Jan 2026            │
│                                    │
│  Status: VETERAN (15+ trades)      │
│  Max Buy: €200                     │
└────────────────────────────────────┘
```

---

## 🛡️ Come Protegge il Sistema?

### 1. Anti-Sybil (Molti Account Fake)

**Senza NFT:**
```
Attaccante crea 100 wallet → 100 identità pulite
Può fare griefing infinito
```

**Con NFT Soulbound:**
```
Attaccante crea 100 wallet → 100 NFT nuovi
Ogni NFT parte da 0 trades → Max buy €30
Per arrivare a €200: serve fare 15 trade reali × 100 account
Costo: enorme tempo + fee
```

### 2. Anti-Reputation Farming

**Scenario:** Utente fa trade con se stesso per gonfiare i numeri

```
Trade count = 15 → "Sbloccato" €200 max
Ma costa: 15 × €30 × 1% = €4.50 in fee
+ Tempo per ogni trade
+ Se disputa per sbaglio = reset a 0
```

### 3. Trasparenza Totale

Quando compri da un seller, puoi vedere:
- ✅ Quanti trade ha fatto
- ✅ Quante dispute ha avuto (idealmente 0)
- ✅ Da quanto tempo è sulla piattaforma

---

## 🎨 Come Appare Visivamente?

L'NFT mostra un badge dinamico che cambia in base alla tua esperienza:

| Trade Count | Badge | Colore |
|-------------|-------|--------|
| 0-2 | 🔵 Newcomer | Blu |
| 3-6 | 🟢 Member | Verde |
| 7-14 | 🟣 Trusted | Viola |
| 15+ | 🟡 Veteran | Oro |

```svg
┌────────────────────────┐
│    ⭐ VETERAN ⭐        │
│                        │
│    12 Trades           │
│    €450 Volume         │
│    0 Disputes          │
│                        │
│    [█████████░] 80%    │
│    to next level       │
└────────────────────────┘
```

---

## ❓ FAQ

**Q: Quando ricevo il mio NFT?**
> Automaticamente al tuo primo trade completato.

**Q: Posso avere più NFT su wallet diversi?**
> Sì, ogni wallet ha il suo NFT con la sua storia separata.

**Q: Se perdo l'accesso al wallet, perdo la reputazione?**
> Sì, la reputazione è legata al wallet. Usa un wallet sicuro!

**Q: L'NFT costa gas per essere creato?**
> Su IOTA l'NFT viene creato senza gas fee grazie alla feeless architecture.

**Q: Se disputo, cosa succede al mio NFT?**
> Il campo `disputes` aumenta di 1 e il `totalTrades` torna a 0.

---

## ✅ Conclusione: Serve Ancora l'NFT?

**SÌ, assolutamente!** Ecco perché:

| Senza NFT | Con NFT Soulbound |
|-----------|-------------------|
| Chiunque può fingere di essere veterano | I dati sono on-chain e verificabili |
| Puoi comprare account "Pro" | Impossibile trasferire reputazione |
| Nessuna storia persistente | Tutto è tracciato per sempre |
| Sybil attack facile | Sybil attack costoso e lento |

### Il Reputation NFT è la "carta d'identità" di GiftBlitz:
- 🔒 **Non falsificabile** (on-chain)
- 🔒 **Non trasferibile** (Soulbound)
- 🔒 **Trasparente** (tutti possono verificare)
- 🔒 **Persistente** (non si cancella)

---

## 🔧 Implementazione Tecnica

```solidity
// Standard: ERC-5192 (Soulbound Token Extension)
// Network: IOTA EVM (ISC)

interface ISoulbound {
    // Blocca qualsiasi trasferimento
    function locked(uint256 tokenId) external view returns (bool);
    // Sempre true per i nostri NFT
}

contract GiftBlitzReputation is ERC721, ISoulbound {
    mapping(uint256 => ReputationData) public reputation;
    
    // Override transfer per bloccare
    function _beforeTokenTransfer(...) internal override {
        require(from == address(0), "Soulbound: non transferable");
    }
}
```

---

## 📌 Riepilogo

```
┌─────────────────────────────────────────────────────────────┐
│                    REPUTATION NFT                           │
│                                                             │
│  ✅ Traccia: trades, volume, dispute, tempo                │
│  ✅ Non trasferibile: legato al wallet per sempre          │
│  ✅ Determina: limiti di acquisto (buyer caps)             │
│  ✅ Previene: Sybil, farming, compravendita account        │
│  ✅ Mostra: badge visivo del tuo status                    │
│                                                             │
│  → È la prova on-chain che sei un utente affidabile        │
└─────────────────────────────────────────────────────────────┘
```
