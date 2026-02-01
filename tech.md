Thought for 1s

Tooling Move vs EVM
Equivalenze
EVM IOTA Move
Solidity Move (linguaggio)
Foundry / Hardhat IOTA CLI (tutto-in-uno)
npm/yarn Move.toml (gestione dipendenze)
Remix Nessun equivalente web
Ethers.js @iota/iota-sdk
Cosa Installerai

1. IOTA CLI (obbligatorio)
   Fa tutto: build, test, publish, interazione con chain
   Download: https://github.com/iotaledger/iota/releases
   È un singolo binario, niente da configurare
2. Rust (opzionale, ma consigliato)
   Move compiler usa Rust sotto il cofano
   Alcune estensioni IDE lo richiedono
   rustup per installare
3. VS Code Extensions

- Move Analyzer (syntax highlighting + errori)
- IOTA Move (specifico per IOTA)

4. Frontend (per dopo)

- Node.js 22+
- pnpm o npm
- @iota/iota-sdk (connessione a chain)
- @iota/wallet-standard (connessione wallet)
  Workflow Completo
  bash

# 1. Installa IOTA CLI (download binario)

# 2. Crea progetto Move

iota move new giftblitz

# 3. Scrivi codice in sources/\*.move

# 4. Build

iota move build

# 5. Test

iota move test

# 6. Publish su testnet

iota client publish --gas-budget 100000000
Riepilogo Installazioni
Tool Scopo Obbligatorio
IOTA CLI Build, test, deploy ✅ Sì
Rust Compilazione ⚠️ Consigliato
VS Code + Move ext Editor ⚠️ Consigliato
Node.js Frontend Per dopo
