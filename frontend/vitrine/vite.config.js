import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { env as processEnv } from 'node:process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_API_TARGET = 'http://localhost:3000' } = loadEnv(mode, '.', 'VITE_');
  const siteUrl = processEnv.VITE_SITE_URL || loadEnv(mode, '.', 'VITE_').VITE_SITE_URL || processEnv.RENDER_EXTERNAL_URL || 'http://localhost:3000';
  const proxy = Object.fromEntries([
    '^/(?:$|\\?|index\\.html(?:\\?|$))', '/auth', '^/admin/(?:me|products)(?:/|$|\\?)',
    '/css', '/fonts', '/js', '/assets',
  ].map((route) => [route, { target: VITE_API_TARGET, changeOrigin: true }]));
  return {
    plugins: [react(), tailwindcss()],
    publicDir: false,
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
    build: { assetsDir: 'app-assets' },
    server: { port: 3001, proxy },
    preview: { proxy },
  };
})
