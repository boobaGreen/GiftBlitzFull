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
