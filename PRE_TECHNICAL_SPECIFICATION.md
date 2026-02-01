# 🛠️ Technical Specification: Proxy Re-Encryption (PRE) Implementation

Questo documento descrive la transizione del sistema di crittografia di GiftBlitz da un modello P2P asincrono a un modello **Proxy Re-Encryption (PRE)** professionale.

L'obiettivo è ottenere la **"Instant UX"**: il compratore vede il codice nel momento esatto in cui paga, senza che il venditore debba tornare online.

---

## 1. Obiettivo Finale

- **Privacy Totale**: Il codice gift rimane protetto crittograficamente in ogni fase.
- **Disponibilità Istantanea**: Eliminazione della dipendenza dal "reveal" manuale del venditore.
- **Sicurezza Matematica**: Nessun intermediario può leggere i codici.
- **Key Management Stateless**: Le chiavi vengono derivate deterministicamente dalla firma del wallet, eliminando rischi di Local Storage.

---

## 2. Architettura del Sistema

### Componenti:

1.  **Frontend (Seller & Buyer)**: Gestisce la crittografia iniziale e la decrittazione finale tramite `umbral-js`.
2.  **Smart Contract (IOTA/Move)**: Funge da "Arbitro" e registro pubblico dei pagamenti e delle chiavi.
3.  **Proxy Relay (Backend)**: Un software "cieco" (blind) che monitora la blockchain ed esegue la magia della trasformazione delle chiavi.

---

## 3. Cambiamenti Necessari (Roadmap)

### 🔵 Frontend (FE)

- **Installazione**: Aggiunta di `@nucypher/umbral-js` (WASM).
- **Fase di Creazione (Seller - Stateless)**:
  1.  Genera un **Salt** casuale.
  2.  Firma `Salt` con Wallet → Deriva **Symmetric Key**.
  3.  Cripta il codice → `Ciphertext`.
  4.  Concatena `Ciphertext + Salt` e invia on-chain come `encrypted_code`.
- **Fase di Acquisto (Buyer)**:
  1.  Riconosce l'evento di acquisto.
  2.  Scarica il materiale re-criptato dal Proxy (o tramite la chain).
  3.  Usa la propria **Chiave Privata** per sbloccare il codice istantaneamente.

### 🟢 Smart Contract (Move)

- **Update Struct `GiftBox`**:
  - Rimuovere `encrypted_code` semplice.
  - Aggiungere `capsule: vector<u8>` (il pacchetto crittografato).
  - Aggiungere `kfrag_id: vector<u8>` (identificativo per la delega).
- **Update Logica**:
  - La funzione `join_box` deve emettere un evento che includa la **Public Key** del buyer.

### 🔴 Backend (Proxy Relay)

- **Nuovo Servizio**: Creazione di una cartella `/proxy` con un server Node.js.
- **Blockchain Listener**: Monitoraggio degli eventi `BoxLocked`.
- **Re-Encryption Logic**:
  1.  Quando vede un acquisto, prende la chiave pubblica del buyer dall'evento.
  2.  Usa i `KFrags` (precedentemente caricati dal seller) per trasformare il `Capsule`.
  3.  Salva il risultato (Re-encrypted Capsule) in un metadato leggibile dal buyer.

---

## 4. Flusso Passo-Passo

1.  **Seller**: Mette in vendita. Il browser genera tutto il materiale crittografico (Capsule + KFrags).
2.  **Blockchain**: Registra l'annuncio.
3.  **Proxy**: Salva i KFrags (senza poterli usare finché non c'è un pagamento).
4.  **Buyer**: Clicca "Compra Ora". I fondi vengono bloccati nello Smart Contract.
5.  **Proxy**: Rileva il pagamento, esegue la re-encryption e la pubblica.
6.  **Buyer**: Il browser rileva la chiave disponibile e mostra il codice Amazon. **Tempo totale: ~2-3 secondi.**

---

## 5. Tecnologie Utilizzate

- **Crittografia**: Threshold Proxy Re-Encryption (Umbral Scheme).
- **Frontend**: React + WASM (per le performance di Umbral).
- **Backend**: Node.js + `@iota/iota-sdk` per interfacciarsi con i nodi IOTA.
- **Storage**: On-chain (IOTA) per capsule e metadati.

---

## 6. Perché è una soluzione Professionale?

---

## 7. Set-Up & Operation Guide

### 📂 Directory Structure

- **Root**: `.../Desktop/GiftBlitz` (Base for all commands)
- **Frontend**: `fe/`
- **Contracts**: `contracts/`
- **Proxy Relay**: `proxy/` (Verrà creata)

### ⌨️ Initial Setup Commands

| Task                      | Environment | Path         | Command                                                                           |
| :------------------------ | :---------- | :----------- | :-------------------------------------------------------------------------------- |
| **Frontend Dependencies** | Windows/WSL | `root/fe`    | `npm install @nucypher/umbral-js nacl-signature`                                  |
| **Create Proxy Service**  | Windows/WSL | `root/`      | `mkdir proxy && cd proxy && npm init -y`                                          |
| **Proxy Dependencies**    | Windows/WSL | `root/proxy` | `npm install @iota/iota-sdk ethers@5.7.2 cors express dotenv @nucypher/umbral-js` |
| **Deploy Contracts**      | **WSL**     | `root/`      | `./publish.sh`                                                                    |
| **Run Proxy**             | Windows/WSL | `root/proxy` | `node server.js`                                                                  |
| **Run Frontend**          | Windows/WSL | `root/fe`    | `npm run dev`                                                                     |

### 💡 WSL vs Windows Rules

1. **WSL**: Usalo tassativamente per tutto ciò che riguarda `iota client` o il deployment degli smart contracts (`publish.sh`).
2. **Windows**: Puoi usarlo per il `dev server` di Vite (`npm run dev`) e per installare pacchetti npm.
3. **Paths**: In WSL, il tuo path di lavoro è: `/mnt/c/Users/ClaudioDall'Ara/OneDrive - Agile Lab/Desktop/GiftBlitz`
