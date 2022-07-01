import { RPC } from "./rpc";

export const GetBlockHeight = async (): Promise<number> => {
  const response = await RPC("getblockchaininfo", []);
  return response.result.blocks;
};
