1. Avvia la Rete (con Regenesis)
   Esegui dalla root del progetto:

bash
./iota start --with-faucet --force-regenesis
(Lascia aperto)

2. Finanzia gli Indirizzi
   In un secondo terminale (dalla root):
   0x7e26302e820d7847fc67d28c24e513565c7b6498988ead377b9a4903115d7010

a) Deployer (Indirizzo Attivo)

bash

# Ottieni l'indirizzo attivo

# Sostituisci <DEPLOYER_ADDR> nel comando sotto:

./iota-service/iota client faucet --address <DEPLOYER_ADDR>
(Se il faucet via CLI fallisce, usa il comando curl ma se ieri funzionava faucet, usa quello).

./iota-service/iota client faucet --address 0x7e26302e820d7847fc67d28c24e513565c7b6498988ead377b9a4903115d7010

b) Seller

bash
./iota-service/iota client faucet --address 0x80bc535653e5a8843ac5eabac52eea0043e749573c058bbbfa09b84ef41ef107
c) Buyer

bash
./iota-service/iota client faucet --address 0xda57b34c5096100275a0dce38a7fd850ff918dfdcaac7e6f744565e6de00275e 3. Deploy su Chain
bash
cd contracts
../iota-service/iota client publish --gas-budget 1000000000

./publish.sh
