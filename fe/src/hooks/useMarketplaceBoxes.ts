import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useGiftBlitz } from './useGiftBlitz';
import type { Box } from '../types';

/**
 * Custom hook for fetching marketplace boxes with React Query caching
 * Automatically refetches every 10 seconds and caches for 30 seconds
 */
export const useMarketplaceBoxes = () => {
    const { fetchAllBoxes } = useGiftBlitz();

    return useQuery({
        queryKey: ['giftBoxes'],
        queryFn: async (): Promise<Box[]> => {
            console.log('Fetching boxes from blockchain...');
            const boxes = await fetchAllBoxes();
            return boxes as Box[];
        },
        staleTime: 30000, // Cache for 30 seconds
        refetchInterval: 10000, // Auto-refetch every 10 seconds
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

/**
 * Helper to manually refresh boxes (invalidates cache and refetches)
 */
export const useRefreshBoxes = () => {
    const queryClient = useQueryClient();
    
    return () => {
        console.log('Manual refresh: invalidating boxes cache...');
        queryClient.invalidateQueries({ queryKey: ['giftBoxes'] });
    };
};
