# GiftBlitz - Game Theory & Security Analysis 🔒📊

> **Obiettivo:** Analizzare e bilanciare il sistema di trust deposit per renderlo:
>
> 1. **Invogliante** → Basse barriere d'ingresso per utenti onesti
> 2. **Sicuro** → Frode matematicamente irrazionale
> 3. **Resistente** → Protezione da attacchi esterni (wash trading, griefing)

> [!IMPORTANT]
> **Le sezioni 1-5 sono ANALISI STORICHE** che documentano il processo di ragionamento.
> **La DECISIONE FINALE è nella Sezione 6** → Trust Deposit 100% simmetrico + Buyer caps automatici + No livelli Newbie/Pro.

---

## 1. Analisi del Modello Attuale (da WhitePaper)

### 1.1 Trust Deposit Venditore (Seller)

| Livello | Trust Deposit Richiesto | Logica                                                              |
| ------- | ----------------------- | ------------------------------------------------------------------- |
| Base    | **100% del FACE VALUE** | **Safety First:** Impedisce double-spending con perdita netta certa |

### 1.2 Trust Deposit Compratore (Buyer)

| Livello | Trust Deposit Richiesto | Logica                       |
| ------- | ----------------------- | ---------------------------- |
| Newbie  | 50% del valore          | Da verificare se sufficiente |
| Pro     | 25% del valore?         | Da definire                  |

### 1.3 Level-Up Requirements (Attuale)

- **Pro:** 5 trade + €30 media per trade (€150 volume minimo)

## 2. Esempi Completi con Flusso Monetario

> **Chiarimento Importante:**
>
> - **Valore Carta** = Quanto vale la carta (es. €50 Amazon)
> - **Prezzo Vendita** = Quanto il buyer paga (es. €40, con 20% sconto)
> - **Trust Deposit** = Deposito cauzionale (calcolato come % del PREZZO, non del valore)

---

### ❓ Q1: Perché il 100% del Face Value (e non del prezzo)?

#### Esempio: Vendo Carta €100 a Prezzo €80

**Setup Iniziale:**
| Attore | Deposita | Totale Bloccato |
|--------|----------|-----------------|
| Seller | Trust Deposit = 100% di €100 (Face Value) = **€100** | €100 |
| Buyer | Prezzo €80 + Trust Deposit €110 (110% V) = €190 | **€190** |
| **Totale in Escrow** | | **€290** |

---

**🟢 SCENARIO A: Trade Onesto (Happy Path)**

1. Seller rivela chiave, Buyer verifica → conferma.
2. Smart Contract rilascia fondi.

| Attore | Riceve Indietro                            | Guadagno Netto            |
| ------ | ------------------------------------------ | ------------------------- |
| Seller | €100 (trust deposit) + €80 (prezzo) = €180 | **+€80** (vendo carta)    |
| Buyer  | €110 (trust deposit) + Carta (€100)        | **+€20** (valore - costo) |

---

**🔴 SCENARIO B: Double Spending (Seller Froda)**

Il Seller vende la carta qui E su un'altra piattaforma per €80.
Qui fornisce codice invalido (o già usato). Buyer disputa.

1. **Altrove:** Seller incassa €80.
2. **Qui (GiftBlitz):** Buyer disputa → Treasury confisca il deposito del Seller (€100).
3. **Calcolo Seller:**
   - Guadagno Altrove: +€80
   - Perdita Qui: -€100
   - **NETTO: -€20 💸**

**Conclusione:**
Con il deposito al **100% del Face Value**, il double-spending è matematicamente una **perdita certa**.
Il truffatore non va in pari (come accadrebbe col deposito sul prezzo), ma ci rimette soldi.
**FRODE IRRAZIONALE E COSTOSA. ✅**

---

### 🧮 PROOF MATEMATICA: Perché il Buyer è SEMPRE Incentivato a Fare BURN

> **⚠️ OBIEZIONE COMUNE:** "Se sono già stato truffato (codice falso), non mi conviene dire 'OK' per almeno recuperare il mio trust deposit, invece di bruciare tutto?"

**RISPOSTA: NO!** Ecco la dimostrazione formale.

#### Setup del Problema

- **Carta:** Valore nominale V = €50
- **Prezzo:** P = €40 (sconto 20%)
- **Trust Deposit Buyer:** B = 100% × P = €40
- **Trust Deposit Seller:** S = 100% × P = €40 (o 200% per Newbie = €80)

#### Flusso Smart Contract

1. Buyer deposita: **P + B** = €40 + €40 = €80
2. Seller deposita: **S** = €40 (o €80)
3. Totale in escrow: €120 (o €160)

