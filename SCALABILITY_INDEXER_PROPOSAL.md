# 🚀 Proposta: Implementazione IOTA GraphQL Indexer per Scalabilità

> **Documento:** Proposta Tecnica per Ottimizzazione Query e Scalabilità  
> **Data:** 8 Febbraio 2026  
> **Autore:** Analisi Tecnica GiftBlitz  
> **Status:** PROPOSTA FUTURA

---

## 📋 Problema Identificato

### Situazione Attuale

Il frontend GiftBlitz attualmente effettua query **dirette** alla blockchain IOTA tramite RPC:

```typescript
// Frontend query diretta via @iota/dapp-kit
const { data } = useIotaObjectQuery({
  objectId: boxId,
  options: { showContent: true },
});

// Per marketplace: deve scansionare TUTTI i GiftBox
const boxes = await client.getOwnedObjects({
  filter: { StructType: `${PACKAGE_ID}::giftblitz::GiftBox` },
});
```

### Performance Degradation

| Box Attivi | Tempo Query | User Experience  |
| ---------- | ----------- | ---------------- |
| 10-50      | ~200-500ms  | ✅ Ottimo        |
| 100-300    | ~1-2s       | ⚠️ Accettabile   |
| 500-1000   | ~3-5s       | ❌ Lento         |
| 1000+      | ~5-10s+     | ❌ Inaccettabile |

### Limitazioni Tecniche

1. **No Filtering Efficiente**
   - Frontend deve scaricare TUTTI i box e filtrare client-side
   - Impossibile fare query complesse (es. "box da €50-€100 per Amazon created last 7 days")

2. **No Sorting Server-Side**
   - Ordinamento per `created_at`, `price`, `face_value` fatto client-side
   - Performance degradata con grandi dataset

3. **No Full-Text Search**
   - Nessuna ricerca per brand, description, seller name
   - Limitato a exact match su address

4. **No Aggregation**
   - Impossibile calcolare statistiche (avg price, volume totale, ecc.) senza scaricare tutto

5. **Latency Alta**
   - Ogni query attraversa l'intero RPC protocol
   - No caching centralizzato

---

## 🎯 Soluzione Proposta: IOTA GraphQL Indexer

### Architettura

```mermaid
graph TB
    subgraph "IOTA Blockchain"
        A[Smart Contracts Move]
        B[Events Stream]
    end

    subgraph "Indexer Layer"
        C[IOTA Indexer Service]
        D[PostgreSQL Database]
        E[GraphQL API]
    end

    subgraph "Frontend"
        F[React App]
        G[Apollo Client]
    end

    A -->|Emit Events| B
    B -->|Real-time Subscribe| C
    C -->|Parse & Store| D
    D -->|Query| E
    F -->|GraphQL Queries| E
    G -.->|Cache| F

    style C fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#9f9,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
```

### Come Funziona

1. **Event Listening**
   - Indexer ascolta tutti gli eventi blockchain (`BoxCreated`, `BoxLocked`, `TradeFinalized`, ecc.)
   - Processo in real-time (latenza <1s)

2. **Data Parsing**
   - Estrae dati strutturati dagli eventi Move
   - Salva in database relazionale (PostgreSQL)

3. **GraphQL Exposure**
   - Espone API GraphQL ottimizzate
   - Supporta filtering, sorting, pagination, aggregation

4. **Frontend Query**
   - Frontend usa GraphQL invece di RPC diretto
   - Query veloci (~50ms) indipendentemente dal numero di box

---

## 🛠️ Opzioni Implementative

### Opzione 1: IOTA Hosted Indexer (Raccomandato per MVP)

**Descrizione:**  
Utilizzare il servizio di indexing gestito da IOTA Foundation (se disponibile su mainnet/testnet).

**Pro:**

- ✅ **Zero Infrastructure:** No server/DB da gestire
- ✅ **Costo:** Gratuito o molto basso
- ✅ **Manutenzione:** Gestita da IOTA Foundation
- ✅ **Affidabilità:** SLA garantito
- ✅ **Tempo Setup:** 3-5 giorni (solo modifiche frontend)

**Contro:**

