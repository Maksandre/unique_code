import { burnCollectionAndTokens } from "./150-burn";

const main = async () => {
  await burnCollectionAndTokens(2389);
  await burnCollectionAndTokens(2384);
};

// Run program
main()
  .then()
  .catch((err) => {
    if (err instanceof Error) console.error(err.message);
    console.error("Unknown error:", err);
  });
