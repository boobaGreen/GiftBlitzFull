#!/bin/bash

# Configuration
IOTA_BIN="./iota-service/iota"
CONTRACTS_DIR="./contracts"
FRONTEND_CONFIG="./fe/src/data/contracts.json"

echo "🌍 Starting Deployment to IOTA TESTNET..."

# 1. Publish the package
# We use --gas-budget 1000000000 (1.0 IOTA) which is standard for Testnet faucet coins
PUBLISH_RES=$($IOTA_BIN client publish --gas-budget 1000000000 --json $CONTRACTS_DIR 2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    echo "$PUBLISH_RES"
    exit 1
fi

# 2. Extract Package ID
PACKAGE_ID=$(echo "$PUBLISH_RES" | grep -oP '(?<="packageId": ")[^"]+' | head -n 1)

if [ -z "$PACKAGE_ID" ]; then
    echo "❌ Failed to extract PACKAGE_ID. Check deployment output."
    exit 1
fi

echo "✅ Package Deployed: $PACKAGE_ID"

# 3. Extract AdminCap ID (owned object)
ADMIN_CAP_ID=$(echo "$PUBLISH_RES" | grep -oP '"objectType": "[^"]*::giftblitz::AdminCap"[^}]*"objectId": "[^"]+' | grep -oP '(?<="objectId": ")[^"]+' | head -n 1)

if [ -z "$ADMIN_CAP_ID" ]; then
    echo "⚠️ Could not extract AdminCap ID automatically."
    echo "   Run: ./iota-service/iota client objects --json | grep -B 5 '::giftblitz::AdminCap'"
else
    echo "✅ Admin Cap: $ADMIN_CAP_ID"
fi

# 4. Extract Treasury ID (shared object)
TREASURY_ID=$(echo "$PUBLISH_RES" | grep -oP '"objectType": "[^"]*::giftblitz::Treasury"[^}]*"objectId": "[^"]+' | grep -oP '(?<="objectId": ")[^"]+' | head -n 1)

if [ -z "$TREASURY_ID" ]; then
    echo "⚠️ Could not extract Treasury ID automatically."
    echo "   Treasury is a SHARED object. Find it manually:"
    echo "   1. Get deploy tx digest from above"
    echo "   2. Run: ./iota-service/iota client tx-block <DIGEST> --json | grep -A 5 'Treasury'"
else
    echo "✅ Treasury ID: $TREASURY_ID"
fi

# 5. Update contracts.json
cat <<EOF > $FRONTEND_CONFIG
{
  "NETWORK": "testnet",
  "PACKAGE_ID": "$PACKAGE_ID",
  "ADMIN_CAP_ID": "$ADMIN_CAP_ID",
  "TREASURY_ID": "$TREASURY_ID"
}
EOF

echo ""
echo "✨ Frontend configuration updated in $FRONTEND_CONFIG"
echo ""
echo "📋 VERIFY THESE VALUES BEFORE TESTING:"
cat $FRONTEND_CONFIG
echo ""
echo "🔍 If Treasury ID is wrong, find the correct one with:"
echo "   ./iota-service/iota client tx-block <DEPLOY_TX_DIGEST> --json | grep -A 5 'Treasury'"
echo ""
echo "🚀 Deployment Complete!"
echo "View on Explorer: https://explorer.rebased.iota.org/object/$PACKAGE_ID?network=testnet"
