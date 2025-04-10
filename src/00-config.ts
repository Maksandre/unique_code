import dotenv from "dotenv";
dotenv.config();

/*
Configure the following variables in .env file:
- REST_URL: you can use some of the following public urls https://rest.unique.network/<opal|quartz|unique>/v1
- MNEMONIC: create an account and get some tokens there
*/

const getConfig = () => {
  const { REST_URL, REST_URL_OLD, MNEMONIC, REST_URL_ASSETHUB, PINATA_JWT } =
    process.env;

  if (
    !REST_URL ||
    !MNEMONIC ||
    !REST_URL_OLD ||
    !REST_URL_ASSETHUB ||
    !PINATA_JWT
  ) {
    throw Error("Did you forget to set the .env?");
  }

  return {
    restUrl: REST_URL,
    restUrlOld: REST_URL_OLD,
    restUrlAssetHub: REST_URL_ASSETHUB,
    mnemonic: MNEMONIC,
    pinataJwt: PINATA_JWT,
  };
};

export const config = getConfig();
