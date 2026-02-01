import { useCallback } from 'react';
import { Transaction } from '@iota/iota-sdk/transactions';
import { useIotaClient, useSignAndExecuteTransaction, useCurrentAccount } from '@iota/dapp-kit';
import contracts from '../data/contracts.json';
import type { Box, BoxType, BoxStatus } from '../types';
import { 
    getEncryptionKeyPair, 
    encryptCode, 
    encryptKeyForBuyer, 
    storeSymmetricKey, 
    getSymmetricKey 
} from '../utils/security';

export const useGiftBlitz = () => {
    const iotaClient = useIotaClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

    const PACKAGE_ID = contracts.PACKAGE_ID;
    const MODULE = "giftblitz";

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
                        publicKey: fields.public_key ? JSON.stringify(fields.public_key) : null
                    };
                }
            }
        }
        return null;
    }, [iotaClient, PACKAGE_ID]);

    /**
     * Create a new GiftBox
     */
    const createBox = useCallback(async (
        cardBrand: string, 
        faceValue: number, 
        price: number, 
        clearCode: string
    ) => {
        if (!account) return;

        // 1. Local Encryption (Asymmetric Setup)
        const { ciphertext, key: symKey } = await encryptCode(clearCode);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const encryptedCodeHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', ciphertext as any)));

        const tx = new Transaction();
        const [stakeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(price)]);

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::create_box`,
            arguments: [
                tx.pure.string(cardBrand),
                tx.pure.u64(faceValue),
                tx.pure.u64(price),
                tx.pure.vector('u8', encryptedCodeHash),
                tx.pure.vector('u8', Array.from(ciphertext)),
                stakeCoin,
                tx.object('0x6'),
            ],
        });

        const result = await signAndExecute({ transaction: tx });
        
        // 4. If successful, link symmetric key to the new object ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const txResponse = result as any;
        if (txResponse && txResponse.effects?.created) {
            const created = txResponse.effects.created;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const boxObj = created.find((c: any) => c.owner && typeof c.owner === 'object' && 'AddressOwner' in c.owner);
            if (boxObj && boxObj.reference?.objectId) {
                await storeSymmetricKey(boxObj.reference.objectId, symKey);
            }
        }

        return { result, symKey };
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);

    /**
     * Join/Purchase an existing GiftBox
     */
    const joinBox = useCallback(async (boxId: string, price: number, faceValue: number) => {
        if (!account) return;

        const tx = new Transaction();
        
        // Contract expects Price + 110% FaceValue as a single Coin
        const totalRequired = BigInt(price) + (BigInt(faceValue) * 110n / 100n);
        
        const [paymentAndStakeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(totalRequired)]);

        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::join_box`,
            arguments: [
                tx.object(boxId),
                paymentAndStakeCoin,
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);

    /**
     * Reveal Key (Seller)
     */
    const revealKey = useCallback(async (boxId: string, buyerAddress: string) => {
        if (!account) return;

        // 1. Fetch Buyer's Public Key from their Reputation NFT
        const buyerNft = await getReputationNFT(buyerAddress);
        if (!buyerNft || !buyerNft.publicKey) {
            throw new Error("Buyer profile or encryption public key not found. Buyer must initialize profile.");
        }

        // 2. Fetch my encryption keys
        const myKeys = await getEncryptionKeyPair(account.address);

        // 3. Fetch the symmetric key for this box from localStorage
        const symKey = await getSymmetricKey(boxId);
        if (!symKey) throw new Error("Local symmetric key not found for this listing. Did you create it on this device?");

        // 4. Encrypt symmetric key specifically for buyer
        const buyerPubKeyBytes = new Uint8Array(JSON.parse(buyerNft.publicKey));
        const encryptedKeyForBuyer = await encryptKeyForBuyer(symKey, myKeys.privateKey, buyerPubKeyBytes);

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::reveal_key`,
            arguments: [
                tx.object(boxId),
                tx.pure.vector('u8', Array.from(encryptedKeyForBuyer)),
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE, getReputationNFT]);

    /**
     * Finalize (Buyer) - Requires ReputationNFT
     */
    const finalizeBox = useCallback(async (boxId: string, repNftId: string) => {
        if (!account) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::finalize`,
            arguments: [
                tx.object(boxId),
                tx.object(repNftId)
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);

    /**
     * Dispute (Buyer) - Requires ReputationNFT
     */
    const disputeBox = useCallback(async (boxId: string, repNftId: string) => {
        if (!account) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::dispute`,
            arguments: [
                tx.object(boxId),
                tx.object(repNftId)
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);


    /**
     * Mint Reputation NFT for new users
     */
    const mintProfile = useCallback(async () => {
        if (!account) return;

        // Generate/Retrieve Encryption Hub Keys
        const { publicKey } = await getEncryptionKeyPair(account.address);
        const pubKeyArray = Array.from(publicKey);

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::reputation::mint_profile`,
            arguments: [
                tx.pure.vector('u8', pubKeyArray)
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID]);

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

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);

    /**
     * Claim Refund if Seller timeouts (72h)
     */
    const claimRevealTimeout = useCallback(async (boxId: string) => {
        if (!account) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::claim_reveal_timeout`,
            arguments: [
                tx.object(boxId),
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);

    /**
     * Claim Auto-Finalize (72h after reveal)
     */
    const claimAutoFinalize = useCallback(async (boxId: string) => {
        if (!account) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE}::claim_auto_finalize`,
            arguments: [
                tx.object(boxId),
                tx.object('0x6'),
            ],
        });

        return signAndExecute({ transaction: tx });
    }, [account, signAndExecute, PACKAGE_ID, MODULE]);


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

            // 2. Fetch current state of all discovered boxes
            const result = await iotaClient.multiGetObjects({
                ids: [...new Set(boxIds)], 
                options: { showContent: true, showOwner: true }
            });

            if (!result) return [];

            type MoveOption<T> = T | { fields: { contents: T } } | { fields: { some: T } } | null | undefined;


            const getByteArrayValue = (opt: unknown): number[] | null => {
                if (!opt) return null;
                if (Array.isArray(opt)) return opt;
                if (typeof opt === 'object' && opt !== null && 'fields' in opt) {
                    const fields = (opt as { fields: { contents: number[] } }).fields;
                    if (fields && fields.contents) return fields.contents;
                }
                return null;
            };

            return result.map((obj) => {
                const data = obj.data;
                const content = data?.content;
                if (content && 'fields' in content && content.fields) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const fields = content.fields as Record<string, any>;
                    
                    const getOptionValue = (opt: MoveOption<string>): string | null => {
                        if (!opt) return null;
                        if (typeof opt === 'string') return opt.toLowerCase();
                        if (typeof opt === 'object' && opt !== null && 'fields' in opt) {
                            const optFields = opt as { fields: { contents?: string; some?: string } };
                            const val = optFields.fields.contents || optFields.fields.some || null;
                            return val ? val.toLowerCase() : null;
                        }
                        return null;
                    };

                    const buyer = getOptionValue(fields.buyer);
                    
                    const getOptionNumberValue = (opt: unknown): number | null => {
                        if (opt === null || opt === undefined) return null;
                        if (typeof opt === 'number') return opt;
                        if (typeof opt === 'string') return Number(opt);
                        if (typeof opt === 'object' && 'fields' in opt) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const f = (opt as any).fields;
                            const val = f.contents || f.some || null;
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

                    return {
                        id: data.objectId,
                        seller: fields.seller.toLowerCase(),
                        buyer: buyer,
                        brand: fields.card_brand as BoxType,
                        value: Number(fields.face_value),
                        price: Number(fields.price),
                        status: (stateMap[fields.state] || 'OPEN') as BoxStatus,
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
        mintProfile,
        getReputationNFT,
        fetchAllBoxes
    };
};
