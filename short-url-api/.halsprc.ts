import { defineConfig } from "@halsp/cli";

export default defineConfig(() => {
  return {
    build: {
      assets: ["web/**"],
    },
  };
});
