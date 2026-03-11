import { scrypt, randomBytes, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

/**
 * Hash a password using Node's built-in scrypt.
 * Returns "salt:derivedKey" as hex strings.
 */
export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(SALT_LENGTH);
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt.toString("hex")}:${derivedKey.toString("hex")}`);
    });
  });
}

/**
 * Verify a password against a stored hash ("salt:derivedKey").
 */
export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [saltHex, keyHex] = storedHash.split(":");

    if (!saltHex || !keyHex) {
      return resolve(false);
    }

    const salt = Buffer.from(saltHex, "hex");
    const storedKey = Buffer.from(keyHex, "hex");

    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(timingSafeEqual(storedKey, derivedKey));
    });
  });
}

/**
 * Generate a random password of the given length.
 */
export function generatePassword(length = 16): string {
  return randomBytes(length).toString("base64url").slice(0, length);
}
