# 🔒 Analisi di Sicurezza - Soluzione 3A (On-Chain Key Escrow)

> **Domanda Critica**: Se `seller_secret` diventa pubblico dopo il pagamento, chiunque può decriptare la chiave e rubare il codice gift?

---

## ⚠️ RISPOSTA: SÌ, LA SOLUZIONE 3A È INSICURA

Hai assolutamente ragione a essere preoccupato. Analizziamo perché.

---

## 🔴 Vulnerabilità della Soluzione 3A

### Scenario di Attacco

```
Timeline:
T0: Seller crea box
    - encrypted_key_for_anyone = Encrypt(K, Hash(box_id || seller_secret))
    - seller_secret pubblicato on-chain (o in evento)
    - encrypted_code pubblicato on-chain

T1: Buyer paga
    - Smart contract emette evento con seller_secret

T2: ATTACCANTE (chiunque monitora la blockchain)
    - Legge seller_secret dall'evento
    - Legge encrypted_key_for_anyone dalla chain
    - Calcola P = Hash(box_id || seller_secret)
    - Decripta K = Decrypt(encrypted_key_for_anyone, P)
    - Decripta codice gift = Decrypt(encrypted_code, K)
    - 🚨 ATTACCANTE HA IL CODICE GIFT!

T3: Buyer (legittimo)
    - Fa la stessa cosa, ma è troppo tardi
    - Il codice potrebbe essere già stato usato dall'attaccante
```

### ❌ Problema Fondamentale

**Una volta che `seller_secret` è pubblico, CHIUNQUE può decriptare la chiave simmetrica K, e quindi il codice gift.**

Non c'è nessun meccanismo che limita la decriptazione solo al buyer legittimo.

---

## 🔍 Perché Non Funziona

### Tentativo di Fix 1: Usare buyer_address nella derivazione

```
P = Hash(box_id || seller_secret || buyer_address)
```

**Problema**:

- `buyer_address` è pubblico on-chain (visibile a tutti)
- Attaccante può comunque calcolare P e decriptare

**Verdict**: ❌ Non risolve

---

### Tentativo di Fix 2: Criptare seller_secret per buyer

```
Seller:
1. Cripta seller_secret con buyer public key
2. Pubblica encrypted_seller_secret on-chain

Buyer:
1. Decripta seller_secret con sua private key
2. Usa seller_secret per decriptare K
```

**Problema**:

- **Questo richiede che seller conosca buyer public key PRIMA del pagamento**
- Ma buyer è sconosciuto fino a quando non paga!
- Torniamo al problema originale (seller deve intervenire dopo il pagamento)

**Verdict**: ❌ Non risolve (torniamo al punto di partenza)

---

### Tentativo di Fix 3: Time-Lock sul seller_secret

```
Seller:
1. Pubblica seller_secret criptato con time-lock
2. Time-lock si sblocca solo dopo che buyer ha pagato + 10 minuti

Buyer:
1. Paga
2. Aspetta 10 minuti
3. Time-lock si sblocca, buyer decripta
```

**Problema**:

- Richiede Time-Lock Encryption (complessità 10/10)
- Attaccante può comunque aspettare 10 minuti e rubare il codice
- Non risolve il problema fondamentale

**Verdict**: ❌ Non risolve

---

## 🎯 Conclusione sulla Soluzione 3A

### ❌ DA ESCLUDERE COMPLETAMENTE

La Soluzione 3A **NON È SICURA** perché:

1. **Chiunque può decriptare**: Una volta che `seller_secret` è pubblico, non c'è modo di limitare chi può decriptare
2. **Nessuna autenticazione**: Non c'è meccanismo per verificare che chi decripta sia il buyer legittimo
3. **Race condition**: Attaccante può decriptare prima del buyer

**Questa soluzione va SCARTATA.**

---

## ✅ Soluzioni Sicure Rimanenti

Dopo aver escluso la 3A, ecco le soluzioni che SONO sicure:

### 1. Soluzione 2A/2B: Proxy Re-Encryption (PRE)

**Perché è sicura:**

- La chiave K è criptata specificamente per la **public key del buyer**
- Solo il buyer (con sua private key) può decriptare
- Il proxy trasforma la chiave ma **non può decriptarla**
- Matematicamente sicuro (threshold cryptography)

**Flusso sicuro:**

