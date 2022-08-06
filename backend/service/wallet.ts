import { generateMnemonic, mnemonicToSeed } from "bip39";
import { BIP32Interface, BIP32Factory } from "bip32";
import { Network, networks, payments } from "bitcoinjs-lib";
import dotenv from "dotenv";
const ecc = require("tiny-secp256k1");

dotenv.config();

const getNewMnemonics = (): string => {
  const mnemonic = generateMnemonic(256);
  return mnemonic;
};

const masterPrivateKey = async (
  mnemonic: string,
  network: Network
): Promise<BIP32Interface> => {
  const seed = await mnemonicToSeed(mnemonic);
  const privateKey = BIP32Factory(ecc).fromSeed(seed, network);
  return privateKey;
};

const getXpubkey = (privateKey: BIP32Interface) => {
  const derivationPath = "m/84'/0'/0'";
  const child = privateKey.derivePath(derivationPath).neutered();
  const xpub = child.toBase58();
  return xpub;
};

const getChildPubkey = (
  xpub: string,
  derivationPath: string
): BIP32Interface => {
  const node = BIP32Factory(ecc).fromBase58(xpub, networks.regtest);
  const child = node.derivePath(derivationPath);
  return child;
};

export const Wif = async (network: Network): Promise<string> => {
  const mnemonic = process.env.MNEMONIC || getNewMnemonics();
  const privateKey = await masterPrivateKey(mnemonic, network);
  const wif = privateKey.toWIF();
  return wif;
};

export const userWif = async (network: Network): Promise<string> => {
  const mnemonic = getNewMnemonics();
  const privateKey = await masterPrivateKey(mnemonic, network);
  const wif = privateKey.toWIF();
  return wif;
};

// export const getPublickey = async (): Promise<Buffer> => {
//   const mnemonic = process.env.MNEMONIC || getNewMnemonics();
//   const privateKey = await masterPrivateKey(mnemonic);
//   console.log(privateKey.toWIF());
//   const xpub = getXpubkey(privateKey);
//   const pubkey = getChildPubkey(xpub, "0/0");
//   //   console.log(pubkey.toWIF());
//   return pubkey.publicKey;
// };

export const signer = async (network: Network): Promise<BIP32Interface> => {
  const mnemonic = process.env.MNEMONIC || getNewMnemonics();
  const privateKey = await masterPrivateKey(mnemonic, network);
  return privateKey;
};
