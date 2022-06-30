import { Network, payments } from "bitcoinjs-lib";
import { Wif, userWif } from "../service/wallet";
import { RedeemScript } from "./script";
const ecc = require("tiny-secp256k1");
import { ECPairFactory } from "ecpair";

export const GetScriptAddress = async (
  network: Network,
  payment_hash: string
): Promise<string> => {
  const UserPrivateKey = await userWif();
  const ServicePrivateKey = await Wif();
  const userSigner = ECPairFactory(ecc).fromWIF(UserPrivateKey, network);
  const serviceSigner = ECPairFactory(ecc).fromWIF(ServicePrivateKey, network);
  const script = RedeemScript(
    serviceSigner.publicKey,
    userSigner.publicKey,
    payment_hash,
    12345
  );
  const scriptWithness = script.toString("hex");
  const p2wsh = payments.p2wsh({ redeem: { output: script, network } });
  return p2wsh.address!;
};
