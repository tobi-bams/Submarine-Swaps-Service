const bitcoin = require("bitcoinjs-lib");

export const RedeemScript = (
  swapServicePubkey: Buffer,
  userPubkey: Buffer,
  payment_hash: string,
  timelock: number
) => {
  return bitcoin.script.fromASM(
    `
    OP_HASH160
    ${bitcoin.crypto
      .ripemd160(Buffer.from(payment_hash, "hex"))
      .toString("hex")}
      OP_EQUAL
      OP_IF
        ${swapServicePubkey.toString("hex")}
      OP_ELSE
        ${bitcoin.script.number.encode(timelock).toString("hex")}
        OP_CHECKLOCKTIMEVERIFY
        OP_DROP
        ${userPubkey.toString("hex")}
      OP_ENDIF
      OP_CHECKSIG
    `
      .trim()
      .replace(/\s+/g, " ")
  );
};
