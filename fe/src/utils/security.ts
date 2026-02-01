/**
 * GiftBlitz P2P Security Utility
 * Uses Web Crypto API for zero-dependency hybrid encryption.
 */

const STORAGE_PREFIX = 'gb_sec_';

export interface EncryptionKeyPair {
    publicKey: Uint8Array;
    privateKey: CryptoKey;
    vault?: Uint8Array; // New: optional vault if we just created it
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
 * Derives a deterministic Symmetric Key (AES-GCM) from a Wallet Signature.
 * This makes the encryption "Stateless" - as long as you can sign the same message
 * (which contains the salt), you can recover the key.
 */
export async function deriveKeyFromSignature(signature: string): Promise<CryptoKey> {
    // 1. Hash the signature to get uniform entropy
    const sigBytes = new TextEncoder().encode(signature);
    const hashBuffer = await crypto.subtle.digest('SHA-256', sigBytes);

    // 2. Import the hash as a raw key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw', 
        hashBuffer, 
        { name: 'HKDF' }, 
        false, 
        ['deriveKey']
    );

    // 3. Derive the actual AES-GCM key
    // We use a fixed info string because the uniqueness comes from the signature (which contains the salt)
    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: new Uint8Array(), // Salt is already in the signature
            info: new TextEncoder().encode('GiftBlitz-Symmetric-Key'),
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    return derivedKey;
}

/**
 * Encrypts data using a provided symmetric key.
 */
export async function encryptCodeWithKey(clearText: string, key: CryptoKey): Promise<Uint8Array> {
    const data = new TextEncoder().encode(clearText);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data as any
    );

    // Format: IV (12 bytes) || Ciphertext
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return result;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data as any
    );

    return new TextDecoder().decode(decrypted);
}

/**
 * HELPER: Pack Ciphertext + Salt into a single byte array
 * Format: Salt (32 bytes) || IV || Ciphertext
 * Note: We put Salt first or last? Let's put it LAST for easier slicing if needed, 
 * or FIRST for fixed offset. 
 * Decision: SALT (32 bytes) || EncryptedData
 */
export function packCiphertextWithSalt(ciphertext: Uint8Array, salt: Uint8Array): Uint8Array {
    // Salt should be 32 bytes (SHA-256 hash or similar length recommended)
    if (salt.length !== 32) throw new Error("Salt must be 32 bytes");
    
    const packed = new Uint8Array(salt.length + ciphertext.length);
    packed.set(salt, 0);
    packed.set(ciphertext, salt.length);
    return packed;
}

export function unpackCiphertextWithSalt(packedData: Uint8Array): { ciphertext: Uint8Array, salt: Uint8Array } {
    if (packedData.length < 32) throw new Error("Invalid packed data length");
    
    const salt = packedData.slice(0, 32);
    const ciphertext = packedData.slice(32);
    return { ciphertext, salt };
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buyerPubKeyBytes as any,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        keyBytes as any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        peerPubKeyBytes as any,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data as any
    );

    return crypto.subtle.importKey(
        'raw',
        decrypted,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * NEW: Encrypts the local Hub Private Key into a Vault using a wallet signature.
 * This makes the Identity recoverable across devices/domains.
 */
export async function encryptVault(privateKey: CryptoKey, signature: string): Promise<Uint8Array> {
    // 1. Export Private Key to JWK
    const privJwk = await crypto.subtle.exportKey('jwk', privateKey);
    const privString = JSON.stringify(privJwk);
    
    // 2. Derive Vault Protective Key from Signature
    const vaultKey = await deriveVaultKeyFromSignature(signature);
    
    // 3. Encrypt JWK
    const data = new TextEncoder().encode(privString);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        vaultKey,
        data
    );

    // Format: IV || Ciphertext
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return result;
}

/**
 * NEW: Decrypts the Hub Private Key from a cross-domain Vault.
 */
export async function decryptVault(vaultBytes: Uint8Array, signature: string): Promise<CryptoKey> {
    // 1. Derive Vault Protective Key
    const vaultKey = await deriveVaultKeyFromSignature(signature);

    // 2. Decrypt JWK
    const iv = vaultBytes.slice(0, 12);
    const data = vaultBytes.slice(12);
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        vaultKey,
        data
    );

    const privString = new TextDecoder().decode(decrypted);
    const privJwk = JSON.parse(privString);

    // 3. Import back
    return crypto.subtle.importKey(
        'jwk',
        privJwk,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        ['deriveKey', 'deriveBits']
    );
}

/**
 * Internal helper to derive a key specifically for the vault.
 * Different info string than the transaction-specific keys.
 */
async function deriveVaultKeyFromSignature(signature: string): Promise<CryptoKey> {
    const sigBytes = new TextEncoder().encode(signature);
    const hashBuffer = await crypto.subtle.digest('SHA-256', sigBytes);
    const keyMaterial = await crypto.subtle.importKey(
        'raw', hashBuffer, { name: 'HKDF' }, false, ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: new Uint8Array(),
            info: new TextEncoder().encode('GiftBlitz-Identity-Vault-Key'),
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

// STORAGE FUNCTIONS REMOVED - STATELESS ARCHITECTURE
