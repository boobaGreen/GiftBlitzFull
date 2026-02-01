export type BoxStatus = 'OPEN' | 'LOCKED' | 'REVEALED' | 'COMPLETED' | 'CANCELED' | 'DISPUTED' | 'EXPIRED';

export type BoxType =
    // Shopping / E-Commerce
    | 'AMAZON' | 'EBAY' | 'ETSY' | 'ALIEXPRESS'
    | 'MEDIAMARKT' | 'MEDIAWORLD' | 'UNIEURO' | 'SATURN' | 'FNAC' | 'CURRYS' | 'ARGOS'
    | 'IKEA' | 'LEROY_MERLIN' | 'BAUHAUS' | 'OBI'
    | 'WALMART' | 'TARGET' | 'BESTBUY' | 'HOME_DEPOT' | 'LOWES' | 'MACYS' | 'NORDSTROM' | 'KOHLS'
    // Supermarkets
    | 'ESSELUNGA' | 'CONAD' | 'COOP' | 'CARREFOUR' | 'LIDL' | 'ALDI'
    | 'REWE' | 'EDEKA' | 'PENNY' | 'KAUFLAND'
    | 'TESCO' | 'SAINSBURYS' | 'ASDA' | 'MORRISONS' | 'WAITROSE' | 'MARKS_SPENCER'
    | 'WHOLE_FOODS' | 'TRADER_JOES' | 'KROGER' | 'COSTCO'
    // Gaming
    | 'STEAM' | 'PLAYSTATION' | 'XBOX' | 'NINTENDO' | 'ROBLOX' | 'VALORANT' | 'BLIZZARD'
    | 'EA_PLAY' | 'EPIC_GAMES' | 'MINECRAFT' | 'PUBG' | 'APEX_LEGENDS' | 'GENSHIN'
    | 'GAMESTOP' | 'TWITCH'
    // Fashion & Beauty
    | 'ZALANDO' | 'ASOS' | 'SHEIN' | 'HM' | 'ZARA' | 'PRIMARK' | 'MANGO' | 'UNIQLO' | 'GAP'
    | 'BERSHKA' | 'PULL_BEAR' | 'MASSIMO_DUTTI' | 'OVS'
    | 'NIKE' | 'ADIDAS' | 'PUMA' | 'NEW_BALANCE' | 'JD_SPORTS' | 'FOOT_LOCKER' | 'LEVIS'
    | 'SEPHORA' | 'DOUGLAS' | 'BOOTS' | 'ULTA' | 'BATH_BODY' | 'OTHERS_FASHION'
    // Sport
    | 'DECATHLON' | 'SPORTS_DIRECT' | 'INTERSPORT'
    // Tech
    | 'ITUNES' | 'GOOGLE_PLAY' | 'MICROSOFT' | 'SPOTIFY'
    // Entertainment & Streaming
    | 'NETFLIX' | 'DISNEY_PLUS' | 'PRIME_VIDEO' | 'HBO_MAX' | 'HULU' | 'PARAMOUNT' | 'DAZN' | 'NOW_TV'
    // Food Delivery
    | 'UBER_EATS' | 'DELIVEROO' | 'JUST_EAT' | 'GLOVO' | 'DOORDASH' | 'GRUBHUB' | 'THE_FORK'
    // Coffee
    | 'STARBUCKS' | 'COSTA' | 'DUNKIN' | 'NESPRESSO' | 'PRET'
    // Fast Food
    | 'MCDONALDS' | 'BURGER_KING' | 'KFC' | 'SUBWAY' | 'DOMINOS' | 'PIZZA_HUT'
    | 'TACO_BELL' | 'CHIPOTLE' | 'WENDYS' | 'CHICK_FIL_A' | 'FIVE_GUYS' | 'NANDOS'
    // Travel
    | 'AIRBNB' | 'BOOKING' | 'EXPEDIA' | 'HOTELS_COM' | 'LASTMINUTE' | 'TRIPADVISOR'
    | 'UBER' | 'LYFT' | 'BOLT'
    | 'FLIXBUS' | 'RYANAIR' | 'EASYJET' | 'TRENITALIA' | 'ITALO' | 'EUROSTAR' | 'DELTA' | 'SOUTHWEST'
    | 'SHELL' | 'BP' | 'ESSO' | 'TOTAL'
    // Fallback
    | 'OTHER';

export interface Box {
    id: string;
    seller: string;
    buyer?: string | null;

    // Card Details
    brand: BoxType; // Mapped from card_brand
    value: number; // Value in NANOS
    price: number; // Selling price in NANOS

    // Metadata
    createdAt: string;
    status: BoxStatus;
    lockedAt?: number | null; // Timestamp in ms
    revealTimestamp?: number | null; // Timestamp in ms

    // Security
    encryptedCodeOnChain?: string | null; // The code encrypted with symmetric key (on-chain)
    encryptedKeyOnChain?: string | null; // The symmetric key encrypted for buyer (on-chain)
    
    // For local memory/transient use
    localSymmetricKey?: string | null;
}

export interface User {
    address: string;
    balance: number;
    // Trade count unico per entrambi i ruoli
    tradeCount: number;
    volume: number;
    disputes: number; // Se >0, trade count resettato
    memberEpoch?: number | null;
    publicKey?: string | null; // Hex string of encryption public key
}

// Caps ASIMMETRICI: Seller può vendere fino a €200 subito, Buyer ha caps progressivi

// Helper: Buyer Stake is 110% of Card Value (Safe Stake)
export function getBuyerStake(boxValue: number): number {
    return Math.ceil(boxValue * 1.1);
}

// Seller: Può vendere fino a €200 DAL GIORNO 1 (già mette 100% stake)
export function getMaxSellValue(): number {
    return 200; // Nessun limite restrittivo per chi vende
}

// Buyer: Caps progressivi per prevenire griefing
export function getMaxBuyValue(tradeCount: number): number {
    if (tradeCount >= 15) return 200;
    if (tradeCount >= 7) return 100;
    if (tradeCount >= 3) return 50;
    return 30;
}
