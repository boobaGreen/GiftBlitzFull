-ripensare al penalita se venditore non da codice entro le 72h , adesso paga la meta dello stake ripensare.

------------------------------------------------------------------------------------------------------Implementation Plan: Frontend Caching Layer (Opzione 3)
Goal
Implement React Query caching layer to improve performance and reduce blockchain queries, supporting up to 500-1000 active boxes with smooth UX.

Current State Analysis
✅ Already Done
@tanstack/react-query installed (v5.90.20)
QueryClient configured in
main.tsx
App wrapped with QueryClientProvider
🔍 Current Issues
Manual Polling:
MarketContext.tsx
uses setInterval every 10s to refresh all boxes
No Caching: Every page navigation refetches all data from blockchain
Load All Data: Frontend downloads ALL boxes and filters client-side
No Pagination: Can't handle 500+ boxes efficiently
Proposed Changes

1. Refactor MarketContext with React Query
   File:
   fe/src/context/MarketContext.tsx

Current Approach:

typescript
// Manual polling with setInterval
React.useEffect(() => {
refreshBoxes();
const interval = setInterval(() => {
if (Date.now() - lastActionTime < 8000) return;
refreshBoxes();
}, 10000);
return () => clearInterval(interval);
}, [refreshBoxes, lastActionTime]);
New Approach:

typescript
// React Query with automatic caching and refetching
const { data: boxes, refetch: refreshBoxes } = useQuery({
queryKey: ['giftBoxes'],
queryFn: fetchBoxesFromBlockchain,
staleTime: 30000, // Cache for 30s
refetchInterval: 10000, // Auto-refetch every 10s
refetchOnWindowFocus: true,
});
Benefits:

✅ Automatic caching (no duplicate queries)
✅ Background refetching
✅ Deduplication (multiple components using same data)
✅ Loading/error states built-in 2. Add Pagination Support
File: fe/src/hooks/useMarketplaceBoxes.ts (NEW)

Create custom hook for paginated marketplace queries:

typescript
export const useMarketplaceBoxes = (filters: BoxFilters) => {
return useQuery({
queryKey: ['marketplaceBoxes', filters],
queryFn: () => fetchBoxesWithPagination(filters),
staleTime: 30000,
keepPreviousData: true, // Smooth pagination transitions
});
};
File:
fe/src/pages/Market.tsx

Add pagination UI:

typescript
const [page, setPage] = useState(0);
const { data } = useMarketplaceBoxes({ page, limit: 20, state: 'OPEN' });
// Pagination controls
<button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Previous</button>
<button onClick={() => setPage(p => p + 1)} disabled={!data?.hasMore}>Next</button> 3. Optimistic Updates for User Actions
File: fe/src/hooks/useBoxMutations.ts (NEW)

Implement optimistic updates for buy/sell/cancel actions:

typescript
export const usePurchaseBox = () => {
const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (boxId: string) => purchaseBoxOnChain(boxId),
        onMutate: async (boxId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['giftBoxes'] });

            // Snapshot previous value
            const previousBoxes = queryClient.getQueryData(['giftBoxes']);

            // Optimistically update
            queryClient.setQueryData(['giftBoxes'], (old: Box[]) =>
                old.filter(box => box.id !== boxId)
            );

            return { previousBoxes };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            queryClient.setQueryData(['giftBoxes'], context.previousBoxes);
        },
        onSettled: () => {
            // Refetch after mutation
            queryClient.invalidateQueries({ queryKey: ['giftBoxes'] });
        },
    });

};
Benefit: Box disappears instantly from UI when purchased, even before blockchain confirmation!

4. Improve Query Configuration
   File:
   fe/src/main.tsx

Update QueryClient configuration for better performance:

typescript
const queryClient = new QueryClient({
defaultOptions: {
queries: {
staleTime: 30000, // 30s cache
cacheTime: 5 _ 60 _ 1000, // Keep in cache for 5 minutes
refetchOnWindowFocus: false, // Don't refetch on tab switch
retry: 1, // Only retry once on failure
},
},
});
File Changes Summary
Modified Files
fe/src/context/MarketContext.tsx

Replace manual setInterval with useQuery
Keep refreshBoxes as queryClient.invalidateQueries
Maintain backward compatibility with existing components
fe/src/main.tsx

Update QueryClient configuration with better defaults
fe/src/pages/Market.tsx

Add pagination state
Add pagination UI controls
Limit to 20 boxes per page
New Files
fe/src/hooks/useMarketplaceBoxes.ts

Custom hook for marketplace queries
Handles pagination and filtering
fe/src/hooks/useBoxMutations.ts

Custom hooks for box mutations (purchase, create, cancel)
Implements optimistic updates
Verification Plan

1. Unit Testing
   Currently the project doesn't have a test suite setup. Skip unit tests for now and rely on manual testing.

2. Manual Testing
   Test 1: Verify Caching Works
   Steps:

Open Market page
Open browser DevTools → Network tab
Navigate away and back to Market page
Expected: No new RPC calls for 30 seconds (data served from cache)
Test 2: Verify Auto-Refresh
Steps:

Open Market page in Browser 1
Open Market page in Browser 2
Purchase a box in Browser 2
Wait maximum 10 seconds
Expected: Box disappears from Browser 1 market automatically
Test 3: Verify Optimistic Updates
Steps:

Open Market page
Click "Buy Now" on a box
Expected: Box disappears immediately from UI (before transaction completes)
If transaction fails, box should reappear
Test 4: Verify Pagination
Steps:

Create 25+ test boxes (if not enough in testnet)
Open Market page
Expected: Only 20 boxes shown initially
Click "Next Page"
Expected: Next 5+ boxes appear
Expected: "Previous Page" button enabled
Test 5: Performance Benchmark
Steps:

Open Market page with DevTools Performance tab
Record page load
Expected: Initial render < 1 second
Expected: Page navigation < 300ms (cached)
Rollback Plan
If caching causes issues, we can easily rollback:

Keep old
MarketContext.tsx
as MarketContext.legacy.tsx
If problems arise, swap back to legacy implementation
React Query layer is additive, doesn't break existing code
Timeline Estimate
Task Time Status
Update QueryClient config 15 min ⏳ Not started
Refactor MarketContext 2 hours ⏳ Not started
Create useMarketplaceBoxes hook 1 hour ⏳ Not started
Add pagination to Market page 2 hours ⏳ Not started
Create useBoxMutations hook 1 hour ⏳ Not started
Manual testing 1 hour ⏳ Not started
Total ~7-8 hours
Success Metrics
After implementation:

✅ Reduced RPC calls: 70% reduction in blockchain queries
✅ Faster navigation: Page switches < 300ms
✅ Smooth pagination: Load 20 boxes at a time
✅ Better UX: Optimistic updates feel instant
✅ Scalability: Handles 500-1000 boxes smoothly
Next Steps After This
Once we hit 500+ active boxes and see latency > 2s:

Evaluate IOTA Hosted Indexer (Opzione 1)
If not available, prepare Self-Hosted Indexer (Opzione 2)