- ❌ **Personalizzazione:** Query generiche, non ottimizzate per GiftBlitz
- ❌ **Dipendenza:** Devi verificare disponibilità su IOTA mainnet
- ❌ **Vendor Lock-in:** Dipendenza da servizio esterno

**Stack Necessario:**

```yaml
Frontend Changes:
  - Installare: @apollo/client
  - Sostituire: RPC calls con GraphQL queries
  - Aggiungere: Query caching con Apollo

Infrastructure:
  - Nessuna (tutto hosted da IOTA)

Costo Mensile: €0-10
```

**Effort Estimation:**

- **Sviluppo:** 3-5 giorni
- **Testing:** 2 giorni
- **Deploy:** 1 giorno
- **Totale:** ~1 settimana

**Esempio Query:**

```graphql
query GetOpenGiftBoxes($limit: Int, $offset: Int) {
  giftBoxes(
    filter: { state: { eq: "OPEN" } }
    orderBy: { created_at: DESC }
    limit: $limit
    offset: $offset
  ) {
    nodes {
      id
      seller
      card_brand
      face_value
      price
      created_at
    }
    totalCount
  }
}
```

---

### Opzione 2: Self-Hosted Indexer (Controllo Completo)

**Descrizione:**  
Deploy di un indexer personalizzato su infrastructure propria.

**Pro:**

- ✅ **Full Control:** Query custom, ottimizzazioni ad-hoc
- ✅ **Features Custom:** Analytics dashboard, admin tools
- ✅ **Privacy:** Dati su server proprietario
- ✅ **Extensibility:** Facile aggiungere Redis cache, ElasticSearch, ecc.

**Contro:**

- ❌ **Complexity:** Richiede DevOps skills
- ❌ **Costo:** €30-50/mese per VPS + DB
- ❌ **Manutenzione:** Updates, monitoring, backups a carico tuo

**Stack Consigliato:**

```yaml
Services:
  iota-indexer:
    image: iotaledger/iota-indexer:latest
    environment:
      - IOTA_RPC_URL=https://api.testnet.iota.org
      - DATABASE_URL=postgresql://user:pass@postgres:5432/giftblitz_indexer
    ports:
      - "9000:9000"

  postgresql:
    image: postgres:15
    volumes:
      - indexer_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=giftblitz_indexer
      - POSTGRES_USER=indexer
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  hasura:
    image: hasura/graphql-engine:latest
    environment:
      - HASURA_GRAPHQL_DATABASE_URL=postgresql://user:pass@postgres:5432/giftblitz_indexer
      - HASURA_GRAPHQL_ENABLE_CONSOLE=true
    ports:
      - "8080:8080"

volumes:
  indexer_data:
```

**Deploy Options:**

| Platform             | Costo/Mese | Difficoltà   | Pro                                |
| -------------------- | ---------- | ------------ | ---------------------------------- |
| **Railway.app**      | €20-30     | 🟢 Facile    | One-click deploy, auto-scaling     |
| **DigitalOcean App** | €30-40     | 🟢 Facile    | Managed DB, ±0 config              |
| **AWS ECS**          | €40-60     | 🔴 Difficile | Enterprise grade, complesso        |
| **Self-Hosted VPS**  | €15-25     | 🟡 Media     | Max control, richiede Linux skills |

**Schema Database Personalizzato:**

```sql
-- Table: gift_boxes
CREATE TABLE gift_boxes (
    id VARCHAR PRIMARY KEY,
    seller VARCHAR NOT NULL,
    buyer VARCHAR,
    card_brand VARCHAR NOT NULL,
    face_value BIGINT NOT NULL,
    price BIGINT NOT NULL,
    state VARCHAR NOT NULL,
    encrypted_code_hash BYTEA,
    created_at TIMESTAMP NOT NULL,
    locked_at TIMESTAMP,
    reveal_timestamp TIMESTAMP,

    -- Indexes per query veloci
    INDEX idx_state (state),
    INDEX idx_seller (seller),
    INDEX idx_buyer (buyer),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_brand_price (card_brand, price)
);

-- Table: reputation_nfts
CREATE TABLE reputation_nfts (
    id VARCHAR PRIMARY KEY,
    owner VARCHAR UNIQUE NOT NULL,
    total_trades BIGINT DEFAULT 0,
    total_volume BIGINT DEFAULT 0,
    disputes BIGINT DEFAULT 0,
    first_trade_time BIGINT,

    INDEX idx_owner (owner),
    INDEX idx_total_trades (total_trades DESC)
);

-- Table: trade_events (audit trail)
CREATE TABLE trade_events (
    id SERIAL PRIMARY KEY,
    box_id VARCHAR REFERENCES gift_boxes(id),
    event_type VARCHAR NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    data JSONB,

    INDEX idx_box_id (box_id),
    INDEX idx_timestamp (timestamp DESC)
);
```

