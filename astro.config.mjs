import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://thequeensgambithouse.com',
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
});
