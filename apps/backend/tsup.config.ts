import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  // Bundle the workspace package IN so its extensionless ESM never has to be resolved by native Node at runtime.
  noExternal: ["@chimu-sync/shared"],
});
