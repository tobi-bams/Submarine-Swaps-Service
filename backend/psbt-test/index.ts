const bitcoin = require("bitcoinjs-lib");
import { RPC } from "../utils/rpc";

const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });

const myScript = () => {
  return bitcoin.script.fromASM(
    `
        OP_ADD
        03
        OP_EQUAL
        `
      .trim()
      .replace(/\s+/g, " ")
  );
};

const address = "tb1qd376qagkvyacpqpkqyppcm2zgvgfc2cr3c259f";
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
    [{ [address]: 0.000003 }],
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

const PsbtSigner = async (hex: string) => {
  try {
    const psbt = await RPC("walletprocesspsbt", [hex]);
    // console.log(psbt);
    return psbt;
  } catch (error: any) {
    console.log(error.response);
  }
};

const finalizePsbt = async (hex: string) => {
  try {
    const psbt = await RPC("finalizepsbt", [hex]);
    console.log(psbt);
  } catch (error) {}
};

// const scriptContract = myScript();
// console.log(scriptContract.toString("hex"));

export const testRPC = async () => {
  const scriptContract = myScript();
  const scriptWitness = scriptContract.toString("hex");
  const p2sh = bitcoin.payments.p2sh({
    redeem: { output: scriptContract, network: bitcoin.networks.testnet },
  });
  console.log(p2sh.address);
  const p2wsh = bitcoin.payments.p2wsh({
    redeem: { output: scriptContract, network: bitcoin.networks.testnet },
  });
  console.log(p2wsh.address);
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
  psbt.addInput({
    hash: "9284d2502eadb300049a5fc87ee3d1f6e1f4523494df09576006712f3410a60f",
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

  const createPsbt = await createPsbtBitcoinCore("any");
  console.log(createPsbt);
  const psbt2 = new bitcoin.Psbt({
    network: bitcoin.networks.testnet,
  });
};
