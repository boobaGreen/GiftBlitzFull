module giftblitz::giftblitz {
    // transfer, tx_context, option provided by default
    use iota::balance::{Self, Balance};
    use iota::coin::{Self, Coin};
    use iota::iota::IOTA;
    use iota::clock::{Self, Clock};
    use std::string::String;
    // option, Option provided by default
    use giftblitz::reputation::{Self, ReputationNFT};

    // Error codes
    const EIncorrectStake: u64 = 0;
    const EInvalidState: u64 = 1;
    const ENotAuthorized: u64 = 2;
    const ETimeNotReached: u64 = 3;
    const EKeyAlreadyRevealed: u64 = 4;
    const EBuyerCapExceeded: u64 = 5;
    const ESellerCapExceeded: u64 = 6;

    // States
    const STATE_OPEN: u8 = 0;
    const STATE_LOCKED: u8 = 1;
    const STATE_REVEALED: u8 = 2;
    const STATE_COMPLETED: u8 = 3;
    const STATE_BURNED: u8 = 4;
    const STATE_EXPIRED: u8 = 5;

    // Timeouts
    const REVEAL_TIMEOUT_MS: u64 = 259200000; // 72 hours
    const FINALIZE_TIMEOUT_MS: u64 = 259200000; // 72 hours

    /// Admin Capability for emergency actions
    public struct AdminCap has key { id: UID }

    /// Shared Treasury object to store collected fees and disputed stakes
    public struct Treasury has key {
        id: UID,
        balance: Balance<IOTA>
    }

    /// The main GiftBox object (Shared Object)
    public struct GiftBox has key, store {
        id: UID,
        seller: address,
        buyer: Option<address>,
        card_brand: String,
        face_value: u64,
        price: u64,
        // Trusted Deposits (Stakes)
        seller_stake: Balance<IOTA>,
        buyer_stake: Balance<IOTA>,
        // Payment
        payment: Balance<IOTA>,
        // Security
        encrypted_code_hash: vector<u8>,
        encrypted_code: vector<u8>, // The code encrypted with the symmetric key
        encrypted_key: Option<vector<u8>>, // The symmetric key encrypted for the buyer
        // State
        state: u8,
        reveal_timestamp: Option<u64>,
        created_at: u64,
        locked_at: Option<u64>,
    }

    /// Events
    public struct BoxCreated has copy, drop {
        id: address,
        seller: address,
        price: u64,
        face_value: u64
    }

    public struct BoxLocked has copy, drop {
        id: address,
        buyer: address
    }

    public struct KeyRevealed has copy, drop {
        id: address,
        encrypted_key: vector<u8>
    }

    public struct TradeFinalized has copy, drop {
        id: address,
        buyer: address,
        seller: address,
        final_price: u64
    }

    public struct BoxExpired has copy, drop {
        id: address,
        buyer: address,
        refund_amount: u64
    }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
        
        // Initialize global treasury
        transfer::share_object(Treasury {
            id: object::new(ctx),
            balance: balance::zero(),
        });
    }

    // --- Core Functions ---

    /// Seller creates a new GiftBox
    public entry fun create_box(
        seller_rep_nft: &ReputationNFT,
        card_brand: String,
        face_value: u64,
        price: u64,
        encrypted_code_hash: vector<u8>,
        encrypted_code: vector<u8>,
        stake_coin: Coin<IOTA>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(price > 0 && face_value > 0, EIncorrectStake);

        // Seller Reputation Cap Check: verify seller's reputation allows this listing
        let max_sell_value = reputation::get_max_trade_value(seller_rep_nft);
        assert!(price <= max_sell_value, ESellerCapExceeded);
        
        // Seller Stake must be 100% of Face Value (Safety First)
        assert!(coin::value(&stake_coin) == face_value, EIncorrectStake);

        let id = object::new(ctx);
        // let box_id = object::uid_to_inner(&id); // unused

        let sender = tx_context::sender(ctx);

        let gift_box = GiftBox {
            id,
            seller: sender,
            buyer: option::none(),
            card_brand,
            face_value,
            price,
            seller_stake: coin::into_balance(stake_coin),
            buyer_stake: balance::zero(),
            payment: balance::zero(),
            encrypted_code_hash,
            encrypted_code,
            encrypted_key: option::none(),
            state: STATE_OPEN,
            reveal_timestamp: option::none(),
            created_at: clock::timestamp_ms(clock),
            locked_at: option::none(),
        };

        // Emit event
        iota::event::emit(BoxCreated {
            id: object::id_address(&gift_box),
            seller: sender,
            price,
            face_value
        });

        // Share object
        transfer::share_object(gift_box);
    }

    /// Buyer joins the box
    public entry fun join_box(
        box: &mut GiftBox,
        payment_and_stake: Coin<IOTA>,
        buyer_rep_nft: &ReputationNFT,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(box.state == STATE_OPEN, EInvalidState);
        
        // Buyer Caps Check: verify buyer's reputation allows this purchase
        let max_buy_value = reputation::get_max_trade_value(buyer_rep_nft);
        assert!(box.price <= max_buy_value, EBuyerCapExceeded);
        
        // Buyer MUST pay: Price + 110% Face Value (Stake)
        let required_stake = (box.face_value * 110) / 100;
        let total_required = box.price + required_stake;
        
        assert!(coin::value(&payment_and_stake) == total_required, EIncorrectStake);

        let buyer_addr = tx_context::sender(ctx);
        let mut balance = coin::into_balance(payment_and_stake);
        
        // Split balance into payment and stake
        let payment_balance = balance::split(&mut balance, box.price);
        // Remaining is stake
        
        box.buyer = option::some(buyer_addr);
        box.state = STATE_LOCKED;
        balance::join(&mut box.payment, payment_balance);
        balance::join(&mut box.buyer_stake, balance);
        box.locked_at = option::some(clock::timestamp_ms(clock));

        iota::event::emit(BoxLocked {
            id: object::id_address(box),
            buyer: buyer_addr
        });
    }

    /// Seller reveals the encrypted key
    public entry fun reveal_key(
        box: &mut GiftBox,
        encrypted_key: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only seller can reveal
        assert!(box.seller == sender, ENotAuthorized);
        // Must be in LOCKED state 
        assert!(box.state == STATE_LOCKED, EInvalidState);

        box.encrypted_key = option::some(encrypted_key);
        box.state = STATE_REVEALED;
        box.reveal_timestamp = option::some(clock::timestamp_ms(clock));

        iota::event::emit(KeyRevealed {
            id: object::id_address(box),
            encrypted_key
        });
    }

    /// Buyer finalizes the trade (Happy Path)
    public entry fun finalize(
        box: &mut GiftBox,
        rep_nft: &mut ReputationNFT,
        treasury: &mut Treasury,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only buyer can finalize
        assert!(box.buyer == option::some(sender), ENotAuthorized);
        // Must be in REVEALED state
        assert!(box.state == STATE_REVEALED, EInvalidState);

        // Distributions:
        // 1. Payment -> Seller (minus 1% fee)
        let payment_val = balance::value(&box.payment);
        let fee_val = (payment_val * 1) / 100; // 1% Fee
        
        let fee = balance::split(&mut box.payment, fee_val);
        balance::join(&mut treasury.balance, fee);
        
        let payment_remaining = balance::value(&box.payment);
        let payment = balance::split(&mut box.payment, payment_remaining);
        transfer::public_transfer(coin::from_balance(payment, ctx), box.seller);

        // 2. Seller Stake -> Seller
        let s_stake_val = balance::value(&box.seller_stake);
        let s_stake = balance::split(&mut box.seller_stake, s_stake_val);
        transfer::public_transfer(coin::from_balance(s_stake, ctx), box.seller);

        // 3. Buyer Stake -> Buyer (Return deposit)
        let b_stake_val = balance::value(&box.buyer_stake);
        let b_stake = balance::split(&mut box.buyer_stake, b_stake_val);
        transfer::public_transfer(coin::from_balance(b_stake, ctx), sender);

        // Update Buyer Reputation
        reputation::update_stats(rep_nft, payment_val);

        // Mark completed
        box.state = STATE_COMPLETED;

        iota::event::emit(TradeFinalized {
            id: object::id_address(box),
            buyer: sender,
            seller: box.seller,
            final_price: payment_val
        });
    }

    /// Buyer raises a dispute (e.g. key invalid) -> Burn trust deposits, return price to buyer
    public entry fun dispute(
        box: &mut GiftBox,
        buyer_rep_nft: &mut ReputationNFT,
        seller_rep_nft: &mut ReputationNFT,
        treasury: &mut Treasury,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only buyer can dispute
        assert!(box.buyer == option::some(sender), ENotAuthorized);
        // Can dispute in REVEALED state
        assert!(box.state == STATE_REVEALED, EInvalidState);

        // 1. Return PRICE to Buyer (they only lose trust deposit, not payment)
        let payment_val = balance::value(&box.payment);
        let payment = balance::split(&mut box.payment, payment_val);
        transfer::public_transfer(coin::from_balance(payment, ctx), sender);

        // 2. Send Seller Trust Deposit to Treasury (BURN)
        let s_val = balance::value(&box.seller_stake);
        let s_stake = balance::split(&mut box.seller_stake, s_val);
        balance::join(&mut treasury.balance, s_stake);

        // 3. Send Buyer Trust Deposit to Treasury (BURN)
        let b_val = balance::value(&box.buyer_stake);
        let b_stake = balance::split(&mut box.buyer_stake, b_val);
        balance::join(&mut treasury.balance, b_stake);

        // Update Reputation for BOTH parties
        reputation::reset_on_dispute(buyer_rep_nft);
        reputation::record_dispute_counterparty(seller_rep_nft);

        box.state = STATE_BURNED;
    }

    /// Auto-finalize if buyer doesn't confirm/dispute within 72h after reveal
    public entry fun claim_auto_finalize(
        box: &mut GiftBox,
        treasury: &mut Treasury,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Must be REVEALED and waiting
        assert!(box.state == STATE_REVEALED, EInvalidState);

        let reveal_time = *option::borrow(&box.reveal_timestamp);
        let now = clock::timestamp_ms(clock);
        
        assert!(now > reveal_time + FINALIZE_TIMEOUT_MS, ETimeNotReached);

        // Release everything to Seller
        let seller = box.seller;
        
        let payment_val = balance::value(&box.payment);
        let fee_val = (payment_val * 1) / 100;
        
        let fee = balance::split(&mut box.payment, fee_val);
        balance::join(&mut treasury.balance, fee);
        
        let payment_remaining = balance::value(&box.payment);
        let payment = balance::split(&mut box.payment, payment_remaining);
        transfer::public_transfer(coin::from_balance(payment, ctx), seller);

        let s_val = balance::value(&box.seller_stake);
        let s_stake = balance::split(&mut box.seller_stake, s_val);
        transfer::public_transfer(coin::from_balance(s_stake, ctx), seller);

        // Return Buyer Stake to Buyer (since they essentially "accepted" by silence)
        let b_val = balance::value(&box.buyer_stake);
        let b_stake = balance::split(&mut box.buyer_stake, b_val);
        let buyer_addr = *option::borrow(&box.buyer);
        
        transfer::public_transfer(coin::from_balance(b_stake, ctx), buyer_addr);

        box.state = STATE_COMPLETED;
    }

    /// Buyer can claim refund if seller doesn't reveal within 72h
    public entry fun claim_reveal_timeout(
        box: &mut GiftBox,
        treasury: &mut Treasury,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Verify caller is buyer
        assert!(box.buyer == option::some(sender), ENotAuthorized);
        
        // Verify box is in LOCKED state (not yet revealed)
        assert!(box.state == STATE_LOCKED, EInvalidState);
        
        // Verify seller hasn't revealed yet
        assert!(option::is_none(&box.encrypted_key), EKeyAlreadyRevealed);
        
        // Verify timeout has passed
        let locked_at = *option::borrow(&box.locked_at);
        let now = clock::timestamp_ms(clock);
        assert!(now >= locked_at + REVEAL_TIMEOUT_MS, ETimeNotReached);
        
        // Refund buyer: payment + buyer_stake + 50% seller_stake
        let payment_val = balance::value(&box.payment);
        let payment_coin = coin::from_balance(
            balance::split(&mut box.payment, payment_val),
            ctx
        );
        transfer::public_transfer(payment_coin, sender);
        
        let buyer_stake_val = balance::value(&box.buyer_stake);
        let buyer_stake_coin = coin::from_balance(
            balance::split(&mut box.buyer_stake, buyer_stake_val),
            ctx
        );
        transfer::public_transfer(buyer_stake_coin, sender);
        
        // Give 50% of seller stake to buyer as compensation
        let seller_stake_val = balance::value(&box.seller_stake);
        let compensation = seller_stake_val / 2;
        let compensation_coin = coin::from_balance(
            balance::split(&mut box.seller_stake, compensation),
            ctx
        );
        transfer::public_transfer(compensation_coin, sender);
        
        // Send remaining 50% to PROTOCOL (Treasury)
        let protocol_fee = balance::value(&box.seller_stake);
        balance::join(&mut treasury.balance, balance::split(&mut box.seller_stake, protocol_fee));
        
        // Update state
        box.state = STATE_EXPIRED;
        
        // Emit event
        iota::event::emit(BoxExpired {
            id: object::uid_to_address(&box.id),
            buyer: sender,
            refund_amount: payment_val + buyer_stake_val + compensation,
        });
    }

    /// Cancel box if no one joined
    public entry fun cancel_box(
        box: &mut GiftBox,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(box.seller == sender, ENotAuthorized);
        assert!(box.state == STATE_OPEN, EInvalidState);

        let s_val = balance::value(&box.seller_stake);
        let stake = balance::split(&mut box.seller_stake, s_val);
        transfer::public_transfer(coin::from_balance(stake, ctx), sender);

        box.state = STATE_BURNED; 
    }

    /// Admin can withdraw accumulated fees from Treasury
    public entry fun withdraw_fees(
        _: &AdminCap,
        treasury: &mut Treasury,
        amount: Option<u64>,
        ctx: &mut TxContext
    ) {
        let total_val = balance::value(&treasury.balance);
        let withdraw_val = if (option::is_some(&amount)) {
            let req_val = *option::borrow(&amount);
            assert!(req_val <= total_val, EIncorrectStake);
            req_val
        } else {
            total_val
        };

        let withdrawal = balance::split(&mut treasury.balance, withdraw_val);
        transfer::public_transfer(coin::from_balance(withdrawal, ctx), tx_context::sender(ctx));
    }
}
