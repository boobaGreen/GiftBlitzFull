# GiftBlitz - Regole e Meccaniche 📚

> **Tutto quello che devi sapere per usare GiftBlitz come Buyer o Seller**

---

## 🎯 Le 4 Regole Fondamentali

```
1️⃣ TRUST DEPOSIT = Seller: 100% Prezzo | Buyer: 110% Valore Card
2️⃣ SELLER può vendere fino a €200 dal giorno 1
3️⃣ BUYER ha caps progressivi (anti-griefing)
4️⃣ UNA DISPUTA = reset del trade count a 0
```

---

## 💰 Come Funziona il Trust Deposit

**Cos'è il trust deposit?** Un deposito cauzionale che blocchi durante il trade. Lo riprendi se tutto va bene.

| Chi | Cosa Deposita | Esempio (carta €100, prezzo €80) |
|-----|---------------|----------------------------------|
| **Seller** | 100% del prezzo | €80 |
| **Buyer** | Prezzo + 110% Valore | €80 + €110 (110% di €100) = €190 |

### Se tutto OK ✅
- Seller riceve: trust deposit + prezzo - 1% fee = **€159.20**
- Buyer riceve: trust deposit indietro + carta = **€80 + carta da €100**

### Se DISPUTA (BURN) 🔥
- Entrambi perdono il trust deposit (bruciato)
- Buyer recupera il prezzo pagato
- **Nessuno vince → entrambi perdono**

---

## 📦 Se Sei un SELLER (Vuoi Vendere)

### Cosa Puoi Fare

| Trade Count | Max Valore Box |
|-------------|----------------|
| **Qualsiasi** | **€200** |

> ✅ **Puoi vendere una gift card da €100 dal primo giorno!**

### Come Funziona

1. **Crea un Box** → Inserisci codice gift card (criptato) + trust deposit 100%
2. **Attendi Buyer** → Qualcuno compra il tuo Box
3. **Buyer Verifica** → Controlla che il codice funzioni
4. **Buyer Conferma** → Ricevi trust deposit + prezzo - 1% fee

### ⚠️ Se Truffi (Codice Falso)

```
Buyer fa BURN → Perdi tutto il trust deposit (€80)
Non guadagni nulla → Solo perdita garantita
```

---

## 🛒 Se Sei un BUYER (Vuoi Comprare)

### Limiti in Base ai Trade Completati

| Trade Completati | Max Acquisto |
|------------------|--------------|
| 0-2 | €30 |
| 3-6 | €50 |
| 7-14 | €100 |
| 15+ | €200 |

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

| Evento | Effetto |
|--------|---------|
| Trade OK come Seller | +1 |
| Trade OK come Buyer | +1 |
| Box cancellata | Nessuno |
| **DISPUTA** | **RESET A 0** |

> 🎯 **È UN SOLO contatore!** Cresce sia quando compri che quando vendi.

**Esempio:**
```
Mario (nuovo, tradeCount = 0)

Trade 1: COMPRA €20    → tradeCount = 1
Trade 2: VENDE €25     → tradeCount = 2
Trade 3: COMPRA €30    → tradeCount = 3 → MAX BUY = €50! ✨
```

---

## ⏱️ Auto-Confirm (24 Ore)

Dopo aver rivelato il codice, se non ci sono azioni per **24 ore**, il sistema **conferma automaticamente** il trade.

**Perché?**
- Protegge il seller se il buyer sparisce (ghosting)
- Assicura che i fondi non restino bloccati per sempre
- Hai 24h per verificare: più che sufficienti!

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
    ┌─────────────────┐              ┌─────────┐    ┌─────────┐
    │ Riceve Deposit +│◄─────────────│ Riceve  │    │ BURN    │
    │ Prezzo - 1% Fee │              │ Deposit │    │ ENTRAMBI│
    └─────────────────┘              └─────────┘    └─────────┘
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

| Aspetto | Seller | Buyer |
|---------|--------|-------|
| **Trust Deposit** | 100% del prezzo | 110% del Valore Card |
| **Max Trade (nuovo)** | €200 | €30 |
| **Max Trade (veteran)** | €200 | €200 |
| **Fee** | 1% sul prezzo | 0% |
| **Rischio Principale** | BURN se codice falso | BURN se disputa falsa |
