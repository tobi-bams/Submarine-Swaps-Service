import { Network, payments } from "bitcoinjs-lib";
import { Wif, userWif } from "../service/wallet";
import { RedeemScript } from "./script";
const ecc = require("tiny-secp256k1");
import { ECPairFactory } from "ecpair";
import { GetBlockHeight } from "../utils/getBlockHeight";
import { GetTimelock } from "./getTimelock";
import { saveData } from "./save_data";

export const GetScriptAddress = async (
  network: Network,
  payment_hash: string,
  invoice: string,
  amount: number,
  networkType: string
): Promise<string> => {
  try {
    const UserPrivateKey = await userWif(network);
    const ServicePrivateKey = await Wif(network);
    const userSigner = ECPairFactory(ecc).fromWIF(UserPrivateKey, network);
    const serviceSigner = ECPairFactory(ecc).fromWIF(
      ServicePrivateKey,
      network
    );
    const timelock = await GetTimelock(10);
    const script = RedeemScript(
      serviceSigner.publicKey,
      userSigner.publicKey,
      payment_hash,
      timelock
    );
    const scriptWithness = script.toString("hex");
    console.log(network);
    const p2wsh = payments.p2wsh({ redeem: { output: script, network } });
    await saveData(
      invoice,
      p2wsh.address!,
      scriptWithness,
      networkType,
      UserPrivateKey,
      timelock,
      amount,
      "pending"
    );
    return p2wsh.address!;
  } catch (error) {
    throw error;
  }
};
