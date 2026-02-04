// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
