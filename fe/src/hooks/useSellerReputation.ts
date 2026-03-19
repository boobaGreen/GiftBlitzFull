import { useQuery } from '@tanstack/react-query';
import { useGiftBlitz } from './useGiftBlitz';

interface ReputationData {
    trades: number;
    volume: number;
    disputes: number;
}

/**
 * Custom hook for fetching seller reputation with React Query caching
 * Caches reputation data for 2 minutes (reputations don't change frequently)
 */
export const useSellerReputation = (sellerAddress: string) => {
    const { getReputationNFT } = useGiftBlitz();

    return useQuery({
        queryKey: ['sellerReputation', sellerAddress.toLowerCase()],
        queryFn: async (): Promise<ReputationData> => {
            const repData = await getReputationNFT(sellerAddress);
            
            if (!repData) {
                return { trades: 0, volume: 0, disputes: 0 };
            }
            
            return {
                trades: repData.tradeCount,
                volume: repData.volume,
                disputes: repData.disputes,
            };
        },
        staleTime: 2 * 60 * 1000, // Cache for 2 minutes (reputations don't change often)
        refetchInterval: false, // Don't auto-refetch reputation
        retry: 1,
        enabled: !!sellerAddress, // Only run query if address exists
    });
};

/**
 * Hook to fetch multiple sellers' reputations in batch
 */
export const useBatchSellerReputations = (sellerAddresses: string[]) => {
    const { getReputationNFT } = useGiftBlitz();

    return useQuery({
        queryKey: ['batchSellerReputations', sellerAddresses.sort().join(',')],
        queryFn: async (): Promise<Record<string, ReputationData>> => {
            const uniqueSellers = Array.from(new Set(sellerAddresses.map(a => a.toLowerCase())));
            const repPromises = uniqueSellers.map(address => getReputationNFT(address));
            const repResults = await Promise.all(repPromises);

            const repMap: Record<string, ReputationData> = {};
            
            uniqueSellers.forEach((address, index) => {
                const rep = repResults[index];
                repMap[address] = rep ? {
                    trades: rep.tradeCount,
                    volume: rep.volume,
                    disputes: rep.disputes,
                } : {
                    trades: 0,
                    volume: 0,
                    disputes: 0,
                };
            });

            return repMap;
        },
        staleTime: 2 * 60 * 1000,
        retry: 1,
        enabled: sellerAddresses.length > 0,
    });
};
