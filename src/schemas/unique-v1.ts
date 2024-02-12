import {
  AttributeSchemaDto,
  UniqueCollectionSchemaToCreateDto,
} from "@unique-nft/sdk";

export const attributesSchema: Record<string, AttributeSchemaDto> = {
  "0": {
    name: {
      _: "Gender",
    },
    type: "string",
    enumValues: { 0: { _: "Male" }, 1: { _: "Female" } },
    optional: false,
  },
  "1": {
    name: {
      _: "Skin",
    },
    type: "string",
    enumValues: { 0: { _: "Green" }, 1: { _: "Blue" } },
  },
  "2": {
    name: {
      _: "Power",
    },
    type: "number",
  },
  "3": {
    name: {
      _: "Traits",
    },
    type: "string",
    isArray: true,
    enumValues: {
      0: { _: "Black hair" },
      1: { _: "Red punk" },
      2: { _: "Green punk" },
      3: { _: "Bold" },
      4: { _: "Dead" },
      5: { _: "Joy" },
      6: { _: "Smile" },
    },
  },
  "4": {
    name: {
      _: "Date of birth",
    },
    type: "isoDate",
  },
  "5": {
    name: {
      _: "Color",
    },
    type: "colorRgba",
    optional: true,
  },
  "6": {
    name: {
      _: "Website",
    },
    type: "url",
  },
  "7": {
    name: {
      _: "Weight",
    },
    type: "float",
  },
  "8": {
    name: { _: "Vegan" },
    type: "boolean",
  },
  "9": {
    name: { _: "Lucky number" },
    type: "integer",
  },
  "10": {
    name: { _: "Wake up" },
    type: "time",
  },
  "11": {
    name: { _: "Minted at" },
    type: "timestamp",
  },
  "12": {
    name: { _: "Favorite quote" },
    type: "string",
  },
};

export const getUniqueV1Schema = (
  args: GetSchemaArgs,
): UniqueCollectionSchemaToCreateDto => {
  const schema: UniqueCollectionSchemaToCreateDto = {
    schemaName: "unique",
    schemaVersion: "1.0.0",
    coverPicture: {
      urlInfix: args.coverName ?? "cover",
    },
    image: {
      urlTemplate: `${args.ipfsUrl}/{infix}.${args.ext ?? "png"}`,
    },
    attributesSchemaVersion: "1.0.0",
    attributesSchema,
  };

  return schema;
};

type GetSchemaArgs = {
  ipfsUrl: string;
  coverName?: string;
  ext?: string;
};
