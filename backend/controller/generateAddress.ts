import { decodeInvoice } from "../service/parse_lightning_invoice";
import { response } from "../utils/response";
import { SelectNetwork } from "../utils/network";
import { GetScriptAddress } from "../service/getScriptAddress";

export const GenerateAddress = async (invoice: string, network: string) => {
  const decodedInvoice = decodeInvoice(invoice);
  if (decodedInvoice.valid) {
    const currentTime = new Date().getTime() / 1000;
    if (currentTime > decodedInvoice.timeExpireDate!) {
      return response(400, "Expired Invoice");
    } else if (network !== decodedInvoice.network) {
      return response(
        400,
        "Selected Network does not match that of the Invoice provided"
      );
    } else {
      try {
        const networkType = SelectNetwork(network);
        const address = await GetScriptAddress(
          networkType,
          decodedInvoice.payment_hash!,
          invoice,
          decodedInvoice.amount!,
          network
        );
        return response(200, "Lightnign Invoice", { address });
      } catch (error: any) {
        console.log(error);
        return response(400, error.message);
      }
    }
  } else {
    return response(400, "Invalid Lightning Invoice");
  }
};