#### Cosa Succede in Caso di BURN:

```
 ┌─────────────────────────────────────────────────────┐
 │   TREASURY = Confisca SOLO i Trust Deposit (B + S)       │
 │   Il PREZZO (P) viene RESTITUITO al Buyer!               │
 └─────────────────────────────────────────────────────┘
```

#### Tabella Decisionale del Buyer (quando truffato)

| Azione              | Buyer Perde           | Buyer Recupera        | Risultato Netto Buyer |
| ------------------- | --------------------- | --------------------- | --------------------- |
| Conferma OK (falso) | P = €40               | Trust Deposit B = €40 | **-€40** ❌           |
| DISPUTA             | Trust Deposit B = €40 | Prezzo P = €40        | **€0** ✅             |

#### ✅ CONCLUSIONE FORMALE

**Se il buyer è stato truffato (codice invalido):**

```
Payoff(Conferma OK) = -P = -€40
Payoff(BURN)        = -B + P = -€40 + €40 = €0

Poiché €0 > -€40 → la DISPUTA è SEMPRE la scelta razionale!
```

**In formula generale:**

```
Se B ≤ P → BURN è sempre dominante per buyer truffato.
MA ATTENZIONE: Se Valore Card > Trust Deposit, un buyer malevolo potrebbe truffare (Scenario Burner Account).
**Soluzione:** Impostare Buyer Trust Deposit > Valore Card (es. 110%).
```

---

### 🎯 IMPLICAZIONE: Perché il Seller Non Può Truffare

Sapendo che il Buyer farà **sempre** BURN se truffato:

| Scenario          | Seller Guadagna | Seller Perde | EV Seller        |
| ----------------- | --------------- | ------------ | ---------------- |
| Trade onesto      | +P = €40        | €0           | **+€40** ✅      |
| Frode (→ Disputa) | €0              | S = €40/€80  | **-€40/-€80** ❌ |

**Il seller razionale sa che la frode causa BURN con certezza → non froda mai.**

---

### 📊 Matrice di Gioco Completa (Nash Equilibrium)

|                   | Buyer Conferma | Buyer BURN               |
| ----------------- | -------------- | ------------------------ |
| **Seller Onesto** | (+40, +10) ✅  | (-80, 0)                 |
| **Seller Froda**  | (+40, -40)     | (-80, 0) ← accade sempre |

**Nash Equilibrium:** (Seller Onesto, Buyer Conferma) = (+40, +10)

- Se Seller froda → Buyer apre Disputa (perché 0 > -40)
- Sapendo questo → Seller non froda (perché -80 < +40)
- → Equilibrio: Trade onesto

---

**📊 Conclusione Q1:**

```
Trust Deposit 100% del PREZZO = €40 per vendere carta da €50 al prezzo di €40
Frode: Max guadagno €0 (perché BURN), Max perdita €40-€80
→ FRODE MATEMATICAMENTE IRRAZIONALE ✅
```

**💡 Nota Finale:**
Il sistema funziona perché il **prezzo torna al buyer in caso di burn**.
Questo rende il BURN a "costo zero" per il buyer truffato, mentre il seller perde il trust deposit.

---

### ❓ Q2: È giusto il 100% per venditori Pro?

#### Esempio: Carta €100, Prezzo €80

**Setup con Trust Deposit 100%:**
| Attore | Deposita |
|--------|----------|
| Seller Pro | Trust Deposit = 100% di €80 = **€80** |
| Buyer | Prezzo €80 + Trust Deposit 50% = €40 | **€120** |

**Frode Seller:**

```
Max guadagno (buyer non disputa): €80 (prezzo)
Perdita (buyer disputa): €80 (trust deposit)
Rapporto: 1:1 → NEUTRO ⚠️
```

**Problema:** Con rapporto 1:1, il fraudatore potrebbe tentare se:

- Ha già intenzione di abbandonare la piattaforma
- Può creare account multipli (Sybil)

**💡 Proposta per Pro:**

1. **Trust Deposit 100% + Trade Value Cap:**
   - Pro max trade = €200
   - Limita il danno massimo per singola frode
2. **Cooling period:** Pro deve aspettare 24h prima di fare trade >€100
3. **Trust Deposit dinamico:** Trust Deposit = 100% + (10% per ogni dispute passata)

---

### ❓ Q3: È corretto il requisito "5 trade + €30 media" per diventare Pro?

#### Analisi Attacco Sybil (Farming Reputazione)

**Costo per creare 1 account Pro:**

```
5 trade × €30 medio = €150 volume
Fee 1% = €1.50 speso
Tempo: ~1 settimana se attivo
```

