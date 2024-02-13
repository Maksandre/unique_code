import { getSigner } from "./01-signer";
import { getSdk } from "./02-sdk";

export const burnCollectionAndTokens = async (collectionId: number) => {
  const signer = await getSigner();
  const sdk = getSdk(signer);

  const tokens = await sdk.collection.tokens({ collectionId });

  for (const tokenId of tokens.ids) {
    await sdk.token.burn({ collectionId, tokenId });
  }

  await sdk.collection.destroy({ collectionId });
  console.log("Collection destroyed");
};
