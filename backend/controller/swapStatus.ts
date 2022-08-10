import axios from "axios";
import { forEachChild } from "typescript";
import { GetBlockHeight } from "../utils/getBlockHeight";
const models = require("../models");
import { response } from "../utils/response";

interface UTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

export const SwapStatus = async (address: string) => {
  try {
    const height = await GetBlockHeight();
    const addressExist = await models.info.findOne({ where: { address } });
    // if (addressExist) {
    if (height > addressExist.timelock && addressExist.status === "pending") {
      const adddressUtxo = await axios.get(
        `https://blockstream.info/testnet/api/address/${address}/utxo`
      );
      let utxo: UTXO = {
        txid: "",
        vout: 0,
        status: {
          confirmed: false,
          block_height: 0,
          block_hash: "",
          block_time: 0,
        },
        value: 0,
      };
      adddressUtxo.data.forEach((tx: any) => {
        if (tx.status.confirmed) {
          utxo = { ...tx };
          return;
        }
      });
      if (height - utxo.status.block_height >= 3) {
        // Pay Invoice
        // Claim funds
        // Update Database
        return response(200, "UtXO data", utxo);
      } else {
        return response(200, "Waiting for more confirmations", {
          confirmation: height - utxo.status.block_height,
          status: "pending",
        });
      }
    } else {
      if (addressExist.status === "pending") {
        await models.info.update({ status: "expired" }, { where: { address } });
        return response(200, "Invoice expired", { status: "expired" });
      } else {
        return response(200, "Address Status", { status: addressExist.status });
      }
    }

    // } else {
    //   return response(404, "Address not found");
    // }
  } catch (error: any) {
    if (error.response) {
      return response(400, error.response.data);
    } else {
      return response(500, "Internal Server error");
    }
  }
};
