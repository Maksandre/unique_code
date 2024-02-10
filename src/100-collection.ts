import { usingSdk } from "./utils/using-sdk";

const createCollection = usingSdk(async ({ sdk, signer }) => {
  await sdk.collection.create({
    name: "New collection",
    description: "Collection description",
    tokenPrefix: "NEW",
  });
});
