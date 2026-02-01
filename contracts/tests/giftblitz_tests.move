#[test_only]
module giftblitz::giftblitz_tests {
    use iota::test_scenario::{Self}; // Removed Scenario alias
    use iota::coin::{Self, Coin};
    use iota::iota::IOTA;
    use std::string;
    // Removed vector, option aliases (defaults)
    
    use giftblitz::giftblitz::{Self, GiftBox};
    use giftblitz::reputation::{Self, ReputationNFT};

    const ALICE: address = @0xA; // Seller
    const BOB: address = @0xB;   // Buyer
    
    // Utilities
    fun mint(amount: u64, ctx: &mut iota::tx_context::TxContext): Coin<IOTA> {
        coin::mint_for_testing<IOTA>(amount, ctx)
    }

    #[test]
    fun test_happy_path() {
        // 1. Setup
        let mut scenario = test_scenario::begin(ALICE);
        
        // 2. Bob mints Reputation Profile
        test_scenario::next_tx(&mut scenario, BOB);
        {
            reputation::mint_profile(test_scenario::ctx(&mut scenario));
        };

        // 3. Alice creates GiftBox (Price: 100, Face: 100)
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            let stake = mint(100, ctx); // Seller stake = Price
            giftblitz::create_box(
                string::utf8(b"AMAZON"),
                100, // Face Value
                100, // Price
                vector[], // Encrypted Code Hash (Mock)
                stake,
                ctx
            );
        };

        // 4. Bob joins GiftBox
        test_scenario::next_tx(&mut scenario, BOB);
        {
            // Take shared object FIRST (immutable borrow of scenario implied or separate)
            let mut box = test_scenario::take_shared<GiftBox>(&scenario);
            
            let ctx = test_scenario::ctx(&mut scenario); // Mutable borrow
            
            // Required user payment: Price (100) + Stake (110% of Face = 110) = 210
            let payment_and_stake = mint(210, ctx);
            
            giftblitz::join_box(&mut box, payment_and_stake, ctx);
            
            test_scenario::return_shared(box);
        };

        // 5. Alice reveals key
        test_scenario::next_tx(&mut scenario, ALICE);
        {
            let mut box = test_scenario::take_shared<GiftBox>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);
            
            giftblitz::reveal_key(&mut box, vector[], ctx); // Mock key
            
            test_scenario::return_shared(box);
        };

        // 6. Bob finalizes
        test_scenario::next_tx(&mut scenario, BOB);
        {
            let mut box = test_scenario::take_shared<GiftBox>(&scenario);
            let mut rep_nft = test_scenario::take_from_sender<ReputationNFT>(&scenario);
            let ctx = test_scenario::ctx(&mut scenario);
            
            // Validate stats before
            assert!(reputation::total_trades(&rep_nft) == 0, 0);

            giftblitz::finalize(&mut box, &mut rep_nft, ctx);

            // Validate stats after
            assert!(reputation::total_trades(&rep_nft) == 1, 1);
            
            test_scenario::return_to_sender(&scenario, rep_nft);
            test_scenario::return_shared(box);
        };

        test_scenario::end(scenario);
    }
}
