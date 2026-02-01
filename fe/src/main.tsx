import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IotaClientProvider, WalletProvider } from '@iota/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { networkConfig } from './config/iotaConfig.ts'
import contracts from './data/contracts.json'
import '@iota/dapp-kit/dist/index.css'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();

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
