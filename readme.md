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

Example output:
```text
🌍 Starting Deployment to IOTA TESTNET...
✅ Package Deployed: 0x9917848e00d8f156fec6648c15c04bbdc2221afc46a9d48a852116802b7f723a
📝 Transaction Digest: 7jCxbJhyGcnALjNzSHD8Xt7hEV1MAZN4NejeqUtbGRP4
🔍 Searching for AdminCap...
⚠️ Could not find AdminCap automatically (method 1).
   Trying alternative extraction from publish output...
✅ Admin Cap: 0x0639dbf689a16e4072a1f51be4cf142ce7599cfa35d90aab8d5830484da8fd84
🔍 Searching for Treasury...
✅ Treasury ID: 0x8a0f98e616cab94727a751207b060d38ed3a5a9dd2faf35f152f0f46d74f263d

✨ Frontend configuration updated in ./fe/src/data/contracts.json
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

### Single Address Funding

Fund a single address for testing:

```bash
./iota-service/iota client faucet --address <ADDRESS>
```

### Batch Faucet Script (Multiple Wallets)

To fund multiple test wallets at once (useful for multi-user testing):

1. Create a file `faucet.sh`:

```bash
#!/bin/bash

addresses=(
  "0xda57b34c5096100275a0dce38a7fd850ff918dfdcaac7e6f744565e6de00275e"
  "0x80bc535653e5a8843ac5eabac52eea0043e749573c058bbbfa09b84ef41ef107"
  "0x724d1c6cbba57d4b5b68a60ce5bef7f660a7d28f5c68ab096991bbe904a49afa"
  "0xfcefcc4f5f7978c86ec8e7fe8201fd1deffa4b09178b52a53ae6b11c4eeb2081"
  "0x1e8a2b71e8fa26c50bfee88efe5f05482991f2b6b5e3e8bb8ae833df36d50d7a"
  "0x0a75fa19f45aeddd522b87a836a329b7c8810dd2c7830aa767b815722f6657f0"
  "0x605c7a0239142ba6f6ed01dbc1e87985fbe4c05dfdb584e35bcd419fc914b42a"
)

for addr in "${addresses[@]}"; do
  echo "🚰 Requesting faucet for $addr..."
  ./iota-service/iota client faucet --address "$addr"
  sleep 2  # Rate limiting: wait 2s between requests
done

echo "✅ All wallets funded!"
```

2. Make it executable and run:

```bash
chmod +x faucet.sh
./faucet.sh
```

**Usage:** Great for testing multi-user scenarios (marketplace, disputes, concurrent trades, etc.)

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

Buyer is trying to purchase beyond their limit. With **1-2 trades** (Newcomer) the limit is 30 IOTA.

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
