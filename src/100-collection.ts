import { getSigner } from "./01-signer";
import { getSdk } from "./02-sdk";
import { uploadImages } from "./03-upload-images";
import { getUniqueV1Schema } from "./schemas/unique-v1";

export const createCollection = async () => {
  const signer = await getSigner();
  const sdk = getSdk(signer);

  const ipfsUrl = await uploadImages("./images");
  const { block, error } = await sdk.collection.create({
    name: "New",
    description: "New collection",
    tokenPrefix: "NEW",
    schema: getUniqueV1Schema({ ipfsUrl }),
  });

  if (error) throw Error("Error creating collection");

  console.log("Created at block:", block);
};
