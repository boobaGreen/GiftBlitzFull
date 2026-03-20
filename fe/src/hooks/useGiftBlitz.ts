import { useCallback } from 'react';
import { Transaction } from '@iota/iota-sdk/transactions';
import { useIotaClient, useSignAndExecuteTransaction, useCurrentAccount, useSignPersonalMessage } from '@iota/dapp-kit';
import contracts from '../data/contracts.json';
import type { Box, BoxType, BoxStatus } from '../types';
import { 
    getEncryptionKeyPair, 
    encryptCodeWithKey,
    deriveKeyFromSignature,
    packCiphertextWithSalt,
    unpackCiphertextWithSalt,
    encryptKeyForBuyer,
    encryptVault,
    decryptVault
} from '../utils/security';

export const useGiftBlitz = () => {
    const iotaClient = useIotaClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

    const PACKAGE_ID = contracts.PACKAGE_ID;
    const TREASURY_ID = (contracts as { TREASURY_ID?: string }).TREASURY_ID;
    const MODULE = "giftblitz";

    /**
     * Helper to fetch Reputation NFT
     */
    const getReputationNFT = useCallback(async (ownerAddress: string) => {
        const objects = await iotaClient.getOwnedObjects({
            owner: ownerAddress,
            filter: { StructType: `${PACKAGE_ID}::reputation::ReputationNFT` },
            options: { showContent: true }
        });

        if (objects.data.length > 0) {
            const data = objects.data[0].data;
            if (data && data.objectId) {
                const content = data.content;
                if (content && 'fields' in content) {
                    const fields = content.fields as Record<string, unknown>;
                    return {
                        id: data.objectId,
                        tradeCount: Number(fields.total_trades),
                        volume: Number(fields.total_volume),
                        disputes: Number(fields.disputes),
                        memberEpoch: Number(fields.first_trade_time),
                        publicKey: fields.public_key ? JSON.stringify(fields.public_key) : null,
                        vault: fields.vault ? (fields.vault as number[]) : null
                    };
                }
            }
        }
        return null;
    }, [iotaClient, PACKAGE_ID]);


    /**
     * Create a new GiftBox
     * SALT + SIGNATURE STRATEGY (Stateless)
     */
    const createBox = useCallback(async (
        cardBrand: string, 
        faceValue: number, 
        price: number, 
        clearCode: string
    ) => {
        if (!account) return;

        try {
            // 1. REQUIRE existing profile for seller caps check (Mirror Protocol)
            const myNft = await getReputationNFT(account.address);
            if (!myNft) {
                throw new Error("You must initialize your Citizen Passport first before listing a gift card. Please complete the Identity Setup on this page.");
            }

            // 2. Generate Salt (32 bytes)
            const salt = crypto.getRandomValues(new Uint8Array(32));
            const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
            
            // 3. Sign Salt with Wallet to derive Deterministic Key
            const message = `GiftBlitz Key Generation\nSalt: ${saltHex}`;
            console.log("Requesting signature for key derivation...");
            
            const { signature } = await signPersonalMessage({
                 message: new TextEncoder().encode(message) 
            });

            // 4. Derive Stateless Key from Signature
            const symKey = await deriveKeyFromSignature(signature);

            // 5. Encrypt Code
            const ciphertextOnly = await encryptCodeWithKey(clearCode, symKey);
            
            // 6. Pack Salt + Ciphertext for the blockchain
            const fullEncryptedPaylod = packCiphertextWithSalt(ciphertextOnly, salt);

            // 7. Calculate Hash for on-chain integrity verification
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const encryptedCodeHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', fullEncryptedPaylod as any)));

            const tx = new Transaction();

            const [stakeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(faceValue)]);

            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE}::create_box`,
                arguments: [
                    tx.object(myNft.id), // 1. Pass ReputationNFT for reciprocal enforcement (Mirror logic)
                    tx.pure.string(cardBrand),
                    tx.pure.u64(faceValue),
                    tx.pure.u64(price),
                    tx.pure.vector('u8', encryptedCodeHash),
                    tx.pure.vector('u8', Array.from(fullEncryptedPaylod)), // 6. Contains Salt!
                    stakeCoin,
                    tx.object('0x6'), // 8. Clock
                ],
            });

            const result = await signAndExecute({ transaction: tx as any });
            
            console.log("Box created successfully with Mirror Reputation check.");

            return { result, symKey };
        } catch (err) {
            console.error("Failed to create box:", err);
            throw err;
        }
    }, [account, signPersonalMessage, signAndExecute, PACKAGE_ID, MODULE, getReputationNFT]);

    /**
     * Join/Purchase an existing GiftBox
     * REQUIRES existing ReputationNFT for buyer caps enforcement
     */
    const joinBox = useCallback(async (boxId: string, totalRequired: number) => {
        if (!account) return;

        // REQUIRE existing profile for buyer caps check
        const myNft = await getReputationNFT(account.address);
        if (!myNft) {
            throw new Error("You must create a profile first before joining a box. Go to Profile page and click 'Create Profile'.");
        }

        const tx = new Transaction();
        
        const [paymentAndStakeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalRequired)]);

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::join_box`,
            arguments: [
                tx.object(boxId),
                paymentAndStakeCoin,
                tx.object(myNft.id),  // Pass buyer's ReputationNFT for caps check
                tx.object('0x6'),
            ],
        });

        console.log(`Joining box ${boxId} with total payment ${totalRequired}...`);
        try {
            const result = await signAndExecute({ transaction: tx as any });
            console.log("Join transaction submitted:", result.digest);
            if (result.digest) {
                console.log(`Explorer link: https://explorer.rebased.iota.org/txblock/${result.digest}?network=testnet`);
                
                // Wait for effects to verify on-chain success
                const txData = await iotaClient.waitForTransaction({
                    digest: result.digest,
                    options: { showEffects: true }
                });

                if (txData.effects?.status.status !== 'success') {
                    const errorMsg = txData.effects?.status.error || "Execution failed";
                    console.error("On-chain execution failed:", errorMsg);
                    throw new Error(`Transaction failed: ${errorMsg}`);
                }
                console.log("On-chain execution SUCCESS.");
            }
            return result;
        } catch (err) {
            console.error("Join transaction failed:", err);
            throw err;
        }
    }, [account, signAndExecute, iotaClient, PACKAGE_ID, MODULE, getReputationNFT]);

    /**
     * Reveal Key (Seller)
     * SALT + SIGNATURE STRATEGY (Stateless)
     */
    const revealKey = useCallback(async (boxId: string, buyerAddress: string) => {
        if (!account) return;

        // 1. Get Salt from on-chain box
        const boxResult = await iotaClient.getObject({
            id: boxId,
            options: { showContent: true }
        });
        
        let salt: Uint8Array | null = null;
        if (boxResult.data?.content && 'fields' in boxResult.data.content) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fields = (boxResult.data.content.fields as any);
            const encCodeBytes = fields.encrypted_code?.fields?.contents || fields.encrypted_code; 
            if (encCodeBytes) {
                // Determine if it's array or object-wrapped array (Move craziness)
                const bytes = Array.isArray(encCodeBytes) ? encCodeBytes : (encCodeBytes.fields?.contents ?? []);
                const packed = new Uint8Array(bytes);
                // Unpack to get Salt
                if (packed.length >= 32) {
                     const unpacked = unpackCiphertextWithSalt(packed);
                     salt = unpacked.salt;
                }
            }
        }

        if (!salt) {
             throw new Error("Could not retrieve Salt from on-chain box. Is the box data correct?");
        }

        // 2. Fetch Buyer's Public Key
        const buyerNft = await getReputationNFT(buyerAddress);
        if (!buyerNft || !buyerNft.publicKey) {
            throw new Error("Buyer profile or encryption public key not found. Buyer must initialize profile.");
        }

        // 3. Derive Symmetric Key from Salt + Signature (Stateless)
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        const message = `GiftBlitz Key Generation\nSalt: ${saltHex}`;
        
        console.log("Requesting signature for Key Recovery...");
        const { signature } = await signPersonalMessage({
             message: new TextEncoder().encode(message) 
        });

        const symKey = await deriveKeyFromSignature(signature);
        console.log("Symmetric Key recovered from signature in revealKey.");

        // 4. Encrypt symmetric key specifically for buyer
        const myKeys = await getEncryptionKeyPair(account.address);
        console.log("Seller public key from local storage:", Array.from(myKeys.publicKey).slice(0, 8), "...");
        
        const buyerPubKeyBytes = new Uint8Array(JSON.parse(buyerNft.publicKey));
        console.log("Buyer public key from on-chain NFT:", Array.from(buyerPubKeyBytes).slice(0, 8), "...");
        
        const encryptedKeyForBuyer = await encryptKeyForBuyer(symKey, myKeys.privateKey, buyerPubKeyBytes);
        console.log("Symmetric key encrypted for buyer successfully.");

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::reveal_key`,
            arguments: [
                tx.object(boxId),
                tx.pure.vector('u8', Array.from(encryptedKeyForBuyer)),
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, getReputationNFT, iotaClient, signPersonalMessage]);

    /**
     * Finalize (Buyer) - Requires ReputationNFT
     */
    const finalizeBox = useCallback(async (boxId: string, repNftId: string) => {
        if (!account || !TREASURY_ID) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::finalize`,
            arguments: [
                tx.object(boxId),
                tx.object(repNftId),
                tx.object(TREASURY_ID)
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, TREASURY_ID]);

    /**
     * Dispute (Buyer) - Requires both Buyer and Seller ReputationNFTs
     */
    const disputeBox = useCallback(async (boxId: string, buyerRepNftId: string, sellerAddress: string) => {
        if (!account || !TREASURY_ID) return;

        // Fetch seller's ReputationNFT
        const sellerNft = await getReputationNFT(sellerAddress);
        if (!sellerNft) {
            throw new Error("Seller profile not found. Cannot update seller dispute stats.");
        }

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::dispute`,
            arguments: [
                tx.object(boxId),
                tx.object(buyerRepNftId),
                tx.object(sellerNft.id),
                tx.object(TREASURY_ID)
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, TREASURY_ID, getReputationNFT]);


    /**
     * Mint Reputation NFT for new users
     */
    const mintProfile = useCallback(async () => {
        if (!account) return;

        // 1. Generate/Retrieve Encryption Hub Keys
        const myKeys = await getEncryptionKeyPair(account.address);
        
        // 2. Encrypt Hub Private Key into a Vault using a Signature
        const message = "Authorize Identity Vault Creation\nThis allows you to recover your encrypted trades on any device/domain.";
        const { signature } = await signPersonalMessage({
             message: new TextEncoder().encode(message) 
        });

        const vaultBytes = await encryptVault(myKeys.privateKey, signature);
        const pubKeyArray = Array.from(myKeys.publicKey);
        const vaultArray = Array.from(vaultBytes);

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::reputation::mint_profile`,
            arguments: [
                tx.pure.vector('u8', pubKeyArray),
                tx.pure.vector('u8', vaultArray)
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, signPersonalMessage]);

    /**
     * Recovery Flow: Re-links the local browser to the on-chain vault
     */
    const syncIdentity = useCallback(async (vault: number[]) => {
        if (!account) return;
        
        let privateKey: CryptoKey;
        
        // 1. Try NEW Standard Message ("Access")
        const messageNew = "Authorize Identity Vault Access\nThis will secure your encryption keys on the blockchain.";
        
        try {
            console.log("Attempting sync with STANDARD message...");
            const { signature } = await signPersonalMessage({
                message: new TextEncoder().encode(messageNew) 
            });
            privateKey = await decryptVault(new Uint8Array(vault), signature);
        } catch (e) {
            console.warn("Standard sync failed, trying LEGACY message...", e);
            
            // 2. Fallback to LEGACY Message ("Creation") for older profiles
            const messageLegacy = "Authorize Identity Vault Creation\nThis allows you to recover your encrypted trades on any device/domain.";
            const { signature: sigLegacy } = await signPersonalMessage({
                    message: new TextEncoder().encode(messageLegacy)
            });
            
            try {
                privateKey = await decryptVault(new Uint8Array(vault), sigLegacy);
                console.log("Legacy sync SUCCESS!");
            } catch (legacyError) {
                console.error("All sync attempts failed.");
                throw legacyError;
            }
        }

        // 3. Export Private JWK (contains coordinates x, y)
        const privJwk = await crypto.subtle.exportKey('jwk', privateKey) as JsonWebKey;
        
        // 4. Extract public part and export as raw to match getEncryptionKeyPair expectations
        const pubKey = await crypto.subtle.importKey(
            'jwk',
            {
                kty: 'EC',
                crv: 'P-256',
                x: privJwk.x,
                y: privJwk.y,
                ext: true
            },
            { name: 'ECDH', namedCurve: 'P-256' },
            true,
            []
        );
        const pubBuffer = await crypto.subtle.exportKey('raw', pubKey);
        const pubBytes = new Uint8Array(pubBuffer);

        // 5. Save to local storage
        const addr = account.address.toLowerCase();
        localStorage.setItem(`gb_sec_pub_${addr}`, JSON.stringify(Array.from(pubBytes)));
        localStorage.setItem(`gb_sec_priv_${addr}`, JSON.stringify(privJwk));
        
        return true;
    }, [account, signPersonalMessage]);

    /**
     * Update Vault (Security Reset)
     */
    const updateVaultIdentity = useCallback(async (repNftId: string) => {
        if (!account) return;

        const myKeys = await getEncryptionKeyPair(account.address);
        const message = "Authorize Identity Vault Access\nThis will secure your encryption keys on the blockchain.";
        const { signature } = await signPersonalMessage({
             message: new TextEncoder().encode(message) 
        });

        const vaultBytes = await encryptVault(myKeys.privateKey, signature);
        const pubKeyArray = Array.from(myKeys.publicKey);
        const vaultArray = Array.from(vaultBytes);

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::reputation::update_vault`,
            arguments: [
                tx.object(repNftId),
                tx.pure.vector('u8', pubKeyArray),
                tx.pure.vector('u8', vaultArray)
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, signPersonalMessage]);

    /**
     * Cancel Box (Seller) - Only if OPEN
     */
    const cancelBox = useCallback(async (boxId: string) => {
        if (!account) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::cancel_box`,
            arguments: [
                tx.object(boxId),
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);

    /**
     * Claim Refund if Seller timeouts (72h)
     */
    const claimRevealTimeout = useCallback(async (boxId: string) => {
        if (!account || !TREASURY_ID) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::claim_reveal_timeout`,
            arguments: [
                tx.object(boxId),
                tx.object(TREASURY_ID),
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, TREASURY_ID]);

    /**
     * Claim Auto-Finalize (72h after reveal)
     */
    const claimAutoFinalize = useCallback(async (boxId: string) => {
        if (!account || !TREASURY_ID) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::claim_auto_finalize`,
            arguments: [
                tx.object(boxId),
                tx.object(TREASURY_ID),
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, TREASURY_ID]);


    /**
     * Withdraw fees from Treasury (Admin only)
     */
    const withdrawFees = useCallback(async (adminCapId: string, amount?: number) => {
        if (!account || !TREASURY_ID) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::withdraw_fees`,
            arguments: [
                tx.object(adminCapId),
                tx.object(TREASURY_ID),
                tx.pure.option('u64', amount ? amount : null),
            ],
        });

        return signAndExecute({ transaction: tx as any });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, TREASURY_ID]);



    /**
     * Fetch all GiftBox objects from the chain
     */
    const fetchAllBoxes = useCallback(async () => {
        try {
            // 1. Discover Box IDs using Events
            const eventResult = await iotaClient.queryEvents({
                query: { MoveModule: { package: PACKAGE_ID, module: MODULE } },
            });

            if (!eventResult || !eventResult.data) return [];

            const boxIds = eventResult.data
                .filter(event => event.type.endsWith('::BoxCreated'))
                .map(event => (event.parsedJson as { id: string }).id);

            if (boxIds.length === 0) return [];

            console.log(`Fetching state for ${boxIds.length} unique boxes...`);
            const result = await iotaClient.multiGetObjects({
                ids: [...new Set(boxIds)], 
                options: { showContent: true, showOwner: true }
            });

            if (!result) {
                console.warn("multiGetObjects returned NO results");
                return [];
            }
            console.log("RPC raw objects sample:", JSON.stringify(result.slice(0, 2), null, 2));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getByteArrayValue = (opt: any): number[] | null => {
                if (!opt) return null;
                if (Array.isArray(opt)) return opt;
                if (typeof opt === 'object' && opt.fields) {
                    // Standard Move Option<vector<u8>> uses fields.vec
                    if (Array.isArray(opt.fields.vec) && opt.fields.vec.length > 0) {
                        return opt.fields.vec[0];
                    }
                    // Compatibility for some RPCs using contents
                    if (Array.isArray(opt.fields.contents)) return opt.fields.contents;
                }
                return null;
            };

            return result.map((obj) => {
                const data = obj.data;
                const content = data?.content;
                if (content && 'fields' in content && content.fields) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const fields = content.fields as Record<string, any>;
                    
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const getOptionValue = (opt: any): string | null => {
                        if (!opt) return null;
                        if (typeof opt === 'string') return opt.toLowerCase();
                        if (typeof opt === 'object' && opt.fields) {
                           if (Array.isArray(opt.fields.vec)) {
                               return opt.fields.vec[0]?.toLowerCase() || null;
                           }
                           const val = opt.fields.contents || opt.fields.some || null;
                           return val ? val.toLowerCase() : null;
                        }
                        return null;
                    };

                    const buyer = getOptionValue(fields.buyer);
                    
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const getOptionNumberValue = (opt: any): number | null => {
                        if (opt === null || opt === undefined) return null;
                        if (typeof opt === 'number') return opt;
                        if (typeof opt === 'string') return Number(opt);
                        if (typeof opt === 'object' && opt.fields) {
                            if (Array.isArray(opt.fields.vec)) {
                                const val = opt.fields.vec[0];
                                return val !== undefined ? Number(val) : null;
                            }
                            const val = opt.fields.contents || opt.fields.some || null;
                            return val ? Number(val) : null;
                        }
                        return null;
                    };

                    const stateMap: Record<number, string> = {
                        0: 'OPEN',
                        1: 'LOCKED',
                        2: 'REVEALED', 
                        3: 'COMPLETED',
                        4: buyer ? 'DISPUTED' : 'CANCELED',
                        5: 'EXPIRED'
                    };

                    const encCodeBytes = getByteArrayValue(fields.encrypted_code);
                    const encKeyBytes = getByteArrayValue(fields.encrypted_key);
                    
                    // Ensure state is treated as a number
                    const stateNum = Number(fields.state);

                    return {
                        id: data.objectId,
                        seller: fields.seller.toLowerCase(),
                        buyer: buyer,
                        brand: fields.card_brand as BoxType,
                        value: Number(fields.face_value),
                        price: Number(fields.price),
                        status: (stateMap[stateNum] || 'OPEN') as BoxStatus,
                        encryptedCodeOnChain: encCodeBytes ? JSON.stringify(Array.from(encCodeBytes)) : null,
                        encryptedKeyOnChain: encKeyBytes ? JSON.stringify(Array.from(encKeyBytes)) : null,
                        createdAt: new Date(Number(fields.created_at)).toISOString(),
                        lockedAt: getOptionNumberValue(fields.locked_at),
                        revealTimestamp: getOptionNumberValue(fields.reveal_timestamp),
                    } as Box;
                }
                return null;
            }).filter((b): b is Box => b !== null);
        } catch (err) {
            console.error("Error in fetchAllBoxes:", err);
            return [];
        }
    }, [iotaClient, PACKAGE_ID, MODULE]);

    return {
        createBox,
        joinBox,
        revealKey,
        finalizeBox,
        disputeBox,
        cancelBox,
        claimRevealTimeout,
        claimAutoFinalize,
        withdrawFees,
        fetchAllBoxes,
        syncIdentity,
        updateVaultIdentity,
        mintProfile,
        getReputationNFT
    };
};
