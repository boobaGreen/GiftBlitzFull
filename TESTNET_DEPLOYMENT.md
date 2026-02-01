# IOTA Testnet Deployment Guide

Follow these steps to deploy the GiftBlitz contracts to the IOTA Testnet.

## 1. Configure IOTA Wallet (Browser Extension)

1. Open your IOTA Wallet extension.
2. Go to **Settings** (⚙️) -> **Network**.
3. Select **Testnet**.
4. Click on **Faucet** (usually "Request Testnet IOTA tokens") to get 1.0 IOTA for testing.

## 2. Configure CLI (Terminal)

Before running the deployment script, we need to point your CLI to the Testnet.

### A. Environment Setup

Run these commands in your terminal (make sure you are in the project root):

```bash
# Add Testnet environment (if not already present)
./iota-service/iota client new-env --alias testnet --rpc https://fullnode.testnet.iota.cafe:443

# Switch to Testnet
./iota-service/iota client switch-env testnet
```

### B. Import your Wallet Address (Optional but Recommended)

If you want to use the same address you have in the browser:

1. In IOTA Wallet: **Settings** -> **Accounts** -> **Select Account** -> **Export Private Key**.
2. In Terminal:

```bash
# Import the key (Replace <YOUR_PRIVATE_KEY> with the one from the wallet)
./iota-service/iota keytool import <YOUR_PRIVATE_KEY> ed25519

# Switch to that address
./iota-service/iota client switch --address <YOUR_ADDRESS>
```

### C. Get Tokens

```bash
# Get test tokens for your active CLI address
./iota-service/iota client faucet
```

Check your CLI balance:

```bash
./iota-service/iota client gas
```

## 3. Run Deployment Script

Once you have gas in your CLI address, run:

```bash
chmod +x publish_testnet.sh
./publish_testnet.sh
```

This script will:

1. Publish the Move package to Testnet.
2. Extract the new `PACKAGE_ID`, `REGISTRY_ID`, and `ADMIN_CAP_ID`.
3. Update `fe/src/data/contracts.json` automatically.

## 4. Launch Frontend

```bash
cd fe
npm run dev
```

The frontend will now use the Testnet IDs. Ensure your browser wallet is also on Testnet!
