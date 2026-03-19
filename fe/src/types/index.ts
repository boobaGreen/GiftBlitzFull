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
    vault?: number[] | null;   // NEW: Encrypted Hub Private Key
    repNftId?: string | null;  // NEW: ID of the Reputation NFT
}

// Caps ASIMMETRICI: Seller può vendere fino a €200 subito, Buyer ha caps progressivi

// Trade Limit Mirror: both Buyer and Seller share the same progressive caps
export function getMaxTradeValue(tradeCount: number): number {
    if (tradeCount >= 25) return 1000;
    if (tradeCount >= 10) return 500;
    if (tradeCount >= 5) return 100;
    if (tradeCount >= 2) return 50;
    return 30;
}

// Deprecated separate functions, now using unified trade limit
export function getMaxBuyValue(tradeCount: number): number {
    return getMaxTradeValue(tradeCount);
}

export function getMaxSellValue(tradeCount: number): number {
    return getMaxTradeValue(tradeCount);
}

export interface TierConfig {
    name: string;
    color: string;
    bg: string;
    border: string;
    icon: string;
    maxBuy: number;
    nextTier: string | null;
    nextMaxBuy: number | null;
    prevTierLimit: number;
    tradesNeeded: number;
}

// Trade count based tiers
export const TIER_CONFIG: Record<number, TierConfig> = {
    30: {
        name: 'Newcomer',
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        icon: '🔵',
        maxBuy: 30,
        nextTier: 'Verified',
        nextMaxBuy: 50,
        prevTierLimit: 0,
        tradesNeeded: 2,
    },
    50: {
        name: 'Verified',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-500/30',
        icon: '🟢',
        maxBuy: 50,
        nextTier: 'Pro',
        nextMaxBuy: 100,
        prevTierLimit: 2,
        tradesNeeded: 5,
    },
    100: {
        name: 'Pro',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/20',
        border: 'border-indigo-500/30',
        icon: '🟣',
        maxBuy: 100,
        nextTier: 'Veteran',
        nextMaxBuy: 500,
        prevTierLimit: 5,
        tradesNeeded: 10,
    },
    500: {
        name: 'Veteran',
        color: 'text-purple-400',
        bg: 'bg-purple-500/20',
        border: 'border-purple-500/30',
        icon: '🟡',
        maxBuy: 500,
        nextTier: 'Elite',
        nextMaxBuy: 1000,
        prevTierLimit: 10,
        tradesNeeded: 25,
    },
    1000: {
        name: 'Elite',
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        icon: '👑',
        maxBuy: 1000,
        nextTier: null,
        nextMaxBuy: null,
        prevTierLimit: 25,
        tradesNeeded: 999,
    },
};

export function getTierConfig(tradeCount: number): TierConfig {
    const maxTrade = getMaxTradeValue(tradeCount);
    return TIER_CONFIG[maxTrade] || TIER_CONFIG[30];
}
