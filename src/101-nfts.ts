import { getSigner } from "./01-signer";
import { getSdk } from "./02-sdk";
import { tokensPayloadU2 } from "./schemas/unique-v2";

export const createNfts = async (collectionId: number) => {
  const signer = await getSigner();
  const sdk = getSdk(signer);

  const { block, error } = await sdk.token.createV2({
    collectionId,
    attributes: tokensPayloadU2,
  });

  if (error) throw Error("Error creating tokens");

  console.log("Created at block:", block.hash);
};
