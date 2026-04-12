import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  prefetch: true,

  integrations: [
    svelte(),
    mdx(),
    sitemap(),
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

  vite: {
    plugins: [tailwindcss()],
  },
});
