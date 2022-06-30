const bitcoin = require("bitcoinjs-lib");
export const SelectNetwork = (network: string) => {
  if (network === "regtest") {
    return bitcoin.networks.regtest;
  } else if (network === "testnet") {
    return bitcoin.networks.regtest;
  } else if (network === "mainnet") {
    return bitcoin.networks.bitcoin;
  } else {
    throw new Error("Invalid network");
  }
};
