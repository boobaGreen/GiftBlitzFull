# 🎨 Visual Guide: How Proxy Re-Encryption Works

Proxy Re-Encryption (PRE) is like **"Magic Transformation Crittografica"**. Permette di cambiare il destinatario di un segreto senza mai doverlo leggere.

## 1. L'Analogia della "Scatola Magica"

Immagina questa situazione:

1.  **Il Venditore** mette il codice Amazon in una **scatola d'acciaio** e la chiude con il suo lucchetto (Chiave del Venditore).
2.  Il Venditore dà la scatola a un **Corriere (il Proxy)**.
3.  Il Venditore dà al Corriere anche una **Bacchetta Magica (Re-encryption Key)**.
    - _Nota_: La bacchetta **NON** può aprire la scatola. Può solo cambiarne la forma esterna.
4.  Il Venditore va in vacanza e spegne il telefono.
5.  **Il Compratore** arriva, paga sulla blockchain, e mostra la ricevuta al Corriere.
6.  Il Corriere usa la **Bacchetta Magica** sulla scatola chiusa.
7.  **Magia!** Il lucchetto sulla scatola si trasforma: ora non risponde più alla chiave del Venditore, ma si apre con la **Chiave del Compratore**.
8.  Il Compratore apre la scatola e legge il codice.

---

## 2. Il Flusso Tecnico (Mermaid Diagram)

Ecco come i dati si spostano tra il tuo browser, la rete e la blockchain:

```mermaid
sequenceDiagram
    participant S as Venditore (Offline dopo Step 1)
    participant BC as IOTA Blockchain
    participant P as Proxy Network (I nodi)
    participant B as Compratore

    Note over S: Step 1: Preparazione
    S->>S: Cripta Codice (Capsule)
    S->>S: Genera Bacchetta Magica (KFrags)
    S->>P: Consegna Scatola + Bacchetta

    Note over B: Step 2: Acquisto
    B->>BC: Paga 110 IOTA
    BC-->>P: Evento: "Pagamento Confermato per Buyer X"

    Note over P: Step 3: Trasformazione (Instant)
    P->>P: Wave Wand (Re-encrypt Capsule per Buyer X)
    P->>B: Consegna Scatola con nuovo Lucchetto

    Note over B: Step 4: Decriptazione
    B->>B: Apri con Chiave Privata locale
    B->>B: VEDI CODICE! 🚀
```

---

## 3. Perché è "Professionale"?

| Problema      | Soluzione PRE                                                                                                            |
| :------------ | :----------------------------------------------------------------------------------------------------------------------- |
| **Privacy**   | I nodi (Proxy) non possono mai vedere il codice. Vedono solo "rumore" matematico.                                        |
| **Velocità**  | Il compratore non deve aspettare che il venditore torni online. La rete lavora per lui.                                  |
| **Sicurezza** | Anche se un nodo proxy viene hackerato, l'hacker non può leggere nulla perché ha solo un pezzo della "bacchetta magica". |

---

## 4. Visual Representation

![Infografica PRE](/C:/Users/ClaudioDall'Ara/.gemini/antigravity/brain/1d3e1d04-c958-4d37-ae45-821937f2060e/pre_encryption_infographic_1769908821137.png)
_(L'immagine qui sopra mostra visivamente come il "lucchetto" cambia forma durante il passaggio dal venditore al compratore)_
