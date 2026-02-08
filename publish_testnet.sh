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

# Save full output to temporary file for easier debugging
echo "$PUBLISH_RES" > /tmp/iota_deploy_output.json

# 2. Extract Package ID
PACKAGE_ID=$(echo "$PUBLISH_RES" | grep -o '"packageId": *"[^"]*"' | head -n 1 | sed 's/.*"packageId": *"\([^"]*\)".*/\1/')

if [ -z "$PACKAGE_ID" ]; then
    echo "❌ Failed to extract PACKAGE_ID. Check deployment output."
    echo "Full output saved to /tmp/iota_deploy_output.json"
    exit 1
fi

echo "✅ Package Deployed: $PACKAGE_ID"

# 3. Extract Transaction Digest
TX_DIGEST=$(echo "$PUBLISH_RES" | grep -o '"digest": *"[^"]*"' | head -n 1 | sed 's/.*"digest": *"\([^"]*\)".*/\1/')

if [ -z "$TX_DIGEST" ]; then
    echo "⚠️ Could not extract TX digest. Will try alternative method for IDs..."
fi

echo "📝 Transaction Digest: $TX_DIGEST"

# 4. Extract AdminCap ID from owned objects (most reliable method)
echo "🔍 Searching for AdminCap..."
ADMIN_CAP_ID=$($IOTA_BIN client objects --json 2>/dev/null | grep -B 5 "::giftblitz::AdminCap" | grep "objectId" | grep "$PACKAGE_ID" -A 5 | head -n 1 | sed 's/.*"objectId": *"\([^"]*\)".*/\1/')

if [ -z "$ADMIN_CAP_ID" ]; then
    echo "⚠️ Could not find AdminCap automatically (method 1)."
    echo "   Trying alternative extraction from publish output..."
    ADMIN_CAP_ID=$(echo "$PUBLISH_RES" | grep -o "\"objectId\": *\"0x[a-f0-9]*\"" | sed 's/.*"\(0x[a-f0-9]*\)".*/\1/' | head -n 2 | tail -n 1)
fi

if [ -z "$ADMIN_CAP_ID" ]; then
    echo "⚠️ Could not extract AdminCap ID automatically."
    echo "   Manual command: ./iota-service/iota client objects --json | grep -B 5 '::giftblitz::AdminCap'"
else
    echo "✅ Admin Cap: $ADMIN_CAP_ID"
fi

# 5. Extract Treasury ID from transaction (shared object)
echo "🔍 Searching for Treasury..."

if [ -n "$TX_DIGEST" ]; then
    TREASURY_ID=$($IOTA_BIN client tx-block "$TX_DIGEST" --json 2>/dev/null | grep -A 3 "::giftblitz::Treasury" | grep "objectId" | head -n 1 | sed 's/.*"objectId": *"\([^"]*\)".*/\1/')
fi

if [ -z "$TREASURY_ID" ]; then
    echo "⚠️ Could not extract Treasury ID from transaction."
    echo "   Treasury is a SHARED object. Find it manually:"
    echo "   ./iota-service/iota client tx-block $TX_DIGEST --json | grep -A 5 'Treasury'"
else
    echo "✅ Treasury ID: $TREASURY_ID"
fi

# 6. Update contracts.json
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

if [ -z "$ADMIN_CAP_ID" ] || [ -z "$TREASURY_ID" ]; then
    echo "⚠️  MANUAL ACTION REQUIRED:"
    if [ -z "$ADMIN_CAP_ID" ]; then
        echo "   Find AdminCap: ./iota-service/iota client objects --json | grep -B 5 '$PACKAGE_ID::giftblitz::AdminCap'"
    fi
    if [ -z "$TREASURY_ID" ]; then
        echo "   Find Treasury: ./iota-service/iota client tx-block $TX_DIGEST --json | grep -A 5 'Treasury'"
    fi
    echo ""
fi

echo "🚀 Deployment Complete!"
echo "📊 View on Explorer: https://explorer.rebased.iota.org/object/$PACKAGE_ID?network=testnet"
echo "📝 Transaction: https://explorer.rebased.iota.org/txblock/$TX_DIGEST?network=testnet"
echo ""
echo "💡 Full deployment output saved to: /tmp/iota_deploy_output.json"
