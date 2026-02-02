// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://github.com', // Replace with your actual site URL
  base: '/', // Replace with your repo name if deploying to a subpath (e.g. '/my-repo')
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["gsap"],
    },
  },

  integrations: [react()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