```
Seller:
1. Cripta codice per SÉ STESSO (Capsule)
2. Genera KFrags (deleghe matematiche)

Buyer paga:
3. Proxy usa KFrags per trasformare Capsule
4. Capsule trasformata è criptata per BUYER PUBLIC KEY
5. Solo buyer (con private key) può decriptare

Attaccante:
- Non ha la private key del buyer
- Non può decriptare nemmeno con accesso a KFrags
```

**Sicurezza**: ✅ Matematicamente garantita

---

### 2. Soluzione 1A: Time-Lock Encryption (con drand)

**Perché è sicura:**

- La chiave K è criptata con una "future timestamp"
- Solo dopo che drand network pubblica il beacon per quella timestamp, K diventa decriptabile
- Ma a quel punto il buyer ha già pagato e il trade è in corso

**Problema pratico:**

- Complessità altissima
- Dipendenza da drand network
- Non flessibile (timestamp fisso)

**Sicurezza**: ✅ Sicura ma impraticabile

---

### 3. Soluzione Attuale (P2P Manuale)

**Perché è sicura:**

- Seller cripta K specificamente per **buyer public key** (ECDH)
- Solo buyer può decriptare con sua private key
- Nessun altro può accedere

**Problema:**

- Richiede che seller torni online
- UX asincrona

**Sicurezza**: ✅ Sicura (già implementata)

---

## 🔄 Rivediamo le Opzioni Valide

| Soluzione                     | Sicura? | Decentralizzata? | Automatica? | Complessità  | Raccomandazione         |
| ----------------------------- | ------- | ---------------- | ----------- | ------------ | ----------------------- |
| **Attuale (P2P)**             | ✅      | ✅               | ❌          | 🟢 Già fatto | ⚠️ Funziona ma UX lenta |
| **2A: Proxy Centralizzato**   | ✅      | ⚠️               | ✅          | 🟡 7/10      | ✅ **MIGLIORE per MVP** |
| **2B: Proxy Decentralizzato** | ✅      | ✅               | ✅          | 🔴 9/10      | ⏳ Futuro               |
| **1A: Time-Lock**             | ✅      | ✅               | ✅          | 🔴 10/10     | ❌ Troppo complesso     |
| **3A: On-Chain Escrow**       | ❌      | ✅               | ✅          | 🟢 4/10      | ❌ **INSICURA**         |

---

## 🎯 Nuova Raccomandazione

### Per MVP/Hackathon: Soluzione 2A (Proxy Re-Encryption Centralizzato)

Dopo aver escluso la 3A per motivi di sicurezza, la **Soluzione 2A è l'unica che soddisfa tutti i requisiti**:

✅ **Sicura**: Solo buyer può decriptare (matematicamente garantito)  
✅ **Automatica**: Istantanea (2-3 secondi)  
✅ **Implementabile**: 3-5 giorni con umbral-js  
⚠️ **Trade-off**: Proxy centralizzato (ma matematicamente "cieco")

---

## 🛠️ Implementazione Soluzione 2A (Sicura)

### Smart Contract (Modifiche a giftblitz.move)

```move
public struct GiftBox has key, store {
    // ... campi esistenti ...

    // PRE fields
    capsule: vector<u8>,           // Codice criptato per seller
    kfrag_ids: vector<vector<u8>>, // IDs dei KFrags (stored off-chain)

    // Rimuovere encrypted_key (non serve più)
}

public entry fun create_box(
    // ... parametri esistenti ...
    capsule: vector<u8>,
    kfrag_ids: vector<vector<u8>>,
) {
    // Seller pubblica Capsule e KFrag IDs
}

public entry fun join_box(...) {
    // ... logica esistente ...

    // Emetti evento con buyer public key
    iota::event::emit(BoxLocked {
        id: object::id_address(box),
        buyer: buyer_addr,
        buyer_public_key: buyer_pub_key  // ← NUOVO
    });
}
```

### Frontend (security.ts)

