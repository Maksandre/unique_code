import path from "path";
import AdmZip from "adm-zip";
import { getSigner } from "./01-signer";
import { getSdk } from "./02-sdk";
import fs from "fs/promises";

export const uploadImages = async (imagesDir: string): Promise<string> => {
  const signer = await getSigner();
  const sdk = getSdk(signer);

  const zipPath = await createZipArchive(imagesDir);
  const zipFile = await fs.readFile(zipPath);

  const { fileUrl } = await sdk.ipfs.uploadZip({ file: zipFile });

  if (!fileUrl) throw Error("fileUrl is undefined");

  return fileUrl;
};

async function createZipArchive(imagesDir: string) {
  const imagesFullDir = path.resolve(__dirname, imagesDir);
  const images = await fs.readdir(imagesFullDir);

  try {
    const zipPath = path.resolve(__dirname, "archive.zip");

    const zip = new AdmZip();

    for (const img of images) {
      zip.addLocalFile(path.resolve(imagesFullDir, img));
    }

    zip.writeZip(zipPath);

    return zipPath;
  } catch (e) {
    if (e instanceof Error) throw Error(`cannot create zip: ${e.message}`);
    else throw Error(`Unknown error: creating zip: ${e}`);
  }
}
