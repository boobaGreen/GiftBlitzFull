import type { BoxType } from '../types';

export const CATEGORIES = [
    { id: 'ECOMMERCE', label: 'Shopping', icon: '🛍️' },
    { id: 'SUPERMARKET', label: 'Groceries', icon: '🛒' },
    { id: 'GAMING', label: 'Gaming', icon: '🎮' },
    { id: 'FASHION', label: 'Fashion', icon: '👗' },
    { id: 'TECH', label: 'Tech & Apps', icon: '📱' },
    { id: 'STREAMING', label: 'Streaming', icon: '📺' },
    { id: 'FOOD', label: 'Food & Drink', icon: '🍔' },
    { id: 'TRAVEL', label: 'Travel', icon: '✈️' },
    { id: 'SPORT', label: 'Sport', icon: '⚽' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export interface Brand {
    value: BoxType;
    label: string;
    icon: string;
    category: CategoryId;
}

export const GIFT_CARDS_DATA: Brand[] = [
    // --- E-COMMERCE / SHOPPING ---
    { value: 'AMAZON', label: 'Amazon', icon: '📦', category: 'ECOMMERCE' },
    { value: 'EBAY', label: 'eBay', icon: '🛍️', category: 'ECOMMERCE' },
    { value: 'ETSY', label: 'Etsy', icon: '🎨', category: 'ECOMMERCE' },
    { value: 'ALIEXPRESS', label: 'AliExpress', icon: '📦', category: 'ECOMMERCE' },
    // Tech Retail
    { value: 'MEDIAMARKT', label: 'MediaMarkt', icon: '🔴', category: 'ECOMMERCE' },
    { value: 'MEDIAWORLD', label: 'MediaWorld', icon: '🔴', category: 'ECOMMERCE' },
    { value: 'UNIEURO', label: 'Unieuro', icon: '🟠', category: 'ECOMMERCE' },
    { value: 'SATURN', label: 'Saturn', icon: '🪐', category: 'ECOMMERCE' },
    { value: 'FNAC', label: 'Fnac', icon: '📚', category: 'ECOMMERCE' },
    { value: 'CURRYS', label: 'Currys', icon: '🔌', category: 'ECOMMERCE' },
    { value: 'ARGOS', label: 'Argos', icon: '🏷️', category: 'ECOMMERCE' },
    // Home & DIY
    { value: 'IKEA', label: 'IKEA', icon: '🏠', category: 'ECOMMERCE' },
    { value: 'LEROY_MERLIN', label: 'Leroy Merlin', icon: '🔨', category: 'ECOMMERCE' },
    { value: 'BAUHAUS', label: 'Bauhaus', icon: '🛠️', category: 'ECOMMERCE' },
    { value: 'OBI', label: 'OBI', icon: '🧰', category: 'ECOMMERCE' },
    // USA
    { value: 'WALMART', label: 'Walmart', icon: '🏬', category: 'ECOMMERCE' },
    { value: 'TARGET', label: 'Target', icon: '🎯', category: 'ECOMMERCE' },
    { value: 'BESTBUY', label: 'Best Buy', icon: '🏷️', category: 'ECOMMERCE' },
    { value: 'HOME_DEPOT', label: 'Home Depot', icon: '🛠️', category: 'ECOMMERCE' },
    { value: 'LOWES', label: 'Lowe\'s', icon: '🔩', category: 'ECOMMERCE' },
    { value: 'MACYS', label: 'Macy\'s', icon: '🏬', category: 'ECOMMERCE' },
    { value: 'NORDSTROM', label: 'Nordstrom', icon: '👔', category: 'ECOMMERCE' },
    { value: 'KOHLS', label: 'Kohl\'s', icon: '🛍️', category: 'ECOMMERCE' },

    // --- SUPERMARKETS ---
    // Italy
    { value: 'ESSELUNGA', label: 'Esselunga', icon: '🥬', category: 'SUPERMARKET' },
    { value: 'CONAD', label: 'Conad', icon: '🌼', category: 'SUPERMARKET' },
    { value: 'COOP', label: 'Coop', icon: '🛒', category: 'SUPERMARKET' },
    // Europe
    { value: 'CARREFOUR', label: 'Carrefour', icon: '🏪', category: 'SUPERMARKET' },
    { value: 'LIDL', label: 'Lidl', icon: '🔵', category: 'SUPERMARKET' },
    { value: 'ALDI', label: 'Aldi', icon: '🛍️', category: 'SUPERMARKET' },
    { value: 'REWE', label: 'REWE', icon: '🛒', category: 'SUPERMARKET' },
    { value: 'EDEKA', label: 'EDEKA', icon: '🟡', category: 'SUPERMARKET' },
    { value: 'PENNY', label: 'Penny', icon: '🔴', category: 'SUPERMARKET' },
    { value: 'KAUFLAND', label: 'Kaufland', icon: '🏬', category: 'SUPERMARKET' },
    // UK
    { value: 'TESCO', label: 'Tesco', icon: '🇬🇧', category: 'SUPERMARKET' },
    { value: 'SAINSBURYS', label: 'Sainsbury\'s', icon: '🟠', category: 'SUPERMARKET' },
    { value: 'ASDA', label: 'Asda', icon: '🟢', category: 'SUPERMARKET' },
    { value: 'MORRISONS', label: 'Morrisons', icon: '🟡', category: 'SUPERMARKET' },
    { value: 'WAITROSE', label: 'Waitrose', icon: '🌿', category: 'SUPERMARKET' },
    { value: 'MARKS_SPENCER', label: 'Marks & Spencer', icon: '👔', category: 'SUPERMARKET' },
    // USA
    { value: 'WHOLE_FOODS', label: 'Whole Foods', icon: '🥑', category: 'SUPERMARKET' },
    { value: 'TRADER_JOES', label: 'Trader Joe\'s', icon: '🌺', category: 'SUPERMARKET' },
    { value: 'KROGER', label: 'Kroger', icon: '🛒', category: 'SUPERMARKET' },
    { value: 'COSTCO', label: 'Costco', icon: '📦', category: 'SUPERMARKET' },

    // --- GAMING ---
    { value: 'STEAM', label: 'Steam', icon: '🎮', category: 'GAMING' },
    { value: 'PLAYSTATION', label: 'PlayStation', icon: '🔵', category: 'GAMING' },
    { value: 'XBOX', label: 'Xbox', icon: '💚', category: 'GAMING' },
    { value: 'NINTENDO', label: 'Nintendo', icon: '🍄', category: 'GAMING' },
    { value: 'ROBLOX', label: 'Roblox', icon: '🟥', category: 'GAMING' },
    { value: 'VALORANT', label: 'Riot Games / LoL', icon: '👊', category: 'GAMING' },
    { value: 'BLIZZARD', label: 'Blizzard', icon: '❄️', category: 'GAMING' },
    { value: 'EA_PLAY', label: 'EA Play / FIFA', icon: '⚽', category: 'GAMING' },
    { value: 'EPIC_GAMES', label: 'Epic / Fortnite', icon: '🎮', category: 'GAMING' },
    { value: 'MINECRAFT', label: 'Minecraft', icon: '⛏️', category: 'GAMING' },
    { value: 'PUBG', label: 'PUBG Mobile', icon: '🔫', category: 'GAMING' },
    { value: 'APEX_LEGENDS', label: 'Apex Legends', icon: '🎯', category: 'GAMING' },
    { value: 'GENSHIN', label: 'Genshin Impact', icon: '⭐', category: 'GAMING' },
    { value: 'GAMESTOP', label: 'GameStop', icon: '🛑', category: 'GAMING' },
    { value: 'TWITCH', label: 'Twitch', icon: '🟣', category: 'GAMING' },

    // --- FASHION & BEAUTY ---
    // Online Fashion
    { value: 'ZALANDO', label: 'Zalando', icon: '👗', category: 'FASHION' },
    { value: 'ASOS', label: 'ASOS', icon: '👚', category: 'FASHION' },
    { value: 'SHEIN', label: 'SHEIN', icon: '👗', category: 'FASHION' },
    // Fast Fashion
    { value: 'HM', label: 'H&M', icon: '👕', category: 'FASHION' },
    { value: 'ZARA', label: 'Zara', icon: '💃', category: 'FASHION' },
    { value: 'PRIMARK', label: 'Primark', icon: '👖', category: 'FASHION' },
    { value: 'MANGO', label: 'Mango', icon: '🥭', category: 'FASHION' },
    { value: 'UNIQLO', label: 'Uniqlo', icon: '👕', category: 'FASHION' },
    { value: 'GAP', label: 'Gap', icon: '👖', category: 'FASHION' },
    { value: 'BERSHKA', label: 'Bershka', icon: '👗', category: 'FASHION' },
    { value: 'PULL_BEAR', label: 'Pull&Bear', icon: '🐻', category: 'FASHION' },
    { value: 'MASSIMO_DUTTI', label: 'Massimo Dutti', icon: '👔', category: 'FASHION' },
    { value: 'OVS', label: 'OVS', icon: '👶', category: 'FASHION' },
    // Sports & Shoes
    { value: 'NIKE', label: 'Nike', icon: '👟', category: 'FASHION' },
    { value: 'ADIDAS', label: 'Adidas', icon: '🏃', category: 'FASHION' },
    { value: 'PUMA', label: 'Puma', icon: '🐆', category: 'FASHION' },
    { value: 'NEW_BALANCE', label: 'New Balance', icon: '👟', category: 'FASHION' },
    { value: 'JD_SPORTS', label: 'JD Sports', icon: '👟', category: 'FASHION' },
    { value: 'FOOT_LOCKER', label: 'Foot Locker', icon: '🏁', category: 'FASHION' },
    { value: 'LEVIS', label: 'Levi\'s', icon: '👖', category: 'FASHION' },
    // Beauty
    { value: 'SEPHORA', label: 'Sephora', icon: '💄', category: 'FASHION' },
    { value: 'DOUGLAS', label: 'Douglas', icon: '💅', category: 'FASHION' },
    { value: 'BOOTS', label: 'Boots', icon: '💊', category: 'FASHION' },
    { value: 'ULTA', label: 'Ulta Beauty', icon: '💄', category: 'FASHION' },
    { value: 'BATH_BODY', label: 'Bath & Body Works', icon: '🛁', category: 'FASHION' },
    { value: 'OTHERS_FASHION', label: 'Other Fashion', icon: '🕶️', category: 'FASHION' },

    // --- SPORT ---
    { value: 'DECATHLON', label: 'Decathlon', icon: '⛺', category: 'SPORT' },
    { value: 'SPORTS_DIRECT', label: 'Sports Direct', icon: '⚽', category: 'SPORT' },
    { value: 'INTERSPORT', label: 'Intersport', icon: '🏀', category: 'SPORT' },

    // --- TECH ---
    { value: 'ITUNES', label: 'Apple / iTunes', icon: '🍎', category: 'TECH' },
    { value: 'GOOGLE_PLAY', label: 'Google Play', icon: '🤖', category: 'TECH' },
    { value: 'MICROSOFT', label: 'Microsoft', icon: '🪟', category: 'TECH' },
    { value: 'SPOTIFY', label: 'Spotify', icon: '🎧', category: 'TECH' },

    // --- STREAMING ---
    { value: 'NETFLIX', label: 'Netflix', icon: '🎬', category: 'STREAMING' },
    { value: 'DISNEY_PLUS', label: 'Disney+', icon: '🐭', category: 'STREAMING' },
    { value: 'PRIME_VIDEO', label: 'Prime Video', icon: '📺', category: 'STREAMING' },
    { value: 'HBO_MAX', label: 'Max (HBO)', icon: '🎭', category: 'STREAMING' },
    { value: 'HULU', label: 'Hulu', icon: '📺', category: 'STREAMING' },
    { value: 'PARAMOUNT', label: 'Paramount+', icon: '⛰️', category: 'STREAMING' },
    { value: 'DAZN', label: 'DAZN', icon: '⚽', category: 'STREAMING' },
    { value: 'NOW_TV', label: 'NOW TV', icon: '📡', category: 'STREAMING' },

    // --- FOOD & DRINK ---
    // Food Delivery
    { value: 'UBER_EATS', label: 'Uber Eats', icon: '🍔', category: 'FOOD' },
    { value: 'DELIVEROO', label: 'Deliveroo', icon: '🚲', category: 'FOOD' },
    { value: 'JUST_EAT', label: 'Just Eat', icon: '🍕', category: 'FOOD' },
    { value: 'GLOVO', label: 'Glovo', icon: '🎒', category: 'FOOD' },
    { value: 'DOORDASH', label: 'DoorDash', icon: '🚗', category: 'FOOD' },
    { value: 'GRUBHUB', label: 'Grubhub', icon: '🍔', category: 'FOOD' },
    { value: 'THE_FORK', label: 'TheFork', icon: '🍽️', category: 'FOOD' },
    // Coffee
    { value: 'STARBUCKS', label: 'Starbucks', icon: '☕', category: 'FOOD' },
    { value: 'COSTA', label: 'Costa Coffee', icon: '☕', category: 'FOOD' },
    { value: 'DUNKIN', label: 'Dunkin\'', icon: '🍩', category: 'FOOD' },
    { value: 'NESPRESSO', label: 'Nespresso', icon: '☕', category: 'FOOD' },
    { value: 'PRET', label: 'Pret A Manger', icon: '🥪', category: 'FOOD' },
    // Fast Food
    { value: 'MCDONALDS', label: 'McDonald\'s', icon: '🍟', category: 'FOOD' },
    { value: 'BURGER_KING', label: 'Burger King', icon: '🍔', category: 'FOOD' },
    { value: 'KFC', label: 'KFC', icon: '🍗', category: 'FOOD' },
    { value: 'SUBWAY', label: 'Subway', icon: '🥪', category: 'FOOD' },
    { value: 'DOMINOS', label: 'Domino\'s', icon: '🍕', category: 'FOOD' },
    { value: 'PIZZA_HUT', label: 'Pizza Hut', icon: '🍕', category: 'FOOD' },
    { value: 'TACO_BELL', label: 'Taco Bell', icon: '🌮', category: 'FOOD' },
    { value: 'CHIPOTLE', label: 'Chipotle', icon: '🌯', category: 'FOOD' },
    { value: 'WENDYS', label: 'Wendy\'s', icon: '🍔', category: 'FOOD' },
    { value: 'CHICK_FIL_A', label: 'Chick-fil-A', icon: '🐔', category: 'FOOD' },
    { value: 'FIVE_GUYS', label: 'Five Guys', icon: '🍔', category: 'FOOD' },
    { value: 'NANDOS', label: 'Nando\'s', icon: '🍗', category: 'FOOD' },

    // --- TRAVEL ---
    { value: 'AIRBNB', label: 'Airbnb', icon: '🏠', category: 'TRAVEL' },
    { value: 'BOOKING', label: 'Booking.com', icon: '🏨', category: 'TRAVEL' },
    { value: 'EXPEDIA', label: 'Expedia', icon: '✈️', category: 'TRAVEL' },
    { value: 'HOTELS_COM', label: 'Hotels.com', icon: '🏨', category: 'TRAVEL' },
    { value: 'LASTMINUTE', label: 'lastminute.com', icon: '🏖️', category: 'TRAVEL' },
    { value: 'TRIPADVISOR', label: 'Tripadvisor', icon: '🦉', category: 'TRAVEL' },
    // Rideshare
    { value: 'UBER', label: 'Uber', icon: '🚗', category: 'TRAVEL' },
    { value: 'LYFT', label: 'Lyft', icon: '🚕', category: 'TRAVEL' },
    { value: 'BOLT', label: 'Bolt', icon: '⚡', category: 'TRAVEL' },
    // Transport
    { value: 'FLIXBUS', label: 'FlixBus', icon: '🚌', category: 'TRAVEL' },
    { value: 'RYANAIR', label: 'Ryanair', icon: '✈️', category: 'TRAVEL' },
    { value: 'EASYJET', label: 'easyJet', icon: '🟠', category: 'TRAVEL' },
    { value: 'TRENITALIA', label: 'Trenitalia', icon: '🚄', category: 'TRAVEL' },
    { value: 'ITALO', label: 'Italo', icon: '🚄', category: 'TRAVEL' },
    { value: 'EUROSTAR', label: 'Eurostar', icon: '🚄', category: 'TRAVEL' },
    { value: 'DELTA', label: 'Delta', icon: '✈️', category: 'TRAVEL' },
    { value: 'SOUTHWEST', label: 'Southwest', icon: '❤️', category: 'TRAVEL' },
    // Fuel
    { value: 'SHELL', label: 'Shell', icon: '⛽', category: 'TRAVEL' },
    { value: 'BP', label: 'BP', icon: '🟢', category: 'TRAVEL' },
    { value: 'ESSO', label: 'Esso', icon: '⛽', category: 'TRAVEL' },
    { value: 'TOTAL', label: 'TotalEnergies', icon: '⛽', category: 'TRAVEL' },

    // Fallback
    { value: 'OTHER', label: 'Other', icon: '🎁', category: 'ECOMMERCE' },
];

// Map for O(1) lookup
const BRAND_MAP = new Map<string, Brand>(
    GIFT_CARDS_DATA.map(brand => [brand.value, brand])
);

export const getBrand = (type: BoxType | string): Brand => {
    // Normalize lookup if needed (though types should match)
    const brand = BRAND_MAP.get(type);
    if (!brand) {
        // console.warn(`Brand not found for type: ${type}, falling back to OTHER`);
        return GIFT_CARDS_DATA.find(b => b.value === 'OTHER') || GIFT_CARDS_DATA[0];
    }
    return brand;
};
