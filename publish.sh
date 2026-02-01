#!/bin/bash

# Configuration
IOTA_BIN="./iota-service/iota"
CONTRACTS_DIR="./contracts"
FRONTEND_CONFIG="./fe/src/data/contracts.json"

echo "🚀 Starting Deployment to Localnet..."

# 1. Publish the package
# We use --json to parse IDs reliably
PUBLISH_RES=$($IOTA_BIN client publish --gas-budget 200000000 --json $CONTRACTS_DIR)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    echo "$PUBLISH_RES"
    exit 1
fi

# 2. Extract IDs using grep/sed (to avoid requiring jq)
# Use a more flexible pattern to find objectId for specific types
PACKAGE_ID=$(echo "$PUBLISH_RES" | grep -oP '(?<="packageId": ")[^"]+' | head -n 1)

# Extract Registry ID: find line with Registry, then find the objectId in the same block
REGISTRY_ID=$(echo "$PUBLISH_RES" | grep -B 15 '::registry::Registry' | grep -oP '(?<="objectId": ")[^"]+' | tail -n 1)

# Extract Admin Cap: find line with AdminCap, then find the objectId in the same block
ADMIN_CAP_ID=$(echo "$PUBLISH_RES" | grep -B 15 '::giftblitz::AdminCap' | grep -oP '(?<="objectId": ")[^"]+' | tail -n 1)

echo "✅ Package Deployed: $PACKAGE_ID"
echo "✅ Registry ID: $REGISTRY_ID"
echo "✅ Admin Cap: $ADMIN_CAP_ID"

# 3. Update contracts.json
# Using a temporary file to be safe
cat <<EOF > $FRONTEND_CONFIG
{
  "NETWORK": "local",
  "PACKAGE_ID": "$PACKAGE_ID",
  "REGISTRY_ID": "$REGISTRY_ID",
  "ADMIN_CAP_ID": "$ADMIN_CAP_ID"
}
EOF

echo "✨ Frontend configuration updated in $FRONTEND_CONFIG"
echo "Done!"
