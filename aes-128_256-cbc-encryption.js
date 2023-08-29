const crypto = require('crypto');

const encrypt = (plainText, keyBase64, ivBase64) => {
    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    let algorithm;

    switch (key.length) {
        case 16:
            algorithm = 'aes-128-cbc';
            break;
        case 32:
            algorithm = 'aes-256-cbc';
            break;
        default:
            throw new Error('Invalid key length: ' + key.length);
    }

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let data = plainText;

    if (data.match(/{{salt}}/g)) {
        const salt = parseInt(crypto.randomBytes(2).toString('hex'), 16);

        data = data.replace(/{{salt}}/g, String(salt));
    }

    let encrypted = cipher.update(data, 'utf8', 'base64');

    encrypted += cipher.final('base64');

    console.log('data: ' + data);
    console.log('cipherText: ' + encrypted);

    return encrypted;
}

const plainText = '0|0023376740|{{salt}}|';
const keyBase64 = "M3M2djl5JEImRSlIQE1jUQ==";
const ivBase64 = 'WHAyczV2OHkvQj9FKEcrSw==';

encrypt(plainText, keyBase64, ivBase64);
