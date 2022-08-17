import createLnRpc from "@radar/lnrpc";
import { updateData } from "../service/save_data";

export const payInvoice = async (invoice: string) => {
  const CERT: string = process.env.CERT!;
  const MACAROON: string = process.env.MACAROON!;
  try {
    const lnd = await createLnRpc({
      server: "127.0.0.1:11009",
      cert: Buffer.from(CERT, "hex").toString("utf-8"),
      macaroon: MACAROON,
    });
    const paymentInfo = await lnd.sendPaymentSync({ paymentRequest: invoice });
    // await updateData(invoice, paymentInfo.paymentPreimage.toString("hex"));
    console.log(paymentInfo);
    return {
      status: true,
      message: "Payment Preimage",
      preimage: paymentInfo.paymentPreimage.toString("hex"),
    };
  } catch (error: any) {
    if (error.details) {
      console.log(error.details);
      return { status: false, message: error.details };
    } else {
      console.log(error);
      return { status: false, message: "An error occured" };
    }
  }
};
