const models = require("../models");

export const saveData = async (
  invoice: string,
  address: string,
  redeem_script: string,
  network: string,
  private_key: string,
  timelock: number,
  swap_amount: number,
  status: string
) => {
  try {
    await models.info.create({
      address,
      redeem_script,
      network,
      private_key,
      timelock,
      swap_amount,
      invoice,
      status,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
