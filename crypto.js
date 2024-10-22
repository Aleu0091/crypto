const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// RSA 키 쌍 생성
function generateRSAKeyPair() {
    const keysDir = path.join(__dirname, "../keys");
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
    });

    fs.writeFileSync(path.join(keysDir, "public_key.pem"), publicKey);
    fs.writeFileSync(path.join(keysDir, "private_key.pem"), privateKey);
    console.log("RSA 4096비트 키 쌍이 생성되었습니다.");
}

// RSA 키 쌍이 없으면 생성
if (
    !fs.existsSync(path.join(__dirname, "../keys/public_key.pem")) ||
    !fs.existsSync(path.join(__dirname, "../keys/private_key.pem"))
) {
    generateRSAKeyPair();
}

// AES로 메시지 암호화
function encryptMessageWithAES(message) {
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);

    let encryptedMessage = cipher.update(message, "utf-8", "hex");
    encryptedMessage += cipher.final("hex");

    return { encryptedMessage, aesKey, iv };
}

// RSA로 AES 키 암호화
function encryptAESKeyWithRSA(aesKey) {
    const publicKey = fs.readFileSync(
        path.join(__dirname, "../keys/public_key.pem"),
        "utf-8"
    );
    const encryptedAesKey = crypto.publicEncrypt(publicKey, aesKey);
    return encryptedAesKey.toString("base64");
}

// RSA로 AES 키 복호화
function decryptAESKeyWithRSA(encryptedAesKey) {
    const privateKey = fs.readFileSync(
        path.join(__dirname, "../keys/private_key.pem"),
        "utf-8"
    );
    const decryptedAesKey = crypto.privateDecrypt(
        privateKey,
        Buffer.from(encryptedAesKey, "base64")
    );
    return decryptedAesKey;
}

// AES로 메시지 복호화
function decryptMessageWithAES(encryptedMessage, aesKey, iv) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
    let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf-8");
    decryptedMessage += decipher.final("utf-8");
    return decryptedMessage;
}

module.exports = {
    encryptMessageWithAES,
    encryptAESKeyWithRSA,
    decryptAESKeyWithRSA,
    decryptMessageWithAES,
};
