import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://wpe-hiring.tokopedia.net/graphql",
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  // documents: ["/**/*.{ts,tsx}"],
  documents: ["lib/graphql.ts"],
  generates: {
    "./__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
