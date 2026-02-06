import React, { useState } from 'react';
import { useMarket } from '../hooks/useMarket';
import SyncIdentityModal from './SyncIdentityModal';

const GlobalModals: React.FC = () => {
    const { isSyncModalOpen, setIsSyncModalOpen, setIsSyncDismissed, syncIdentity, updateVaultIdentity, refreshUserStats, user } = useMarket();
    const [showReset, setShowReset] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (!user.vault) {
            setIsSyncModalOpen(false);
            return;
        }
        
        setIsSyncing(true);
        setShowReset(false);
        try {
            const success = await syncIdentity(user.vault);
            if (success) {
                await refreshUserStats();
                setIsSyncModalOpen(false);
            }
        } catch (error) {
            console.error("Global sync failed:", error);
            // If sync fails (e.g. wrong signature/decryption error), show reset option
            setShowReset(true);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleReset = async () => {
        if (!user.repNftId) return;
        setIsSyncing(true);
        try {
             // Overwrite on-chain vault with current local keys
             await updateVaultIdentity(user.repNftId);
             setIsSyncModalOpen(false);
             setIsSyncDismissed(false); // Reset dismissal so we re-verify
             await refreshUserStats();
        } catch (error) {
            console.error("Reset identity failed:", error);
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
                onReset={showReset ? handleReset : undefined}
                onClose={() => {
                    setIsSyncDismissed(true);
                    setIsSyncModalOpen(false);
                }}
            />
            {/* Future global modals can go here */}
        </>
    );
};

export default GlobalModals;