**GraphQL Schema Hasura:**

Hasura auto-genera GraphQL da PostgreSQL, ma puoi customizzare:

```graphql
type GiftBox {
  id: ID!
  seller: Address!
  buyer: Address
  cardBrand: String!
  faceValue: BigInt!
  price: BigInt!
  state: GiftBoxState!
  createdAt: DateTime!
  lockedAt: DateTime
  revealTimestamp: DateTime

  # Relazioni
  sellerReputation: ReputationNFT
  events: [TradeEvent!]!
}

enum GiftBoxState {
  OPEN
  LOCKED
  REVEALED
  COMPLETED
  BURNED
  EXPIRED
}

type Query {
  # Custom query ottimizzata
  marketplaceBoxes(
    state: GiftBoxState
    brand: String
    minPrice: BigInt
    maxPrice: BigInt
    orderBy: OrderBy
    limit: Int = 20
    offset: Int = 0
  ): GiftBoxConnection!

  # Aggregation
  marketplaceStats: MarketStats!
}

type MarketStats {
  totalBoxes: Int!
  totalVolume: BigInt!
  averagePrice: Float!
  activeBoxesByBrand: [BrandStat!]!
}
```

**Effort Estimation:**

- **Setup Infrastructure:** 2-3 giorni
- **Schema Design:** 1-2 giorni
- **Indexer Config:** 2 giorni
- **Frontend Integration:** 3-5 giorni
- **Testing & Debug:** 3 giorni
- **Deploy & Monitoring:** 1-2 giorni
- **Totale:** ~2 settimane

**Costo Mensile:** €30-50 (Railway/DigitalOcean)

---

### Opzione 3: Soluzione Ibrida (Quick Win - Raccomandato per Ora)

**Descrizione:**  
Ottimizzare il frontend attuale con caching e pagination avanzata, senza backend indexer.

**Pro:**

- ✅ **Zero Costi:** Nessun server aggiuntivo
- ✅ **Rapido:** Implementabile in 1-2 giorni
- ✅ **Sufficiente per MVP:** Scala fino a 500-1000 box

**Contro:**

- ⚠️ **Limite Scalabilità:** Performance degradata con 1000+ box
- ⚠️ **No Advanced Features:** Search, aggregation limitati

**Implementazione:**

```typescript
// 1. Cache Aggressiva con React Query
import { useQuery } from "@tanstack/react-query";

const useMarketplaceBoxes = (filters) => {
  return useQuery(
    ["marketplaceBoxes", filters],
    () => fetchBoxesFromRPC(filters),
    {
      staleTime: 30000, // Cache 30 secondi
      cacheTime: 5 * 60 * 1000, // Keep 5 minuti
      refetchOnWindowFocus: false,
      keepPreviousData: true, // Smooth pagination
    },
  );
};

// 2. Pagination Server-Side (tramite cursors)
const fetchBoxesFromRPC = async ({ cursor, limit = 20, state }) => {
  const result = await iotaClient.queryObjects({
    filter: {
      StructType: `${PACKAGE_ID}::giftblitz::GiftBox`,
      // TODO: aggiungere filtro per state
    },
    cursor,
    limit,
  });

  return {
    boxes: result.data,
    nextCursor: result.nextCursor,
    hasMore: result.hasNextPage,
  };
};

// 3. Infinite Scroll
import { useInfiniteQuery } from "@tanstack/react-query";

const useInfiniteBoxes = () => {
  return useInfiniteQuery(
    ["infiniteBoxes"],
    ({ pageParam }) => fetchBoxesFromRPC({ cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 30000,
    },
  );
};

// 4. Optimistic Updates (per azioni rapide)
const { mutate } = useMutation((boxId) => purchaseBox(boxId), {
  onMutate: async (boxId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(["marketplaceBoxes"]);

    // Snapshot
    const previous = queryClient.getQueryData(["marketplaceBoxes"]);

    // Optimistically update
    queryClient.setQueryData(["marketplaceBoxes"], (old) => ({
      ...old,
      boxes: old.boxes.filter((b) => b.id !== boxId),
    }));

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback
    queryClient.setQueryData(["marketplaceBoxes"], context.previous);
  },
});

// 5. Local Filtering/Sorting (per piccoli dataset)
const filteredBoxes = useMemo(() => {
  return boxes
    ?.filter((box) => !brandFilter || box.card_brand === brandFilter)
    ?.filter((box) => box.price >= minPrice && box.price <= maxPrice)
    ?.sort((a, b) =>
      sortBy === "price" ? a.price - b.price : b.created_at - a.created_at,
    );
}, [boxes, brandFilter, minPrice, maxPrice, sortBy]);
```

