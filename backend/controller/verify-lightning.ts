import { decodeInvoice } from "../service/parse_lightning_invoice";
import { response } from "../utils/response";

export const verifyLightningInvoice = (invoice: string) => {
  const decodedInvoice = decodeInvoice(invoice);
  if (decodedInvoice.valid) {
    const currentTime = new Date().getTime() / 1000;
    if (currentTime > decodedInvoice.timeExpireDate!) {
      return response(400, "Expired Invoice");
    } else {
      return response(200, "Lightnign Invoice", decodedInvoice);
    }
  } else {
    return response(400, "Invalid Lightning Invoice");
  }
};
