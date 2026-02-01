import type { Box, User } from '../types';

export const MOCK_USER: User = {
    address: "0x71C...9A21",
    balance: 2500,
    tradeCount: 12, // → Max trade = €100 (7-14 trades)
    volume: 450,
    disputes: 0
};

// Seller Trust Deposit = 100% del PREZZO (modello ASIMMETRICO: Buyer paga 110% del VALORE)
// NOTE: minTrades rimosso - i buyer caps sono automatici via getMaxBuyValue()
export const MOCK_BOXES: Box[] = [
    // --- TECH & ELECTRONICS (CORE) ---
    {
        id: "box-100",
        seller: "0x88...A12B",
        brand: "MEDIAWORLD",
        value: 100000000000,
        price: 88000000000,
        createdAt: new Date(Date.now() - 50000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-101",
        seller: "0x22...B34C",
        brand: "UNIEURO",
        value: 250000000000,
        price: 210000000000,
        createdAt: new Date(Date.now() - 150000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-102",
        seller: "0xAA...1122",
        brand: "AMAZON",
        value: 50000000000,
        price: 45000000000,
        createdAt: new Date(Date.now() - 300000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-103",
        seller: "0x77...E56F",
        brand: "ITUNES",
        value: 100000000000,
        price: 90000000000,
        createdAt: new Date(Date.now() - 400000).toISOString(),
        status: "OPEN"
    },

    // --- SUPERMARKETS (NEW) ---
    {
        id: "box-200",
        seller: "0xBB...3344",
        brand: "ESSELUNGA",
        value: 100000000000,
        price: 85000000000,
        createdAt: new Date(Date.now() - 600000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-201",
        seller: "0xCC...5566",
        brand: "CONAD",
        value: 50000000000,
        price: 40000000000,
        createdAt: new Date(Date.now() - 700000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-202",
        seller: "0xDD...7788",
        brand: "CARREFOUR",
        value: 20000000000,
        price: 15000000000,
        createdAt: new Date(Date.now() - 800000).toISOString(),
        status: "OPEN"
    },

    // --- FASHION (CORE) ---
    {
        id: "box-300",
        seller: "0xEE...9900",
        brand: "ZARA",
        value: 80000000000,
        price: 65000000000,
        createdAt: new Date(Date.now() - 1000000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-301",
        seller: "0xFF...1122",
        brand: "LEVIS",
        value: 120000000000,
        price: 95000000000,
        createdAt: new Date(Date.now() - 1200000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-302",
        seller: "0x11...3344",
        brand: "ZALANDO",
        value: 50000000000,
        price: 42000000000,
        createdAt: new Date(Date.now() - 1300000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-303",
        seller: "0x22...4455",
        brand: "FOOT_LOCKER",
        value: 150000000000,
        price: 130000000000,
        createdAt: new Date(Date.now() - 1400000).toISOString(),
        status: "OPEN"
    },

    // --- GAMING & SUB ---
    {
        id: "box-400",
        seller: "0x33...5566",
        brand: "DAZN",
        value: 30000000000,
        price: 25000000000,
        createdAt: new Date(Date.now() - 1500000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-401",
        seller: "0x44...6677",
        brand: "PLAYSTATION",
        value: 20000000000,
        price: 18000000000,
        createdAt: new Date(Date.now() - 1600000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-402",
        seller: "0x55...7788",
        brand: "STEAM",
        value: 50000000000,
        price: 40000000000,
        createdAt: new Date(Date.now() - 1700000).toISOString(),
        status: "OPEN"
    },

    // --- TRAVEL (NEW) ---
    {
        id: "box-500",
        seller: "0x66...8899",
        brand: "BOOKING",
        value: 200000000000,
        price: 180000000000,
        createdAt: new Date(Date.now() - 2000000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-501",
        seller: "0x77...9900",
        brand: "RYANAIR",
        value: 100000000000,
        price: 85000000000,
        createdAt: new Date(Date.now() - 2100000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-502",
        seller: "0x88...0011",
        brand: "AIRBNB",
        value: 150000000000,
        price: 130000000000,
        createdAt: new Date(Date.now() - 2200000).toISOString(),
        status: "OPEN"
    },

    // --- FOOD ---
    {
        id: "box-600",
        seller: "0x99...1122",
        brand: "MCDONALDS",
        value: 15000000000,
        price: 10000000000,
        createdAt: new Date(Date.now() - 2500000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-601",
        seller: "0x00...2233",
        brand: "JUST_EAT",
        value: 25000000000,
        price: 20000000000,
        createdAt: new Date(Date.now() - 2600000).toISOString(),
        status: "OPEN"
    },

    // --- USA / GLOBAL ---
    {
        id: "box-700",
        seller: "0xAA...3344",
        brand: "WALMART",
        value: 100000000000,
        price: 88000000000,
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-701",
        seller: "0xBB...4455",
        brand: "BESTBUY",
        value: 300000000000,
        price: 270000000000,
        createdAt: new Date(Date.now() - 3100000).toISOString(),
        status: "OPEN"
    },

    // --- COFFEE ---
    {
        id: "box-800",
        seller: "0xCC...5566",
        brand: "STARBUCKS",
        value: 25000000000,
        price: 20000000000,
        createdAt: new Date(Date.now() - 3200000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-801",
        seller: "0xDD...6677",
        brand: "COSTA",
        value: 15000000000,
        price: 12000000000,
        createdAt: new Date(Date.now() - 3300000).toISOString(),
        status: "OPEN"
    },

    // --- STREAMING ---
    {
        id: "box-900",
        seller: "0xEE...7788",
        brand: "NETFLIX",
        value: 50000000000,
        price: 42000000000,
        createdAt: new Date(Date.now() - 3400000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-901",
        seller: "0xFF...8899",
        brand: "SPOTIFY",
        value: 30000000000,
        price: 25000000000,
        createdAt: new Date(Date.now() - 3500000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-902",
        seller: "0x11...9900",
        brand: "DISNEY_PLUS",
        value: 40000000000,
        price: 35000000000,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: "OPEN"
    },

    // --- MORE GAMING (new) ---
    {
        id: "box-1000",
        seller: "0x22...0011",
        brand: "MINECRAFT",
        value: 30000000000,
        price: 25000000000,
        createdAt: new Date(Date.now() - 3700000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1001",
        seller: "0x33...1122",
        brand: "EPIC_GAMES",
        value: 50000000000,
        price: 42000000000,
        createdAt: new Date(Date.now() - 3800000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1002",
        seller: "0x44...2233",
        brand: "GENSHIN",
        value: 100000000000,
        price: 85000000000,
        createdAt: new Date(Date.now() - 3900000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1003",
        seller: "0x55...3344",
        brand: "XBOX",
        value: 60000000000,
        price: 50000000000,
        createdAt: new Date(Date.now() - 4000000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1004",
        seller: "0x66...4455",
        brand: "NINTENDO",
        value: 35000000000,
        price: 30000000000,
        createdAt: new Date(Date.now() - 4100000).toISOString(),
        status: "OPEN"
    },

    // --- SPORT ---
    {
        id: "box-1100",
        seller: "0x77...5566",
        brand: "DECATHLON",
        value: 75000000000,
        price: 60000000000,
        createdAt: new Date(Date.now() - 4200000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1101",
        seller: "0x88...6677",
        brand: "SPORTS_DIRECT",
        value: 50000000000,
        price: 40000000000,
        createdAt: new Date(Date.now() - 4250000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1102",
        seller: "0x99...7788",
        brand: "INTERSPORT",
        value: 100000000000,
        price: 85000000000,
        createdAt: new Date(Date.now() - 4280000).toISOString(),
        status: "OPEN"
    },

    // --- FASHION/SPORTSWEAR ---
    {
        id: "box-1110",
        seller: "0xAA...8899",
        brand: "NIKE",
        value: 100000000000,
        price: 85000000000,
        createdAt: new Date(Date.now() - 4300000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1111",
        seller: "0x99...7788",
        brand: "ADIDAS",
        value: 80000000000,
        price: 65000000000,
        createdAt: new Date(Date.now() - 4400000).toISOString(),
        status: "OPEN"
    },

    // --- FAST FOOD ---
    {
        id: "box-1200",
        seller: "0xAA...8899",
        brand: "KFC",
        value: 20000000000,
        price: 15000000000,
        createdAt: new Date(Date.now() - 4500000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1201",
        seller: "0xBB...9900",
        brand: "DOMINOS",
        value: 25000000000,
        price: 20000000000,
        createdAt: new Date(Date.now() - 4600000).toISOString(),
        status: "OPEN"
    },

    // --- UK SUPERMARKETS ---
    {
        id: "box-1300",
        seller: "0xCC...0011",
        brand: "TESCO",
        value: 50000000000,
        price: 42000000000,
        createdAt: new Date(Date.now() - 4700000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1301",
        seller: "0xDD...1122",
        brand: "MARKS_SPENCER",
        value: 100000000000,
        price: 88000000000,
        createdAt: new Date(Date.now() - 4800000).toISOString(),
        status: "OPEN"
    },

    // --- BEAUTY ---
    {
        id: "box-1400",
        seller: "0xEE...2233",
        brand: "SEPHORA",
        value: 75000000000,
        price: 65000000000,
        createdAt: new Date(Date.now() - 4900000).toISOString(),
        status: "OPEN"
    },

    // --- MORE FASHION ---
    {
        id: "box-1500",
        seller: "0xFF...3344",
        brand: "HM",
        value: 40000000000,
        price: 32000000000,
        createdAt: new Date(Date.now() - 5000000).toISOString(),
        status: "OPEN"
    },
    {
        id: "box-1501",
        seller: "0x11...4455",
        brand: "PRIMARK",
        value: 30000000000,
        price: 25000000000,
        createdAt: new Date(Date.now() - 5100000).toISOString(),
        status: "OPEN"
    },

    // --- TECH APPS ---
    {
        id: "box-1600",
        seller: "0x22...5566",
        brand: "GOOGLE_PLAY",
        value: 50000000000,
        price: 42000000000,
        createdAt: new Date(Date.now() - 5200000).toISOString(),
        status: "OPEN"
    }
];
