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

### Missing AdminCap or Treasury ID after deployment

If `publish_testnet.sh` couldn't extract IDs automatically, use these commands:

**Find AdminCap ID:**

```bash
./iota-service/iota client objects --json | grep -B 5 '::giftblitz::AdminCap' | grep "objectId"
```

Look for the AdminCap with the correct `PACKAGE_ID` in the type field.

**Find Treasury ID:**

```bash
# First, get the transaction digest from deployment output
# Then run:
./iota-service/iota client tx-block <TX_DIGEST> --json | grep -A 5 'Treasury'
```

The Treasury ID is in the `objectId` field of the Treasury object.

**Check deployment output:**

```bash
cat /tmp/iota_deploy_output.json | jq '.'
```

### Error: Treasury owned by wrong address

Treasury ID in `contracts.json` is wrong. Use the Treasury command above to find the correct one.

### Error: EBuyerCapExceeded (code 5)

Buyer is trying to purchase beyond their limit. With 0-2 trades the limit is 30 IOTA.

### Error: Client/Server version mismatch

Normal warning, can be ignored in most cases.

### Full Manual Deployment

If `publish_testnet.sh` fails completely:

```bash
# 1. Build contracts
cd contracts
../iota-service/iota move build

# 2. Publish (save output!)
../iota-service/iota client publish --gas-budget 1000000000 --json .

# 3. Extract IDs from output
# PACKAGE_ID: Look for "packageId" field
# TX_DIGEST: Look for "digest" field in transaction

# 4. Find AdminCap
../iota-service/iota client objects --json | grep -B 5 '<PACKAGE_ID>::giftblitz::AdminCap'

# 5. Find Treasury
../iota-service/iota client tx-block <TX_DIGEST> --json | grep -A 5 'Treasury'

# 6. Update fe/src/data/contracts.json manually
```
