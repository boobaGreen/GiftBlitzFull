#!/bin/bash

# Configuration
IOTA_BIN="./iota-service/iota"
CONTRACTS_DIR="./contracts"
FRONTEND_CONFIG="./fe/src/data/contracts.json"

echo "🌍 Starting Deployment to IOTA TESTNET..."

# 1. Publish the package
# We use --gas-budget 1000000000 (1.0 IOTA) which is standard for Testnet faucet coins
PUBLISH_RES=$($IOTA_BIN client publish --gas-budget 1000000000 --json $CONTRACTS_DIR)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    echo "$PUBLISH_RES"
    exit 1
fi

# 2. Extract IDs using grep/sed
PACKAGE_ID=$(echo "$PUBLISH_RES" | grep -oP '(?<="packageId": ")[^"]+' | head -n 1)
REGISTRY_ID=$(echo "$PUBLISH_RES" | grep -B 15 '::registry::Registry' | grep -oP '(?<="objectId": ")[^"]+' | tail -n 1)
ADMIN_CAP_ID=$(echo "$PUBLISH_RES" | grep -B 15 '::giftblitz::AdminCap' | grep -oP '(?<="objectId": ")[^"]+' | tail -n 1)
TREASURY_ID=$(echo "$PUBLISH_RES" | grep -B 15 '::giftblitz::Treasury' | grep -oP '(?<="objectId": ")[^"]+' | tail -n 1)

if [ -z "$PACKAGE_ID" ]; then
    echo "❌ Failed to extract PACKAGE_ID. Check deployment output."
    exit 1
fi

echo "✅ Package Deployed: $PACKAGE_ID"
echo "✅ Registry ID: $REGISTRY_ID"
echo "✅ Admin Cap: $ADMIN_CAP_ID"
echo "✅ Treasury ID: $TREASURY_ID"

# 3. Update contracts.json
cat <<EOF > $FRONTEND_CONFIG
{
  "NETWORK": "testnet",
  "PACKAGE_ID": "$PACKAGE_ID",
  "REGISTRY_ID": "$REGISTRY_ID",
  "ADMIN_CAP_ID": "$ADMIN_CAP_ID",
  "TREASURY_ID": "$TREASURY_ID"
}
EOF

echo "✨ Frontend configuration updated to TESTNET in $FRONTEND_CONFIG"
echo "🚀 Deployment Complete!"
echo "View on Explorer: https://explorer.rebased.iota.org/object/$PACKAGE_ID?network=testnet"
