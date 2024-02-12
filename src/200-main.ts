import { createCollection } from "./100-collection";
import { createNfts } from "./101-nfts";

const main = async () => {
  const collectionId = await createCollection();
  await createNfts(collectionId);
};

// Run program
main()
  .then()
  .catch((err) => {
    if (err instanceof Error) console.error(err.message);
    console.error("Unknown error:", err);
  });
