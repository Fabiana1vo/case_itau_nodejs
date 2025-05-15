const crypto = require('crypto')
const logger = require('../../config/logger')('DECRYPT_UTIL')

require('dotenv').config()

const salt = process.env.SALT
const passphrase = process.env.SECRET_KEY;


/**
 * Utility class for data encryption and decryption using AES-256-CBC.
 * @type {Crypto}
 */

class Crypto {
    static salt = salt;
    static key = crypto.pbkdf2Sync(passphrase, Crypto.salt, 1000, 32, "sha256");

    static encrypt(data) {
        const iv = crypto.randomBytes(16);
        const ivHex = iv.toString("hex");


        const cipher = crypto.createCipheriv("aes-256-cbc", Crypto.key, iv);
        let encrypted = cipher.update(data, "utf8", "hex");

        encrypted += cipher.final("hex");

        return `${encrypted}:${ivHex}`;
    }


    static decrypt(data) {
        logger.info(`Dado antes de descriptografar: ${data}`)
          if (!data) {
            return data;
        }

        if (typeof data !== 'string' || !data.includes(":")) {
            return data;
        }


        try {

             const parts = data.split(":");
                if (parts.length !== 2) {
                return data;
            }
            
            const [encryptedText, ivHex] = data.split(":");
            const iv = Buffer.from(ivHex, "hex");

            const decipher = crypto.createDecipheriv("aes-256-cbc", Crypto.key, iv);
            let decrypted = decipher.update(encryptedText, "hex", "utf8");
            decrypted += decipher.final("utf8");

            return decrypted;
        } catch (error) {
            return data;
        }
    }
}

module.exports = Crypto