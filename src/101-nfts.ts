import { getSigner } from "./01-signer";
import { getSdk } from "./02-sdk";
import { tokensPayload } from "./schemas/unique-v1";

export const createNfts = async (collectionId: number) => {
  const signer = await getSigner();
  const sdk = getSdk(signer);

  const { block, error } = await sdk.token.createMultiple.submitWaitResult({
    collectionId,
    tokens: tokensPayload,
  });

  if (error) throw Error("Error creating tokens");

  console.log("Created at block:", block.hash);
};
