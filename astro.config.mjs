import { defineConfig } from 'astro/config';

/*
 * GitHub Pages serves a project repository from a subdirectory, so the build
 * needs a base path there and not locally — otherwise `pnpm preview` would move
 * to /queen-gambit/ and every bookmark to localhost:4321 would 404.
 */
const onGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  output: 'static',
  base: onGitHubPages ? '/queen-gambit' : '/',
  site: onGitHubPages
    ? 'https://umar-bilal21.github.io'
    : 'https://thequeensgambithouse.com',
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
});
