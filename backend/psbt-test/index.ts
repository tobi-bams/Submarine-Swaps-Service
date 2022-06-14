const bitcoin = require("bitcoinjs-lib");
import { RPC } from "../utils/rpc";
const witnessStackToScriptWitness = require("../utils/withnessStackToScriptWithness");
const network = bitcoin.networks.regtest;

// const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
const pubkey =
  "022100cfd206d0d8afccc297c7d59f55e94ee1866a32940f43cfe948a3bc7e6eae";
const getAddress = async () => {
  try {
    const address = await RPC("getnewaddress", []);
    const publicKey = await RPC("getaddressinfo", [address.result]);
    console.log(publicKey.result.pubkey);
    return publicKey.result.pubkey;
  } catch (error: any) {
    console.log(error.response.data);
  }
};

const myScript = async () => {
  // const pubkey = await getAddress();
  return bitcoin.script.fromASM(
    `
        OP_ADD
        03
        OP_EQUAL
        OP_DROP
        ${pubkey}
        OP_CHECKSIG
        `
      .trim()
      .replace(/\s+/g, " ")
  );
};

const address = "bcrt1q223qdv8adsvzy5xr89jqy74e6qw84ngs3lm9c0";
const createPsbtBitcoinCore = async (scriptWitness: any) => {
  const utxo = await RPC("listunspent", []);
  //   console.log(utxo.result[0]);
  const input = utxo.result[0];
  const data = [
    [
      {
        txid: input.txid,
        vout: input.vout,
      },
    ],
    [{ [address]: 49.999 }],
  ];
  const psbt = await RPC("createpsbt", data);
  //   console.log(psbt.result);
  //   const psbt3 = new bitcoin.Psbt(psbt.result);
  //   console.log(psbt3);
  return psbt.result;
};

const decodePSBT = async (hex: string) => {
  try {
    const psbt = await RPC("decodepsbt", [hex]);
    console.log(psbt.result.tx.vin[0]);
  } catch (error: any) {
    console.log(error.response);
  }
};

const unspent = async () => {
  try {
    const utxo = await RPC("listunspent", []);
    const result = utxo.result.filter((tx: any) => tx.amount < 50);
    console.log(result);
    console.log(utxo.result[0]);
  } catch (error) {}
};

const PsbtSigner = async (hex: string) => {
  try {
    const psbt = await RPC("walletprocesspsbt", [hex]);
    // console.log(psbt);
    return psbt;
  } catch (error: any) {
    console.log(error);
  }
};

const analyzePSBT = async (hex: string) => {
  try {
    const analyzepsbt = await RPC("analyzepsbt", [hex]);
    console.log(analyzepsbt.result);
  } catch (error: any) {
    console.log(error.response.data);
  }
};

const finalizePsbt = async (hex: string) => {
  try {
    const psbt = await RPC("finalizepsbt", [hex, true]);
    console.log(psbt);
    return psbt.result.hex;
  } catch (error) {
    console.log(error);
  }
};

const isValidTransaction = async (hex: string) => {
  try {
    const psbt = await RPC("testmempoolaccept", [[hex]]);
    console.log(psbt);
  } catch (error: any) {
    console.log(error.response.data);
  }
};

// const scriptContract = myScript();
// console.log(scriptContract.toString("hex"));

