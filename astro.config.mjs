import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    svelte(),
    icon({
      include: {
        mdi: ["github", "email"],
        cib: ["itch-io"],
        ri: ["instagram-fill"],
        bi: ["box-arrow-up-right"],
      },
    }),
  ],
  experimental: {
    // viewTransitions: true,
  },
});
