const {
    encryptMessageWithAES,
    encryptAESKeyWithRSA,
    decryptAESKeyWithRSA,
    decryptMessageWithAES,
} = require("./crypto");

// 메시지 암호화
function encryptMessage(msg) {
    const { encryptedMessage, aesKey, iv } = encryptMessageWithAES(msg);
    const encryptedAesKey = encryptAESKeyWithRSA(aesKey);

    return {
        encryptedMessage,
        encryptedAesKey,
        iv: iv.toString("hex"),
    };
}

// 메시지 복호화
function decryptMessage(encryptedMsg, encryptedAesKey, ivHex) {
    const decryptedAesKey = decryptAESKeyWithRSA(encryptedAesKey);
    const iv = Buffer.from(ivHex, "hex");

    const decryptedMsg = decryptMessageWithAES(encryptedMsg, decryptedAesKey, iv);
    return decryptedMsg;
}


// 메시지 암호화
const { encryptedMessage, encryptedAesKey, iv } = encryptMessage("Hello, World!");
console.log("암호화된 메시지:", encryptedMessage);
console.log("암호화된 AES 키:", encryptedAesKey);
console.log("IV:", iv);

// 메시지 복호화
const decryptedMessage = decryptMessage(encryptedMessage, encryptedAesKey, iv);
console.log("복호화된 메시지:", decryptedMessage);
