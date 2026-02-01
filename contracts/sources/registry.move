module giftblitz::registry {
    use iota::table::{Self, Table};
    // object, transfer, tx_context, vector provided by default

    /// Global Registry to track boxes (Shared Object)
    public struct Registry has key {
        id: UID,
        // Mapping: Seller Address -> List of Box IDs
        boxes_by_seller: Table<address, vector<ID>>,
        // Mapping: Buyer Address -> List of Box IDs
        boxes_by_buyer: Table<address, vector<ID>>
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(Registry {
            id: object::new(ctx),
            boxes_by_seller: table::new(ctx),
            boxes_by_buyer: table::new(ctx),
        });
    }

    /// Register a new box for a seller
    public entry fun register_box(
        registry: &mut Registry,
        box_id: ID,
        ctx: &mut TxContext
    ) {
        let seller = tx_context::sender(ctx);
        
        if (!table::contains(&registry.boxes_by_seller, seller)) {
            table::add(&mut registry.boxes_by_seller, seller, vector::empty());
        };
        
        let boxes = table::borrow_mut(&mut registry.boxes_by_seller, seller);
        vector::push_back(boxes, box_id);
    }

    /// Register a purchase for a buyer
    public entry fun register_purchase(
        registry: &mut Registry,
        box_id: ID,
        ctx: &mut TxContext
    ) {
        let buyer = tx_context::sender(ctx);

        if (!table::contains(&registry.boxes_by_buyer, buyer)) {
            table::add(&mut registry.boxes_by_buyer, buyer, vector::empty());
        };

        let boxes = table::borrow_mut(&mut registry.boxes_by_buyer, buyer);
        vector::push_back(boxes, box_id);
    }
}
