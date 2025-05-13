const crypto = require('crypto');
require('dotenv').config()

const salt = process.env.SALT


const salt = process.env.SALT;
const passphrase = process.env.SECRET_KEY;

class Crypto {
    static salt = salt;

    constructor() {
        this.key = crypto.pbkdf2Sync(
            passphrase,
            Crypto.salt,
            1000,
            32,
            "sha256"
        );
    }


    encrypt(data) {
        const iv = crypto.randomBytes(16);
        const ivHex = iv.toString("hex");


        const cipher = crypto.createCipheriv("aes-256-cbc", this.key, iv);

        //* pega o data -> 1ª param, pega o dado puro em utf - criptografa usando o createCipheriv, e retorna isso em hexa 
        let encrypted = cipher.update(data, "utf8", "hex");

        encrypted += cipher.final("hex");

        return `${encrypted}:${ivHex}`;
    }


    decrypt(data) {
        if (data && !data.includes(":")) {
            return data;
        }

        try {

            const [encryptedText, ivHex] = data.split(":");
            const iv = Buffer.from(ivHex, "hex");

            const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv);
            let decrypted = decipher.update(encryptedText, "hex", "utf8");
            decrypted += decipher.final("utf8");

            return decrypted;
        } catch (error) {
            return data;
        }

    }
}