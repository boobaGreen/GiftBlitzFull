import React, { useState } from 'react';
import { useMarket } from '../hooks/useMarket';
import SyncIdentityModal from './SyncIdentityModal';

const GlobalModals: React.FC = () => {
    const { isSyncModalOpen, setIsSyncModalOpen, syncIdentity, user } = useMarket();
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (!user.vault) {
            setIsSyncModalOpen(false);
            return;
        }
        
        setIsSyncing(true);
        try {
            const success = await syncIdentity(user.vault);
            if (success) {
                setIsSyncModalOpen(false);
            }
        } catch (error) {
            console.error("Global sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <>
            <SyncIdentityModal
                isOpen={isSyncModalOpen}
                isSyncing={isSyncing}
                onSync={handleSync}
                onClose={() => setIsSyncModalOpen(false)}
            />
            {/* Future global modals can go here */}
        </>
    );
};

export default GlobalModals;