**Frontend Structure:**

```
fe/src/
├── hooks/
│   ├── useMarketplaceBoxes.ts    # Cached marketplace query
│   ├── useInfiniteBoxes.ts       # Infinite scroll
│   └── useBoxMutations.ts        # Purchase, create, etc.
├── utils/
│   ├── queryClient.ts            # React Query config
│   └── boxFilters.ts             # Client-side filtering helpers
└── components/
    └── MarketplacePagination.tsx # Pagination UI
```

**Effort Estimation:**

- **Implementazione:** 1-2 giorni
- **Testing:** 1 giorno
- **Totale:** ~2-3 giorni

**Costo:** €0

**Breakpoint:** Questa soluzione scala fino a **500-1000 box attivi**. Oltre, serve indexer.

---

## 📊 Confronto Opzioni

| Criterio              | Hosted Indexer     | Self-Hosted   | Ibrida (Cache)     |
| --------------------- | ------------------ | ------------- | ------------------ |
| **Tempo Setup**       | 3-5 giorni         | 10-14 giorni  | 1-2 giorni         |
| **Costo/Mese**        | €0-10              | €30-50        | €0                 |
| **Scalabilità**       | ✅ Illimitata      | ✅ Illimitata | ⚠️ Fino a 1000 box |
| **Personalizzazione** | ⚠️ Limitata        | ✅ Completa   | ❌ Minima          |
| **Manutenzione**      | ✅ Zero            | ❌ Alta       | ✅ Minima          |
| **Vendor Lock-in**    | ⚠️ IOTA dipendente | ✅ No         | ✅ No              |
| **Query Avanzate**    | ✅ Sì              | ✅ Sì         | ❌ Limitate        |
| **Analytics**         | ⚠️ Basic           | ✅ Custom     | ❌ No              |
| **DevOps Skills**     | 🟢 Non richiesto   | 🔴 Richiesto  | 🟢 Non richiesto   |

---

## 🎯 Roadmap Consigliata

### Fase 1: MVP / Hackathon (ORA)

**Azione:** Implementare **Soluzione Ibrida** (Opzione 3)

**Perché:**

- Testing rapido senza infrastructure
- Sufficiente per early adopters (<500 utenti)
- Costo zero

**Deliverables:**

- ✅ Cache con React Query
- ✅ Pagination (20 box per pagina)
- ✅ Infinite scroll opzionale
- ✅ Loading states & skeleton loaders

**Timeline:** 2-3 giorni

---

### Fase 2: Public Launch (Post-Hackathon)

**Trigger:** Raggiunti **300+ box attivi** o **latenza >2s**

**Azione:** Valutare **IOTA Hosted Indexer** (Opzione 1)

**Verifiche:**

1. IOTA mainnet ha servizio indexer pubblico?
2. Supporta filtering/sorting personalizzati?
3. SLA accettabile?

**Se SÌ → Deploy Opzione 1**  
**Se NO → Procedi a Fase 3**

**Timeline:** 1 settimana

---

### Fase 3: Scale (1000+ Utenti)

**Trigger:**

- Raggiunti **1000+ box attivi**
- Richieste utenti per search/filtri avanzati
- Query latency >3s

