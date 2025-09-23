import crypto from "node:crypto";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 32-byte hex string (64 chars)");
  }
  return Buffer.from(keyHex, "hex");
}

export function encryptString(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

export function decryptString(payloadBase64: string): string {
  const key = getEncryptionKey();
  const payload = Buffer.from(payloadBase64, "base64");
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const ciphertext = payload.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}


