# GiftBlitz - Regole e Meccaniche 📚

> **Tutto quello che devi sapere per usare GiftBlitz come Buyer o Seller**

---

## 🎯 Le 4 Regole Fondamentali

```
1️⃣ TRUST DEPOSIT = Seller: 100% FACE VALUE | Buyer: 110% Valore Card
2️⃣ SELLER può vendere fino a €200 dal giorno 1
3️⃣ BUYER ha caps progressivi (anti-griefing)
4️⃣ UNA DISPUTA = reset del trade count a 0
```

---

## 💰 Come Funziona il Trust Deposit

**Cos'è il trust deposit?** Un deposito cauzionale che blocchi durante il trade. Lo riprendi se tutto va bene.

| Chi        | Cosa Deposita        | Esempio (carta €100, prezzo €80) |
| ---------- | -------------------- | -------------------------------- |
| **Seller** | 100% Face Value      | €100                             |
| **Buyer**  | Prezzo + 110% Valore | €80 + €110 (110% di €100) = €190 |

### Se tutto OK ✅

- Seller riceve: trust deposit + prezzo - 1% fee = **€179.20**
- Buyer riceve: trust deposit indietro + carta = **€80 + carta da €100**

### Se DISPUTA (Protocol Treasury) 🏦

- Entrambi perdono il trust deposit (confiscato dal protocollo)
- Buyer recupera il prezzo pagato
- **Deterrente massimo**: i fondi mancanti alimentano il fondo di sviluppo della piattaforma.

---

## 📦 Se Sei un SELLER (Vuoi Vendere)

### Cosa Puoi Fare

| Trade Count   | Max Valore Box |
| ------------- | -------------- |
| **Qualsiasi** | **€200**       |

> ✅ **Puoi vendere una gift card da €100 dal primo giorno!**

### Come Funziona

1. **Crea un Box** → Inserisci codice gift card (criptato) + trust deposit 100%
2. **Attendi Buyer** → Qualcuno compra il tuo Box
3. **Buyer Verifica** → Controlla che il codice funzioni
4. **Buyer Conferma** → Ricevi trust deposit + prezzo - 1% fee

### ⚠️ Se Truffi (Codice Falso)

```
Buyer attiva DISPUTA → Perdi il trust deposit (va al Protocol Treasury)
Non guadagni nulla → Solo perdita garantita
```

---

## 🛒 Se Sei un BUYER (Vuoi Comprare)

### Limiti in Base ai Trade Completati

| Trade Completati | Max Acquisto |
| ---------------- | ------------ |
| 0-2              | €30          |
| 3-6              | €50          |
| 7-14             | €100         |
| 15+              | €200         |

> ⚠️ **I caps per buyer esistono per prevenire griefing (false dispute)**

### Come Funziona

1. **Scegli un Box** → Trova una gift card che ti interessa
2. **Paga + Trust Deposit** → Depositi prezzo + 110% del Valore Card (Trust Deposit)
3. **Ricevi Codice** → Il seller rivela il codice (ancora criptato)
4. **Verifica** → Prova il codice sul sito del brand
5. **Conferma o Disputa**:
   - ✅ **Codice OK** → Confermi, riprendi trust deposit
   - ❌ **Codice Falso** → Disputi, BURN di entrambi i trust deposit

### ⚠️ Se Fai Griefing (Disputa Falsa)

```
Perdi il tuo trust deposit (€80) per bruciare trust deposit del seller (€80)
Rapporto 1:1 → Non è profittevole!
+ Il tuo trade count torna a 0
```

---

## 📈 Come Cresce il Tuo Trade Count

| Evento               | Effetto       |
| -------------------- | ------------- |
| Trade OK come Seller | +1            |
| Trade OK come Buyer  | +1            |
| Box cancellata       | Nessuno       |
| **DISPUTA**          | **RESET A 0** |

> 🎯 **È UN SOLO contatore!** Cresce sia quando compri che quando vendi.

**Esempio:**

```
Mario (nuovo, tradeCount = 0)

Trade 1: COMPRA €20    → tradeCount = 1
Trade 2: VENDE €25     → tradeCount = 2
Trade 3: COMPRA €30    → tradeCount = 3 → MAX BUY = €50! ✨
```

---

## ⏱️ Timeouts e Protezioni

### 🔒 Regola 1: NO Cancellazione Dopo l'Acquisto

**Una volta che un buyer compra il tuo box, NON puoi più cancellare.**

- ✅ Puoi cancellare PRIMA che qualcuno compri (gratis)
- ❌ NON puoi cancellare DOPO che qualcuno ha comprato
- 🎯 Questo garantisce commitment e fiducia

### ⏰ Regola 2: Reveal Timeout (72 Ore)

**Il seller ha 72 ore (3 giorni) per rivelare il codice dopo che il buyer compra.**

**Se seller NON rivela entro 72h:**

- Buyer può richiedere rimborso completo
- Buyer recupera: prezzo + trust deposit + 50% del trust deposit seller
- Seller perde: 100% del trust deposit (50% va al buyer, 50% Protocol Treasury)

