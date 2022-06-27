const bitcoin = require("bitcoinjs-lib");
const { RPC } = require("../utils/rpc");
const witnessStackToScriptWitness = require("../utils/withnessStackToScriptWithness");
const network = bitcoin.networks.regtest;
const { getPublickey, signer, Wif } = require("../service/wallet");
const ecc = require("tiny-secp256k1");
import { ECPairFactory, networks } from "ecpair";
import { isValidTransaction } from "../service/verify_transaction";

const wif = (async (): Promise<string> => {
  const tobi = await Wif();
  console.log(tobi);
  return tobi;
})();

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

const myScript = async (pubkey: Buffer) => {
  return bitcoin.script.fromASM(
    `
    ${pubkey.toString("hex")}
        OP_CHECKSIG
        `
      .trim()
      .replace(/\s+/g, " ")
  );
};

const address = "bcrt1q223qdv8adsvzy5xr89jqy74e6qw84ngs3lm9c0";
const createPsbtBitcoinCore = async (scriptWitness: string) => {
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
    const result = utxo.result.filter(
      (tx: any) =>
        tx.txid ===
        "6ceb7a5611541d92fbc17d1e82d7243c6ecea6c2788e68979a814cd1cac7d314"
    );
    console.log(result);
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

export const testRPC = async () => {
  const wif = await Wif();
  console.log(wif);
  const ServiceSignature = ECPairFactory(ecc).fromWIF(wif, network);
  console.log(ServiceSignature);
  const scriptContract = await myScript(ServiceSignature.publicKey);
  const scriptWitness = scriptContract.toString("hex");
  console.log(scriptWitness);
  // const p2sh = bitcoin.payments.p2sh({
  //   redeem: { output: scriptContract, network: network },
  // });
  // console.log(p2sh.address);
  const p2wsh = bitcoin.payments.p2wsh({
    redeem: { output: scriptContract, network: network },
  });
  console.log(p2wsh.address);
  const psbt = new bitcoin.Psbt({ network: network });
  psbt.addInput({
    hash: "6ceb7a5611541d92fbc17d1e82d7243c6ecea6c2788e68979a814cd1cac7d314",
    index: 0,
    sequence: 0xfffffffe,
    witnessUtxo: {
      script: Buffer.from(
        "0020" +
          bitcoin.crypto
            .sha256(Buffer.from(scriptWitness, "hex"))
            .toString("hex"),
        "hex"
      ),
      value: 4e9,
    },
    witnessScript: Buffer.from(scriptWitness, "hex"),
  });
  psbt.addOutput({
    address: address,
    value: 39.999e8,
  });
  psbt.signInput(0, ServiceSignature);
  console.log(psbt.data.inputs);
  const finalizeWithness = () => {
    const witnessStackClaimBranch = bitcoin.payments.p2wsh({
      redeem: {
        input: bitcoin.script.compile([
          psbt.data.inputs[0].partialSig[0].signature,
          // bitcoin.opcodes.OP_2,
          // bitcoin.opcodes.OP_1,
        ]),
        output: Buffer.from(scriptWitness, "hex"),
      },
    });

    const witness = witnessStackToScriptWitness(
      witnessStackClaimBranch.witness
    );
    return {
      finalScriptWitness: witnessStackToScriptWitness(
        witnessStackClaimBranch.witness
      ),
    };
  };
  psbt.finalizeInput(0, finalizeWithness);
  const checkPsbt = psbt.extractTransaction().toHex();
  const verify = await isValidTransaction(checkPsbt);
};
