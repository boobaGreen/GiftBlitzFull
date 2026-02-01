import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Box, User } from '../types';
import { MOCK_USER } from '../data/mockData';
import { useCurrentAccount, useIotaClient } from '@iota/dapp-kit';
import { useGiftBlitz } from '../hooks/useGiftBlitz';

interface MarketContextType {
    boxes: Box[];
    user: User;
    repNftId: string | null;
    addBox: (newBox: Box) => void;
    joinBox: (boxId: string, buyerAddress: string) => void;
    finalizeBox: (boxId: string) => void;
    disputeBox: (boxId: string) => void;
    cancelBox: (boxId: string) => void;
    mintProfile: () => Promise<void>;
    refreshUserStats: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const account = useCurrentAccount();
    const iotaClient = useIotaClient();
    const { getReputationNFT, mintProfile: callMintProfile, fetchAllBoxes, cancelBox: callCancelBox } = useGiftBlitz();
    
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [repNftId, setRepNftId] = useState<string | null>(null);
    const [user, setUser] = useState<User>({
        ...MOCK_USER,
        address: account?.address.toLowerCase() || MOCK_USER.address.toLowerCase(),
        balance: 0,
    });

    const refreshBoxes = useCallback(async () => {
        try {
            const chainBoxes = await fetchAllBoxes();
            setBoxes(chainBoxes as Box[]);
        } catch (err) {
            console.error("Failed to fetch boxes:", err);
        }
    }, [fetchAllBoxes]);

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
                memberEpoch: repData ? repData.memberEpoch : null
            }));
            
            if (repData) {
                setRepNftId(repData.id);
            }
        } catch (err) {
            console.error("Failed to refresh stats:", err);
        }
    }, [account, iotaClient, getReputationNFT]);

    // Initial sync and periodic refresh
    React.useEffect(() => {
        refreshBoxes();
        const interval = setInterval(refreshBoxes, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [refreshBoxes]);

    // Sync on account change
    React.useEffect(() => {
        if (account?.address) {
            refreshUserStats();
        } else {
            setRepNftId(null);
            setUser(prev => ({ ...prev, balance: 0, tradeCount: 0 }));
        }
    }, [account?.address, refreshUserStats]);

    const cancelBox = async (boxId: string) => {
        try {
            await callCancelBox(boxId);
            setBoxes(prev => prev.map(box =>
                box.id === boxId ? { ...box, status: 'CANCELED' } : box
            ));
            setTimeout(refreshUserStats, 2000);
        } catch (err) {
            console.error("Cancel failed:", err);
        }
    };

    const mintProfile = async () => {
        await callMintProfile();
        // Delay slightly for indexing and then refresh
        setTimeout(refreshUserStats, 2000);
    };

    const addBox = (newBox: Box) => {
        setBoxes((prev) => [newBox, ...prev]);
    };

    const joinBox = (boxId: string, buyerAddress: string) => {
        setBoxes(prev => prev.map(box => {
            if (box.id === boxId) {
                return { ...box, status: 'LOCKED', buyer: buyerAddress };
            }
            return box;
        }));
    };

    const finalizeBox = (boxId: string) => {
        setBoxes(prev => prev.map(box =>
            box.id === boxId ? { ...box, status: 'COMPLETED' } : box
        ));
        setTimeout(refreshUserStats, 2000);
    };

    const disputeBox = (boxId: string) => {
        setBoxes(prev => prev.map(box =>
            box.id === boxId ? { ...box, status: 'DISPUTED' } : box
        ));
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
            mintProfile, 
            refreshUserStats 
        }}>
            {children}
        </MarketContext.Provider>
    );
};

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
};
