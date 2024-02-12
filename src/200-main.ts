import { uploadImages } from "./03-upload-images";
import { createCollection } from "./100-collection";

const main = async () => {
  await createCollection();
};

// Run program
main()
  .then()
  .catch((err) => {
    if (err instanceof Error) console.error(err.message);
    console.error("Unknown error:", err);
  });
