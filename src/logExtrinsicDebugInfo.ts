import { ApiPromise } from "@polkadot/api";
import { signatureVerify } from "@polkadot/util-crypto";

export async function logExtrinsicDebugInfo({
  api,
  signerPayloadJSON,
  signature,
  extrinsicHex,
  rawPayload,
}: {
  api: ApiPromise;
  signerPayloadJSON: any;
  signature?: string;
  extrinsicHex: string;
  rawPayload?: string;
}) {
  console.log("🧠 Payload:", signerPayloadJSON);

  const call = api.registry.createType("Call", signerPayloadJSON.method);
  const methodArgs = call.toJSON();
  console.log("📦 Method Args:");
  console.dir(methodArgs, { depth: null });

  const runtime = await api.rpc.state.getRuntimeVersion();
  console.log(
    "🔢 Spec version correct?",
    signerPayloadJSON.specVersion === runtime.specVersion.toHex(),
  );

  if (signature) {
    console.log("✍️ Signature:", signature);
  }

  console.log("🚀 Extrinsic Hex:", extrinsicHex);

  const era = api.registry.createType("ExtrinsicEra", signerPayloadJSON.era);
  const currentBlock = parseInt(signerPayloadJSON.blockNumber, 16);

  if (era.isMortalEra) {
    const period = era.asMortalEra.period.toNumber();
    const phase = era.asMortalEra.phase.toNumber();
    const birth = currentBlock - (currentBlock % period) + phase;
    const death = birth + period;

    console.log(
      `📅 Valid from block #${birth} to #${death} (period: ${period}, phase: ${phase})`,
    );
  } else {
    console.log("📅 Era is immortal — transaction is valid forever.");
  }

  const currentHeader = await api.rpc.chain.getHeader();
  console.log(
    "⛓️ Current chain block number:",
    currentHeader.number.toNumber(),
  );

  if (signature && rawPayload) {
    const isValid = signatureVerify(
      rawPayload,
      signature,
      signerPayloadJSON.address,
    );
    console.log("✅ Signature valid?", isValid.isValid);
  }

  console.log("🏁 FINAL HEX TO SUBMIT:", extrinsicHex);
  console.log("--------------------------------------------------");
}
