import { createContext } from 'react';
import type { Box, User } from '../types';

export interface MarketContextType {
    boxes: Box[];
    user: User;
    repNftId: string | null;
    addBox: (newBox: Box) => void;
    joinBox: (boxId: string, buyerAddress: string) => void;
    finalizeBox: (boxId: string) => void;
    disputeBox: (boxId: string) => void;
    cancelBox: (boxId: string) => void;
    claimRevealTimeout: (boxId: string) => void;
    claimAutoFinalize: (boxId: string) => void;
    mintProfile: () => Promise<void>;
    refreshUserStats: () => Promise<void>;
    syncIdentity: (vault: number[]) => Promise<boolean | undefined>;
    updateVaultIdentity: (repNftId: string) => Promise<unknown>;
    isSyncModalOpen: boolean;
    setIsSyncModalOpen: (open: boolean) => void;
    isSyncDismissed: boolean;
    setIsSyncDismissed: (dismissed: boolean) => void;
    keyMatch: boolean | null;
    sellersRep: Record<string, { trades: number, volume: number, disputes: number }>;
}

export const MarketContext = createContext<MarketContextType | undefined>(undefined);
