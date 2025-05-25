const crypto = require("crypto");

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf8"); // 32 байти

function encrypt(plainText) {
  if (plainText === null || plainText === undefined) return null; // ← тепер "" проходить
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(cipherText) {
  if (!cipherText || typeof cipherText !== "string") return null;

  try {
    const data = Buffer.from(cipherText, "base64");

    if (data.length < 28) {
      // IV (12) + TAG (16) мінімум — інакше вважаємо, що це просто текст
      return cipherText;
    }

    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (err) {
    // Явна обробка помилки для SonarLint
    console.warn(`⚠️ decrypt() failed. Returning raw value. Reason: ${err.message}`);
    return cipherText;
  }
}


// ✅ безпечна обгортка
function safeEncrypt(value, fallback = "") {
  if (value === undefined || value === null) return encrypt(fallback);
  return encrypt(value.toString());
}

module.exports = { encrypt, decrypt, safeEncrypt };
