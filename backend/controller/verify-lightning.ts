import { decodeInvoice } from "../service/parse_lightning_invoice";
import { response } from "../utils/response";
import { RedeemScript } from "../service/script";
import { Wif, userWif } from "../service/wallet";
const ecc = require("tiny-secp256k1");
import { ECPairFactory } from "ecpair";
import { SelectNetwork } from "../utils/network";

export const verifyLightningInvoice = async (
  invoice: string,
  network: string
) => {
  const decodedInvoice = decodeInvoice(invoice);
  if (decodedInvoice.valid) {
    const currentTime = new Date().getTime() / 1000;
    if (currentTime > decodedInvoice.timeExpireDate!) {
      return response(400, "Expired Invoice");
    } else {
      try {
        const networkType = SelectNetwork(network);
        const UserPrivateKey = await userWif();
        const ServicePrivateKey = await Wif();
        const userSigner = ECPairFactory(ecc).fromWIF(
          UserPrivateKey,
          networkType
        );
        const serviceSigner = ECPairFactory(ecc).fromWIF(
          ServicePrivateKey,
          networkType
        );
        return response(200, "Lightnign Invoice", decodedInvoice);
      } catch (error: any) {
        return response(400, error.message);
      }
    }
  } else {
    return response(400, "Invalid Lightning Invoice");
  }
};
