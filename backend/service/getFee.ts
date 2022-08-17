export const getFee = (type: string): number => {
  // using 1 Satoshi per byte for now, the size of the claim transaction is 135bytes
  if (type === "claim") {
    return 135 / 100000000;
  } else {
    return 145 / 100000000;
  }
};