export const testRPC = async () => {
  const scriptContract = await myScript();
  const scriptWitness = scriptContract.toString("hex");
  // console.log(scriptWitness);
  const p2sh = bitcoin.payments.p2sh({
    redeem: { output: scriptContract, network: network },
  });
  // console.log(p2sh.address);
  const p2wsh = bitcoin.payments.p2wsh({
    redeem: { output: scriptContract, network: network },
  });
  // console.log(p2wsh.address);
  const psbt = new bitcoin.Psbt({ network: network });
  psbt.addInput({
    hash: "0f82265d27d33d802c607b5e7ac462ed76a7e0207936905fa3a4b6efdb3ad9e1",
    index: 1,
    sequence: 0xfffffffe,
    witnessUtxo: {
      script: Buffer.from(
        "0020" +
          bitcoin.crypto
            .sha256(Buffer.from(scriptWitness, "hex"))
            .toString("hex"),
        "hex"
      ),
      value: 12e2,
    },
    witnessScript: Buffer.from(scriptWitness, "hex"),
  });
  psbt.addOutput({
    address: address,
    value: 9e2,
  });
  //   console.log(psbt.data);
  //   const psbtString = JSON.stringify(psbt.data);
  //   const psbtBase64 = Buffer.from(psbtString).toString("base64");
  const psbtBase64 = psbt.toBase64();
  //   const checker = await createPsbtBitcoinCore(scriptWitness);
  //   await decodePSBT(psbtBase64);
  const sighner = await PsbtSigner(psbtBase64);
  //   console.log(sighner.result.psbt);
  //   await finalizePsbt(sighner.result.psbt);
  //   const psbt2 = new bitcoin.Psbt({
  //     network: bitcoin.networks.testnet,
  //   });
  //   console.log(psbt2);
  //   await decodePSBT(sighner.result.psbt);
  //   const createpsbt = await createPsbtBitcoinCore("best");
  //   console.log(createpsbt);

  // console.log(sighner.result.psbt);
  // const newPsbt =
  //   "cHNidP8BAFICAAAAAQ+mEDQvcQZgVwnflDRS9OH20eN+yF+aBACzrS5Q0oSSAQAAAAD+////AYQDAAAAAAAAFgAUbH2gdRZhO4CANgECHG1CQxCcKwMAAAAAAAEAsgIAAAACu+lGV+kxLTP1+qf6EVM0Gy7C0NUNFo67rfgVLMEl5l4BAAAAAP7////AJFvN227UPARUttBvLrr6QdDZlLY3VCqOyFD3tuk9ngAAAAAA/v///wJoAQAAAAAAACJRIN8lr09p3Ry+on6u2UAuU/hQ2dMiywB3NzWUmLjGC5qCsAQAAAAAAAAiACABI2KSe1vztg5IjDd4W4fV0J/yMLVUoh9AFT/GNTOzlLtuAQABASuwBAAAAAAAACIAILL+JZF1sZOH/zvh1kc3SijmRktm/PR9699+RuJVSz5OAQgtAwECAQEnk1OHdSEC3ArqKmrCdRN528YsiNHUUwenHxPhoC5eb5mvU4YwhkWsACICAkRasOl8x6vNulVlyfx7L3ydTOpn6eeKO0v7n8FVPEBDGLeb00BUAACAAQAAgAAAAIAAAAAAggAAAAA=";
  // const psbtTry = bitcoin.Psbt.fromBase64(sighner.result.psbt, {
  //   network: bitcoin.networks.testnet,
  // });
  // console.log(psbtTry.toBase64());
  // console.log(psbtTry.data);
  // const finalizeWithness = () => {
  //   const witnessStackClaimBranch = bitcoin.payments.p2wsh({
  //     redeem: {
  //       input: bitcoin.script.compile([
  //         // psbtTry.data.inputs[0].partialSig[0].signature,
  //         bitcoin.opcodes.OP_2,
  //         bitcoin.opcodes.OP_1,
  //       ]),
  //       output: Buffer.from(scriptWitness, "hex"),
  //     },
  //   });

  //   console.log(witnessStackClaimBranch.witness);
  //   const witness = witnessStackToScriptWitness(
  //     witnessStackClaimBranch.witness
  //   );
  //   return {
  //     finalScriptWitness: witnessStackToScriptWitness(
  //       witnessStackClaimBranch.witness
  //     ),
  //   };
  // };
  // psbtTry.finalizeInput(0, finalizeWithness);
  // const tobi = await finalizePsbt(psbtTry.toBase64());
  // await analyzePSBT(psbtTry.toBase64());
  // const verify = await isValidTransaction(tobi);
  const newPsbt = await createPsbtBitcoinCore("");
  console.log(newPsbt);
  const signPsbt = await PsbtSigner(newPsbt);
  console.log(signPsbt.result.psbt);
  const decode = await decodePSBT(signPsbt.result.psbt);
  const finalizedPsbt = await finalizePsbt(signPsbt.result.psbt);
  console.log(finalizedPsbt);
  const verify = await isValidTransaction(finalizedPsbt);
  await unspent();
};
