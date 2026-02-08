# 🎉 Deployment Report - Reputation Bug Fix

> **Data:** 8 Febbraio 2026  
> **Network:** IOTA Testnet  
> **Status:** ✅ Completato con successo

---

## 🐛 Bug Risolto

### Problema Identificato

Nel contratto `reputation.move`, la funzione `reset_on_dispute()` **incrementava** invece di **resettare** il contatore `total_trades`:

```move
// PRIMA (BUG):
public(package) fun reset_on_dispute(nft: &mut ReputationNFT) {
    nft.total_trades = nft.total_trades + 1; // ❌ INCREMENTA
    nft.disputes = nft.disputes + 1;
}
```

**Conseguenza:** Un griefer poteva fare false dispute e **guadagnare** reputazione invece di perderla, violando il meccanismo di deterrenza del sistema.

### Fix Applicato

```move
// DOPO (FIX):
public(package) fun reset_on_dispute(nft: &mut ReputationNFT) {
    nft.total_trades = 0; // ✅ RESET a zero
    nft.disputes = nft.disputes + 1;
}

public(package) fun record_dispute_counterparty(nft: &mut ReputationNFT) {
    nft.total_trades = 0; // ✅ RESET a zero per entrambe le parti
    nft.disputes = nft.disputes + 1;
}
```

**Effetto:**

- ✅ Aligned con documentazione: "UNA DISPUTA = reset del trade count a 0"
- ✅ Deterrenza massima contro griefing attacks
- ✅ Game theory corretto: false dispute costa €110 + perdita reputazione completa

---

## 📦 Deployment Info

### Contract IDs

```json
{
  "NETWORK": "testnet",
  "PACKAGE_ID": "0xbddac876baae9ce7f1fb218cee6d48789532cd1ff5b68455ddfffa90bede2175",
  "ADMIN_CAP_ID": "0x7069928ee50a2c394364d700dfe6f739cc1c422bd43224d727b80ebd4179aacc",
  "TREASURY_ID": "0x731d6f4fdf4153efc78e75a008c4cd077d9286005f675c2e9b3d23cb938b3257"
}
```

### Deployer Address

```
0x724d1c6cbba57d4b5b68a60ce5bef7f660a7d28f5c68ab096991bbe904a49afa
```

### Explorer Links

- **Package**: https://explorer.rebased.iota.org/object/0xbddac876baae9ce7f1fb218cee6d48789532cd1ff5b68455ddfffa90bede2175?network=testnet
- **AdminCap**: https://explorer.rebased.iota.org/object/0x7069928ee50a2c394364d700dfe6f739cc1c422bd43224d727b80ebd4179aacc?network=testnet
- **Treasury**: https://explorer.rebased.iota.org/object/0x731d6f4fdf4153efc78e75a008c4cd077d9286005f675c2e9b3d23cb938b3257?network=testnet

---

## ✅ Verifica Build

```bash
INCLUDING DEPENDENCY IotaSystem
INCLUDING DEPENDENCY Stardust
INCLUDING DEPENDENCY Iota
INCLUDING DEPENDENCY MoveStdlib
BUILDING giftblitz
✅ Build completato con successo
```

---

## 🎯 Impatto del Fix

### Scenario Prima del Fix (BUG)

```
Griefer con 0 trade:
1. Compra box Amazon €100 (price €80)
2. Riceve codice valido
3. FA FALSE DISPUTE

Risultato BUG:
- total_trades: 0 → 1 ✅ (incrementa!)
- disputes: 0 → 1
- Cap buyer: €30 → €30 (nessun impatto)
- Perde €110 trust deposit
- Ma può ripetere 2 volte → total_trades = 3 → cap €50!

EXPLOIT: Griefer può "farmare" reputazione con false dispute!
```

### Scenario Dopo il Fix (CORRETTO)

```
Griefer con 0 trade:
1. Compra box Amazon €100 (price €80)
2. Riceve codice valido
3. FA FALSE DISPUTE

Risultato FIX:
- total_trades: 0 → 0 ✅ (reset, rimane 0)
- disputes: 0 → 1
- Cap buyer: €30 → €30 (bloccato a minimo)
- Perde €110 trust deposit
- NON può mai aumentare cap con dispute

DETERRENZA: False dispute NON premiano, solo puniscono!
```

### Game Theory Corretto

| Azione            | Costo Buyer      | Guadagno Buyer | Razionale? |
| ----------------- | ---------------- | -------------- | ---------- |
| **Trade onesto**  | €0               | +1 reputation  | ✅ SÌ      |
| **False dispute** | €110 + reset rep | €0             | ❌ NO      |

**Nash Equilibrium:** Buyer honest, Seller honest ✅

---

## 📝 Prossimi Passi

1. ✅ **Testare su frontend** - Verificare che dispute funzioni correttamente
2. ✅ **Monitorare testnet** - Vedere se utenti testano il sistema dispute
3. ⏳ **Security audit** - Prima di mainnet, far verificare la logica da esperti
4. ⏳ **Test suite** - Aggiungere unit test per dispute scenarios

---

## 🔍 File Modificati

- `contracts/sources/reputation.move` (linee 64, 70)
- `fe/src/data/contracts.json` (aggiornato con nuovi IDs)

---

_Deployment completato: 8 Febbraio 2026, 13:50 UTC+1_
