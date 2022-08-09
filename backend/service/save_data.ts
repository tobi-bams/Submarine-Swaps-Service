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
    const data = await models.info.create({
      address,
      redeem_script,
      network,
      private_key,
      timelock,
      swap_amount,
      invoice,
      status,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateData = async (invoice: string, pre_image: string) => {
  try {
    await models.info.update({ pre_image }, { where: { invoice } });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
