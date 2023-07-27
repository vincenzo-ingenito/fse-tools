import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import sveltePreprocess from "svelte-preprocess";

/** @type {import('vite').UserConfig} */
const config = {
  sveltekit: {
    adapter: adapter(),
  },
  plugins: [sveltekit()],
  preprocess: sveltePreprocess({
    postcss: true,
  }),
};

export default config;