**Poi froda:**

```
1 trade da €100 → Guadagno €80 (se buyer non disputa)
                → Perdita €80 (se disputa)
```

**Problema:** Dopo essere diventato Pro, può frodare con rapporto ~1:1.
Il costo €1.50 per "comprare" status Pro è troppo basso!

**💡 Proposta Requisiti Pro:**

| Requisito       | Attuale | Proposto      | Perché                      |
| --------------- | ------- | ------------- | --------------------------- |
| Trade count     | 5       | **10**        | Più frizione                |
| Volume medio    | €30     | **€40**       | Evita micro-trade farming   |
| Volume totale   | €150    | **€400**      | Costo farming = €4 fee      |
| Tempo minimo    | -       | **14 giorni** | Impedisce hit-and-run       |
| Dispute massime | -       | **0**         | Un dispute = reset a Newbie |

**Costo farming nuovo:**

```
10 trade × €40 × 1% fee = €4
+ 14 giorni di attesa
+ Rischio che una controparte disputi (reset)
```

Più costoso e rischioso → Disincentiva Sybil

---

## 3. Analisi Approfondita: Compratore (Buyer)

### ❓ Q4: Quanto trust deposit per Buyer Newbie?

**Scenario:** Buyer Newbie compra carta da €50 a prezzo €40

- **Rischio per il sistema:** Buyer reclama frode falsa per bruciare trust deposit venditore
- **Costo del griefing:** Il trust deposit del buyer stesso viene bruciato

**Attuale (assunto):** 50% del prezzo = €20

**Analisi:**

```
Griefing: Costo = €20 bruciati
Danno inflitto = €100 (trust deposit venditore Newbie) o €50 (Pro)
Rapporto Danno/Costo = 5:1 o 2.5:1 → PROFITTEVOLE per griefer!
```

**⚠️ VULNERABILITÀ CRITICA:** Un concorrente potrebbe:

1. Comprare con account fake
2. Disputare sempre → bruciare trust deposit a venditori onesti
3. Costo: solo €20 per causare €100 di danno

**💡 Proposta:**
| Livello Buyer | Trust Deposit Proposto | Logica |
|---------------|----------------|--------|
| Newbie | **100% del PREZZO** | Pari al venditore Pro |
| Pro | **50% del prezzo** | Ridotto per buyer verificati |

Con 100%: Griefing costa €40 per bruciare €100 → Rapporto 2.5:1 ancora rischioso
**Alternativa:** Trust Deposit buyer = Trust Deposit seller (simmetrico)

---

### ❓ Q5: Quanto trust deposit per Buyer Pro?

Se Buyer Pro ha trust deposit 50%:

- Trade €100 a €80 → Trust Deposit €40
- Griefing: Costo €40, Danno €100 → Rapporto 2.5:1

**💡 Proposta:** Buyer Pro trust deposit = **75% del prezzo**

- Rapporto Danno/Costo = 1.33:1 → marginale ma non profittevole considerando:
  - Perdita reputazione (account Pro "sprecato")
  - Costo farming nuovo account Pro

---

## 4. Meccanica Reputazione Unificata

### ❓ Q6: È chiara la dinamica del contatore unico?

**Regola attuale:** Ogni trade completato → +1 trade count + volume per ENTRAMBI

**Scenari:**
| Scenario | Seller | Buyer | Risultato |
|----------|--------|-------|-----------|
| Trade OK | +1 trade, +€50 vol | +1 trade, +€50 vol | Entrambi crescono |
| Dispute (burn) | +1 dispute | +1 dispute | Entrambi puniti |
| Cancel (pre-lock) | Nessun effetto | N/A | Nessun effetto |

**✅ Semplice e chiaro.** Nessuna asimmetria.

**⚠️ Problema:** Un seller può "comprare" da se stesso per farmare reputazione?

**Analisi Wash Trading:**

- Seller crea Box €100
- Buyer (stesso owner) compra e finalizza
- Costo: 1% fee = €1
- Guadagno: +2 trade count (uno per ruolo)

**💡 Proposta Anti-Wash:**

1. **Cooldown** tra trade con stessa controparte (24h)
2. **Pattern detection:** Flag se >50% trade con stessi indirizzi
3. **Trust Deposit proporzionale al volume:** Trade piccoli (<€20) non contano per level-up

---

## 5. Vettori di Attacco Esterni

### 🔴 Attacco 1: Competitor Griefing

**Scenario:** Un competitor (es. CardCash) vuole distruggere GiftBlitz

