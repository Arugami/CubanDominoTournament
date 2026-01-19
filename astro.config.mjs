import { defineConfig } from 'astro/config';

export default defineConfig({
  publicDir: './PUBLIC',
  outDir: './dist',
  server: {
    port: 3005
  }
});
