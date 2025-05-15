const crypto = require('crypto')
const { CustomError } = require('../errors/custom-error')
const logger = require('../../config/logger')('DECRYPT_UTIL')

require('dotenv').config()

    if(!process.env.SALT || !process.env.PASSPHRASE){
        throw new CustomError("O SALT e PASSPHRASE devem existir no arquivo .env", 400, 'BAD_REQUEST')
    }
    
const salt = process.env.SALT
const passphrase = process.env.PASSPHRASE;


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
        logger.info(`Inciando o processo de descriptografia do dado: ${data}`)
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
            logger.error(`Falha na descriptografia: ${error.message}`);
            throw new CustomError('Ocorreu um erro ao tentar descriptografar o dado', 500,'SERVER_ERROR')
        }
    }
}

module.exports = Crypto