- Compra 100 carte da venditori onesti
- Disputa sempre → brucia €10,000 di trust deposit venditori
- Costo per attaccante: €10,000 (trust deposit bruciato) + €500 carte = €10,500

**Difesa:**

- ✅ Se trust deposit buyer = trust deposit seller → Costo = Danno (neutro)
- ✅ Rate limiting: Max 3 dispute/giorno per account
- ✅ Blocklist: Account con >30% dispute rate bloccati

### 🔴 Attacco 2: Sybil Farming

**Scenario:** Creare molti account Pro per poi frodare

- Costo per 1 Pro: 10 trade × €50 × 1% = €5
- Poi froda 1 trade da €500 → Guadagno €500
- ROI: 100x

**Difesa:**

- ✅ Max trade value = f(reputazione): Newbie max €50, Pro max €200
- ✅ Tempo minimo in piattaforma (30 giorni per Pro)
- ✅ KYC opzionale per sbloccare limiti alti (con incentivi)

### 🟢 Auto-Confirm Timer (24h)

**Problema:** Buyer 'dimentica' di confermare o sparisce.
**Soluzione:** Smart Contract ha un timer.

- Se dopo **24 ORE** dal reveal non c'è Disputa né Conferma → **Auto-Confirm**.
- Fondi rilasciati al Seller.
- Protegge il Seller da ghosting.

**Difesa Finale:**

- ✅ Trust Deposit Asimmetrico (Buyer > Valore)
- ✅ **Auto-Confirm 24h** (nessun cooling period necessario)
- ✅ Pattern detection: flag se stesso utente disputa >30% trades
- ✅ Possibilità di caricare screenshot prova nel dispute (off-chain)

---

## 6. ✅ DECISIONE FINALE (APPROVATO - v3 Caps Asimmetrici)

### 📊 Sistema Finale

```
REGOLA 1: Selezionato Trust Deposit Asimmetrico (Safe Trust Deposit)
   - Seller Trust Deposit: 100% del Prezzo
   - Buyer Trust Deposit: 110% del VALORE della Card
REGOLA 2: Seller può vendere fino a €200 DAL GIORNO 1
REGOLA 3: Buyer ha caps progressivi (anti-griefing)
REGOLA 4: Una disputa = reset del trade count a 0
```

### 📈 Caps Asimmetrici

**SELLER (Chi Vende):**
| Trade Count | Max Valore Box |
|-------------|----------------|
| 0+ | **€200** |

> ✅ Un nuovo utente può vendere la sua gift card da €100 subito!

**BUYER (Chi Compra):**
| Trade Count | Max Acquisto |
|-------------|--------------|
| 0-2 | €30 |
| 3-6 | €50 |
| 7-14 | €100 |
| 15+ | €200 |

### 🛡️ Protezioni Anti-Abuse

| Protezione              | Implementazione                                                            |
| ----------------------- | -------------------------------------------------------------------------- |
| **Trust Deposit Model** | **Asimmetrico (Safe Trust Deposit)**: Buyer 110% Value > Seller 100% Price |
| **Seller Caps**         | €200 (già ha 100% trust deposit)                                           |
| **Buyer Caps**          | Progressivi (anti-griefing)                                                |
| **Auto-Confirm**        | Dopo 24h se nessuna azione                                                 |
| **Reset Dispute**       | Una disputa = trade count torna a 0                                        |

### 🛡️ Protezioni Anti-Abuse

| Protezione              | Implementazione                         |
| ----------------------- | --------------------------------------- |
| **Trust Deposit Model** | **Asimmetrico (Safe Trust Deposit)**    |
| **Trade Caps**          | Progressivi basati sui trade completati |
| **Auto-Confirm**        | Dopo 24h se nessuna azione              |
| **Reset Dispute**       | Una disputa = trade count torna a 0     |

> **Perché questo sistema?**
>
> - ✅ Più semplice (no "livelli" da spiegare)
> - ✅ Stesso livello di sicurezza
> - ✅ Progressione naturale
> - ✅ Deterrente forte (reset completo su disputa)

---

## 7. Implementazione

### ✅ DOCUMENTAZIONE (Completato)

- [x] WhitePaper aggiornato con sistema semplificato
- [x] Game Theory Analysis aggiornato
- [x] Competitor Analysis aggiornato

### ✅ CODICE (Completato)

- [x] `types/index.ts`: Rimosso `reputationLevel`, aggiunto `getMaxTradeValue()`
- [x] `mockData.ts`: Aggiornato a `minTrades` invece di `minReputation`
- [x] Trust Deposit = 100% Prezzo (Seller), 110% Valore (Buyer)
- [ ] Trust Deposit calculator: price \* 1.0 (100%)
