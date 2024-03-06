import { createCollection } from "./100-collection";
import { createNfts } from "./101-nfts";

const main = async () => {
  const collectionId = 2396;
  await createNfts(collectionId);
};

main()
  .then()
  .catch((err) => {
    if (err instanceof Error) console.error(err.message);
    console.error("Unknown error:", err);
  });
