import { RPC } from "../utils/rpc";

export const isValidTransaction = async (hex: string) => {
  try {
    const psbt = await RPC("testmempoolaccept", [[hex]]);
    console.log(psbt);
  } catch (error: any) {
    console.log(error.response.data);
  }
};
