import bolt11 from "bolt11";

interface Invoice {
  amount: number;
  payment_hash: string;
  payeeNode?: string;
  network: string;
  timestamp?: number;
}

interface Tag {
  tagName: string;
  data: any;
}

interface Network {
  bech32: string;
}

const getPaymentHash = (tags: Array<Tag>): Tag => {
  let payment_hash = { tagName: "", data: "" };
  tags.forEach((tag) => {
    if (tag.tagName === "payment_hash") {
      payment_hash = tag;
    }
  });
  return payment_hash;
};

const getNetwork = (network: Network): string => {
  let currentNetwork: string = "";
  if (network.bech32 === "tb") {
    currentNetwork = "testnet";
  }
  if (network.bech32 === "bc") {
    currentNetwork = "mainnet";
  }
  return currentNetwork;
};

export const decodeInvoice = (invoice: string): Invoice => {
  try {
    const decodedInvoice = bolt11.decode(invoice);
    const amount = Number(decodedInvoice.millisatoshis) / 100000000000;
    const payment_hash = getPaymentHash(decodedInvoice.tags);
    const network = getNetwork(decodedInvoice.network!);
    const time = decodedInvoice.timeExpireDate! - decodedInvoice.timestamp!;
    const formattedInvoice = {
      amount,
      payeeNode: decodedInvoice.payeeNodeKey,
      payment_hash: payment_hash.data,
      network,
      timestamp: decodedInvoice.timestamp,
      timeExpireDate: decodedInvoice.timeExpireDate,
    };
    return formattedInvoice;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
