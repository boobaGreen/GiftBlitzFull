# 🛠️ GiftBlitz Local Development Guide (WSL)

Since the local network reset clears all on-chain state, follow these steps to resume development.

## 📂 Root Directory

All commands should be launched from the project root in WSL:
`/mnt/c/Users/ClaudioDall'Ara/OneDrive - Agile Lab/Desktop/GiftBlitz`

---

## 1. Network & Faucet (One-time after reset)

### Start Network (if not running)

```bash
cd iota-service
./iota-tool start
```

### Fund Wallets

Launch these from the **project root**:

```bash
# Account 1 (Seller)
./iota-service/iota client faucet --address 0xda57b34c5096100275a0dce38a7fd850ff918dfdcaac7e6f744565e6de00275e

# Account 2 (Buyer)
./iota-service/iota client faucet --address 0x80bc535653e5a8843ac5eabac52eea0043e749573c058bbbfa09b84ef41ef107

# Browser Wallet (copy your address from the extension)
./iota-service/iota client faucet --address [YOUR_WALLET_ADDRESS]
```

---

## 2. Deploy Smart Contracts

The `publish.sh` script automates the deployment and updates the frontend config `fe/src/data/contracts.json`.

Run from the **project root**:

```bash
# Set permissions (only the first time)
chmod +x publish.sh

# Deploy & Update Frontend
./publish.sh
```

---

## 3. Frontend Development

Run from `fe` directory:

```bash
cd fe
npm run dev
```

---

## 💡 Troubleshooting

- **Sequence Error**: If the wallet gives "Object version mismatch" or similar errors after a network reset, go to Wallet Settings > Advanced > **Reset Wallet Data**.
- **Package ID**: If the frontend doesn't see your boxes, verify that `fe/src/data/contracts.json` has been updated by `./publish.sh`.
