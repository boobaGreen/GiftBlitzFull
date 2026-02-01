module giftblitz::giftblitz {
    // transfer, tx_context, option provided by default
    use iota::balance::{Self, Balance};
    use iota::coin::{Self, Coin};
    use iota::iota::IOTA;
    use std::string::String;
    // option, Option provided by default
    use giftblitz::reputation::{Self, ReputationNFT};

    // Error codes
    const EIncorrectStake: u64 = 0;
    const EInvalidState: u64 = 1;
    const ENotAuthorized: u64 = 2;
    const ETimeNotReached: u64 = 3;

    // States
    const STATE_OPEN: u8 = 0;
    const STATE_LOCKED: u8 = 1;
    const STATE_REVEALED: u8 = 2;
    const STATE_COMPLETED: u8 = 3;
    const STATE_BURNED: u8 = 4;

    /// Admin Capability for emergency actions
    public struct AdminCap has key { id: UID }

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

    fun init(ctx: &mut TxContext) {
        transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
    }

    // --- Core Functions ---

    /// Seller creates a new GiftBox
    public entry fun create_box(
        card_brand: String,
        face_value: u64,
        price: u64,
        encrypted_code_hash: vector<u8>,
        encrypted_code: vector<u8>,
        stake_coin: Coin<IOTA>,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(price > 0 && face_value > 0, EIncorrectStake);
        
        // Seller Stake must be 100% of Price
        assert!(coin::value(&stake_coin) == price, EIncorrectStake);

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
            created_at: tx_context::epoch(ctx),
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
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(box.state == STATE_OPEN, EInvalidState);
        
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

        iota::event::emit(BoxLocked {
            id: object::id_address(box),
            buyer: buyer_addr
        });
    }

    /// Seller reveals the encrypted key
    public entry fun reveal_key(
        box: &mut GiftBox,
        encrypted_key: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only seller can reveal
        assert!(box.seller == sender, ENotAuthorized);
        // Must be in LOCKED state 
        assert!(box.state == STATE_LOCKED, EInvalidState);

        box.encrypted_key = option::some(encrypted_key);
        box.state = STATE_REVEALED;
        box.reveal_timestamp = option::some(tx_context::epoch(ctx));

        iota::event::emit(KeyRevealed {
            id: object::id_address(box),
            encrypted_key
        });
    }

    /// Buyer finalizes the trade (Happy Path)
    public entry fun finalize(
        box: &mut GiftBox,
        rep_nft: &mut ReputationNFT,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only buyer can finalize
        assert!(box.buyer == option::some(sender), ENotAuthorized);
        // Must be in REVEALED state
        assert!(box.state == STATE_REVEALED, EInvalidState);

        // Distributions:
        // 1. Payment -> Seller
        let payment_val = balance::value(&box.payment);
        let payment = balance::split(&mut box.payment, payment_val);
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

    /// Buyer raises a dispute (e.g. key invalid) -> BURNS everything
    public entry fun dispute(
        box: &mut GiftBox,
        rep_nft: &mut ReputationNFT,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only buyer can dispute
        assert!(box.buyer == option::some(sender), ENotAuthorized);
        // Can dispute in REVEALED state
        assert!(box.state == STATE_REVEALED, EInvalidState);

        // BURN EVERYTHING (Send to 0x0)
        let payment_val = balance::value(&box.payment);
        let payment = balance::split(&mut box.payment, payment_val);
        transfer::public_transfer(coin::from_balance(payment, ctx), @0x0);

        let s_val = balance::value(&box.seller_stake);
        let s_stake = balance::split(&mut box.seller_stake, s_val);
        transfer::public_transfer(coin::from_balance(s_stake, ctx), @0x0);

        let b_val = balance::value(&box.buyer_stake);
        let b_stake = balance::split(&mut box.buyer_stake, b_val);
        transfer::public_transfer(coin::from_balance(b_stake, ctx), @0x0);

        // Reset Reputation
        reputation::reset_on_dispute(rep_nft);

        box.state = STATE_BURNED;
    }

    /// Seller claims funds if buyer disappears after 24h
    public entry fun claim_auto_finalize(
        box: &mut GiftBox,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        // Only seller
        assert!(box.seller == sender, ENotAuthorized);
        // Must be REVEALED and waiting
        assert!(box.state == STATE_REVEALED, EInvalidState);

        let reveal_time = *option::borrow(&box.reveal_timestamp);
        let now = tx_context::epoch(ctx);
        // 24 hours in ms = 86400000
        assert!(now > reveal_time + 86400000, ETimeNotReached);

        // Release everything to Seller
        let payment_val = balance::value(&box.payment);
        let payment = balance::split(&mut box.payment, payment_val);
        transfer::public_transfer(coin::from_balance(payment, ctx), sender);

        let s_val = balance::value(&box.seller_stake);
        let s_stake = balance::split(&mut box.seller_stake, s_val);
        transfer::public_transfer(coin::from_balance(s_stake, ctx), sender);

        let b_val = balance::value(&box.buyer_stake);
        let b_stake = balance::split(&mut box.buyer_stake, b_val);
        transfer::public_transfer(coin::from_balance(b_stake, ctx), sender);
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
}
