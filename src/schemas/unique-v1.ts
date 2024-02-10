import { UniqueCollectionSchemaToCreateDto } from "@unique-nft/sdk";

export const getUniqueV1Schema = (args: GetSchemaArgs) => {
  const schema: UniqueCollectionSchemaToCreateDto = {
    schemaName: "unique",
    schemaVersion: "1.0.0",
    coverPicture: {
      urlInfix: args.coverName ?? "cover",
    },
    image: {
      urlTemplate: `${args.ipfsUrl}/{infix}.${args.ext ?? "png"}`,
    },
  };

  return schema;
};

type GetSchemaArgs = {
  ipfsUrl: string;
  coverName?: string;
  ext?: string;
};
