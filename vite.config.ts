import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import crown from "./vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    crown(),
    svelte({
      compilerOptions: {
        hydratable: true,
      },
    }),
  ],
});
