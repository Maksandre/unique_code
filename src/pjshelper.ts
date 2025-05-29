// polkadotHelper.ts
import { ApiPromise, WsProvider } from "@polkadot/api";

export async function initializeApi(rpcUrl = "wss://ws-opal.unique.network") {
  const provider = new WsProvider(rpcUrl);
  const api = await ApiPromise.create({ provider });
  await api.isReady;
  console.log("Connected to Polkadot node at", rpcUrl);
  return api;
}

export async function submitAndWatchExtrinsic(
  api: ApiPromise,
  signedExtrinsicHex: string,
  resolveInBlock = false,
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const extrinsic = api.registry.createType(
        "Extrinsic",
        signedExtrinsicHex,
      );

      const unsub = await api.rpc.author.submitAndWatchExtrinsic(
        extrinsic,
        async (status) => {
          console.log("Status:", status.type);

          if (status.isInBlock) {
            console.log(`Included in block: ${status.asInBlock}`);
            if (resolveInBlock) {
              unsub();
              resolve();
            }
          }

          if (status.isFinalized) {
            console.log(`Finalized in block: ${status.asFinalized}`);
            unsub();
            resolve();
          }

          if (status.isInvalid) {
            console.log("Transaction status: Invalid");

            // 🔍 Try runtime dry-run error explanation
            try {
              const result = await (api.call as any).povEstimateApi.povEstimate(
                extrinsic,
              );

              console.log("povEstimateApi.povEstimate result:");
              console.dir(result.toJSON(), { depth: null, colors: false });
            } catch (povError) {
              console.log("⚠️ Failed to call povEstimateApi.povEstimate:");
              console.error(povError);
            }

            unsub();
            reject(new Error("Invalid transaction"));
          }

          if ((status as any).dispatchError) {
            const dispatchError = (status as any).dispatchError;
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(
                dispatchError.asModule,
              );
              const { section, method } = decoded;
              console.error(`Dispatch error: ${section}.${method}`);
            } else {
              console.error(`Dispatch error: ${dispatchError.toString()}`);
            }
            unsub();
            reject(dispatchError);
          }
        },
      );
    } catch (error) {
      console.error("Error submitting or watching extrinsic:", error);
      reject(error);
    }
  });
}
