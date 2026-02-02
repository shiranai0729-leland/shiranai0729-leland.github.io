// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://shiranai0729-leland.github.io',
  base: '/',
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
