import { KeyringOptions } from "@polkadot/keyring/types";
import { KeyringAccount, KeyringProvider } from "@unique-nft/accounts/keyring";
import { config } from "./0-config";

export const getSigner = async (): Promise<KeyringAccount> => {
  const options: KeyringOptions = {
    type: "sr25519",
  };
  const provider = new KeyringProvider(options);
  await provider.init();

  const signer = provider.addSeed(config.mnemonic);
  return signer;
};
