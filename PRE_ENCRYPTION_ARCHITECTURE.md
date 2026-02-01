# 🔐 Advanced Encryption Architecture: Proxy Re-Encryption (PRE)

This document outlines the professional-grade implementation of **Proxy Re-Encryption (PRE)** for GiftBlitz. This architecture enables **instant, trustless delivery** of gift card codes without requiring the seller to be online at the moment of purchase.

## 1. Overview: What is PRE?

Proxy Re-Encryption is a form of public-key encryption that allows a third party (the **Proxy**) to alter a ciphertext which has been encrypted for one party (the **Seller**), so that it can be decrypted by another party (the **Buyer**).

**Key Security Property:** The Proxy **never** sees the underlying plaintext (the gift code) and cannot decrypt the data itself.

---

## 2. The Professional Stack

- **Cryptographic Library:** `umbral-js` (NuCypher's WASM-based implementation of the Umbral threshold PRE scheme).
- **Consensus Layer:** IOTA (Move Smart Contracts) to verify payments and authorize re-encryption.
- **Off-chain Storage:** IPFS or Arweave for storing the encrypted "Capsules" and "Key Fragments".
- **Execution Environment:** WebAssembly (WASM) for high-performance cryptographic operations in the browser.

---

## 3. The Logical Flow

### Step 1: Seller Listing (Pre-delegation)

1. **Encryption**: The Seller encrypts the gift code using their own public key. This creates a **Capsule**.
2. **KFrag Generation**: The Seller generates a set of **Key Fragments (KFrags)**. These fragments contain the "mathematical permission" to transform the code from the Seller's key to _any_ authorized buyer.
3. **Storage**: The Capsule is uploaded to IPFS. The KFrags are distributed to a network of **Proxy Nodes** (or a secure decentralized vault).
4. **Blockchain**: The Seller publishes the IPFS CID to the IOTA smart contract.

### Step 2: Buyer Purchase (Instant Access)

1. **Payment**: The Buyer pays the price + trust deposit in IOTA.
2. **Event**: The Smart Contract emits a `BoxLocked` event containing the Buyer's Public Key.
3. **Re-Encryption**: The Proxy Nodes monitor the chain. Upon seeing the payment, they use the KFrags to transform the Capsule for the **Buyer's Public Key**.
4. **Decryption**: The Buyer downloads the re-encrypted capsule and decrypts it with their **Private Key**. **Istantaneamente.**

---

## 4. Pros, Cons & Feasibility

### Pros

- **UX Perfecta**: Il buyer vede il codice nel millisecondo in cui la transazione IOTA è confermata.
- **Zero Trust**: Nemmeno GiftBlitz può rubare il codice. Solo la matematica garantisce la privacy.
- **Scalabilità**: Supporta milioni di scambi senza colli di bottiglia asincroni.

### Cons

- **Complessità FE**: Richiede l'integrazione di moduli WASM pesanti nel frontend.
- **Infrastruttura**: Richiede un network di proxy (come NuCypher o un nostro set di nodi verificati).

### Costs & Difficulty

- **Difficultà**: 9/10 (Integrazione crittografica avanzata).
- **Costi Hardware**: Minimi (nodi proxy leggeri).
- **Costi Sviluppo**: Alti (richiede esperti in crittografia applicata).

---

## 5. Required Modifications

### Backend (BE) / Proxy

- Implementazione di un servizio di monitoraggio eventi IOTA.
- Integrazione di `umbral_rs` per gestire la re-encryption delle capsule.

### Frontend (FE)

- Integrazione di `umbral-js` nel wallet del browser.
- Automazione della generazione KFrags durante la creazione della `GiftBox`.

### Smart Contract

- Aggiunta di campi per memorizzare l'IPFS Hash (CID) e i riferimenti ai nodi proxy autorizzati.
