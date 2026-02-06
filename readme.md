# 🚀 GiftBlitz - Setup & Deploy Guide

## 📋 Prerequisites

- **WSL** with Ubuntu installed
- **Node.js 18+** and npm
- **Wallet** with IOTA testnet funds

---

## 🔧 IOTA CLI Installation

The `iota-service/` folder is in `.gitignore` because it contains large binaries.

### 1. Download IOTA CLI

Go to: https://docs.iota.org/developer/references/cli

Or from WSL:

```bash
curl -fsSL https://github.com/iotaledger/iota/releases/latest/download/iota-cli-linux-amd64 -o iota
chmod +x iota
```

### 2. Create folder and move binary

```bash
mkdir -p iota-service
mv iota iota-service/iota
```

### 3. Verify installation

```bash
./iota-service/iota --version
```

### 4. Configure Testnet

```bash
./iota-service/iota client envs
./iota-service/iota client switch --env testnet
```

---

## 🌐 Deploy to TESTNET

### 1. Open WSL and navigate to project folder

```bash
cd /mnt/c/path/to/GigtBlitzFull
```

### 2. Deploy the contract

```bash
bash publish_testnet.sh
```

The script:

- ✅ Automatically builds the contract
- ✅ Publishes to testnet
- ✅ Extracts PACKAGE_ID, ADMIN_CAP_ID, TREASURY_ID
- ✅ Updates `fe/src/data/contracts.json`

### 3. ⚠️ VERIFY TREASURY ID (IMPORTANT!)

Treasury is a **shared object** and may not be extracted correctly.

**Find the deploy transaction digest** (shown in deploy output) then:

```bash
./iota-service/iota client tx-block <DEPLOY_TX_DIGEST> --json | grep -A 5 'Treasury'
```

Example output:

```json
"objectType": "0x...::giftblitz::Treasury",
"objectId": "0x25c8234e93300831fdd9ef47c3a2c1322fd032d97f1ae9e341b435d326c35014",
```

**If the ID is different**, manually update `fe/src/data/contracts.json`:

```json
{
  "NETWORK": "testnet",
  "PACKAGE_ID": "...",
  "ADMIN_CAP_ID": "...",
  "TREASURY_ID": "<CORRECT_TREASURY_ID>"
}
```

### 4. Find AdminCap ID (if needed)

```bash
./iota-service/iota client objects --json | grep -B 5 "::giftblitz::AdminCap"
```

---

## 🖥️ Build Frontend

```bash
cd fe
npm run build
```

---

## 📤 Git Push

```bash
git add .
git commit -m "deploy update"
git push
```

---

## 🧪 Test Faucet (Testnet)

Fund addresses for testing:

```bash
./iota-service/iota client faucet --address <ADDRESS>
```

---

## 🏃 Local Dev Server

```bash
cd fe
npm run dev
```

Open: http://localhost:5173

---

## 📁 Important Files

| File                                | Description           |
| ----------------------------------- | --------------------- |
| `fe/src/data/contracts.json`        | Deployed contract IDs |
| `contracts/sources/giftblitz.move`  | Main contract         |
| `contracts/sources/reputation.move` | Reputation system     |
| `publish_testnet.sh`                | Testnet deploy script |

---

## ❓ Troubleshooting

### Error: Treasury owned by wrong address

Treasury ID in `contracts.json` is wrong. Use the command above to find the correct one.

### Error: EBuyerCapExceeded (code 5)

Buyer is trying to purchase beyond their limit. With 0-2 trades the limit is 30 IOTA.

### Error: Client/Server version mismatch

Normal warning, can be ignored in most cases.
