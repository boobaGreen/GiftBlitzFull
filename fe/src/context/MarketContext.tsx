import React, { useState, type ReactNode, useCallback, useMemo } from 'react';
import type { Box, User } from '../types';
import { MOCK_USER } from '../data/mockData';
import { useCurrentAccount, useIotaClient } from '@iota/dapp-kit';
import { useGiftBlitz } from '../hooks/useGiftBlitz';
import { MarketContext } from './MarketContextPrimitive';
import { useMarketplaceBoxes, useRefreshBoxes } from '../hooks/useMarketplaceBoxes';
import { useBatchSellerReputations } from '../hooks/useSellerReputation';

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const account = useCurrentAccount();
    const iotaClient = useIotaClient();
    const { 
        getReputationNFT, 
        mintProfile: callMintProfile, 
        cancelBox: callCancelBox,
        claimRevealTimeout: callClaimRevealTimeout,
        claimAutoFinalize: callClaimAutoFinalize,
        syncIdentity,
        updateVaultIdentity
    } = useGiftBlitz();
    
    // React Query hooks for automatic caching and polling
    const { data: cachedBoxes } = useMarketplaceBoxes();
    const refreshBoxesQuery = useRefreshBoxes();
    
    // Get unique seller addresses from boxes
    const sellerAddresses = useMemo(() => 
        cachedBoxes ? Array.from(new Set(cachedBoxes.map(b => b.seller))) : [],
        [cachedBoxes]
    );
    
    // Batch fetch seller reputations
    const { data: sellersRepData } = useBatchSellerReputations(sellerAddresses);
    
    const [repNftId, setRepNftId] = useState<string | null>(null);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [isSyncDismissed, setIsSyncDismissed] = useState(false);
    const [keyMatch, setKeyMatch] = useState<boolean | null>(null);
    const [user, setUser] = useState<User>({
        ...MOCK_USER,
        address: account?.address.toLowerCase() || MOCK_USER.address.toLowerCase(),
        balance: 0,
    });
    
    // Use cached boxes from React Query, fallback to empty array
    const boxes = cachedBoxes || [];
    const sellersRep = sellersRepData || {};

    // Wrapper for refreshBoxes that invalidates React Query cache
    const refreshBoxes = useCallback(async () => {
        console.log("Manual refresh: invalidating React Query cache...");
        refreshBoxesQuery();
    }, [refreshBoxesQuery]);

    const refreshUserStats = useCallback(async () => {
        if (!account) return;
        try {
            // 1. Fetch Balance
            const balance = await iotaClient.getBalance({ owner: account.address });
            const iotaAmount = Number(balance.totalBalance) / 1_000_000_000;
            
            // 2. Fetch Reputation NFT
            const repData = await getReputationNFT(account.address);
            
            setUser(prev => ({ 
                ...prev, 
                address: account.address.toLowerCase(),
                balance: iotaAmount,
                tradeCount: repData ? repData.tradeCount : 0,
                volume: repData ? repData.volume : 0,
                disputes: repData ? repData.disputes : 0,
                memberEpoch: repData ? repData.memberEpoch : null,
                publicKey: repData ? repData.publicKey : null,
                vault: repData ? repData.vault : null
            }));
            
            if (repData) {
                setRepNftId(repData.id);
                
                // PROACTIVE SYNC CHECK: 
                // If we have a vault on chain, check if local keys match
                if (repData.vault && repData.publicKey) {
                    const { getEncryptionKeyPair } = await import('../utils/security');
                    const localKeys = await getEncryptionKeyPair(account.address);
                    const onChainPub = new Uint8Array(JSON.parse(repData.publicKey));
                    const match = localKeys.publicKey.length === onChainPub.length && 
                                 localKeys.publicKey.every((b, i) => b === onChainPub[i]);
                    
                    
                    setKeyMatch(match);

                    if (!match) {
                        console.warn("Identity Mismatch Details:");
                        console.warn("Local Key:", Array.from(localKeys.publicKey));
                        console.warn("Chain Key:", Array.from(onChainPub));
                        
                        if (!isSyncModalOpen && !isSyncDismissed) {
                             console.log("Proactive Sync: Identity mismatch detected, opening modal...");
                             setIsSyncModalOpen(true);
                        }
                    }
                } else {
                    setKeyMatch(null);
                }
            } else {
                setKeyMatch(null);
            }
        } catch (err) {
            console.error("Failed to refresh stats:", err);
            setKeyMatch(null);
        }
    }, [account, iotaClient, getReputationNFT, isSyncModalOpen, isSyncDismissed]);

    // No need for manual polling - React Query handles this automatically!
    // useMarketplaceBoxes already polls every 10s with 30s cache

    // Sync on account change
    React.useEffect(() => {
        if (account?.address) {
            refreshUserStats();
        } else {
            setRepNftId(null);
            setKeyMatch(null);
            setIsSyncDismissed(false);
            setUser(prev => ({ ...prev, balance: 0, tradeCount: 0 }));
        }
    }, [account?.address, refreshUserStats]);

    const cancelBox = async (boxId: string) => {
        try {
            await callCancelBox(boxId);
            // Immediate refresh to remove canceled box from Market
            setTimeout(() => refreshBoxes(), 2000);
            setTimeout(refreshUserStats, 2000);
        } catch (err) {
            console.error("Cancel failed:", err);
        }
    };

    const claimRevealTimeout = async (boxId: string) => {
        try {
            await callClaimRevealTimeout(boxId);
            setTimeout(() => refreshBoxes(), 2000);
            setTimeout(refreshUserStats, 2000);
        } catch (err) {
            console.error("Claim timeout failed:", err);
        }
    };

    const claimAutoFinalize = async (boxId: string) => {
        try {
            await callClaimAutoFinalize(boxId);
            setTimeout(() => refreshBoxes(), 2000);
            setTimeout(refreshUserStats, 2000);
        } catch (err) {
            console.error("Claim auto-finalize failed:", err);
        }
    };

    const mintProfile = async () => {
        await callMintProfile();
        // Delay slightly for indexing and then refresh
        setTimeout(refreshUserStats, 2000);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addBox = (_newBox: Box) => {
        // Immediate refresh via React Query cache invalidation
        setTimeout(() => refreshBoxes(), 2000);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const joinBox = (_boxId: string, _buyerAddress: string) => {
        // Immediate refresh to remove bought box from Market
        setTimeout(() => refreshBoxes(), 2000);
        setTimeout(refreshUserStats, 2000);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const finalizeBox = (_boxId: string) => {
        setTimeout(() => refreshBoxes(), 2000);
        setTimeout(refreshUserStats, 2000);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const disputeBox = (_boxId: string) => {
        setTimeout(() => refreshBoxes(), 2000);
        setTimeout(refreshUserStats, 2000);
    };

    return (
        <MarketContext.Provider value={{ 
            boxes, 
            user, 
            repNftId, 
            addBox, 
            joinBox, 
            finalizeBox, 
            disputeBox, 
            cancelBox,
            claimRevealTimeout,
            claimAutoFinalize,
            mintProfile, 
            refreshUserStats,
            refreshBoxes,
            syncIdentity,
                updateVaultIdentity,
                isSyncModalOpen,
                setIsSyncModalOpen,
                isSyncDismissed,
                setIsSyncDismissed,
                keyMatch,
                sellersRep
            }}>
            {children}
        </MarketContext.Provider>
    );
};
