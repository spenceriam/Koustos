"use node";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

let cachedKey: CryptoKey | null = null;

function getCrypto(): Crypto {
  const crypto = globalThis.crypto;
  if (!crypto || !crypto.subtle) {
    throw new Error("Global crypto.subtle is required; ensure Node 18+ or compatible runtime.");
  }
  return crypto as Crypto;
}

function getEncryptionKeyBytes(): Uint8Array {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 32-byte hex string (64 chars)");
  }
  return new Uint8Array(Buffer.from(keyHex, "hex"));
}

async function importKey(): Promise<CryptoKey> {
  if (cachedKey) {
    return cachedKey;
  }
  const crypto = getCrypto();
  cachedKey = await crypto.subtle.importKey(
    "raw",
    getEncryptionKeyBytes(),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  return cachedKey;
}

export async function encryptString(plaintext: string): Promise<string> {
  const crypto = getCrypto();
  const key = await importKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = textEncoder.encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const payload = new Uint8Array(iv.length + ciphertext.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(ciphertext), iv.length);
  return Buffer.from(payload).toString("base64");
}

export async function decryptString(payloadBase64: string): Promise<string> {
  const crypto = getCrypto();
  const key = await importKey();
  const payload = new Uint8Array(Buffer.from(payloadBase64, "base64"));
  const iv = payload.slice(0, 12);
  const data = payload.slice(12);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return textDecoder.decode(plaintext);
}


