import adapter from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/gtw-tools' : '',
  }
  },
  preprocess: sveltePreprocess({
    postcss: true,
  }),
};

export default config;