```typescript
import {
  Alice,
  Bob,
  encrypt,
  generateKFrags,
  reencrypt,
} from "@nucypher/umbral-js";

// Seller: Create Box
export async function createBoxWithPRE(giftCode: string) {
  // 1. Generate seller keypair (Alice)
  const alice = Alice.fromSecretKey(sellerSecretKey);

  // 2. Encrypt code for seller (Capsule)
  const { capsule, ciphertext } = encrypt(
    alice.publicKey,
    Buffer.from(giftCode),
  );

  // 3. Generate KFrags (delegations)
  const kfrags = generateKFrags(
    alice.secretKey,
    alice.publicKey,
    alice.publicKey, // Placeholder, will be re-encrypted for buyer
    1, // threshold
    1, // shares
  );

  // 4. Upload KFrags to Proxy Server
  const kfragIds = await uploadKFragsToProxy(kfrags);

  return {
    capsule: Array.from(capsule.toBytes()),
    ciphertext: Array.from(ciphertext),
    kfragIds,
  };
}

// Buyer: Decrypt after purchase
export async function decryptWithPRE(
  capsule: Uint8Array,
  ciphertext: Uint8Array,
  buyerPrivateKey: CryptoKey,
) {
  // 1. Buyer keypair (Bob)
  const bob = Bob.fromSecretKey(buyerSecretKey);

  // 2. Request re-encryption from Proxy
  const reencryptedCapsule = await requestReencryption(boxId, bob.publicKey);

  // 3. Decrypt with buyer's private key
  const plaintext = decrypt(bob.secretKey, reencryptedCapsule, ciphertext);

  return plaintext.toString();
}
```

### Proxy Server (proxy/server.js)

```javascript
const { IotaClient } = require("@iota/iota-sdk");
const { reencrypt } = require("@nucypher/umbral-js");

// Monitor blockchain for BoxLocked events
async function monitorBoxLocked() {
  const client = new IotaClient({ url: IOTA_RPC_URL });

  // Subscribe to events
  const subscription = await client.subscribeEvent({
    filter: { MoveEventType: `${PACKAGE_ID}::giftblitz::BoxLocked` },
  });

  subscription.on("message", async (event) => {
    const { id: boxId, buyer, buyer_public_key } = event.parsedJson;

    // 1. Fetch KFrags for this box
    const kfrags = await getKFragsForBox(boxId);

    // 2. Perform re-encryption for buyer
    const buyerPubKey = PublicKey.fromBytes(buyer_public_key);
    const reencryptedCapsule = reencrypt(capsule, kfrags, buyerPubKey);

    // 3. Store re-encrypted capsule (IPFS or on-chain)
    await storeReencryptedCapsule(boxId, reencryptedCapsule);

    console.log(`✅ Re-encrypted box ${boxId} for buyer ${buyer}`);
  });
}
```

---

## 📊 Confronto Sicurezza

### ❌ Soluzione 3A (INSICURA)

```
Attaccante può:
1. Leggere seller_secret (pubblico)
2. Calcolare password = Hash(box_id || seller_secret)
3. Decriptare K
4. Decriptare codice gift
5. 🚨 RUBARE IL CODICE
```

### ✅ Soluzione 2A (SICURA)

```
Attaccante può:
1. Leggere Capsule (pubblico)
2. Leggere KFrags (pubblico)
3. Vedere re-encrypted Capsule (pubblico)

Attaccante NON può:
❌ Decriptare senza buyer private key
❌ Usare KFrags per decriptare (matematicamente impossibile)
❌ Rubare il codice

Solo buyer (con private key) può decriptare ✅
```

---

## 🎯 Decisione Finale

### ❌ SCARTARE Soluzione 3A

**Motivo**: Insicura, chiunque può decriptare dopo che seller_secret è pubblico

### ✅ ADOTTARE Soluzione 2A (Proxy Re-Encryption)

**Motivo**:

- Unica soluzione che è **sicura + automatica + implementabile**
- Trade-off accettabile (proxy centralizzato ma "cieco")
- Può evolvere verso 2B (decentralizzato) in futuro

---

## 📝 Prossimi Passi

Se sei d'accordo con Soluzione 2A:

1. [ ] Installare `@nucypher/umbral-js` nel frontend
2. [ ] Modificare smart contract per supportare Capsule e KFrags
3. [ ] Creare Proxy Server (Node.js)
4. [ ] Implementare monitoring eventi IOTA
5. [ ] Testing end-to-end

**Tempo stimato**: 3-5 giorni

Oppure, se preferisci mantenere il sistema attuale (P2P manuale) che è sicuro ma ha UX asincrona, possiamo migliorare l'esperienza utente con notifiche e UI migliore.

Quale direzione preferisci?