**Esempio:**

```
Box: Amazon €100, prezzo €80

Seller NON rivela entro 72h:
→ Buyer recupera: €80 (prezzo) + €110 (suo trust deposit) + €40 (50% trust deposit seller) = €230
→ Seller perde: €80 (trust deposit)
→ Protocol Treasury: €40
```

**Perché 72 ore?**

- Copre weekend e piccole emergenze
- Abbastanza tempo per seller di tornare online
- Non troppo lungo per buyer (3 giorni è accettabile)

### ⏰ Regola 3: Auto-Finalize (72 Ore Dopo Reveal)

**Il buyer ha 72 ore (3 giorni) per verificare il codice e confermare/disputare.**

**Se buyer NON conferma né disputa entro 72h:**

- Il trade si **auto-finalizza** automaticamente
- Sistema assume: codice valido
- Seller riceve il pagamento
- Entrambi recuperano i trust deposit

**⚠️ IMPORTANTE per Buyer:**

- DEVI verificare il codice entro 72h
- Dopo auto-finalize, NON puoi più disputare
- Assicurati di poter testare il codice nei prossimi 3 giorni!

**Esempio:**

```
T+0h:   Buyer compra box
T+2h:   Seller rivela codice
T+3h:   Buyer riceve codice ma NON lo verifica
T+74h:  Auto-finalize → Seller riceve pagamento
T+7d:   Buyer prova codice → INVALIDO
        Troppo tardi! Non può più disputare
```

**Perché 72 ore?**

- Tempo abbondante per verificare un codice gift
- Simmetrico con reveal timeout (giusto per entrambi)
- Protegge seller da buyer che "dimenticano" di confermare

### 📊 Timeline Completa

```
T+0h:     Buyer compra box
          ↓ [Seller ha 72h per rivelare]

T+2h:     Seller rivela codice
          ↓ [Buyer ha 72h per confermare/disputare]

T+3h:     Buyer verifica codice

Scenario A (Happy Path):
T+4h:     Buyer conferma → ✅ Trade completato

Scenario B (Auto-Finalize):
T+74h:    Nessuna azione → ✅ Auto-finalize (assume valido)

Scenario C (Dispute):
T+5h:     Codice invalido → ❌ Buyer disputa → Protocol Treasury

Scenario D (Seller Ghosting):
T+72h:    Seller NON ha rivelato → ⚠️ Buyer richiede rimborso + compensazione
```

---

## 🔄 Riepilogo Visivo

```
                       GiftBlitz TRADE FLOW

    SELLER                                      BUYER
    ┌─────────┐                                ┌─────────┐
    │ Crea Box│◄─────── Matching ──────────────│ Compra  │
    │+Deposit │                                │+Deposit │
    └────┬────┘                                └────┬────┘
         │                                          │
         ▼                                          ▼
    ┌─────────┐                                ┌─────────┐
    │ Attende │                                │ Riceve  │
    │         │◄─────── Codice ────────────────│ Codice  │
    └────┬────┘                                └────┬────┘
         │                                          │
         │                                     ┌────┴────┐
         │                                     ▼         ▼
         │                               ┌─────────┐ ┌─────────┐
         │                               │ Conferma│ │ Disputa │
         │                               │   ✅    │ │   🔥    │
         │                               └────┬────┘ └────┬────┘
         │                                    │           │
         ▼                                    ▼           ▼
    ┌─────────────────┐              ┌─────────┐    ┌─────────────┐
    │ Riceve Deposit +│◄─────────────│ Riceve  │    │ Protocol    │
    │ Prezzo - 1% Fee │              │ Deposit │    │ Treasury    │
    └─────────────────┘              └─────────┘    └─────────────┘
```

---

## ❓ FAQ Rapide

**Q: Posso vendere una gift card da €100 appena mi registro?**

> ✅ Sì! I seller possono vendere fino a €200 dal giorno 1.

**Q: Perché non posso comprare box grandi subito?**

> Per prevenire griefing. Devi fare qualche trade piccolo prima.

**Q: Cosa succede se disputo per errore?**

> Entrambi perdete il trust deposit e il tuo trade count torna a 0. Verifica bene prima di disputare!

**Q: Se l'altro disputa, perdo anche io?**

> Sì, la disputa brucia i trust deposit di ENTRAMBI. Ecco perché funziona come deterrente.

**Q: Quanto costa usare GiftBlitz?**

> Solo 1% fee sul prezzo, detratto dal pagamento al seller.

---

## 📊 Tabella Riassuntiva Finale

| Aspetto                 | Seller               | Buyer                 |
| ----------------------- | -------------------- | --------------------- |
| **Trust Deposit**       | 100% del Face Value  | 110% del Valore Card  |
| **Max Trade (nuovo)**   | €200                 | €30                   |
| **Max Trade (veteran)** | €200                 | €200                  |
| **Fee**                 | 1% sul prezzo        | 0%                    |
| **Rischio Principale**  | BURN se codice falso | BURN se disputa falsa |