**Azione:** Deploy **Self-Hosted Indexer** (Opzione 2)

**Stack:**

- Railway.app per hosting facile
- PostgreSQL managed DB
- Hasura per GraphQL
- IOTA Indexer ufficiale

**Features Aggiuntive:**

- Full-text search (PostgreSQL `tsvector`)
- Advanced filtering (price ranges, brands, dates)
- Analytics dashboard (volume, trades, disputes)
- Admin tools (ban users, refund disputes)

**Timeline:** 2 settimane

---

### Fase 4: Enterprise (10k+ Utenti)

**Trigger:**

- Traffico elevato (>100k queries/day)
- Necessità di multi-region
- Advanced analytics richieste

**Azione:** Ottimizzazioni Avanzate

**Stack Aggiornato:**

- **ElasticSearch:** Full-text search performante
- **Redis:** Cache layer per hot data
- **CDN:** Static data caching
- **Multi-region DB:** Replica PosgresSQL globale

**Costo:** €200-500/mese

---

## 🧮 Performance Benchmark

### Simulazione con 1000 Box Attivi

| Metodo              | Query Latency                    | Throughput | Scalabilità   |
| ------------------- | -------------------------------- | ---------- | ------------- |
| **RPC Diretto**     | ~5000ms                          | 0.2 req/s  | ❌ Non scala  |
| **RPC + Cache**     | ~500ms (cached) / ~5000ms (miss) | 2 req/s    | ⚠️ Limitata   |
| **GraphQL Indexer** | ~50ms                            | 20 req/s   | ✅ Lineare    |
| **Indexer + Redis** | ~10ms                            | 100 req/s  | ✅ Eccellente |

---

## 💡 Raccomandazioni Finali

### Per MVP/Hackathon (Adesso)

✅ **Implementa Soluzione Ibrida**

- Costo zero
- 2 giorni di sviluppo
- Sufficiente per 500 box

### Per Public Launch (Entro 3 mesi)

🔍 **Verifica IOTA Hosted Indexer**

- Se disponibile → deploy in 1 settimana
- Se no → prepara self-hosted

### Per Scale (Entro 6-12 mesi)

🚀 **Deploy Self-Hosted Indexer**

- Railway.app per semplicità
- PostgreSQL + Hasura
- Budget €30-50/mese

### Criteri Decisione

```
if (active_boxes < 300 && query_time < 2s) {
  → Usa soluzione ibrida (cache)
}
else if (active_boxes < 1000 && iota_has_hosted_indexer) {
  → Usa IOTA hosted indexer
}
else {
  → Deploy self-hosted indexer
}
```

---

## 📚 Risorse Utili

### Documentazione IOTA

- [IOTA GraphQL Documentation](https://docs.iota.org/developer/graphql)
- [Move Events & Indexing](https://docs.iota.org/developer/move/events)
- [IOTA SDK Reference](https://docs.iota.org/developer/references/iota-sdk)

### Tools & Libraries

| Tool              | Scopo                 | Link                          |
| ----------------- | --------------------- | ----------------------------- |
| **Hasura**        | GraphQL Engine        | https://hasura.io             |
| **Apollo Client** | Frontend GraphQL      | https://www.apollographql.com |
| **React Query**   | Data fetching/caching | https://tanstack.com/query    |
| **Railway**       | Easy PaaS deployment  | https://railway.app           |

### Esempi Codice

Repository con esempi di indexer per blockchain Move:

- [Sui Indexer Examples](https://github.com/MystenLabs/sui/tree/main/crates/sui-indexer)
- [Aptos Indexer Setup](https://github.com/aptos-labs/aptos-indexer-processors)

---

## 📝 Prossimi Passi

1. ✅ **Validare necessità** - Monitorare query latency in produzione
2. ✅ **Implementare cache** - Quick win per MVP
3. 🔄 **Ricerca IOTA Indexer** - Verificare disponibilità su mainnet
4. 🔄 **Prototipo self-hosted** - Test su Railway con dataset mock
5. ⏳ **Decision point** - Scegliere architettura definitiva post-hackathon

---

_Documento preparato: 8 Febbraio 2026_  
_Status: PROPOSTA - Richiede decisione stakeholder_
