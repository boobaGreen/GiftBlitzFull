# 📝 Design Decisions: Proxy Re-Encryption (PRE)

Questo documento riassume le scelte architettoniche fatte per l'implementazione del sistema di crittografia avanzata in GiftBlitz.

## 1. Perché Proxy Re-Encryption (PRE)?

Abbiamo valutato tre approcci per la consegna dei codici gift:

- **P2P Manuale**: Sicuro ma asincrono (il buyer aspetta il seller).
- **Centralized Vault**: Veloce ma non "Zero-Trust" (il server vede i codici).
- **Proxy Re-Encryption**: **Scelto.** Offre la velocità del centralizzato con la sicurezza del P2P. Permette la "Instant UX" mantenendo l'identità sovrana dell'utente.

## 2. Architettura Ibrida: Perché un Server Proxy?

**Decisione**: Utilizzare un server Node.js come Proxy Relay invece di una rete totalmente decentralizzata (come Lit Protocol) per la fase MVP/Hackathon.

- **Raziocinio**: L'integrazione di reti decentralizzate terze aggiungerebbe latenza e complessità di dipendenza esterna che potrebbe compromettere la stabilità della demo. Un proxy controllato da noi garantisce performance ottimali.
- **Mitigazione Rischio**: Il Proxy è matematicamente "cieco". Anche se il server viene compromesso, l'attaccante non può decriptare i codici gift senza le chiavi private degli utenti.

## 3. Strategia di Fallback (Resilienza)

**Decisione**: Il sistema deve rimanere funzionante anche se il Proxy Relay è offline.

- **Implementazione**: Lo Smart Contract IOTA rimane la fonte della verità. Se il Proxy non pubblica la chiave re-criptata entro un tempo limite, l'interfaccia utente abilita automaticamente il tasto "Manual Reveal" per il venditore.
- **Vantaggio**: Massima affidabilità del Marketplace. Il Proxy è un acceleratore di esperienza, non un punto di fallimento critico.

## 4. Scelta della Libreria: Umbral-js (NuCypher)

**Decisione**: Utilizzare lo schema _Umbral_ tramite la libreria WebAssembly (WASM).

- **Perché?**: È lo standard de facto per la PRE in ambito Web3. Offre crittografia a soglia (Threshold Encryption), che permetterebbe in futuro di dividere la "bacchetta magica" tra più nodi proxy per eliminare ogni punto di centralizzazione.

## 5. Game Theory & Incentivi

**Decisione**: Mantenere i Trust Deposits (110%) anche con l'automazione PRE.

- **Motivo**: Se il venditore fornisce un codice errato (anche se criptato correttamente), la Game Theory della disputa rimane l'unica protezione per il buyer. La crittografia protegge la _privacy_, la Game Theory protegge l' _onestà_.

---

## 6. Evoluzione Futura (Roadmap)

1.  **Phase 1**: Proxy controllato dal team GiftBlitz.
2.  **Phase 2**: Multi-proxy federato (nodi gestiti da partner del progetto).
3.  **Phase 3**: Transizione a una rete PRE totalmente decentralizzata (Lit Protocol / Threshold Network).
