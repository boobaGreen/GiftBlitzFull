import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IotaClientProvider, WalletProvider } from '@iota/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { networkConfig } from './config/iotaConfig.ts'
import contracts from './data/contracts.json'
import '@iota/dapp-kit/dist/index.css'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // Cache data for 30 seconds
      gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes (was cacheTime in v4)
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs
      retry: 1, // Only retry failed queries once
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork={(contracts.NETWORK as 'testnet' | 'local') || 'local'}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
