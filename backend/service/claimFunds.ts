import { Network } from "bitcoinjs-lib";
const bitcoin = require("bitcoinjs-lib");
import { Wif } from "../service/wallet";
const ecc = require("tiny-secp256k1");
import { ECPairFactory } from "ecpair";
import { getAddress } from "../utils/getAddress";
import { ConvertToSat } from "../utils/convertToSat";
const witnessStackToScriptWitness = require("../utils/withnessStackToScriptWithness");
import { isValidTransaction } from "./verify_transaction";

export const ClaimFunds = async (
  pre_image: string,
  network: Network,
  scriptWitness: string,
  txid: string,
  vout: number,
  value: number
) => {
  const wif = await Wif();
  const ServiceSignature = ECPairFactory(ecc).fromWIF(wif, network);
  const psbt = new bitcoin.Psbt({ network: network });
  const outputValue = value - (value * 0.05) / 100; //temporary for now, would find a better way to calculate fee
  console.log(ConvertToSat(outputValue));
  console.log(Number(ConvertToSat(value).toExponential()));
  psbt.addInput({
    hash: txid,
    index: vout,
    sequence: 0xfffffffe,
    witnessUtxo: {
      script: Buffer.from(
        "0020" +
          bitcoin.crypto
            .sha256(Buffer.from(scriptWitness, "hex"))
            .toString("hex"),
        "hex"
      ),
      value: Number(ConvertToSat(value).toExponential()),
    },
    witnessScript: Buffer.from(scriptWitness, "hex"),
  });
  const address = await getAddress();
  psbt.addOutput({
    address: address,
    value: Number(ConvertToSat(outputValue).toExponential()),
    // value: 9.999e8,
  });
  psbt.signInput(0, ServiceSignature);
  const finalizeWithness = () => {
    const witnessStackClaimBranch = bitcoin.payments.p2wsh({
      redeem: {
        input: bitcoin.script.compile([
          psbt.data.inputs[0].partialSig[0].signature,
          Buffer.from(pre_image, "hex"),
        ]),
        output: Buffer.from(scriptWitness, "hex"),
      },
    });

    return {
      finalScriptWitness: witnessStackToScriptWitness(
        witnessStackClaimBranch.witness
      ),
    };
  };
  psbt.finalizeInput(0, finalizeWithness);
  const psbtHex = psbt.extractTransaction().toHex();
  await isValidTransaction(psbtHex);
};
