import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      autoExternal: false,
      bundle: true,
      format: "esm",
      syntax: ["node 22"],
      dts: true,
      output: {
        target: "web",
        distPath: {
          root: "./dist",
        },
        externals: /wasi:*/,
      },
    },
  ],
});
