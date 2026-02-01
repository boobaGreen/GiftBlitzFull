/**
 * GiftBlitz P2P Security Utility
 * Uses Web Crypto API for zero-dependency hybrid encryption.
 */

const STORAGE_PREFIX = 'gb_sec_';

export interface EncryptionKeyPair {
    publicKey: Uint8Array;
    privateKey: CryptoKey;
}

/**
 * Generates or retrieves an encryption keypair for the current account.
 * Using P-256 for maximum compatibility.
 */
export async function getEncryptionKeyPair(address: string): Promise<EncryptionKeyPair> {
    const addr = address.toLowerCase();
    const pubKeyPath = `${STORAGE_PREFIX}pub_${addr}`;
    const privKeyPath = `${STORAGE_PREFIX}priv_${addr}`;

    const storedPub = localStorage.getItem(pubKeyPath);
    const storedPriv = localStorage.getItem(privKeyPath);

    if (storedPub && storedPriv) {
        try {
            const pubBytes = new Uint8Array(JSON.parse(storedPub));
            const privJwk = JSON.parse(storedPriv);
            
            const privateKey = await crypto.subtle.importKey(
                'jwk',
                privJwk,
                { name: 'ECDH', namedCurve: 'P-256' },
                true,
                ['deriveKey', 'deriveBits']
            );

            return { publicKey: pubBytes, privateKey };
        } catch (e) {
            console.warn("Failed to restore keys, generating new ones", e);
        }
    }

    const keyPair = await crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        ['deriveKey', 'deriveBits']
    );

    const pubBuffer = await crypto.subtle.exportKey('raw', keyPair.publicKey);
    const pubBytes = new Uint8Array(pubBuffer);
    const privJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

    localStorage.setItem(pubKeyPath, JSON.stringify(Array.from(pubBytes)));
    localStorage.setItem(privKeyPath, JSON.stringify(privJwk));

    return { publicKey: pubBytes, privateKey: keyPair.privateKey };
}

/**
 * Encrypts data using a randomly generated symmetric key.
 */
export async function encryptCode(clearText: string): Promise<{ ciphertext: Uint8Array; key: CryptoKey }> {
    const data = new TextEncoder().encode(clearText);

    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return { ciphertext: result, key };
}

/**
 * Decrypts data using a symmetric key.
 */
export async function decryptCode(ciphertextWithIv: Uint8Array, key: CryptoKey): Promise<string> {
    const iv = ciphertextWithIv.slice(0, 12);
    const data = ciphertextWithIv.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    return new TextDecoder().decode(decrypted);
}

/**
 * Encrypts a symmetric key for a specific buyer.
 */
export async function encryptKeyForBuyer(
    symmetricKey: CryptoKey,
    sellerPrivKey: CryptoKey,
    buyerPubKeyBytes: Uint8Array
): Promise<Uint8Array> {
    const buyerPubKey = await crypto.subtle.importKey(
        'raw',
        buyerPubKeyBytes,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        []
    );

    const sharedSecret = await crypto.subtle.deriveKey(
        { name: 'ECDH', public: buyerPubKey },
        sellerPrivKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const keyBytes = await crypto.subtle.exportKey('raw', symmetricKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        sharedSecret,
        keyBytes
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return result;
}

/**
 * Decrypts a symmetric key.
 */
export async function decryptKeyForMe(
    encryptedKeyWithIv: Uint8Array,
    myPrivKey: CryptoKey,
    peerPubKeyBytes: Uint8Array
): Promise<CryptoKey> {
    const peerPubKey = await crypto.subtle.importKey(
        'raw',
        peerPubKeyBytes,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        []
    );

    const sharedSecret = await crypto.subtle.deriveKey(
        { name: 'ECDH', public: peerPubKey },
        myPrivKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const iv = encryptedKeyWithIv.slice(0, 12);
    const data = encryptedKeyWithIv.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        sharedSecret,
        data
    );

    return crypto.subtle.importKey(
        'raw',
        decrypted,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function storeSymmetricKey(boxId: string, key: CryptoKey) {
    const exported = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(`${STORAGE_PREFIX}sym_${boxId}`, JSON.stringify(exported));
}

export async function getSymmetricKey(boxId: string): Promise<CryptoKey | null> {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}sym_${boxId}`);
    if (!stored) return null;

    return crypto.subtle.importKey(
        'jwk',
        JSON.parse(stored),
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}
