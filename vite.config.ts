import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    // Deploy sub-path lives in `.env` (VITE_BASE_PATH) so renaming the repo or
    // moving to a custom domain is a one-line change. Must stay in sync with
    // the basename in src/main.tsx and the redirect in public/404.html.
    base: env.VITE_BASE_PATH || '/great-skill-collection/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
