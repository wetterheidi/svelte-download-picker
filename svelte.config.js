import sveltePreprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: [sveltePreprocess(), vitePreprocess()],
  // Weitere Konfigurationen
  server: {
    port: 6000, // Setze den gewünschten Port hier
  },
};