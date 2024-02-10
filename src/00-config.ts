import dotenv from "dotenv";
dotenv.config();

/*
Configure the following variables in .env file:
- REST_URL: you can use some of the following public urls https://rest.unique.network/<opal|quartz|unique>/v1
- MNEMONIC: create an account and get some tokens there
*/

const getConfig = () => {
  const { REST_URL, MNEMONIC } = process.env;

  if (!REST_URL || !MNEMONIC) {
    throw Error("Did you forget to set the .env?");
  }

  return {
    restUrl: REST_URL,
    mnemonic: MNEMONIC,
  };
};

export const config = getConfig();
