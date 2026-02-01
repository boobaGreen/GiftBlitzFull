module giftblitz::reputation {

    // transfer, tx_context, Option, vector are provided by default in Move 2024
    
    // States


    /// Soulbound Reputation NFT
    public struct ReputationNFT has key {
        id: UID,
        owner: address,
        public_key: vector<u8>, // Encryption Public Key
        vault: vector<u8>,      // NEW: Encrypted Hub Private Key
        total_trades: u64,
        total_volume: u64,
        disputes: u64,
        first_trade_time: u64,
    }

    /// Events
    public struct ReputationMinted has copy, drop {
        id: address,
        owner: address
    }

    /// Getters
    public fun total_trades(nft: &ReputationNFT): u64 { nft.total_trades }
    public fun disputes(nft: &ReputationNFT): u64 { nft.disputes }

    /// Logic to be implemented:
    
    /// Create a new Reputation NFT for a user if they don't have one (Conceptually).
    /// In Move, we usually create it and transfer to user.
    /// This function would be called by the user to initialize their profile.
    public entry fun mint_profile(public_key: vector<u8>, vault: vector<u8>, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        let nft = ReputationNFT {
            id: object::new(ctx),
            owner: sender,
            public_key,
            vault,
            total_trades: 0,
            total_volume: 0,
            disputes: 0,
            first_trade_time: tx_context::epoch(ctx),
        };

        let id = object::id_address(&nft);
        iota::event::emit(ReputationMinted { id, owner: sender });

        // Transfer to sender
        transfer::transfer(nft, sender);
    }

    /// Update stats after a successful trade
    public(package) fun update_stats(nft: &mut ReputationNFT, volume: u64) {
        nft.total_trades = nft.total_trades + 1;
        nft.total_volume = nft.total_volume + volume;
    }

    /// Reset reputation on dispute (for the party who initiated the dispute)
    public(package) fun reset_on_dispute(nft: &mut ReputationNFT) {
        nft.total_trades = nft.total_trades + 1; // Count the disputed trade
        nft.disputes = nft.disputes + 1;
    }

    /// Record dispute for the other party (seller when buyer disputes)
    public(package) fun record_dispute_counterparty(nft: &mut ReputationNFT) {
        nft.total_trades = nft.total_trades + 1; // Count the disputed trade
        nft.disputes = nft.disputes + 1;
    }

    /// Update vault (used for security reset or cross-domain recovery)
    public entry fun update_vault(nft: &mut ReputationNFT, new_public_key: vector<u8>, new_vault: vector<u8>, ctx: &TxContext) {
        assert!(nft.owner == tx_context::sender(ctx), 0);
        nft.public_key = new_public_key;
        nft.vault = new_vault;
    }

    /// Get Max Buy Value based on trades
    /// 0-2 trades: €30 (approx 30 * 10^6 micros if 1€ = 1M) -> logic needs exchange rate
    /// For MVP we return raw units. let's assume 1 IOTA = 1 cent for simplicity or just raw steps
    /// 0-2: 30
    /// 3-6: 50
    /// 7-14: 100
    /// 15+: 200
    public fun get_max_buy_value(nft: &ReputationNFT): u64 {
        let t = nft.total_trades;
        if (t <= 2) { return 30 }
        else if (t <= 6) { return 50 }
        else if (t <= 14) { return 100 }
        else { return 200 }
    }
}
