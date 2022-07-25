const bip65 = require("bip65");
import { GetBlockHeight } from "../utils/getBlockHeight";

export const GetTimelock = async (nextblocks: number) => {
  const currentBlockHeight = await GetBlockHeight();
  const blockheight = currentBlockHeight + nextblocks;
  const timelock = bip65.encode({ blocks: blockheight });
  return timelock;
};

export const GetCurrentBlockHeight = async () => {
  const currentBlockHeight = await GetBlockHeight();
  const timelock = bip65.encode({ blocks: currentBlockHeight });
  return timelock;
};
