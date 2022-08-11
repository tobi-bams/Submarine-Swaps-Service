import { decodeInvoice } from "../service/parse_lightning_invoice";
import { response } from "../utils/response";
import { SelectNetwork } from "../utils/network";
import { GetScriptAddress } from "../service/getScriptAddress";

export const verifyLightningInvoice = async (
  invoice: string,
  network: string
) => {
  const decodedInvoice = decodeInvoice(invoice);
  if (decodedInvoice.valid) {
    const currentTime = new Date().getTime() / 1000;
    if (currentTime > decodedInvoice.timeExpireDate!) {
      return response(400, "Expired Invoice", { valid: false });
    } else if (network !== decodedInvoice.network) {
      return response(
        400,
        "Selected Network does not match that of the Invoice provided",
        { valid: false }
      );
    } else {
      return response(200, "Lightning Invoicce is Valid", { valid: true });
    }
  } else {
    return response(400, "Invalid Lightning Invoice", { valid: false });
  }
};
