import {
  AttributeSchema,
  AttributeType,
  UniqueCollectionSchemaToCreate,
} from "schema1";
import { CreateTokenPayload } from "@unique-nft/sdk";

export const attributesSchemaU1: Record<string, AttributeSchema> = {
  "0": {
    name: {
      _: "Gender",
      ru: "Гендер",
      it: "Genere",
    },
    type: AttributeType.string,
    enumValues: { 0: { _: "Male" }, 1: { _: "Female" } },
    optional: false,
  },
  "1": {
    name: {
      _: "Skin",
    },
    type: AttributeType.string,
    enumValues: { 0: { _: "Green" }, 1: { _: "Blue" } },
  },
  "2": {
    name: {
      _: "Power",
    },
    type: AttributeType.number,
  },
  "3": {
    name: {
      _: "Traits",
    },
    type: AttributeType.string,
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
    type: AttributeType.isoDate,
  },
  "5": {
    name: {
      _: "Color",
    },
    type: AttributeType.colorRgba,
    optional: true,
  },
  "6": {
    name: {
      _: "Website",
    },
    type: AttributeType.url,
  },
  "7": {
    name: {
      _: "Weight",
    },
    type: AttributeType.float,
  },
  "8": {
    name: { _: "Vegan" },
    type: AttributeType.boolean,
  },
  "9": {
    name: { _: "Lucky number" },
    type: AttributeType.integer,
  },
  "10": {
    name: { _: "Wake up" },
    type: AttributeType.time,
  },
  "11": {
    name: { _: "Minted at" },
    type: AttributeType.timestamp,
  },
  "12": {
    name: { _: "Favorite quote" },
    type: AttributeType.string,
  },
} as const;

export const getUniqueV1Schema = (
  args: GetSchemaArgs,
): UniqueCollectionSchemaToCreate => {
  const schema: UniqueCollectionSchemaToCreate = {
    schemaName: "unique",
    schemaVersion: "1.0.0",
    coverPicture: {
      urlInfix: args.coverName ?? "cover",
    },
    image: {
      urlTemplate: `${args.ipfsUrl}/{infix}`,
    },
    attributesSchemaVersion: "1.0.0",
    attributesSchema: attributesSchemaU1,
    audio: {
      format: "mp3",
      urlTemplate: "https://soundcloud.com/bernardo",
    },
    file: {
      urlTemplate: `${args.ipfsUrl}/cover.png`,
    },
    coverPicturePreview: {
      urlInfix: "cover.png",
    },
    royalties: [
      {
        address: "",
        decimals: 12,
        royaltyType: "DEFAULT",
        value: 12n,
        version: 1,
      },
    ],
  };

  return schema;
};

export const tokensPayloadU1: CreateTokenPayload[] = [
  {
    data: {
      image: { urlInfix: "sh1" },
      encodedAttributes: {
        0: 0,
        1: 1,
        2: { _: 12 },
        3: [0, 4],
        4: { _: "2024-02-12" },
        5: { _: "#FFFFFFCC" },
        6: { _: "yourstube.com" },
        7: { _: 55.2 },
        8: { _: 0 },
        9: { _: 42 },
        10: { _: "15:45:00" },
        11: { _: 1644681033 },
        12: { _: "Success is not a destination; it's a mindset." },
      },
    },
  },
];

type GetSchemaArgs = {
  ipfsUrl: string;
  coverName?: string;
};
