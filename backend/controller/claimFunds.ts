import { ClaimFunds } from "../service/claimFunds";
import { SelectNetwork } from "../utils/network";
const models = require("../models");
export const ClaimFundsController = async (invoice: string) => {
  const transaction = await models.info.findOne({ where: { invoice } });
  const network = SelectNetwork(transaction.network);
  console.log(transaction);
  ClaimFunds(
    transaction.pre_image,
    network,
    transaction.redeem_script,
    "e7206d4becff7f660216a246ea4a669b3a538a6b27e2786171cdb89f0a39a33e",
    1,
    // transaction.swap_amount
    10,
    transaction.private_key
  );
};
