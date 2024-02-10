import { KeyringAccount } from "@unique-nft/accounts/keyring";
import Sdk from "@unique-nft/sdk";
import { getSigner } from "src/01-signer";
import { getSdk } from "src/02-sdk";

export const usingSdk = async <T>(func: (args: UsingSdkArgs) => T) => {
  const signer = await getSigner();
  const sdk = getSdk(signer);
  return func({ sdk, signer });
};

type UsingSdkArgs = {
  sdk: Sdk;
  signer: KeyringAccount;
};
