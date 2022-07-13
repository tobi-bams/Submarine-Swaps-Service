import { RPC } from "./rpc";

export const getAddress = async () => {
  try {
    const address = await RPC("getnewaddress", []);
    return address.result;
  } catch (error: any) {
    console.log(error.response);
  }
};
