import { KeyringAccount } from "@unique-nft/accounts/keyring";
import Sdk, { Options } from "@unique-nft/sdk";
import { config } from "./0-config";

export const createSdk = (signer: KeyringAccount): Sdk => {
  const options: Options = {
    baseUrl: config.restUrl,
    signer,
  };

  const sdk = new Sdk(options);
  return sdk;
};
