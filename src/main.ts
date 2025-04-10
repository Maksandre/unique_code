import { UniqueChain } from "@unique-nft/sdk";
import { config } from "./00-config";
import { Sr25519Account } from "@unique-nft/sr25519";
import { initializeApi, submitAndWatchExtrinsic } from "./pjshelper";
import { ApiPromise } from "@polkadot/api";
import { signatureVerify } from "@polkadot/util-crypto";

const main = async () => {
  const account = Sr25519Account.fromUri(
    "report fox depart mention parade engine lawsuit charge acquire repair capable medal",
  );
  const api = await initializeApi("wss://xnft-unique.unique.network");

  const unique = UniqueChain({
    baseUrl: config.restUrl,
    account,
  });

  // const collection = await unique.collection.create({
  //   name: "Name",
  //   description: "description",
  //   mode: "Nft",
  //   symbol: "SYM",
  // });

  // const collectionId = collection.result.collectionId;
  const collectionId = 5373;

  const runtime = await api.rpc.state.getRuntimeVersion();
  console.log("Current runtime specVersion:", runtime.specVersion.toNumber());

  for (let index = 0; index < 100; index++) {
    const nftExtrinsic = await unique.token.mintNFTs.build({
      collectionId,
      tokens: [{}],
    });

    const signature = await unique.token.mintNFTs.sign(nftExtrinsic);

    const submitable = buildSubmittable(
      api,
      nftExtrinsic.signerPayloadJSON,
      signature,
    );

    // Log
    console.log("Payload:", nftExtrinsic.signerPayloadJSON);

    const call = api.registry.createType(
      "Call",
      nftExtrinsic.signerPayloadJSON.method,
    );
    const methodArgs = call.toJSON();
    console.log("Method Args");
    console.dir(methodArgs, { depth: null });

    console.log(
      "Spec version correct?",
      nftExtrinsic.signerPayloadJSON.specVersion ===
        runtime.specVersion.toHex(),
    );

    console.log("Signature:", signature);
    console.log("Submit:", submitable);

    // Decode era to get valid block range
    const era = api.registry.createType(
      "ExtrinsicEra",
      nftExtrinsic.signerPayloadJSON.era,
    );
    const currentBlock = parseInt(
      nftExtrinsic.signerPayloadJSON.blockNumber,
      16,
    );

    if (era.isMortalEra) {
      const period = era.asMortalEra.period.toNumber();
      const phase = era.asMortalEra.phase.toNumber();
      const birth = currentBlock - (currentBlock % period) + phase;
      const death = birth + period;

      console.log(
        `Valid from block #${birth} to #${death} (period: ${period}, phase: ${phase})`,
      );
    } else {
      console.log("Era is immortal — transaction is valid forever.");
    }

    const currentHeader = await api.rpc.chain.getHeader();
    console.log("Current chain block number:", currentHeader.number.toNumber());

    // Verify signature
    const isValid = signatureVerify(
      nftExtrinsic.signerPayloadRaw.data,
      signature,
      nftExtrinsic.signerPayloadJSON.address,
    );

    console.log("Signature valid?", isValid.isValid);
    // Submit
    await submitAndWatchExtrinsic(api, submitable);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }
};

main().catch((e) => {
  console.log("Fail");
  console.log(e.message);
});

function buildSubmittable(
  api: ApiPromise,
  signerPayloadJSON: any,
  signature: string,
) {
  const { method, version } = signerPayloadJSON;

  const submittable = api.registry.createType("Extrinsic", { method, version });

  submittable.addSignature(
    signerPayloadJSON.address,
    signature as `0x${string}`,
    signerPayloadJSON,
  );

  return submittable.toHex();
}
