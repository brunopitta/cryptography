const { pbkdf2 } = require("ethereum-cryptography/pbkdf2");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { bytesToHex, hexToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("ethereum-cryptography/sha256");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");


(async () => {

    const privateKey = bytesToHex( await pbkdf2(utf8ToBytes("Calyptus"), utf8ToBytes("Hello"), 999, 32, "sha256"));
    console.log("Step 1 - Private Key: ",privateKey);

    const messageHash = bytesToHex (sha256(utf8ToBytes("Web3 is Awesome")));
    console.log("Step 2 - Hash of the message: ", messageHash);

    const publicKey = secp256k1.getPublicKey(privateKey);
    console.log("Step 3 - Public Key: ", publicKey)

    const ethAddress = bytesToHex(keccak256(publicKey));
    console.log("Step 4 - Ethereum Address: ", ethAddress)

    const signature = await secp256k1.sign(messageHash, privateKey);
    console.log("Step 5 - Signature: ", signature);

    const verified = secp256k1.verify(signature, messageHash, publicKey);
    console.log("Step 6 - Verification: ", verified);

    const recoveredPubKey = signature.recoverPublicKey(messageHash).toHex(false)
    console.log("Step 7 - Recovery: ", recoveredPubKey);

    const ethAddress2 = bytesToHex(keccak256(hexToBytes(recoveredPubKey.substring(2)))).substring(24)
    console.log("Step 8 - Recovered Address: ", ethAddress2)

    console.log(ethAddress == ethAddress2);

})();