import { UniqueChain } from "@unique-nft/sdk";
import { config } from "./00-config";
import { Sr25519Account } from "@unique-nft/sr25519";
import { initializeApi, submitAndWatchExtrinsic } from "./pjshelper";
import { ApiPromise, Keyring } from "@polkadot/api";
import "@unique-nft/opal-testnet-types/augment-api";
import { signatureVerify } from "@polkadot/util-crypto";

const main = async () => {
  const network = "opal";
  const mnemonic =
    "report fox depart mention parade engine lawsuit charge acquire repair capable medal";
  const account = Sr25519Account.fromUri(mnemonic);
  //rest.unique.network/v2/xcm-unique
  const api = await initializeApi(`wss://ws-${network}.unique.network`);
  // const api = await initializeApi(`wss://ws.unique.network`);
  // const api = await initializeApi(`wss://xnft-unique.unique.network`);
  const keyring = new Keyring({ type: "sr25519" });
  const pjsAccount = keyring.addFromUri(mnemonic);

  const unique = UniqueChain({
    // baseUrl: `https://rest.uniquenetwork.dev/v2/${network}`,
    baseUrl: `https://rest.unique.network/v2/${network}`,
    // baseUrl: `https://rest.unique.network/v2/xcm-unique`,
    account,
    statusOptions: {
      timeout: 1000,
      retries: 60,
    },
  });

  const acc = await unique.balance.get(account);

  // const collection = await unique.collection.create({
  //   name: "Countdown",
  //   description: "3, 2, 1 ...",
  //   mode: "Nft",
  //   symbol: "CDWN",
  // });

  // const collectionId = collection.result.collectionId;
  const collectionId = 5439;
  // const collectionId = 5373;
  // const collectionId = 837;

  const runtime = await api.rpc.state.getRuntimeVersion();
  console.log("Current runtime specVersion:", runtime.specVersion.toNumber());

  // {
  //   // ✅ USE PJS
  //   for (let index = 0; index < 100; index++) {
  //     const tx = api.tx.unique.createMultipleItemsEx(collectionId, {
  //       NFT: [
  //         {
  //           properties: [
  //             { key: "0x736368656d614e616d65", value: "0x756e69717565" },
  //             {
  //               key: "0x736368656d6156657273696f6e",
  //               value: "0x322e302e30",
  //             },
  //             {
  //               key: "0x746f6b656e44617461",
  //               value:
  //                 "0x7b22736368656d614e616d65223a22756e69717565222c22736368656d6156657273696f6e223a22322e302e30227d",
  //             },
  //           ],
  //           owner: {
  //             substrate: account.address,
  //           },
  //         },
  //       ],
  //     });

  //     const signed = await tx.signAsync(pjsAccount, { era: 0 });
  //     const submitablePJS = signed.toHex();

  //     // 🔍 Logging
  //     const call = api.registry.createType("Call", tx.method.toHex());
  //     const methodArgs = call.toJSON();
  //     console.log("Method Args:");
  //     console.dir(methodArgs, { depth: null });

  //     const nonce = (
  //       await api.query.system.account(pjsAccount.address)
  //     ).nonce.toNumber();
  //     console.log("Nonce:", nonce);

  //     const currentHeader = await api.rpc.chain.getHeader();
  //     const currentBlock = currentHeader.number.toNumber();
  //     console.log("Current chain block number:", currentBlock);

  //     const extrinsicDecoded = api.registry.createType(
  //       "Extrinsic",
  //       submitablePJS,
  //     );
  //     const era = extrinsicDecoded.era;

  //     if (era.isMortalEra) {
  //       const period = era.asMortalEra.period.toNumber();
  //       const phase = era.asMortalEra.phase.toNumber();
  //       const birth = currentBlock - (currentBlock % period) + phase;
  //       const death = birth + period;

  //       console.log(
  //         `Era: Mortal — valid from block #${birth} to #${death} (period: ${period}, phase: ${phase})`,
  //       );
  //     } else {
  //       console.log("Era: Immortal — transaction is valid forever.");
  //     }

  //     console.log("Submit:", submitablePJS);
  //     await submitAndWatchExtrinsic(api, submitablePJS);
  //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  //   }
  // }

  {
    // SIGN WITH SDK
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
      console.log(
        "Current chain block number:",
        currentHeader.number.toNumber(),
      );

      // Verify signature
      const isValid = signatureVerify(
        nftExtrinsic.signerPayloadRaw.data,
        signature,
        nftExtrinsic.signerPayloadJSON.address,
      );

      console.log("Signature valid?", isValid.isValid);
      // Submit
      await submitAndWatchExtrinsic(api, submitable, true);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    }
  }

  // {
  //   // SIGN WITH SDK
  //   for (let index = 0; index < 300; index++) {
  //     const nftExtrinsic = await unique.token.mintNFTs.build({
  //       collectionId,
  //       tokens: [{}],
  //     });

  //     const signature = await unique.token.mintNFTs.sign(nftExtrinsic);

  //     const tx = await unique.token.mintNFTs.submit(nftExtrinsic, signature);

  //     console.log(tx);

  //     let status: any;
  //     do {
  //       status = await unique.extrinsic.getStatus(
  //         unique.token.mintNFTs.route,
  //         tx,
  //       );
  //     } while (!status.extrinsicOutput.blockNumber);

  //     console.log("First time in block:", status.extrinsicOutput.blockNumber);
  //     const collectionInfo = await unique.collection.get({ collectionId });
  //     console.log("Transaction Number:", index + 1);
  //     console.log("Last token ID:", collectionInfo.lastTokenId);

  //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  //   }
  // }

  {
    for (let i = 0; i < 300; i++) {
      console.log("Sending", i);
      await unique.balance.transfer({
        to: "unixVxBFutDoThKqFZwEQsY63TSE1K3wGPRpAPpXiXY2RmRM7",
        amount: "100",
      });
    }
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
