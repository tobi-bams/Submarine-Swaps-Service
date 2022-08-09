import { Network, payments } from "bitcoinjs-lib";
import { Wif, userWif } from "../service/wallet";
import { RedeemScript } from "./script";
const ecc = require("tiny-secp256k1");
import { ECPairFactory } from "ecpair";
import { GetBlockHeight } from "../utils/getBlockHeight";
import { GetTimelock } from "./getTimelock";
import { saveData } from "./save_data";

interface UserRefundData {
  swap_address: string;
  network: string;
  private_key: string;
  redeem_script: string;
  refund_address: string;
  refund_fee_tokens_per_vbyte: number;
  swap_amount: number;
  refund_after: number;
  swap_created_at: string;
}

export const GetScriptAddress = async (
  network: Network,
  payment_hash: string,
  invoice: string,
  amount: number,
  networkType: string
): Promise<UserRefundData> => {
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
    const p2wsh = payments.p2wsh({ redeem: { output: script, network } });
    const savedData = await saveData(
      invoice,
      p2wsh.address!,
      scriptWithness,
      networkType,
      UserPrivateKey,
      timelock,
      amount,
      "pending"
    );

    const data = {
      swap_address: p2wsh.address!,
      network: networkType,
      private_key: UserPrivateKey,
      redeem_script: scriptWithness,
      refund_address: "",
      refund_fee_tokens_per_vbyte: 1,
      swap_amount: amount,
      refund_after: timelock,
      swap_created_at: savedData.createdAt,
    };
    return data;
  } catch (error) {
    throw error;
  }
};
