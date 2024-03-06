import { getSigner } from "./01-signer";
import { getSdk } from "./02-sdk";
import { uploadImages } from "./03-upload-images";
import { getUniqueV1Schema } from "./schemas/unique-v1";

export const createCollection = async () => {
  const signer = await getSigner();
  const sdk = getSdk(signer);

  const ipfsUrl = await uploadImages("./images");
  const { block, parsed, error } = await sdk.collection.create({
    name: "Square",
    description: "Square heads",
    tokenPrefix: "SQR",
    schema: getUniqueV1Schema({ ipfsUrl }),
    metaUpdatePermission: "ItemOwner",
    permissions: {
      access: "Normal",
      mintMode: true,
      nesting: { collectionAdmin: true, tokenOwner: true },
    },
  });

  if (error) throw Error("Error creating collection");

  if (!parsed?.collectionId) throw Error("Cannot extract collection id");

  console.log("Created at block:", block.hash);
  console.log("Collection Id:", parsed?.collectionId);

  return parsed.collectionId;  
};
